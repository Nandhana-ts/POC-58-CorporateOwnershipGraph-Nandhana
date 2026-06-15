# Architecture Summary — Corporate Ownership Graph

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (localhost:3000)                  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  page.tsx                                            │  │
│  │  [Search Bar] [Graph Area] [Export Button]           │  │
│  │       │                                              │  │
│  │  ┌────▼─────────┐    ┌──────────────────────────┐   │  │
│  │  │ GraphStage   │    │       Sidebar             │   │  │
│  │  │ (D3 force)   │    │ Metrics | Pie | Filters   │   │  │
│  │  │ L1 + L2 nodes│    │ Node Search | Export      │   │  │
│  │  │ Dashed edges │    │ L2 Badges | Layer 2 Count │   │  │
│  │  └──────────────┘    └──────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP (fetch)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (localhost:8000)            │
│                                                             │
│   POST /graph  →  asyncio.gather(4 SPARQL queries)          │
│                                                             │
│   Query 1: Direct subsidiaries (L1)                         │
│   Query 2: Parents / investors / people (L1)                │
│   Query 3: Subsidiaries-of-subsidiaries (L2)                │
│   Query 4: Grandparent owners (L2)                          │
│                                                             │
│   → Merge + deduplicate by Wikidata entity ID               │
│   → Return { nodes: [...], edges: [...] }                   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS SPARQL
                        ▼
         https://query.wikidata.org/sparql
              (Wikidata SPARQL API — CC0)
```

---

## Data Flow

1. User types company name → autocomplete calls Wikidata search endpoint
2. User selects entity → `page.tsx` POSTs entity ID to `localhost:8000/graph`
3. Backend fires 4 parallel SPARQL queries via `asyncio.gather`
4. Results merged, deduplicated by entity QID
5. Layer depth assigned: L1 (direct), L2 (2-hop)
6. JSON `{ nodes, edges }` returned to frontend
7. D3 force simulation renders graph
8. Sidebar reads same graph data for metrics, pie chart, country breakdown
9. Export: `JSON.stringify({ nodes, edges })` → file download

---

## Component Responsibilities

| Component | Responsibility |
|---|---|
| `page.tsx` | Search state, graph data state, layout, attribution bar |
| `GraphStage.tsx` | D3 force graph, node/edge rendering, L2 visual treatment, tooltips |
| `Sidebar.tsx` | Metrics (total nodes, edges, L2 count), pie chart modal, node search, filter toggles, export button |
| `main.py` | SPARQL query orchestration, deduplication, CORS, `/graph` endpoint |

---

## Key Design Decisions

### 1. Single Data Path
Only Wikidata SPARQL is used. No dual-path confusion between SEC EDGAR / OpenCorporates. This ensures the app runs without API keys or paid access.

### 2. 2-Hop Graph Depth
Four SPARQL queries run in parallel rather than recursively, keeping latency low. Layer 2 nodes are tagged with `depth: 2` in the response, enabling visual distinction without a second render pass.

### 3. Deduplication by Entity ID
Wikidata QIDs (e.g. `Q12345`) are used as node IDs. Duplicate nodes from overlapping queries are dropped before the graph is returned, preventing duplicate edges.

### 4. DNA Enforcement
- Background: `#030712` hardcoded in all three components (page, graph, sidebar) and all modal/dropdown overlays
- Accent: violet `#a855f7` for all highlights, badges, and active states
- No cyan colors anywhere in the codebase

### 5. Visual Layer Distinction
- L2 nodes: smaller radius, lower opacity, dashed stroke edges, "L2" text badge
- L1 nodes: full size, full opacity, solid edges
- Tooltip shows "· Layer 2" suffix for depth-2 nodes

### 6. Sidebar Intelligence Modules

| Module | Data Source |
|---|---|
| Total Nodes / Edges | Derived from graph JSON |
| Layer 2 Node Count | Filtered from `nodes.filter(n => n.depth === 2)` |
| Ownership % Pie | Estimated from edge count per parent node |
| Country Breakdown | `node.country` field from SPARQL results |
| Node Search | Client-side filter on loaded graph (no refetch) |

---

## Backend: `requirements.txt`

```
fastapi==0.111.0
uvicorn==0.30.1
httpx==0.27.0
```

---

## Startup

```bash
# Terminal 1
cd backend && pip install -r requirements.txt && uvicorn main:app --reload

# Terminal 2
cd frontend && npm install && npm run dev
```
