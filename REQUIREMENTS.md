# Requirements
**Project:** Corporate Ownership Graph  
**Architect:** Nandhana T S  
**Batch:** Real Rails · Batch 4  

---

## Runtime Requirements

| Requirement | Version |
|---|---|
| Node.js | >= 18.0.0 |
| npm | >= 9.0.0 |

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| next | 16.2.6 | React framework — routing, SSR, build |
| react | 19.2.4 | UI component library |
| react-dom | 19.2.4 | React DOM renderer |
| d3 | ^7.9.0 | Force-directed graph rendering and SVG manipulation |

---

## Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| typescript | ^5 | Static type checking |
| tailwindcss | ^4 | Utility-first CSS framework |
| @tailwindcss/postcss | ^4 | Tailwind PostCSS integration |
| eslint | ^9 | Code linting |
| eslint-config-next | 16.2.6 | Next.js ESLint ruleset |
| @types/d3 | ^7.4.3 | TypeScript types for D3 |
| @types/node | ^20 | TypeScript types for Node.js |
| @types/react | ^19 | TypeScript types for React |
| @types/react-dom | ^19 | TypeScript types for React DOM |

---

## External APIs (No Installation Required)

| API | Usage |
|---|---|
| Wikidata SPARQL API | Fetches corporate relationship data (subsidiaries, investors, key people) |
| Wikidata wbsearchentities API | Powers company search with client-side company filtering |
| Wikidata wbgetentities API | Fetches live entity descriptions on node click |

---

## Installation

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000
