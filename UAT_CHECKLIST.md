# UAT Checklist — Corporate Ownership Graph
**Version:** Final (Post-Reviewer-Feedback)

---

## Setup Before Testing

```bash
# Terminal 1 — Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Open: http://localhost:3000

---

## Section 1: Search

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 1.1 | Type "Microsoft" in search bar | Autocomplete suggestions appear | |
| 1.2 | Select "Microsoft" from dropdown | Graph loads with nodes and edges | |
| 1.3 | Search for "Alphabet" | Graph loads Google's ownership structure | |
| 1.4 | Search for a non-existent company | Empty state shown, no crash | |

---

## Section 2: Graph — Layer 1

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 2.1 | Load Microsoft | Direct subsidiaries visible (e.g. GitHub, LinkedIn) | |
| 2.2 | Load Microsoft | Direct parent / investors visible | |
| 2.3 | Hover node | Tooltip shows label, type, country | |
| 2.4 | L1 nodes appear full size | Standard radius, full opacity, solid edges | |

---

## Section 3: Graph — Layer 2 (2-Hop)

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 3.1 | Load Microsoft | Layer 2 nodes visible (e.g. Xbox Game Studios subsidiaries) | |
| 3.2 | L2 nodes visually distinct | Smaller radius, lower opacity | |
| 3.3 | L2 edges are dashed | Dashed stroke visible | |
| 3.4 | L2 badge on nodes | "L2" text label visible on depth-2 nodes | |
| 3.5 | Hover L2 node | Tooltip shows "· Layer 2" suffix | |

---

## Section 4: Filters

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 4.1 | Toggle off "Subsidiaries" | Subsidiary nodes disappear | |
| 4.2 | Toggle off "Parents" | Parent nodes disappear | |
| 4.3 | Toggle off "People" | People nodes disappear | |
| 4.4 | Toggle off "Investors" | Investor nodes disappear | |
| 4.5 | Re-enable all filters | All nodes return | |

---

## Section 5: Sidebar Metrics

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 5.1 | Load any company | Total Nodes count displayed | |
| 5.2 | Load any company | Total Edges count displayed | |
| 5.3 | Load any company | Layer 2 Nodes count displayed | |
| 5.4 | Layer 2 count matches graph | Count = number of L2 nodes in graph | |

---

## Section 6: Pie Chart

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 6.1 | Click pie chart button in sidebar | Modal opens with pie chart | |
| 6.2 | Modal background | Background is `#030712` | |
| 6.3 | Pie chart renders slices | Slices proportional to ownership % | |
| 6.4 | Close modal | Modal closes, graph still visible | |

---

## Section 7: Node Search

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 7.1 | Type node name in sidebar search | Matching nodes listed | |
| 7.2 | L2 nodes in results | "L2" badge shown on depth-2 results | |
| 7.3 | Click a result | Graph highlights / zooms to node | |

---

## Section 8: DNA (Design)

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 8.1 | Page background | `#030712` (near-black, not blue-tinted) | |
| 8.2 | Sidebar background | `#030712` or rgba equivalent | |
| 8.3 | Dropdowns / modals | `#030712` background | |
| 8.4 | Accent color | Violet `#a855f7` (not cyan) | |
| 8.5 | No cyan anywhere | Inspect — no `#06b6d4` or similar | |

---

## Section 9: Attribution

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 9.1 | Attribution bar visible | "Wikidata SPARQL API" shown | |
| 9.2 | No SEC EDGAR | SEC EDGAR not mentioned anywhere in UI | |
| 9.3 | No OpenCorporates | OpenCorporates not mentioned anywhere in UI | |
| 9.4 | Info modal attribution | Shows Wikidata only | |

---

## Section 10: Export

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 10.1 | Click Export button | JSON file downloads | |
| 10.2 | Open downloaded JSON | Contains `nodes` and `edges` arrays | |
| 10.3 | Node entries | Each has: id, label, type, country, depth | |
| 10.4 | Edge entries | Each has: source, target | |
| 10.5 | L2 nodes in export | `depth: 2` on layer-2 nodes | |

---

## Section 11: Backend

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 11.1 | `requirements.txt` exists in `/backend` | File present with 3 dependencies | |
| 11.2 | `pip install -r requirements.txt` | Installs without errors | |
| 11.3 | `uvicorn main:app --reload` | Server starts on port 8000 | |
| 11.4 | `GET http://localhost:8000/docs` | FastAPI Swagger UI loads | |
| 11.5 | POST `/graph` with valid entity ID | Returns `{ nodes, edges }` JSON | |

---

## Section 12: Deduplication

| # | Test Case | Expected | Pass/Fail |
|---|---|---|---|
| 12.1 | Load company with overlapping queries | No duplicate nodes in graph | |
| 12.2 | Load company with overlapping queries | No duplicate edges in graph | |

---

## Sign-off

| Role | Name | Date | Signature |
|---|---|---|---|
| Developer | | | |
| Reviewer | | | |
