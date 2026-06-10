"use client";
import { useState } from "react";
import GraphStage from "@/components/GraphStage";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ type: "", country: "" });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&type=item&language=en&limit=20&format=json&origin=*`
      );
      const data = await res.json();
      const candidates = (data.search || []).map((item: any) => ({
        id: item.id,
        name: item.label,
        description: item.description || "",
      }));
      const companyKeywords = ["company", "corporation", "inc", "ltd", "limited", "enterprise", "business", "conglomerate", "firm", "group", "holdings", "plc", "llc", "multinational"];
      const filtered = candidates.filter((c: any) => {
        const desc = c.description.toLowerCase();
        return companyKeywords.some(kw => desc.includes(kw));
      });
      const seen = new Set<string>();
      const deduped = filtered.filter((c: any) => {
        const key = c.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setResults(deduped.slice(0, 10));
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  const handleSelect = async (company: any) => {
    setSelectedCompany(company.name);
    setResults([]);
    setQuery(company.name);
    setLoading(true);
    setFilters({ type: "", country: "" });
    try {
      const sparql1 = `
        SELECT ?node ?nodeLabel ?rel ?countryLabel WHERE {
          {
            BIND(wd:${company.id} AS ?node)
            BIND("root" AS ?rel)
          }
          UNION
          {
            wd:${company.id} wdt:P355 ?node.
            BIND("subsidiary" AS ?rel)
          }
          UNION
          {
            ?node wdt:P749 wd:${company.id}.
            BIND("subsidiary" AS ?rel)
          }
          UNION
          {
            wd:${company.id} wdt:P749 ?node.
            BIND("parent" AS ?rel)
          }
          OPTIONAL {
            ?node wdt:P17 ?country.
            ?country rdfs:label ?countryLabel.
            FILTER(LANG(?countryLabel) = "en")
          }
          SERVICE wikibase:label {
            bd:serviceParam wikibase:language "en".
            ?node rdfs:label ?nodeLabel.
          }
        } LIMIT 40
      `;

      const sparql2 = `
        SELECT ?node ?nodeLabel ?rel ?countryLabel WHERE {
          {
            wd:${company.id} wdt:P169 ?node.
            BIND("person" AS ?rel)
          }
          UNION
          {
            wd:${company.id} wdt:P488 ?node.
            BIND("person" AS ?rel)
          }
          UNION
          {
            wd:${company.id} wdt:P3320 ?node.
            BIND("person" AS ?rel)
          }
          UNION
          {
            wd:${company.id} wdt:P127 ?node.
            BIND("investor" AS ?rel)
          }
          OPTIONAL {
            ?node wdt:P17 ?country.
            ?country rdfs:label ?countryLabel.
            FILTER(LANG(?countryLabel) = "en")
          }
          SERVICE wikibase:label {
            bd:serviceParam wikibase:language "en".
            ?node rdfs:label ?nodeLabel.
          }
        } LIMIT 30
      `;

      const headers = {
        "Accept": "application/json",
        "User-Agent": "CorporateOwnershipGraph/1.0"
      };

      const [res1, res2] = await Promise.all([
        fetch(`https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql1)}&format=json`, { headers }),
        fetch(`https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql2)}&format=json`, { headers }),
      ]);

      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
      const bindings = [
        ...(data1.results?.bindings || []),
        ...(data2.results?.bindings || []),
      ];

      const nodes_map: Record<string, any> = {};
      const edges: any[] = [];
      let root_label = company.name;

      const isRawId = (label: string) => /^Q\d+$/.test(label);

      for (const b of bindings) {
        const node_id = b.node.value.split("/").pop();
        const node_label = b.nodeLabel?.value || node_id;
        const rel = b.rel?.value || "subsidiary";
        const country = b.countryLabel?.value || "";

        if (isRawId(node_label)) continue;

        if (rel === "root") {
          root_label = node_label;
          nodes_map[node_id] = { id: node_id, label: node_label, type: "root", country };
        } else if (rel === "person") {
          if (!nodes_map[node_id]) {
            nodes_map[node_id] = { id: node_id, label: node_label, type: "person", country };
            edges.push({ source: node_id, target: company.id });
          }
        } else if (rel === "parent") {
          nodes_map[node_id] = { id: node_id, label: node_label, type: "investor", country };
          edges.push({ source: node_id, target: company.id });
        } else if (rel === "investor") {
          nodes_map[node_id] = { id: node_id, label: node_label, type: "investor", country };
          edges.push({ source: node_id, target: company.id });
        } else {
          if (!nodes_map[node_id]) {
            nodes_map[node_id] = { id: node_id, label: node_label, type: "subsidiary", country };
            edges.push({ source: company.id, target: node_id });
          }
        }
      }

      if (!nodes_map[company.id]) {
        nodes_map[company.id] = { id: company.id, label: root_label, type: "root", country: "" };
      }

      setGraphData({ company: root_label, nodes: Object.values(nodes_map), edges });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!graphData) return;
    const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${graphData.company.replace(/\s+/g, "_")}_ownership_graph.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredGraphData = graphData ? {
    ...graphData,
    nodes: graphData.nodes.filter((n: any) => {
      if (filters.type && n.type !== "root" && n.type !== filters.type) return false;
      if (filters.country && n.country !== filters.country) return false;
      return true;
    }),
    edges: graphData.edges.filter((e: any) => {
      const sourceId = e.source?.id || e.source;
      const targetId = e.target?.id || e.target;
      const allNodeIds = new Set(
        graphData.nodes.filter((n: any) => {
          if (filters.type && n.type !== "root" && n.type !== filters.type) return false;
          if (filters.country && n.country !== filters.country) return false;
          return true;
        }).map((n: any) => n.id)
      );
      return allNodeIds.has(sourceId) && allNodeIds.has(targetId);
    }),
  } : null;

  const legendItems = [
    { type: "root", color: "#f59e0b", label: "Root Company" },
    { type: "subsidiary", color: "#3b82f6", label: "Subsidiary" },
    { type: "investor", color: "#a855f7", label: "Investor / Parent" },
    { type: "person", color: "#ec4899", label: "Key Person" },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f] font-mono">

      {/* ── Header ── */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 bg-black/50 backdrop-blur-md border-b border-violet-500/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-300 text-sm tracking-widest uppercase">Corporate Ownership Graph</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/30 text-xs">{selectedCompany || "No company selected"}</span>
          {graphData && (
            <button
              onClick={handleDownload}
              title="Download graph data as JSON"
              className="px-3 py-1 rounded-lg border border-violet-500/30 text-violet-400 text-[10px] tracking-widest uppercase hover:bg-violet-500/10 transition"
            >
              ↓ Export
            </button>
          )}
          <button
            onClick={() => setInfoOpen(true)}
            className="w-7 h-7 rounded-full border border-violet-500/40 text-violet-400 hover:bg-violet-500/10 transition flex items-center justify-center text-sm font-bold"
          >i</button>
        </div>
      </header>

      {/* ── Search Bar ── */}
      <div className="absolute top-12 left-0 right-0 z-20 px-6 py-3 bg-black/20 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-3 max-w-lg">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search company... (try Apple, Microsoft, Google)"
            className="flex-1 bg-white/5 border border-violet-500/20 rounded-lg px-4 py-2 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg border border-violet-500/30 text-violet-400 text-xs tracking-widest uppercase hover:bg-violet-500/10 transition"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="absolute mt-1 bg-[#0d0d18] border border-violet-500/20 rounded-lg overflow-hidden w-80 shadow-xl z-50">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-2.5 text-xs text-white/70 hover:bg-violet-500/10 hover:text-violet-300 transition border-b border-white/5 last:border-0"
              >
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Graph Stage ── */}
      <div className="absolute inset-0 z-10 pt-24">
        <GraphStage graphData={filteredGraphData} />
      </div>

      {/* ── Node Legend (bottom-left) ── */}
      <div
        className="absolute bottom-14 left-6 z-40 p-3 rounded-xl"
        style={{
          background: "rgba(10,8,20,0.85)",
          border: "1px solid rgba(139,92,246,0.25)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 24px rgba(139,92,246,0.08)",
        }}
      >
        <div className="text-violet-400/50 text-[9px] tracking-widest uppercase mb-2">Node Legend</div>
        <div className="flex flex-col gap-1.5">
          {legendItems.map(item => (
            <div key={item.type} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: item.color, boxShadow: `0 0 6px ${item.color}80` }}
              />
              <span className="text-white/50 text-[10px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Attribution Bar (bottom) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-6 px-6 py-1.5 bg-black/40 backdrop-blur-sm border-t border-white/5">
        <span className="text-white/20 text-[9px] tracking-widest uppercase">Data Sources</span>
        <a
          href="https://www.sec.gov/cgi-bin/browse-edgar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400/40 text-[9px] tracking-widest uppercase hover:text-violet-300 transition"
        >
          SEC EDGAR
        </a>
        <span className="text-white/10 text-[9px]">·</span>
        <a
          href="https://opencorporates.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400/40 text-[9px] tracking-widest uppercase hover:text-violet-300 transition"
        >
          OpenCorporates
        </a>
        <span className="text-white/10 text-[9px]">·</span>
        <a
          href="https://www.wikidata.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400/40 text-[9px] tracking-widest uppercase hover:text-violet-300 transition"
        >
          Wikidata
        </a>
      </div>

      {/* ── Sidebar Toggle Button ── */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-1/2 z-50 -translate-y-1/2 w-5 h-10 flex items-center justify-center rounded-l-lg transition-all duration-300"
        style={{
          right: sidebarOpen ? "320px" : "0px",
          background: "rgba(139,92,246,0.2)",
          border: "1px solid rgba(139,92,246,0.3)",
          color: "#a855f7",
        }}
      >
        {sidebarOpen ? "›" : "‹"}
      </button>

      {/* ── Sidebar ── */}
      <div
        className="absolute top-0 right-0 h-full w-[320px] z-40 transition-transform duration-300"
        style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(320px)" }}
      >
        <Sidebar
          graphData={graphData}
          selectedCompany={selectedCompany}
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      {/* ── Info Modal ── */}
      {infoOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setInfoOpen(false)}>
          <div
            className="w-96 font-mono"
            style={{
              background: "rgba(10,8,20,0.98)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "16px",
              boxShadow: "0 0 40px rgba(139,92,246,0.12), 0 25px 60px rgba(0,0,0,0.8)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-violet-500/10">
              <div>
                <div className="text-violet-500/40 text-[10px] tracking-widest uppercase mb-1">System Information</div>
                <h2 className="text-white text-xl font-bold">Developer Signature</h2>
              </div>
              <button onClick={() => setInfoOpen(false)} className="text-white/30 hover:text-white text-xl leading-none transition">×</button>
            </div>
            <div className="px-6 py-4 space-y-4 border-b border-violet-500/10">
              {[
                { label: "Architect", value: "Nandhana T S" },
                { label: "Stack", value: "Next.js · FastAPI · D3.js · Tailwind" },
                
                { label: "Dataset", value: "Wikidata SPARQL API" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-white/30 text-xs shrink-0">{label}</span>
                  <span className="text-white/80 text-xs text-right">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-violet-500/40 text-[10px] tracking-widest uppercase">System Online</span>
              </div>
              <button
                onClick={() => setInfoOpen(false)}
                className="px-5 py-2 rounded-lg text-xs tracking-widest uppercase font-semibold"
                style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#a855f7" }}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}