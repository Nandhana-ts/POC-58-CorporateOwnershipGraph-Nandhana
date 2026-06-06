from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="Corporate Ownership Graph", version="0.1.0")

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
            res = await client.get(
                WIKIDATA_URL,
                params={"query": query, "format": "json"},
                headers=HEADERS,
            )
            print("SEARCH STATUS:", res.status_code)
            print("SEARCH CONTENT:", res.text[:300])
            data = res.json()
            bindings = data.get("results", {}).get("bindings", [])
            results = []
            for b in bindings:
                uri = b["company"]["value"]
                wid = uri.split("/")[-1]
                name = b["companyLabel"]["value"]
                results.append({"id": wid, "name": name})
            return {"results": results}
    except Exception as e:
        print("SEARCH ERROR:", str(e))
        return {"results": [], "error": str(e)}

@app.get("/api/company/{company_id}/graph")
async def get_graph(company_id: str):
    query = f"""
    SELECT ?node ?nodeLabel ?rel ?countryLabel WHERE {{
      {{
        BIND(wd:{company_id} AS ?node)
        BIND("root" AS ?rel)
      }}
      UNION
      {{ wd:{company_id} wdt:P355 ?node. BIND("subsidiary" AS ?rel) }}
      UNION
      {{ wd:{company_id} wdt:P749 ?node. BIND("parent" AS ?rel) }}
      UNION
      {{ wd:{company_id} wdt:P169 ?node. BIND("person" AS ?rel) }}
      UNION
      {{ wd:{company_id} wdt:P488 ?node. BIND("person" AS ?rel) }}
      OPTIONAL {{ ?node wdt:P17 ?country. ?country rdfs:label ?countryLabel. FILTER(LANG(?countryLabel)="en") }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". ?node rdfs:label ?nodeLabel. }}
    }}
    LIMIT 30
    """
    try:
        async with httpx.AsyncClient(timeout=25) as client:
            res = await client.get(
                WIKIDATA_URL,
                params={"query": query, "format": "json"},
                headers=HEADERS,
            )
            print("GRAPH STATUS:", res.status_code)
            print("GRAPH CONTENT:", res.text[:300])
            data = res.json()
            bindings = data.get("results", {}).get("bindings", [])

            nodes_map = {}
            edges = []
            root_label = company_id

            for b in bindings:
                node_uri = b["node"]["value"]
                node_id = node_uri.split("/")[-1]
                node_label = b.get("nodeLabel", {}).get("value", node_id)
                rel = b.get("rel", {}).get("value", "subsidiary")
                country = b.get("countryLabel", {}).get("value", "")

                if rel == "root":
                    root_label = node_label
                    nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "root", "country": country}
                elif rel == "person":
                    nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "person", "country": country}
                    edges.append({"source": node_id, "target": company_id})
                elif rel in ("owner", "parent"):
                    nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "investor", "country": country}
                    edges.append({"source": node_id, "target": company_id})
                else:
                    nodes_map[node_id] = {"id": node_id, "label": node_label, "type": "subsidiary", "country": country}
                    edges.append({"source": company_id, "target": node_id})

            if company_id not in nodes_map:
                nodes_map[company_id] = {"id": company_id, "label": root_label, "type": "root", "country": ""}

            return {
                "company": root_label,
                "nodes": list(nodes_map.values()),
                "edges": edges,
            }
    except Exception as e:
        print("GRAPH ERROR:", str(e))
        return {"nodes": [], "edges": [], "company": "Error", "error": str(e)}

@app.get("/api/health")
async def health():
    return {"status": "ok"}