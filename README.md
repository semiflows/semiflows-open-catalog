# SemiFlows Open Process Catalog & MCP Server (40nm – 7nm)

[![Website](https://img.shields.io/badge/Interactive_2.5D_Flows-semiflows.com-0ea5e9)](https://semiflows.com?utm_source=github&utm_medium=readme&utm_campaign=open_catalog)
[![Node Comparisons](https://img.shields.io/badge/Compare_Nodes-40nm_→_7nm-10b981)](https://semiflows.com/learn?utm_source=github&utm_medium=readme&utm_campaign=open_catalog)
[![License: CC BY 4.0](https://img.shields.io/badge/Dataset_License-CC_BY_4.0-f59e0b)](https://creativecommons.org/licenses/by/4.0/)

Open bilingual (English & Chinese) semiconductor process engineering article index (**395 technical deep-dives**), foundational concept definitions, technology node scaling comparisons (**40nm BSI CIS**, **28nm Planar HKMG**, **14nm FinFET**, **7nm FinFET**), and a zero-dependency **Model Context Protocol (MCP)** server for AI engineering assistants.

---

## 1. What Is Included

| File | Description |
| :--- | :--- |
| `dataset/semiflows-public-catalog.json` | Structured JSON containing 4 technology node overviews, 21 foundational FEOL/MOL/BEOL/Lithography concepts, 3 node-to-node scaling comparisons, and **395 bilingual semiconductor engineering article summaries**. |
| `dataset/semiflows-articles.csv` | Flat CSV index of **395 bilingual semiconductor process articles** (`slug`, `category`, `primary_keyword`, `title_en`, `title_zh`, `excerpt_en`, `excerpt_zh`, `url_en`, `url_zh`). |
| `dataset/semiflows-comparisons.csv` | Flat CSV table comparing **40nm vs 28nm**, **28nm vs 14nm**, and **14nm vs 7nm** across transistor architecture, lithography, strain engineering, and interconnect scaling. |
| `dataset/README.md` | Hugging Face Dataset Card metadata and bilingual usage guide. |
| `dataset/dataset-metadata.json` | Kaggle Dataset schema and resource metadata. |
| `mcp/index.mjs` | Standalone Node.js stdio MCP server providing `search_articles`, `lookup_concept`, `compare_nodes`, and `explore_nodes` tools with direct citation links to interactive 2.5D cross-sections on [SemiFlows](https://semiflows.com?utm_source=github&utm_medium=readme&utm_campaign=open_catalog). |
| `server.json`, `smithery.yaml`, `glama.json` | Distribution manifests for Official MCP Registry, Smithery, and Glama. |

---

## 2. Interactive 2.5D Process Flows

Complete process flows and interactive 2.5D cross-sections are hosted on **[SemiFlows](https://semiflows.com?utm_source=github&utm_medium=readme&utm_campaign=open_catalog)**:

- **[40nm BSI CMOS Image Sensor](https://semiflows.com/node/40nm?mode=spine&utm_source=github&utm_medium=readme&utm_campaign=open_catalog)** — Deep photodiode implants, recessed transfer gate, dual-damascene Cu interconnects, wafer bonding & backside thinning (Free Full Flow)
- **[28nm Planar HKMG CMOS](https://semiflows.com/node/28nm?mode=spine&utm_source=github&utm_medium=readme&utm_campaign=open_catalog)** — Gate-Last Replacement Metal Gate (RMG), ALD HfO2 high-k dielectric, embedded SiGe pMOS strain, ULK Cu BEOL
- **[14nm 3D FinFET CMOS](https://semiflows.com/node/14nm?mode=spine&utm_source=github&utm_medium=readme&utm_campaign=open_catalog)** — SADP sub-wavelength silicon fins, FCVD STI oxide fill, 3D tri-gate RMG, Self-Aligned Contact (SAC)
- **[7nm Advanced FinFET CMOS](https://semiflows.com/node/7nm?mode=spine&utm_source=github&utm_medium=readme&utm_campaign=open_catalog)** — SAQP fin pitch scaling, Single Diffusion Break (SDB), multi-Vt ALD work-function engineering, Cobalt MOL/M0 local routing

### Node-to-Node Generation Comparisons
- [40nm vs 28nm: Polysilicon Gate to Gate-Last HKMG & Strain Engineering](https://semiflows.com/learn/40nm-vs-28nm?utm_source=github&utm_medium=readme&utm_campaign=open_catalog)
- [28nm vs 14nm: Planar MOSFET to 3D FinFET, SADP & Self-Aligned Contacts](https://semiflows.com/learn/28nm-vs-14nm?utm_source=github&utm_medium=readme&utm_campaign=open_catalog)
- [14nm vs 7nm: SADP to SAQP, Single Diffusion Break & Cobalt Middle-of-Line](https://semiflows.com/learn/14nm-vs-7nm?utm_source=github&utm_medium=readme&utm_campaign=open_catalog)

---

## 3. Quick Start: SemiFlows MCP Server (Claude Desktop / Cursor)

Run directly via `npx` (recommended):

```json
{
  "mcpServers": {
    "semiflows": {
      "command": "npx",
      "args": ["-y", "@semiflows/open-catalog-mcp"]
    }
  }
}
```

Or run from a local checkout:

```json
{
  "mcpServers": {
    "semiflows": {
      "command": "node",
      "args": ["/path/to/semiflows-open-catalog/mcp/index.mjs"]
    }
  }
}
```

### Available MCP Tools
1. **`search_articles`** — Search 395+ bilingual semiconductor process articles (`HKMG`, `FinFET`, `CMP`, `SADP`, `EUV`, `Cobalt`, `Silicide`, `STI`) with summaries and direct links.
2. **`lookup_concept`** — Search foundational semiconductor process concepts (`STI`, `HKMG`, `FinFET`, `SADP`, `SAC`, `CMP`, `Damascene`) with bilingual explanations and interactive walkthrough links.
3. **`compare_nodes`** — Retrieve structured engineering trade-offs strictly between adjacent 40nm–7nm nodes (`40nm-vs-28nm`, `28nm-vs-14nm`, `14nm-vs-7nm`). Unsupported nodes (e.g. 3nm/GAA) return an explicit error rather than falling back silently.
4. **`explore_nodes`** — Inspect high-level device architectures and technology node overviews across 40nm, 28nm, 14nm, and 7nm with `?mode=spine` anchor links.

---

## 4. Citation & License

- **Dataset (`dataset/*`)**: Licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Any derivative work, RAG index, or benchmark must credit **SemiFlows (https://semiflows.com)**.
- **MCP Server Code (`mcp/*`)**: Licensed under the MIT License.
