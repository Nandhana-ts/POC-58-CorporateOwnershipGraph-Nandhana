"use client";
import { useState } from "react";

function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = Math.cos(startAngle) * 80 + 100;
    const y1 = Math.sin(startAngle) * 80 + 100;
    const x2 = Math.cos(startAngle + angle) * 80 + 100;
    const y2 = Math.sin(startAngle + angle) * 80 + 100;
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M100,100 L${x1},${y1} A80,80 0 ${largeArc},1 ${x2},${y2} Z`;
    startAngle += angle;
    return { ...d, path };
  });

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity={0.85} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
      ))}
    </svg>
  );
}

const COLORS = ["#a855f7", "#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#f43f5e", "#06b6d4", "#84cc16"];

export default function Sidebar({ graphData, selectedCompany, filters, onFilterChange }: {
  graphData: any;
  selectedCompany: string;
  filters: { type: string; country: string };
  onFilterChange: (filters: { type: string; country: string }) => void;
}) {
  const [nodeSearch, setNodeSearch] = useState("");
  const [pieOpen, setPieOpen] = useState(false);

  if (!graphData) return (
    
    <div
      className="h-full flex flex-col justify-center items-center font-mono"
      style={{
        background: "rgba(10,8,20,0.7)",
        borderLeft: "1px solid rgba(139,92,246,0.15)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-violet-500/30 mb-3" />
      <span className="text-white/20 text-[10px] tracking-widest uppercase">No data loaded</span>
    </div>
  );

  const nodes = graphData.nodes || [];
  const subsidiaries = nodes.filter((n: any) => n.type === "subsidiary");
  const investors = nodes.filter((n: any) => n.type === "investor");
  const people = nodes.filter((n: any) => n.type === "person");

  // Jurisdiction concentration
  const countryCounts: Record<string, number> = {};
  nodes.forEach((n: any) => {
    if (n.country) countryCounts[n.country] = (countryCounts[n.country] || 0) + 1;
  });
  const nodesWithCountry = nodes.filter((n: any) => n.country);
  const topCountry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0];
  const jurisdictionConc = topCountry
    ? Math.round((topCountry[1] / nodesWithCountry.length) * 100)
    : 0;

  // Pie chart data — top 8 countries, percentages relative to pieData total
  const pieData = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value], i) => ({ label, value, color: COLORS[i % COLORS.length] }));

  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);

  const topInvestor = investors[0] || null;
  const allCountries = Array.from(new Set(nodes.map((n: any) => n.country).filter(Boolean))) as string[];

  const metrics = [
    { label: "Total Nodes", value: nodes.length, clickable: false },
    { label: "Subsidiaries", value: subsidiaries.length, clickable: false },
    { label: "Investors", value: investors.length, clickable: false },
    { label: "Key People", value: people.length, clickable: false },
    { label: "Top Jurisdiction", value: topCountry ? topCountry[0] : "—", clickable: false },
    { label: "Jurisdiction Conc.", value: `${jurisdictionConc}%`, clickable: true },
  ];

  const nodeColor = (type: string) => {
    if (type === "root") return "#f59e0b";
    if (type === "subsidiary") return "#3b82f6";
    if (type === "investor") return "#a855f7";
    return "#ec4899";
  };

  const searchResults = nodeSearch
    ? nodes.filter((n: any) => n.label.toLowerCase().includes(nodeSearch.toLowerCase()))
    : [];

  return (
    <div
      className="h-full flex flex-col font-mono overflow-hidden"
      style={{
        background: "rgba(10,8,20,0.75)",
        borderLeft: "1px solid rgba(139,92,246,0.15)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Heading */}
      <div className="px-5 pt-4 pb-4 border-b border-violet-500/10">
        <div className="text-violet-400/40 text-[9px] tracking-widest uppercase mb-1">Analysis</div>
        <h2 className="text-white text-base font-bold truncate">{selectedCompany || "—"}</h2>
      </div>

      {/* Metric Boxes */}
      <div className="grid grid-cols-2 gap-2 p-4 border-b border-violet-500/10">
        {metrics.map(m => (
          <div
            key={m.label}
            onClick={() => m.clickable && setPieOpen(true)}
            className="rounded-xl p-3 flex flex-col gap-1 transition"
            style={{
              background: "rgba(139,92,246,0.07)",
              border: m.clickable ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(139,92,246,0.15)",
              cursor: m.clickable ? "pointer" : "default",
            }}
          >
            <span className="text-violet-300 text-sm font-bold truncate">{m.value}</span>
            <span className="text-white/30 text-[9px] tracking-widest uppercase">{m.label}</span>
            {m.clickable && <span className="text-violet-400/40 text-[8px]">click to view chart</span>}
          </div>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Why This Matters */}
        <div className="px-4 py-3 border-b border-violet-500/10">
          <div className="text-violet-400/40 text-[9px] tracking-widest uppercase mb-2">Why This Matters</div>
          <p className="text-white/40 text-[10px] leading-relaxed">
            Corporate ownership structures reveal who holds real economic power.
            Mapping subsidiaries, investors, and key people exposes concentration risk,
            jurisdictional exposure, and control pathways that are invisible in surface-level data.
          </p>
        </div>

        {/* Who Controls the Rail */}
        <div className="px-4 py-3 border-b border-violet-500/10">
          <div className="text-violet-400/40 text-[9px] tracking-widest uppercase mb-2">Who Controls the Rail</div>
          {topInvestor ? (
            <div
              className="px-3 py-2 rounded-lg"
              style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}
            >
              <div className="text-violet-300 text-xs font-bold">{topInvestor.label}</div>
              {topInvestor.country && (
                <div className="text-violet-400/40 text-[9px] mt-0.5">{topInvestor.country}</div>
              )}
            </div>
          ) : (
            <div className="text-white/20 text-[10px]">No investor data found</div>
          )}
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-violet-500/10">
          <div className="text-violet-400/40 text-[9px] tracking-widest uppercase mb-2">Filters</div>
          <div className="flex flex-col gap-2">
            <select
              value={filters.type}
              onChange={e => onFilterChange({ ...filters, type: e.target.value })}
              className="w-full border border-violet-500/20 rounded-lg px-3 py-1.5 text-white/60 text-[10px] focus:outline-none focus:border-violet-500/50"
              style={{ background: "#0d0d18" }}
            >
              <option value="" style={{ background: "#0d0d18", color: "#ffffff99" }}>All Node Types</option>
              <option value="subsidiary" style={{ background: "#0d0d18", color: "#ffffff99" }}>Subsidiaries</option>
              <option value="investor" style={{ background: "#0d0d18", color: "#ffffff99" }}>Investors</option>
              <option value="person" style={{ background: "#0d0d18", color: "#ffffff99" }}>Key People</option>
            </select>
            <select
              value={filters.country}
              onChange={e => onFilterChange({ ...filters, country: e.target.value })}
              className="w-full border border-violet-500/20 rounded-lg px-3 py-1.5 text-white/60 text-[10px] focus:outline-none focus:border-violet-500/50"
              style={{ background: "#0d0d18" }}
            >
              <option value="" style={{ background: "#0d0d18", color: "#ffffff99" }}>All Jurisdictions</option>
              {allCountries.map(c => (
                <option key={c} value={c} style={{ background: "#0d0d18", color: "#ffffff99" }}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Node Search */}
        <div className="px-4 py-3 border-b border-violet-500/10">
          <div className="text-violet-400/40 text-[9px] tracking-widest uppercase mb-2">Search Node</div>
          <input
            type="text"
            value={nodeSearch}
            onChange={e => setNodeSearch(e.target.value)}
            placeholder="Search any node..."
            className="w-full bg-white/5 border border-violet-500/20 rounded-lg px-3 py-1.5 text-white/60 text-[10px] placeholder-white/20 focus:outline-none focus:border-violet-500/50"
          />
          {nodeSearch && (
            <div className="mt-2 flex flex-col gap-1">
              {searchResults.length === 0 ? (
                <div className="text-white/20 text-[10px] px-1">No node found</div>
              ) : (
                searchResults.map((n: any) => (
                  <div
                    key={n.id}
                    className="px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-2"
                    style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: nodeColor(n.type) }} />
                    <span className="text-white/60">{n.label}</span>
                    {n.country && <span className="text-violet-400/40 text-[9px] ml-auto">{n.country}</span>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Subsidiaries List */}
        <div className="px-4 py-3">
          <div className="text-violet-400/40 text-[9px] tracking-widest uppercase mb-3">Subsidiaries</div>
          {subsidiaries.length === 0 ? (
            <div className="text-white/20 text-[10px]">None found</div>
            
          ) : (
            <div className="flex flex-col gap-1.5">
              {subsidiaries.map((s: any) => (
                <div
                  key={s.id}
                  className="px-3 py-2 rounded-lg text-[11px] text-white/60 hover:text-white/90 hover:bg-violet-500/10 transition"
                  style={{ border: "1px solid rgba(139,92,246,0.1)" }}
                >
                  {s.label}
                  {s.country && <span className="ml-2 text-violet-400/40 text-[9px]">{s.country}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart Modal */}
      {pieOpen && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setPieOpen(false)}
        >
          <div
            className="w-72 rounded-2xl p-5 font-mono"
            style={{
              background: "rgba(10,8,20,0.98)",
              border: "1px solid rgba(139,92,246,0.25)",
              boxShadow: "0 0 40px rgba(139,92,246,0.15)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-violet-400/40 text-[9px] tracking-widest uppercase mb-1">Breakdown</div>
                <div className="text-white text-sm font-bold">Jurisdiction Distribution</div>
              </div>
              <button onClick={() => setPieOpen(false)} className="text-white/30 hover:text-white text-lg leading-none">×</button>
            </div>

            <div className="flex justify-center mb-4">
              <PieChart data={pieData} />
            </div>
            <div className="text-white/20 text-[9px] text-center mb-2">Showing top 8 jurisdictions</div>
            <div className="flex flex-col gap-1.5">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-white/60 text-[10px]">{d.label}</span>
                  </div>
                  <span className="text-violet-300 text-[10px] font-bold">
                    {Math.round((d.value / pieTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}