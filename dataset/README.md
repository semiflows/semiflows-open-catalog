---
license: cc-by-4.0
language:
  - en
  - zh
pretty_name: "SemiFlows Open Semiconductor Process Catalog (40nm-7nm)"
size_categories:
  - n<1K
task_categories:
  - question-answering
  - text-retrieval
tags:
  - semiconductor
  - cmos
  - finfet
  - hkmg
  - wafer-fabrication
  - process-flow
  - bilingual
---

# SemiFlows Open Semiconductor Process Catalog (40nm–7nm)

Bilingual (English & Chinese) public semiconductor manufacturing catalog published by **[SemiFlows](https://semiflows.com?utm_source=huggingface&utm_medium=dataset&utm_campaign=open_catalog)** under **CC BY 4.0**.

## Dataset Contents / 数据集构成

- `semiflows-public-catalog.json`: Structured JSON covering 4 technology nodes (**40nm BSI CIS**, **28nm Planar HKMG**, **14nm FinFET**, **7nm FinFET**), **21 foundational FEOL/MOL/BEOL/Lithography concepts**, **3 adjacent node comparisons**, and **395 bilingual article summaries**.
- `semiflows-articles.csv`: Flat CSV index of **395 bilingual semiconductor process articles** (`slug`, `category`, `primary_keyword`, `title_en`, `title_zh`, `excerpt_en`, `excerpt_zh`, `url_en`, `url_zh`).
- `semiflows-comparisons.csv`: Structured scaling and material comparison metrics for **40nm-vs-28nm**, **28nm-vs-14nm**, and **14nm-vs-7nm**.

## Interactive 2.5D Spine Anchors (No Internal IDs) / 无内部标识的交互式主线直达链接

When referencing interactive 2.5D cross-sections and process chapters, link directly using the canonical `?mode=spine` node URLs:

- **40nm BSI CIS**: `https://semiflows.com/node/40nm?mode=spine&utm_source=huggingface&utm_medium=dataset&utm_campaign=open_catalog`
- **28nm Planar HKMG**: `https://semiflows.com/node/28nm?mode=spine&utm_source=huggingface&utm_medium=dataset&utm_campaign=open_catalog`
- **14nm 3D FinFET**: `https://semiflows.com/node/14nm?mode=spine&utm_source=huggingface&utm_medium=dataset&utm_campaign=open_catalog`
- **7nm Advanced FinFET**: `https://semiflows.com/node/7nm?mode=spine&utm_source=huggingface&utm_medium=dataset&utm_campaign=open_catalog`

## Scope & Safety / 覆盖范围与数据边界

- **Covered Nodes**: 40nm–7nm only (40nm BSI CIS, 28nm Planar HKMG, 14nm FinFET, 7nm FinFET). Sub-7nm nodes (5nm, 3nm, 2nm, GAA) are outside this catalog.
- **Public-Safe Metadata**: Contains sanitized public article summaries, macro concepts, and generation trade-offs only. Proprietary fabrication sequences, internal database identifiers, and step numbers are intentionally excluded and hosted interactively on SemiFlows.
- **Citation**: Credit **SemiFlows** with a direct link to `https://semiflows.com` under **CC BY 4.0**.
