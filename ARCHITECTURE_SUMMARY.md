# Architecture Summary
**Project:** Corporate Ownership Graph  
**Architect:** Nandhana T S  
**Batch:** Real Rails · Batch 4  

---

## System Overview

The Corporate Ownership Graph is a single-page Next.js application that fetches corporate relationship data from Wikidata in real time and renders it as an interactive force-directed graph using D3.js. The sidebar provides live intelligence metrics including jurisdiction concentration analysis, country distribution, and contextual ownership insights.

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        page.tsx                           │
│  ┌─────────────┐  ┌──────────────────┐  ┌────────────┐  │
│  │   Header    │  │ Search + Filters  │  │Info Modal  │  │
│  └─────────────┘  └──────────────────┘  └────────────┘  │
│  ┌──────────────────────────┐  ┌──────────────────────┐  │
│  │      GraphStage.tsx      │  │     Sidebar.tsx       │  │
│  │   (D3 Force Graph)       │  │ Metrics + Jurisdiction│  │
│  │   Node Search overlay    │  │ Pie Chart + Intel     │  │
│  └──────────────────────────┘  └──────────────────────┘  │
│  ┌─────────────┐                                          │
│  │ Node Legend │                                          │
│  └─────────────┘                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
User types query
      │
      ▼
wbsearchentities API (Wikidata)
      │
      ▼
Client-side filter (company keywords) + name deduplication
      │
      ▼
User selects company
      │
      ▼
Two parallel SPARQL queries (Promise.all)
  ├── Query 1: Subsidiaries + Parent (LIMIT 40)
  └── Query 2: People + Investors (LIMIT 30)
      │
      ▼
Merge & deduplicate bindings
      │
      ▼
Build nodes_map + edges array
      │
      ▼
setGraphData → GraphStage + Sidebar re-render
      │
      ▼
[On node click]
wbgetentities API → live Wikidata description → tooltip
```

---

## SPARQL Query Strategy

Two separate queries run in parallel to prevent subsidiaries from crowding out people and investors under a single LIMIT:

| Query | Properties Fetched | Limit |
|---|---|---|
| Query 1 | Root, Subsidiaries (P355), Parent (P749) | 40 |
| Query 2 | CEO (P169), Chair (P488), Board (P3320), Owner (P127) | 30 |

---

## Graph Rendering (D3.js)

- **Force Simulation:** forceLink + forceManyBody + forceCenter + forceCollide
- **Node Sizing:** root = radius 24, others = radius 15
- **Glow Effect:** outer circle at 0.1 opacity, radius 40/28
- **Zoom:** scaleExtent [0.3, 3] via d3.zoom
- **Drag:** d3.drag with alphaTarget for smooth physics
- **Tooltip:** React state positioned at click coordinates, includes live Wikidata description
- **Node Search:** highlights a specific node by name within the rendered graph
- **Node Filters:** type filter (subsidiary / investor / person) and jurisdiction filter hide/show nodes in real time

---

## Node Type System

| Type | Color | Wikidata Properties |
|---|---|---|
| root | #f59e0b (amber) | BIND of searched entity |
| subsidiary | #3b82f6 (blue) | P355, P749 (reverse) |
| investor | #a855f7 (purple) | P749, P127 |
| person | #ec4899 (pink) | P169, P488, P3320 |

---

## Sidebar Intelligence Modules

| Module | Description |
|---|---|
| Metric Boxes | Total Nodes, Subsidiaries, Investors, Key People |
| Jurisdiction Conc. | Top country's % share of all nodes with country data |
| Jurisdiction Distribution | Pie chart of top 8 countries; percentages sum to 100% within displayed set |
| Why This Matters | Contextual text explaining the ownership structure's significance |
| Who Controls the Rail | Names the dominant controlling entity in the graph |
| Subsidiaries List | Scrollable list of subsidiaries with country tags |
| Sidebar Toggle | Collapse/expand button to maximise graph space |

---

## Key Design Decisions

1. **Two-query split** — prevents people/investors being crowded out by subsidiaries
2. **Client-side company filtering** — uses `wbsearchentities` (CORS-safe) + keyword filter instead of SPARQL (which had CORS issues in browser)
3. **Name deduplication in search** — `Set<string>` deduplicates results with the same lowercase name before rendering the dropdown
4. **Raw ID filtering** — nodes with labels matching `/^Q\d+$/` are excluded
5. **Node deduplication** — `nodes_map` keyed by Wikidata entity ID prevents duplicate nodes in the graph
6. **On-demand description fetch** — Wikidata `wbgetentities` is called only on node click to avoid unnecessary API load
7. **Pie chart uses pieTotal** — pie percentages are calculated relative to the sum of displayed top-8 slices, not total node count, ensuring pie visual and legend numbers are always consistent
