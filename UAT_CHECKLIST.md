# UAT_CHECKLIST.md — User Acceptance Testing
**Project:** Corporate Ownership Graph  
**Architect:** Nandhana T S  
**Batch:** Real Rails · Batch 4  
**Test Date:** 2026-06-06  

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
| 1.7 | Search returns duplicate company names | Only one entry shown per unique name | ✅ PASS |

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
| 3.1 | Click a node | Tooltip appears with name, type, country, and Wikidata description | ✅ PASS |
| 3.2 | Click SVG background | Tooltip dismisses | ✅ PASS |
| 3.3 | Drag a node | Node moves, simulation adjusts | ✅ PASS |
| 3.4 | Scroll on graph | Zoom in/out works | ✅ PASS |
| 3.5 | Pan graph | Graph pans correctly | ✅ PASS |

---

## 4. Node Search & Filters

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 4.1 | Type in node search box | Matching node is highlighted in the graph | ✅ PASS |
| 4.2 | Filter by node type (subsidiary) | Only subsidiary nodes remain visible | ✅ PASS |
| 4.3 | Filter by node type (investor) | Only investor nodes remain visible | ✅ PASS |
| 4.4 | Filter by node type (person) | Only person nodes remain visible | ✅ PASS |
| 4.5 | Filter by jurisdiction | Only nodes in selected country remain visible | ✅ PASS |
| 4.6 | Clear filters | All nodes visible again | ✅ PASS |

---

## 5. Sidebar

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 5.1 | No company selected | Shows "No data loaded" state | ✅ PASS |
| 5.2 | Company selected | Shows company name as heading | ✅ PASS |
| 5.3 | Metric boxes | Total Nodes, Subsidiaries, Investors, Key People shown | ✅ PASS |
| 5.4 | Subsidiaries list | All subsidiaries listed with country | ✅ PASS |
| 5.5 | Subsidiaries list scrollable | Scroll works for long lists | ✅ PASS |
| 5.6 | Sidebar toggle button | Sidebar collapses and expands correctly | ✅ PASS |
| 5.7 | Graph resizes on sidebar collapse | Graph occupies full width when sidebar is hidden | ✅ PASS |

---

## 6. Jurisdiction Metrics

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 6.1 | Jurisdiction Conc. metric box | Shows top country's % share of all nodes with country data | ✅ PASS |
| 6.2 | Jurisdiction Distribution pie chart | Opens modal with country breakdown pie chart | ✅ PASS |
| 6.3 | Pie chart percentages | Percentages add up to ~100% (rounding allowed) | ✅ PASS |
| 6.4 | Pie chart legend | Each slice has a matching legend entry with % | ✅ PASS |
| 6.5 | "Showing top 8 jurisdictions" note | Displayed below pie chart | ✅ PASS |
| 6.6 | Company with nodes in 1 country | Conc. shows 100%, pie shows single slice | ✅ PASS |

---

## 7. Intelligence Sections

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 7.1 | "Why This Matters" section | Visible in sidebar with relevant context text | ✅ PASS |
| 7.2 | "Who Controls the Rail" section | Shows dominant controlling entity name | ✅ PASS |

---

## 8. Node Legend

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 8.1 | Legend visible on empty state | Yes, bottom-left | ✅ PASS |
| 8.2 | Legend visible with graph loaded | Yes, not overlapping | ✅ PASS |
| 8.3 | Legend colors match graph nodes | Amber, Blue, Purple, Pink match | ✅ PASS |
| 8.4 | All 4 node types shown | Root, Subsidiary, Investor, Key Person | ✅ PASS |

---

## 9. Loading States

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 9.1 | Search button during fetch | Shows "..." | ✅ PASS |
| 9.2 | Graph loads after fetch | Renders without page reload | ✅ PASS |

---

## 10. Edge Cases

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 10.1 | Company with no subsidiaries | Subsidiaries section shows "None found" | ✅ PASS |
| 10.2 | Node with no country | Country tag not shown | ✅ PASS |
| 10.3 | Raw Wikidata IDs (Q12345) | Filtered out, not shown as nodes | ✅ PASS |
| 10.4 | Search with network error | Error logged, no crash | ✅ PASS |
| 10.5 | Node click description fetch fails | Tooltip still shows name, type, country | ✅ PASS |

---

## 11. Info Modal

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 11.1 | Click "i" button | Modal opens | ✅ PASS |
| 11.2 | Click outside modal | Modal closes | ✅ PASS |
| 11.3 | Click Acknowledge | Modal closes | ✅ PASS |
| 11.4 | Modal shows correct details | Architect, Stack, Theme, Dataset | ✅ PASS |

---

## Process Learning

- Repomix method was not followed during this phase
- Debugging was done directly without generating repomix context
- Checkpoint commits before AI changes were missed
- These process gaps will be strictly followed in Phase 2

---

## UAT Result: ✅ FULL PASS
All critical test cases passed. System is production-ready.
