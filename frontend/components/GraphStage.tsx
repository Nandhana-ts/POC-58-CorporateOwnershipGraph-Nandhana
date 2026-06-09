"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type Node = { id: string; label: string; type: string; country?: string };
type Edge = { source: string; target: string };
type Props = { graphData: any };

const NODE_COLORS: Record<string, string> = {
  root: "#f59e0b",
  subsidiary: "#3b82f6",
  person: "#ec4899",
  investor: "#a855f7",
};

export default function GraphStage({ graphData }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: any; description?: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    if (!graphData || !graphData.nodes?.length) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "rgba(168,85,247,0.4)")
        .attr("font-size", "14px")
        .attr("font-family", "monospace")
        .text("No ownership data found for this company.");
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 20)
        .attr("text-anchor", "middle")
        .attr("fill", "rgba(168,85,247,0.2)")
        .attr("font-size", "11px")
        .attr("font-family", "monospace")
        .text("Try searching Apple, Microsoft or Berkshire Hathaway");
      return;
    }

    const nodes: any[] = graphData.nodes.map((n: Node) => ({ ...n }));
    const edges: any[] = graphData.edges.map((e: Edge) => ({ ...e }));

    const g = svg.append("g");
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on("zoom", (event) => g.attr("transform", event.transform))
    );

    const simulation = d3.forceSimulation<any>(nodes)
  .force("link", d3.forceLink(edges).id((d: any) => d.id).distance(140))
  .force("charge", d3.forceManyBody().strength(-500))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collision", d3.forceCollide(55))
  .alphaDecay(0.05);

    const link = g.append("g")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", (d: any) => {
        const target = nodes.find(n => n.id === (d.target?.id || d.target));
        return target ? NODE_COLORS[target.type] + "40" : "rgba(255,255,255,0.1)";
      })
      .attr("stroke-width", 1.5);

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(
        (d3.drag() as any)
          .on("start", (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", (event: any, d: any) => { d.fx = event.x; d.fy = event.y; })
          .on("end", (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      )
      .on("click", async (event: any, d: any) => {
        event.stopPropagation();
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          node: d,
          description: "Loading...",
        });
        try {
          const res = await fetch(
            `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${d.id}&props=descriptions&languages=en&format=json&origin=*`
          );
          const data = await res.json();
          const desc = data.entities?.[d.id]?.descriptions?.en?.value || "No description available";
          setTooltip(prev => prev ? { ...prev, description: desc } : null);
        } catch {
          setTooltip(prev => prev ? { ...prev, description: "No description available" } : null);
        }
      });

    svg.on("click", () => setTooltip(null));

    // Glow circle
    node.append("circle")
      .attr("r", (d: any) => d.type === "root" ? 40 : 28)
      .attr("fill", (d: any) => NODE_COLORS[d.type] || "#a855f7")
      .attr("opacity", 0.1);

    // Main circle
    node.append("circle")
      .attr("r", (d: any) => d.type === "root" ? 24 : 15)
      .attr("fill", (d: any) => NODE_COLORS[d.type] || "#a855f7")
      .attr("opacity", 0.9)
      .attr("stroke", "rgba(0,0,0,0.4)")
      .attr("stroke-width", 0.5);

    // Label
    node.append("text")
      .attr("dy", (d: any) => d.type === "root" ? 42 : 30)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.7)")
      .attr("font-size", (d: any) => d.type === "root" ? "11px" : "9px")
      .attr("font-family", "monospace")
      .text((d: any) => d.label);

    // Country tag
    node.append("text")
      .attr("dy", (d: any) => d.type === "root" ? 56 : 42)
      .attr("text-anchor", "middle")
      .attr("fill", (d: any) => NODE_COLORS[d.type] + "80")
      .attr("font-size", "8px")
      .attr("font-family", "monospace")
      .text((d: any) => d.country || "");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [graphData]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ background: "transparent" }}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 font-mono pointer-events-none"
          style={{
            left: tooltip.x + 16,
            top: tooltip.y - 16,
            background: "rgba(5,5,15,0.97)",
            border: `1px solid ${NODE_COLORS[tooltip.node.type]}50`,
            borderRadius: "10px",
            boxShadow: `0 0 20px ${NODE_COLORS[tooltip.node.type]}20`,
            padding: "12px 16px",
            minWidth: "200px",
            maxWidth: "260px",
          }}
        >
          <div className="text-white text-sm font-semibold mb-1">{tooltip.node.label}</div>
          {tooltip.node.country && (
            <div className="text-white/40 text-[10px]">📍 {tooltip.node.country}</div>
          )}
          {tooltip.description && (
            <div className="text-white/30 text-[10px] mt-2 leading-relaxed border-t border-white/10 pt-2">
              {tooltip.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}