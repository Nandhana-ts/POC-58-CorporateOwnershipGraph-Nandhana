# UAT_CHECKLIST.md — User Acceptance Testing
**Project:** Corporate Ownership Graph  
**Architect:** Nandhana T S  
**Batch:** Real Rails · Batch 4  
**Test Date:** 2026-06-09  

---

## 1. Search Functionality

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 1.1 | Type a company name and press Enter | Search triggers and dropdown appears | ✅ PASS |
| 1.2 | Click Search button | Search triggers and dropdown appears | ✅ PASS |
| 1.3 | Search "apple" | Only real companies shown (Apple Inc., Apple Corp etc.) | ✅ PASS |
| 1.4 | Search returns non-company entities | Filtered out by keyword check | ✅ PASS |
| 1.5 | Click a company from dropdown | Graph loads for selected company | ✅ PASS |
| 1.6 | Search with empty input | No fetch triggered | ✅ PASS |
| 1.7 | Search same company twice | Deduplication prevents repeated results | ✅ PASS |

---

## 2. Graph Rendering

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 2.1 | Select a company | Graph renders with nodes and edges | ✅ PASS |
| 2.2 | Root node visible | Larger amber node at center | ✅ PASS |
| 2.3 | Subsidiary nodes visible | Blue nodes connected to root | ✅ PASS |
| 2.4 | Investor nodes visible | Purple nodes connected to root | ✅ PASS |
| 2.5 | Key Person nodes visible | Pink nodes connected to root | ✅ PASS |
| 2.6 | Edges render with correct color | Edge color matches target node type | ✅ PASS |

---

## 3. Interactions

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 3.1 | Click a node | Tooltip appears with type badge, name, country, Wikidata ID, live description | ✅ PASS |
| 3.2 | Click SVG background | Tooltip dismisses | ✅ PASS |
| 3.3 | Drag a node | Node moves, simulation adjusts | ✅ PASS |
| 3.4 | Scroll on graph | Zoom in/out works | ✅ PASS |
| 3.5 | Pan graph | Graph pans correctly | ✅ PASS |

---

## 4. Sidebar

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 4.1 | No company selected | Shows "No data loaded" state | ✅ PASS |
| 4.2 | Company selected | Shows company name as heading | ✅ PASS |
| 4.3 | Metric boxes | Total Nodes, Subsidiaries, Investors, Key People shown | ✅ PASS |
| 4.4 | Jurisdiction Concentration % | Derived metric shows top-country percentage | ✅ PASS |
| 4.5 | Subsidiaries list | All subsidiaries listed with country | ✅ PASS |
| 4.6 | Subsidiaries list scrollable | Scroll works for long lists | ✅ PASS |
| 4.7 | Sidebar toggle button | Sidebar collapses and expands | ✅ PASS |
| 4.8 | Why This Matters section | Visible in sidebar with contextual text | ✅ PASS |
| 4.9 | Who Controls the Rail section | Top controller breakdown shown | ✅ PASS |

---

## 5. Node Search & Filters

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 5.1 | Filter by Subsidiary | Only subsidiary nodes visible in graph | ✅ PASS |
| 5.2 | Filter by Investor | Only investor nodes visible in graph | ✅ PASS |
| 5.3 | Filter by Person | Only key person nodes visible in graph | ✅ PASS |
| 5.4 | Filter by Jurisdiction | Nodes from selected country shown | ✅ PASS |
| 5.5 | Clear filter | All nodes restored | ✅ PASS |
| 5.6 | Node search by name | Matching nodes highlighted/shown | ✅ PASS |

---

## 6. Jurisdiction Metrics

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 6.1 | Jurisdiction Concentration % shown | Correct % for top country | ✅ PASS |
| 6.2 | Pie chart opens | Click triggers pie chart modal | ✅ PASS |
| 6.3 | Pie chart slices correct | Colors and labels match countries | ✅ PASS |
| 6.4 | Pie chart closes | Dismiss works correctly | ✅ PASS |
| 6.5 | Single-country graph | 100% concentration shown | ✅ PASS |
| 6.6 | Multi-country graph | Distribution split shown correctly | ✅ PASS |

---

## 7. Node Legend

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 7.1 | Legend visible on empty state | Yes, bottom-left | ✅ PASS |
| 7.2 | Legend visible with graph loaded | Yes, not overlapping | ✅ PASS |
| 7.3 | Legend colors match graph nodes | Amber, Blue, Purple, Pink match | ✅ PASS |
| 7.4 | All 4 node types shown | Root, Subsidiary, Investor, Key Person fully visible | ✅ PASS |

---

## 8. Loading States

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 8.1 | Search button during fetch | Shows "..." | ✅ PASS |
| 8.2 | Graph loads after fetch | Renders without page reload | ✅ PASS |

---

## 9. Edge Cases

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 9.1 | Company with no subsidiaries | Subsidiaries section shows "None found" | ✅ PASS |
| 9.2 | Node with no country | Country tag not shown | ✅ PASS |
| 9.3 | Raw Wikidata IDs (Q12345) | Filtered out, not shown as nodes | ✅ PASS |
| 9.4 | Search with network error | Error logged, no crash | ✅ PASS |
| 9.5 | Wikidata description fetch failure | Shows "No description available" gracefully | ✅ PASS |

---

## 10. Info Modal

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 10.1 | Click "i" button | Modal opens | ✅ PASS |
| 10.2 | Click outside modal | Modal closes | ✅ PASS |
| 10.3 | Click Acknowledge | Modal closes | ✅ PASS |
| 10.4 | Modal shows correct details | Architect, Stack, Dataset shown (no Theme row) | ✅ PASS |

---

## 11. Download & Attribution

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 11.1 | Click ↓ Export button | JSON file downloads with company name | ✅ PASS |
| 11.2 | Downloaded JSON structure | Contains company, nodes, edges | ✅ PASS |
| 11.3 | SEC EDGAR attribution link | Visible in footer bar, opens correct URL | ✅ PASS |
| 11.4 | OpenCorporates attribution link | Visible in footer bar, opens correct URL | ✅ PASS |
| 11.5 | Wikidata attribution link | Visible in footer bar, opens correct URL | ✅ PASS |

---

Process Learning:
- Repomix method was not followed during Phase 1
- Debugging was done directly without generating repomix context
- Checkpoint commits before AI changes were missed
- These process gaps will be strictly followed in future phases

## UAT Result: ✅ FULL PASS
All critical test cases passed. System is production-ready.
