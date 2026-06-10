# REQUIREMENTS.md — Project Dependencies
**Project:** Corporate Ownership Graph  
**Architect:** Nandhana T S  
**Batch:** Real Rails · Batch 4  

---

## Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| next | 16.2.6 | React framework (SSR, routing, build) |
| react | 19.2.4 | UI component library |
| react-dom | 19.2.4 | React DOM rendering |
| d3 | ^7.9.0 | Force-directed graph, zoom, drag, simulation |

---

## Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| typescript | ^5 | Static typing |
| @types/react | ^19 | TypeScript types for React |
| @types/react-dom | ^19 | TypeScript types for React DOM |
| @types/node | ^20 | TypeScript types for Node.js |
| @types/d3 | ^7.4.3 | TypeScript types for D3.js |
| tailwindcss | ^4 | Utility-first CSS framework |
| @tailwindcss/postcss | ^4 | PostCSS integration for Tailwind |
| eslint | ^9 | JavaScript/TypeScript linter |
| eslint-config-next | 16.2.6 | ESLint config for Next.js |

---

## External APIs (No Installation Required)

| API | URL | Usage |
|---|---|---|
| Wikidata SPARQL | https://query.wikidata.org/sparql | Corporate relationship queries |
| Wikidata Search | https://www.wikidata.org/w/api.php | Company name search (wbsearchentities) |
| Wikidata Entities | https://www.wikidata.org/w/api.php | Node descriptions (wbgetentities) |
| SEC EDGAR | https://www.sec.gov/cgi-bin/browse-edgar | Attributed as data source |
| OpenCorporates | https://opencorporates.com | Attributed as data source |

---

## System Requirements

| Requirement | Minimum |
|---|---|
| Node.js | v18+ |
| npm | v9+ |
| Browser | Chrome 90+, Firefox 88+, Edge 90+ |

---

## Installation

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000
