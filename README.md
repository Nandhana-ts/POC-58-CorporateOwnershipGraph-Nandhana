# Corporate Ownership Graph

A production-quality intelligence system that visualizes corporate ownership structures using real-time data from the Wikidata SPARQL API.

## Overview

Search any company and instantly explore its subsidiaries, parent companies, investors, and key people through an interactive force-directed graph.

## Features

- **Smart Company Search** — filters to real companies only using Wikidata entity descriptions; deduplication prevents repeated results
- **Interactive Force Graph** — drag, zoom, pan nodes powered by D3.js
- **Color-Coded Nodes** — amber (root), blue (subsidiary), purple (investor), pink (key person)
- **Node Search & Filters** — filter visible nodes by type (subsidiary/investor/person) or jurisdiction in real time
- **Live Sidebar** — real-time metrics, scrollable subsidiaries list, sidebar toggle for smaller screens
- **Jurisdiction Concentration %** — derived metric showing top-country node concentration with full pie chart
- **Why This Matters** — contextual intelligence section explaining ownership significance
- **Who Controls the Rail** — top controller breakdown in the sidebar
- **Node Tooltips** — click any node for type badge, name, country, Wikidata ID, and live description
- **Node Legend** — always-visible reference at bottom-left
- **Downloadable Sample Data** — export current graph as JSON via ↓ Export button in header
- **Enhanced Tooltips** — colored type badge, Wikidata entity ID, and live Wikidata description on click
- **Attribution Bar** — SEC EDGAR, OpenCorporates, and Wikidata credited at the bottom

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
│   └── page.tsx          # Main page — search, data fetch, layout, export
├── components/
│   ├── GraphStage.tsx    # D3 force graph rendering + enhanced tooltips
│   └── Sidebar.tsx       # Metrics, filters, intelligence sections, pie chart
```

## Data Sources

All data is fetched live from:
- **Wikidata SPARQL API** — corporate relationships (P355, P749, P169, P488, P3320, P127)
- **SEC EDGAR** — https://www.sec.gov/cgi-bin/browse-edgar
- **OpenCorporates** — https://opencorporates.com

## Requirements

See [REQUIREMENTS.md](./REQUIREMENTS.md) for full dependency list.

## Author

Nandhana T S  
Real Rails · Batch 4
