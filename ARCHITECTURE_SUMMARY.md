# Architecture Summary
**Project:** Corporate Ownership Graph  
**Architect:** Nandhana T S  
**Batch:** Real Rails · Batch 4  

---

## System Overview

The Corporate Ownership Graph is a single-page Next.js application that fetches corporate relationship data from Wikidata in real time and renders it as an interactive force-directed graph using D3.js.

---

## Component Architecture

```
┌──────────────────────────────────────────────────────┐
│                      page.tsx                        │
│  ┌─────────────┐  ┌──────────┐  ┌────────────────┐  │
│  │   Header    │  │  Search  │  │  Info Modal    │  │
│  │ + Export Btn│  │ Dropdown │  │ (no Theme row) │  │
│  └─────────────┘  └──────────┘  └────────────────┘  │
│  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │    GraphStage.tsx    │  │     Sidebar.tsx      │  │
│  │  (D3 Force Graph +   │  │  Metrics · Filters · │  │
│  │   Enhanced Tooltip)  │  │  Intelligence Panels │  │
│  └──────────────────────┘  └──────────────────────┘  │
│  ┌─────────────┐  ┌──────────────────────────────┐   │
│  │ Node Legend │  │    Attribution Bar (footer)  │   │
│  └─────────────┘  └──────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
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
Client-side filter (company keywords) + deduplication
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
Node click → on-demand wbgetentities fetch (description)
      │
      ▼
pieTotal derived from jurisdiction counts (Sidebar)
      │
      ▼
Export → JSON download via Blob URL
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
- **Tooltip:** React state positioned at click coordinates; shows type badge, name, country, Wikidata ID, and live description
- **Filters:** node type and jurisdiction filters hide/show nodes by mutating D3 selections in real time

---

## Node Type System

| Type | Color | Wikidata Properties |
|---|---|---|
| root | `#f59e0b` (amber) | BIND of searched entity |
| subsidiary | `#3b82f6` (blue) | P355, P749 (reverse) |
| investor | `#a855f7` (purple) | P749, P127 |
| person | `#ec4899` (pink) | P169, P488, P3320 |

---

## Sidebar Intelligence Modules

| Module | Description |
|---|---|
| Metrics | Total Nodes, Subsidiaries, Investors, Key People |
| Jurisdiction Concentration % | Derived metric: top-country node % + pie chart |
| Subsidiaries List | Scrollable list with country tags |
| Why This Matters | Contextual intelligence text |
| Who Controls the Rail | Top controller breakdown |

---

## Key Design Decisions

- **Two-query split** — prevents people/investors being crowded out by subsidiaries
- **Client-side company filtering** — uses wbsearchentities (CORS-safe) + keyword filter instead of SPARQL (CORS issues in browser)
- **Name deduplication** — search dropdown deduplicates by label to prevent repeated entries
- **Raw ID filtering** — nodes with labels matching `/^Q\d+$/` are excluded from the graph
- **Deduplication** — nodes_map keyed by Wikidata entity ID prevents duplicate nodes
- **On-demand description fetch** — wbgetentities called per node click, not at graph load, to avoid rate limits
- **pieTotal derived metric** — computed from jurisdiction count map; top-country % displayed inline with full pie chart on demand
- **Export as JSON** — Blob URL download of full graphData object named after the root company
- **Attribution bar** — SEC EDGAR, OpenCorporates, and Wikidata credited in a persistent footer strip
- **Sidebar toggle** — collapses sidebar for smaller viewports without breaking graph layout
