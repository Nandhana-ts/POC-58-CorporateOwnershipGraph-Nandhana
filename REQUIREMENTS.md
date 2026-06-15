# Requirements — Corporate Ownership Graph

## 1. Functional Requirements

### 1.1 Search
- FR-01: User can search for any company by name via autocomplete
- FR-02: Search queries Wikidata SPARQL for matching entities
- FR-03: Selecting a result triggers graph load

### 1.2 Graph Rendering
- FR-04: Graph renders using D3.js force simulation
- FR-05: Layer 1 nodes = direct subsidiaries, parents, investors, people
- FR-06: Layer 2 nodes = subsidiaries-of-subsidiaries + grandparent owners
- FR-07: Layer 2 nodes render smaller, more transparent, with dashed edges
- FR-08: Layer 2 nodes display an "L2" badge
- FR-09: Node tooltip shows: label, type, country, depth layer
- FR-10: Edges are directional (arrows indicate ownership direction)

### 1.3 Filters
- FR-11: Toggle visibility of subsidiaries, parents, people, investors independently
- FR-12: Filter state reflected immediately in graph without refetch

### 1.4 Sidebar
- FR-13: Show total node count, edge count, Layer 2 node count
- FR-14: Ownership % pie chart for top shareholders
- FR-15: Country breakdown of entities
- FR-16: Node search/filter within loaded graph
- FR-17: L2 badge shown on depth-2 entries in node list

### 1.5 Export
- FR-18: Export full graph data as JSON download
- FR-19: Export JSON includes nodes (id, label, type, country, depth) and edges (source, target)

### 1.6 Attribution
- FR-20: Attribution bar shows "Wikidata SPARQL API" only
- FR-21: No false attribution to SEC EDGAR or OpenCorporates

---

## 2. Non-Functional Requirements

### 2.1 Design (DNA)
- NFR-01: Background color must be `#030712` across all components
- NFR-02: Primary accent color must be violet `#a855f7` (not cyan)
- NFR-03: Consistent dark theme across page, graph, sidebar, modals, dropdowns

### 2.2 Performance
- NFR-04: 4 SPARQL queries run in parallel (asyncio.gather / Promise.all)
- NFR-05: Deduplication by Wikidata entity ID before rendering

### 2.3 Reliability
- NFR-06: CORS configured for localhost:3000 → localhost:8000
- NFR-07: Backend and frontend are independently restartable
- NFR-08: Graceful handling of empty SPARQL results

### 2.4 Maintainability
- NFR-09: Python dependencies pinned in `backend/requirements.txt`
- NFR-10: Single data path — Wikidata SPARQL only (no dual-path confusion)

---

## 3. Out of Scope

- Authentication / user accounts
- Persistent storage / database
- SEC EDGAR or OpenCorporates integration
- Real-time graph updates (WebSocket)
- Mobile-first layout

---

## 4. Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| fastapi | 0.111.0 | Backend API framework |
| uvicorn | 0.30.1 | ASGI server |
| httpx | 0.27.0 | Async HTTP client for SPARQL |
| next | 14.x | Frontend framework |
| d3 | 7.x | Graph rendering |
| tailwindcss | 3.x | Styling |
