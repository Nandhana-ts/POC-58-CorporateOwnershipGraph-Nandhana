# Corporate Ownership Graph

A production-quality intelligence system that visualizes corporate ownership structures using real-time data from the Wikidata SPARQL API.

## Overview

Search any company and instantly explore its subsidiaries, parent companies, investors, and key people through an interactive force-directed graph.

## Features

- Smart Company Search — filters to real companies only using Wikidata entity descriptions
- Interactive Force Graph — drag, zoom, pan nodes powered by D3.js
- Color-Coded Nodes — amber (root), blue (subsidiary), purple (investor), pink (key person)
- Live Sidebar — real-time metrics and scrollable subsidiaries list
- Node Tooltips — click any node for details
- Node Legend — always-visible reference at bottom-left

## Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | Next.js 14, React, TypeScript   |
| Styling   | Tailwind CSS                    |
| Graph     | D3.js (force simulation)        |
| Data      | Wikidata SPARQL API             |

## Getting Started

npm install
npm run dev

Open http://localhost:3000

## Architecture

frontend/
├── app/
│   └── page.tsx          # Main page — search, data fetch, layout
├── components/
│   ├── GraphStage.tsx    # D3 force graph rendering
│   └── Sidebar.tsx       # Metrics and subsidiaries panel

## Data Sources

All data is fetched live from Wikidata SPARQL API. Relationships mapped:
- Subsidiaries (P355)
- Parent company (P749)
- CEO (P169), Chairperson (P488), Board member (P3320)
- Owned by / Investor (P127)

## Author

Nandhana T S
Real Rails · Batch 4
