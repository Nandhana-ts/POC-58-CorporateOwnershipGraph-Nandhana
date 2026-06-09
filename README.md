# Corporate Ownership Graph

A production-quality intelligence system that visualizes corporate ownership structures using real-time data from the Wikidata SPARQL API.

## Overview

Search any company and instantly explore its subsidiaries, parent companies, investors, and key people through an interactive force-directed graph. The sidebar provides live intelligence metrics including jurisdiction analysis and ownership distribution.

## Features

- **Smart Company Search** — filters to real companies only using Wikidata entity descriptions; deduplicates results with the same name
- **Interactive Force Graph** — drag, zoom, pan nodes powered by D3.js
- **Color-Coded Nodes** — amber (root), blue (subsidiary), purple (investor), pink (key person)
- **Node Search** — search and highlight a specific node within the graph
- **Node Filters** — filter visible nodes by type (subsidiary, investor, person) and by jurisdiction
- **Node Click Description** — click any node to see a live Wikidata description fetched in real time
- **Sidebar Toggle** — collapse/expand the sidebar to maximise graph space
- **Live Sidebar** — real-time metrics including total nodes, subsidiaries, investors, and key people
- **Jurisdiction Concentration** — single metric showing what % of nodes are concentrated in the top country
- **Jurisdiction Distribution** — interactive pie chart showing country-wise breakdown (top 8 jurisdictions)
- **Why This Matters** — contextual intelligence section explaining the ownership structure's significance
- **Who Controls the Rail** — highlights the dominant controlling entity in the graph
- **Node Tooltips** — click any node for name, type, country, and live Wikidata description
- **Node Legend** — always-visible reference at bottom-left

## Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | Next.js 14, React, TypeScript   |
| Styling   | Tailwind CSS                    |
| Graph     | D3.js (force simulation)        |
| Data      | Wikidata SPARQL API             |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Architecture

```
frontend/
├── app/
│   └── page.tsx          # Main page — search, data fetch, layout, filters, node search
├── components/
│   ├── GraphStage.tsx    # D3 force graph rendering
│   └── Sidebar.tsx       # Metrics, jurisdiction analysis, pie chart, subsidiaries panel
```

## Data Sources

All data is fetched live from Wikidata SPARQL API. Relationships mapped:
- Subsidiaries (P355)
- Parent company (P749)
- CEO (P169), Chairperson (P488), Board member (P3320)
- Owned by / Investor (P127)

Node descriptions are fetched on-demand from the Wikidata `wbgetentities` API on node click.

## Author

Nandhana T S  
Real Rails · Batch 4
