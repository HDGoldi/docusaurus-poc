# Phase 4: GitHub Pages Deployment - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-21
**Phase:** 04-github-pages-deployment
**Areas discussed:** Deploy trigger, Analytics handling, Workflow structure

---

## Deploy Trigger

| Option | Description | Selected |
|--------|-------------|----------|
| Every push to main (Recommended) | Both AWS and GH Pages deploy on every push. Always in sync. Simple. | ✓ |
| Manual dispatch only | Only deploy to GH Pages when you manually trigger it. Less noise but can get stale. | |
| Separate branch | Deploy from a gh-pages branch. More control but adds branch management overhead. | |

**User's choice:** Every push to main
**Notes:** Keeps both deployments always in sync with minimal overhead.

---

## Analytics Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Disable on GH Pages (Recommended) | Strip analytics from GH Pages builds. Keeps production data clean. | ✓ |
| Keep analytics everywhere | Same analytics on both sites. Simpler config but preview traffic pollutes data. | |
| Separate tracking | Use different analytics IDs for GH Pages. More setup but full visibility into both. | |

**User's choice:** Disable on GH Pages
**Notes:** Production analytics data stays clean — no preview traffic pollution.

---

## Workflow Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Separate workflow (Recommended) | New gh-pages.yml keeps concerns isolated. Existing deploy.yml untouched. | ✓ |
| Add to deploy.yml | Single workflow with a new job. Fewer files but tighter coupling. | |

**User's choice:** Separate workflow
**Notes:** Satisfies CICD-02 requirement (existing AWS workflow unchanged).

---

## Claude's Discretion

- Env var naming and config structure for environment-aware builds
- Conditional analytics inclusion approach
- trailingSlash and other GitHub Pages compatibility settings

## Deferred Ideas

None.
