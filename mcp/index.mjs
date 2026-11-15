#!/usr/bin/env node
/**
 * SemiFlows Open Catalog MCP Server (Read-Only, Zero Internal Dependencies)
 * License: MIT (Code) / CC BY 4.0 (Dataset)
 * Website: https://semiflows.com
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, "../dataset/semiflows-public-catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

const MCP_HOME_URL = "https://semiflows.com?utm_source=mcp&utm_medium=agent&utm_campaign=open_catalog";
const MCP_7NM_SPINE_URL = "https://semiflows.com/node/7nm?mode=spine&utm_source=mcp&utm_medium=agent&utm_campaign=open_catalog";
const STRICT_ADJACENT_PAIR_MAP = {"40nm:28nm":"40nm-vs-28nm","28nm:40nm":"40nm-vs-28nm","28nm:14nm":"28nm-vs-14nm","14nm:28nm":"28nm-vs-14nm","14nm:7nm":"14nm-vs-7nm","7nm:14nm":"14nm-vs-7nm"};
const STRICT_COMPARISON_PAIR_PATTERN = new RegExp("^(40nm|28nm|14nm|7nm)(?:[\\s_-]*(?:<->|<=>|->|→|↔)[\\s_-]*|[\\s_-]+(?:vs\\.?|versus|to)[\\s_-]+|[\\s_-]+)(40nm|28nm|14nm|7nm)$");

function resolveStrictComparisonPair(rawPair) {
  if (typeof rawPair !== "string") return null;
  const cleaned = rawPair.trim().toLowerCase();
  if (!cleaned) return null;
  const match = cleaned.match(STRICT_COMPARISON_PAIR_PATTERN);
  if (!match) return null;
  return STRICT_ADJACENT_PAIR_MAP[`${match[1]}:${match[2]}`] || null;
}

function buildCompareNodesErrorText(rawPair) {
  const inputLabel = typeof rawPair === "string" && rawPair.trim() ? `"${rawPair.trim()}"` : "(empty)";
  return [
    `Unsupported comparison pair ${inputLabel}.`,
    "SemiFlows interactive 2.5D cross-sections cover 40nm–7nm only (40nm BSI CIS, 28nm Planar HKMG, 14nm FinFET, 7nm FinFET).",
    "Supported comparison pairs: 40nm-vs-28nm, 28nm-vs-14nm, 14nm-vs-7nm.",
    `Explore 7nm FinFET interactively: ${MCP_7NM_SPINE_URL}`,
    `Source: SemiFlows (${MCP_HOME_URL}) — CC BY 4.0`
  ].join("\n");
}

const TOOLS = [
  {
    name: "search_articles",
    description: "Search 395+ bilingual semiconductor process engineering articles covering 40nm CIS, 28nm HKMG, 14nm FinFET, and 7nm FinFET physics, materials, lithography, and yield mechanisms.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search keyword such as HKMG, FinFET, CMP, SADP, EUV, Cobalt, Silicide, or STI" },
        category: { type: "string", description: "Optional category filter such as lithography, etch, deposition, planarization, doping, or integration" }
      }
    }
  },
  {
    name: "lookup_concept",
    description: "Look up foundational semiconductor manufacturing concepts (FEOL, MOL, BEOL, Lithography) with bilingual explanations and links to interactive 2.5D visualizations on SemiFlows.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keyword such as STI, HKMG, FinFET, SADP, SAC, CMP, Damascene, or Barrier" },
        domain: { type: "string", description: "Optional domain filter: FEOL, MOL, BEOL, or LITHOGRAPHY" }
      }
    }
  },
  {
    name: "compare_nodes",
    description: "Compare adjacent semiconductor technology generations within 40nm–7nm (40nm-vs-28nm, 28nm-vs-14nm, 14nm-vs-7nm) across transistor architecture, lithography, strain engineering, and interconnect scaling.",
    inputSchema: {
      type: "object",
      properties: {
        pair: { type: "string", description: "Adjacent comparison pair: 40nm-vs-28nm, 28nm-vs-14nm, or 14nm-vs-7nm" }
      },
      required: ["pair"]
    }
  },
  {
    name: "explore_nodes",
    description: "Explore high-level device architectures and technology overviews for 40nm BSI CIS, 28nm Planar HKMG, 14nm FinFET, and 7nm FinFET nodes.",
    inputSchema: {
      type: "object",
      properties: {
        node: { type: "string", description: "Optional node filter: 40nm, 28nm, 14nm, or 7nm" }
      }
    }
  }
];

function callTool(name, args = {}) {
  if (name === "search_articles") {
    const q = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
    const cat = typeof args.category === "string" ? args.category.trim().toLowerCase() : "";
    const tokens = q.split(/\s+/).filter(Boolean);
    const scored = (catalog.articles || [])
      .filter((a) => !cat || a.category.toLowerCase() === cat)
      .map((a) => {
        if (tokens.length === 0) return { a, score: 1 };
        const titleHay = `${a.titleEn} ${a.titleZh} ${a.primaryKeyword}`.toLowerCase();
        const bodyHay = `${a.excerptEn} ${a.excerptZh} ${a.category}`.toLowerCase();
        let score = 0;
        for (const t of tokens) {
          if (titleHay.includes(t)) score += 3;
          else if (bodyHay.includes(t)) score += 1;
        }
        return { a, score };
      })
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score);
    const matches = (scored.length > 0 ? scored.map((x) => x.a) : (catalog.articles || [])).slice(0, 6);
    const lines = [
      scored.length > 0
        ? `Found ${scored.length} SemiFlows technical article(s) matching "${q || cat}":`
        : `No exact keyword match for "${q}". Showing featured SemiFlows semiconductor process articles:`,
      "",
      ...matches.map((a) => `- **[${a.category}] ${a.titleEn}** (${a.titleZh})\n  Summary: ${a.excerptEn}\n  Read Full Article & Interactive 2.5D Cross-Sections: ${a.mcpUrl}`),
      "",
      `Source: SemiFlows (${MCP_HOME_URL}) — CC BY 4.0`
    ];
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }

  if (name === "lookup_concept") {
    const q = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
    const domain = typeof args.domain === "string" ? args.domain.trim().toUpperCase() : "";
    const filtered = catalog.concepts.filter((c) => {
      if (domain && c.domain !== domain) return false;
      if (!q) return true;
      const hay = [c.conceptId, c.domain, c.termEn, c.definitionEn, c.definitionZh].join(" ").toLowerCase();
      return hay.includes(q);
    });
    const list = filtered.length > 0 ? filtered.slice(0, 6) : catalog.concepts.slice(0, 5);
    const lines = [
      filtered.length > 0
        ? `Found ${filtered.length} public semiconductor process concept(s):`
        : `No exact keyword match for "${q}". Showing foundational semiconductor process concepts:`,
      "",
      ...list.map((c) => `- **[${c.domain}] ${c.termEn}**\n  EN: ${c.definitionEn}\n  ZH: ${c.definitionZh}\n  Interactive 2.5D Process Walkthrough: ${c.mcpUrl}`),
      "",
      "Note: Complete step-by-step process sequences and 2.5D cross-sections are hosted interactively on SemiFlows.",
      `Source: SemiFlows (${MCP_HOME_URL}) — CC BY 4.0`
    ];
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }

  if (name === "compare_nodes") {
    const resolvedSlug = resolveStrictComparisonPair(args.pair);
    if (!resolvedSlug) {
      return {
        isError: true,
        content: [{ type: "text", text: buildCompareNodesErrorText(args.pair) }]
      };
    }
    const comp = (catalog.comparisons || []).find((c) => c.slug === resolvedSlug);
    if (!comp) {
      return {
        isError: true,
        content: [{ type: "text", text: buildCompareNodesErrorText(args.pair) }]
      };
    }
    const lines = [
      `# ${comp.titleEn} (${comp.titleZh})`,
      `**${comp.taglineEn}**`,
      "",
      comp.summaryEn,
      "",
      "## Key Scaling & Process Metrics",
      ...comp.metrics.map((m) => `- **${m.metricEn}**: ${comp.sourceNode} (${m.sourceValueEn}) → ${comp.targetNode} (${m.targetValueEn}) — ${m.significanceEn}`),
      "",
      `Full Interactive Node Comparison: ${comp.mcpUrl}`,
      `Source: SemiFlows (${MCP_HOME_URL}) — CC BY 4.0`
    ];
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }

  if (name === "explore_nodes") {
    const rawInput = typeof args.node === "string" ? args.node.trim() : "";
    const tokens = rawInput.toLowerCase().split(/\s+/).filter(Boolean);
    const matched = (catalog.nodes || []).filter((n) => {
      if (tokens.length === 0) return true;
      const hay = [n.node, n.deviceArchitecture, ...(n.tags || []), n.descriptionEn].join(" ").toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
    const list = matched.length > 0 ? matched : (catalog.nodes || []);
    const header =
      tokens.length > 0 && matched.length === 0
        ? `No technology node matching "${rawInput}" was found. SemiFlows interactive 2.5D process flows cover 40nm–7nm only (40nm BSI CIS, 28nm Planar HKMG, 14nm FinFET, 7nm FinFET). Available nodes (${list.length}):`
        : `SemiFlows Semiconductor Technology Nodes (${list.length}):`;
    const lines = [
      header,
      "",
      ...list.map((n) => `- **${n.node} — ${n.deviceArchitecture}** (${n.approxStepScale})\n  Highlights: ${n.tags.join(", ")}\n  Overview: ${n.descriptionEn}\n  Explore Node: ${n.mcpUrl}`),
      "",
      `Source: SemiFlows (${MCP_HOME_URL}) — CC BY 4.0`
    ];
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }

  return {
    isError: true,
    content: [{ type: "text", text: `Unknown tool "${name}". Supported tools: search_articles, lookup_concept, compare_nodes, explore_nodes.` }]
  };
}

const rl = createInterface({ input: process.stdin, terminal: false });

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let req;
  try {
    req = JSON.parse(trimmed);
  } catch {
    return;
  }
  if (!req || typeof req !== "object") return;
  const { id, method, params } = req;
  if (id === undefined || id === null) return;

  if (method === "initialize") {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "semiflows-open-catalog-mcp", version: "1.0.0" }
      }
    }) + "\n");
    return;
  }

  if (method === "ping") {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id,
      result: {}
    }) + "\n");
    return;
  }

  if (method === "tools/list") {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id,
      result: { tools: TOOLS }
    }) + "\n");
    return;
  }

  if (method === "tools/call") {
    const toolName = params && typeof params.name === "string" ? params.name : "";
    const toolArgs = params && typeof params.arguments === "object" && params.arguments ? params.arguments : {};
    const result = callTool(toolName, toolArgs);
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id,
      result
    }) + "\n");
    return;
  }

  process.stdout.write(JSON.stringify({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` }
  }) + "\n");
});
