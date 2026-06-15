# Corporate Ownership Graph

An interactive graph explorer for corporate ownership structures, powered by live **Wikidata SPARQL** queries. Search any company and visualize 2-hop ownership layers — subsidiaries, parent companies, investors, and key people.

---

## Features

| Feature | Description |
|---|---|
| 🔍 **Live Search** | Autocomplete company search via Wikidata |
| 🕸️ **2-Hop Graph** | Layer 1 (direct) + Layer 2 (sub-subsidiaries, grandparent owners) |
| 🎨 **DNA Design** | Background `#030712`, violet accent `#a855f7` |
| 🏷️ **L2 Badges** | Depth-2 nodes visually distinct (dashed edges, smaller, L2 label) |
| 📊 **Sidebar Panels** | Ownership %, pie chart, country breakdown, entity metrics |
| 🔎 **Node Search** | Filter nodes inside the graph |
| 🎛️ **Filters** | Toggle subsidiaries / parents / people / investors |
| 💾 **Export** | Download full graph as JSON |
| 🔗 **Tooltips** | Hover nodes for label, type, country, depth |
| 📡 **Attribution** | Honest sourcing — Wikidata SPARQL API only |

---

## Stack

- **Frontend:** Next.js 14, TypeScript, D3.js, Tailwind CSS
- **Backend:** Python 3.11+, FastAPI, HTTPX, Uvicorn
- **Data:** Wikidata SPARQL API (live, no API key required)

---

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Both terminals must stay running.

---

## Project Structure

```
project/
├── backend/
│   ├── main.py              # FastAPI app, SPARQL queries
│   └── requirements.txt     # Python dependencies
└── frontend/
    ├── app/
    │   └── page.tsx         # Main page, search, graph data state
    └── components/
        ├── GraphStage.tsx   # D3 force graph, 2-hop rendering
        └── Sidebar.tsx      # Metrics, pie chart, filters, export
```

---

## Data Path

The frontend calls the backend (`http://localhost:8000`) which fires **4 parallel SPARQL queries** against `https://query.wikidata.org/sparql`:

1. Direct subsidiaries (Layer 1)
2. Direct parents / investors / people (Layer 1)
3. Subsidiaries-of-subsidiaries (Layer 2)
4. Grandparent owners (Layer 2)

Results are merged, deduplicated by entity ID, and returned as `{ nodes, edges }`.

---

## Sample Data

Search for any of these to see the graph in action:

- **Microsoft** — large subsidiary tree (Xbox Game Studios, LinkedIn, GitHub…)
- **Alphabet** — Google's parent with multiple layers
- **SoftBank** — investor graph with wide reach
- **Toyota** — manufacturing ownership chains

---

## Data Source

All data is queried live from the **[Wikidata SPARQL API](https://query.wikidata.org/)** (CC0 license). No SEC EDGAR or OpenCorporates data is used.

---

## Requirements

See [REQUIREMENTS.md](./REQUIREMENTS.md) for the full functional and non-functional specification.
