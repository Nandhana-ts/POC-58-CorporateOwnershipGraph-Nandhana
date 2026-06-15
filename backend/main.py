from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="Corporate Ownership Graph", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WIKIDATA_URL = "https://query.wikidata.org/sparql"
HEADERS = {
    "User-Agent": "Mozilla/5.0 CorporateOwnershipGraph/1.0",
    "Accept": "application/sparql-results+json",
}


@app.get("/api/company/search")
async def search_company(q: str):
    query = f"""
    SELECT DISTINCT ?company ?companyLabel WHERE {{
      ?company wdt:P31/wdt:P279* wd:Q4830453.
      ?company rdfs:label ?companyLabel.
      FILTER(LANG(?companyLabel) = "en")
      FILTER(STRSTARTS(LCASE(?companyLabel), LCASE("{q}")))
    }}
    LIMIT 8
    """
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            res = await client.get(WIKIDATA_URL, params={"query": query, "format": "json"}, headers=HEADERS)
            data = res.json()
            bindings = data.get("results", {}).get("bindings", [])
            results = [
                {"id": b["company"]["value"].split("/")[-1], "name": b["companyLabel"]["value"]}
                for b in bindings
            ]
            return {"results": results}
    except Exception as e:
        return {"results": [], "error": str(e)}


@app.get("/api/company/{company_id}/graph")
async def get_graph(company_id: str):
    """
    Fetches 2-hop ownership graph from Wikidata:
    - Layer 1: direct subsidiaries, parent companies, key people, investors
    - Layer 2: subsidiaries-of-subsidiaries and grandparent owners
    All data sourced exclusively from Wikidata SPARQL API.
    """

    # Layer 1: subsidiaries + parent
    q1 = f"""
    SELECT ?node ?nodeLabel ?rel ?countryLabel WHERE {{
      {{
        BIND(wd:{company_id} AS ?node)
        BIND("root" AS ?rel)
      }}
      UNION {{ wd:{company_id} wdt:P355 ?node. BIND("subsidiary" AS ?rel) }}
      UNION {{ ?node wdt:P749 wd:{company_id}. BIND("subsidiary" AS ?rel) }}
      UNION {{ wd:{company_id} wdt:P749 ?node. BIND("parent" AS ?rel) }}
      OPTIONAL {{ ?node wdt:P17 ?country. ?country rdfs:label ?countryLabel. FILTER(LANG(?countryLabel)="en") }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". ?node rdfs:label ?nodeLabel. }}
    }} LIMIT 40
    """

    # Layer 1: people + investors
    q2 = f"""
    SELECT ?node ?nodeLabel ?rel ?countryLabel WHERE {{
      {{ wd:{company_id} wdt:P169 ?node. BIND("person" AS ?rel) }}
      UNION {{ wd:{company_id} wdt:P488 ?node. BIND("person" AS ?rel) }}
      UNION {{ wd:{company_id} wdt:P3320 ?node. BIND("person" AS ?rel) }}
      UNION {{ wd:{company_id} wdt:P127 ?node. BIND("investor" AS ?rel) }}
      OPTIONAL {{ ?node wdt:P17 ?country. ?country rdfs:label ?countryLabel. FILTER(LANG(?countryLabel)="en") }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". ?node rdfs:label ?nodeLabel. }}
    }} LIMIT 30
    """

    # Layer 2: sub-subsidiaries
    q3 = f"""
    SELECT ?parent ?node ?nodeLabel ?countryLabel WHERE {{
      wd:{company_id} wdt:P355 ?parent.
      ?parent wdt:P355 ?node.
      OPTIONAL {{ ?node wdt:P17 ?country. ?country rdfs:label ?countryLabel. FILTER(LANG(?countryLabel)="en") }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". ?node rdfs:label ?nodeLabel. }}
    }} LIMIT 30
    """

    # Layer 2: grandparent owners
    q4 = f"""
    SELECT ?child ?node ?nodeLabel ?countryLabel WHERE {{
      wd:{company_id} wdt:P749 ?child.
      ?child wdt:P749 ?node.
      OPTIONAL {{ ?node wdt:P17 ?country. ?country rdfs:label ?countryLabel. FILTER(LANG(?countryLabel)="en") }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". ?node rdfs:label ?nodeLabel. }}
    }} LIMIT 20
    """

    try:
        async with httpx.AsyncClient(timeout=25) as client:
            responses = await asyncio.gather(
                *[client.get(WIKIDATA_URL, params={"query": q, "format": "json"}, headers=HEADERS)
                  for q in [q1, q2, q3, q4]]
            )
            [d1, d2, d3, d4] = [r.json() for r in responses]
    except Exception as e:
        return {"nodes": [], "edges": [], "company": "Error", "error": str(e)}

    nodes_map: dict = {}
    edges: list = []
    root_label = company_id
    is_raw_id = lambda s: bool(__import__("re").match(r"^Q\d+$", s))

    def process_l1(bindings, depth=1):
        nonlocal root_label
        for b in bindings:
            node_id = b["node"]["value"].split("/")[-1]
            node_label = b.get("nodeLabel", {}).get("value", node_id)
            rel = b.get("rel", {}).get("value", "subsidiary")
            country = b.get("countryLabel", {}).get("value", "")
            if is_raw_id(node_label):
                continue
            if rel == "root":
                root_label = node_label
                nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "root", "country": country, "depth": 0}
            elif rel == "person":
                if node_id not in nodes_map:
                    nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "person", "country": country, "depth": depth}
                    edges.append({"source": node_id, "target": company_id})
            elif rel in ("parent", "investor"):
                nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "investor", "country": country, "depth": depth}
                edges.append({"source": node_id, "target": company_id})
            else:
                if node_id not in nodes_map:
                    nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "subsidiary", "country": country, "depth": depth}
                    edges.append({"source": company_id, "target": node_id})

    process_l1(d1.get("results", {}).get("bindings", []))
    process_l1(d2.get("results", {}).get("bindings", []))

    # Layer 2: sub-subsidiaries
    for b in d3.get("results", {}).get("bindings", []):
        parent_id = b["parent"]["value"].split("/")[-1]
        node_id = b["node"]["value"].split("/")[-1]
        node_label = b.get("nodeLabel", {}).get("value", node_id)
        country = b.get("countryLabel", {}).get("value", "")
        if is_raw_id(node_label) or node_id == company_id:
            continue
        if node_id not in nodes_map:
            nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "subsidiary", "country": country, "depth": 2}
            if parent_id in nodes_map:
                edges.append({"source": parent_id, "target": node_id})

    # Layer 2: grandparent owners
    for b in d4.get("results", {}).get("bindings", []):
        child_id = b["child"]["value"].split("/")[-1]
        node_id = b["node"]["value"].split("/")[-1]
        node_label = b.get("nodeLabel", {}).get("value", node_id)
        country = b.get("countryLabel", {}).get("value", "")
        if is_raw_id(node_label) or node_id == company_id:
            continue
        if node_id not in nodes_map:
            nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "investor", "country": country, "depth": 2}
            if child_id in nodes_map:
                edges.append({"source": node_id, "target": child_id})

    if company_id not in nodes_map:
        nodes_map[company_id] = {"id": company_id, "label": root_label, "type": "root", "country": "", "depth": 0}

    return {"company": root_label, "nodes": list(nodes_map.values()), "edges": edges}


@app.get("/api/health")
async def health():
    return {"status": "ok"}


# Required for asyncio.gather in get_graph
import asyncio