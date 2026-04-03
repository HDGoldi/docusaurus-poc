# Phase 10: Crawler Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 10-crawler-foundation
**Areas discussed:** robots.txt content, CloudFront Function rewrite logic, AI crawler policy, Static file serving

---

## robots.txt Content

### General Crawler Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Allow everything | Allow: / for all user-agents. Public docs site, maximum discoverability. | ✓ |
| Allow with exclusions | Allow most paths but Disallow /search, /tags, /page/ to reduce crawl noise. | |
| You decide | Claude picks sensible defaults. | |

**User's choice:** Allow everything
**Notes:** None

### Sitemap Directive

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, include Sitemap | Add 'Sitemap: https://help.1nce.com/sitemap.xml' — standard practice. | ✓ |
| Skip Sitemap directive | Rely on Search Console / Webmaster Tools instead. | |

**User's choice:** Yes, include Sitemap
**Notes:** None

### Disallowed Paths

| Option | Description | Selected |
|--------|-------------|----------|
| No disallows | Everything is public, let crawlers index freely. | |
| Disallow /search and /tags | Low-value index/listing pages that dilute SEO. | ✓ |
| You decide | Claude picks sensible exclusions. | |

**User's choice:** Disallow /search and /tags
**Notes:** None

---

## CloudFront Function Rewrite Logic

### Fix Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Allowlist .well-known | If URI starts with /.well-known/, skip index.html rewrite. Simple, targeted. | ✓ |
| Allowlist specific patterns | Allowlist /.well-known/, /llms.txt, /robots.txt explicitly. More defensive. | |
| You decide | Claude picks simplest, most future-proof approach. | |

**User's choice:** Allowlist .well-known
**Notes:** Current CF function already passes through files with extensions (.txt, .md, .json). Fix needed mainly for extensionless .well-known paths.

### Deployment Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Code change only | Update cf-function.js in repo. Deployment through existing infra workflow. | ✓ |
| Include deploy instructions | Update code AND provide CloudFormation/CLI deploy commands. | |

**User's choice:** Code change only
**Notes:** None

---

## AI Crawler Policy

### AI Crawler Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Named allow-list | Explicit User-agent + Allow blocks for known AI crawlers. Granular control. | ✓ |
| Blanket allow-all | 'User-agent: * / Allow: /' covers everything. Simpler but no per-bot control. | |
| Allow with tiered access | Allow major bots, restrict less trusted ones. Overkill for public docs. | |

**User's choice:** Named allow-list
**Notes:** None

### Bot List

| Option | Description | Selected |
|--------|-------------|----------|
| Core four + extras | GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider. | ✓ |
| Only the four in requirements | GPTBot, ClaudeBot, PerplexityBot, Google-Extended. Minimal, matches CRAWL-02. | |
| You decide | Claude researches current AI crawler landscape. | |

**User's choice:** Core four + extras
**Notes:** None

---

## Static File Serving

### robots.txt Location

| Option | Description | Selected |
|--------|-------------|----------|
| static/robots.txt | Docusaurus copies static/ to build root. Simple, standard. | ✓ |
| Generated at build time | Plugin or build script generates robots.txt. Flexible but unnecessary. | |

**User's choice:** static/robots.txt
**Notes:** None

### Content-Type Headers

| Option | Description | Selected |
|--------|-------------|----------|
| Fix in deploy pipeline | Add --content-type overrides in S3 sync for .txt and .md files. | |
| Defer to Phase 12 | Phase 12 (skill.md) is where .md serving matters. Fix when testable. | ✓ |
| You decide | Claude determines right phase based on scope and dependencies. | |

**User's choice:** Defer to Phase 12
**Notes:** STATE.md notes S3 may serve .md files as application/octet-stream. User chose to address this in Phase 12 where skill.md makes it testable end-to-end.

---

## Claude's Discretion

No areas deferred to Claude's discretion.

## Deferred Ideas

- Content-type header fix for .md/.txt files — deferred to Phase 12
