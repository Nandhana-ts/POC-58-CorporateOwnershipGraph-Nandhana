"use client";

export default function Sidebar({ graphData, selectedCompany }: { graphData: any; selectedCompany: string }) {
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
  const edges = graphData.edges || [];
  const subsidiaries = nodes.filter((n: any) => n.type === "subsidiary");
  const investors = nodes.filter((n: any) => n.type === "investor");
  const people = nodes.filter((n: any) => n.type === "person");

  const metrics = [
    { label: "Total Nodes", value: nodes.length },
    { label: "Subsidiaries", value: subsidiaries.length },
    { label: "Investors", value: investors.length },
    { label: "Key People", value: people.length },
  ];

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
      <div className="px-5 pt-20 pb-4 border-b border-violet-500/10">
        <div className="text-violet-400/40 text-[9px] tracking-widest uppercase mb-1">Analysis</div>
        <h2 className="text-white text-base font-bold truncate">{selectedCompany || "—"}</h2>
      </div>

      {/* 4 Metric Boxes */}
      <div className="grid grid-cols-2 gap-2 p-4 border-b border-violet-500/10">
        {metrics.map(m => (
          <div
            key={m.label}
            className="rounded-xl p-3 flex flex-col gap-1"
            style={{
              background: "rgba(139,92,246,0.07)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <span className="text-violet-300 text-lg font-bold">{m.value}</span>
            <span className="text-white/30 text-[9px] tracking-widest uppercase">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Subsidiaries List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
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
                {s.country && (
                  <span className="ml-2 text-violet-400/40 text-[9px]">{s.country}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}