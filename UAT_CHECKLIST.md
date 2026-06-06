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
| 3.1 | Click a node | Tooltip appears with name, type, country | ✅ PASS |
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
| 4.4 | Subsidiaries list | All subsidiaries listed with country | ✅ PASS |
| 4.5 | Subsidiaries list scrollable | Scroll works for long lists | ✅ PASS |

---

## 5. Node Legend

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 5.1 | Legend visible on empty state | Yes, bottom-left | ✅ PASS |
| 5.2 | Legend visible with graph loaded | Yes, not overlapping | ✅ PASS |
| 5.3 | Legend colors match graph nodes | Amber, Blue, Purple, Pink match | ✅ PASS |
| 5.4 | All 4 node types shown | Root, Subsidiary, Investor, Key Person | ✅ PASS |

---

## 6. Loading States

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 6.1 | Search button during fetch | Shows "..." | ✅ PASS |
| 6.2 | Graph loads after fetch | Renders without page reload | ✅ PASS |

---

## 7. Edge Cases

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 7.1 | Company with no subsidiaries | Subsidiaries section shows "None found" | ✅ PASS |
| 7.2 | Node with no country | Country tag not shown | ✅ PASS |
| 7.3 | Raw Wikidata IDs (Q12345) | Filtered out, not shown as nodes | ✅ PASS |
| 7.4 | Search with network error | Error logged, no crash | ✅ PASS |

---

## 8. Info Modal

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 8.1 | Click "i" button | Modal opens | ✅ PASS |
| 8.2 | Click outside modal | Modal closes | ✅ PASS |
| 8.3 | Click Acknowledge | Modal closes | ✅ PASS |
| 8.4 | Modal shows correct details | Architect, Stack, Theme, Dataset | ✅ PASS |

---

## UAT Result: ✅ FULL PASS
All critical test cases passed. System is production-ready.

