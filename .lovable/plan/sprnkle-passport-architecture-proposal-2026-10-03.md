# Sprnkle Passport — Architecture Proposal

## Findings (inspection)
- **Backend:** No database is connected to this project right now. That means no production Sprnkle resources are linked. We will turn on a fresh, separate Lovable Cloud backend just for the hackathon, and fill it only with made-up demo data.
- **Scaffold:** Blank TanStack Start app (React 19, Vite, Tailwind v4). Server logic runs as TanStack server functions and server routes on an edge runtime, not Supabase Edge Functions.
- **Hosting note:** This template builds for an edge Worker runtime. You can sync to GitHub and try Vercel, but the reliable public URL is Lovable Publish. We recommend demoing from the Lovable URL and treating Vercel as optional.

## Smallest schema (5 tables + seed)
```text
professionals      id, name, title, location, summary, working_style text[],
                   traits jsonb (7 trait scores for fingerprint), preferences jsonb,
                   endorsements int, references_count int
capabilities       id, professional_id, name, level, evidence_backed bool,
                   project_count int, endorsement_count int, reference_count int
evidence           id, capability_id, kind (project|endorsement|reference), title, detail
opportunities      id, brief text, requirements jsonb, created_at
paid_trials        id, opportunity_id, professional_id, project, duration, amount_cents,
                   status (draft|approved|funded|cancelled), stripe_session_id, created_at
```
- Seed: Maya Chen (strongest, no fintech evidence), Jordan Ellis, Elena Rivera, David Park, Aisha Patel. Each gets 5–8 capabilities with fit levels that differ on purpose.
- Access rules: everyone can read the made-up profiles. Only the server can write to `opportunities` and `paid_trials`. No login for the demo.

## Agent + tools
- One agent loop on the server using Vercel AI SDK `streamText` with tool calling. It streams each real tool step to the workspace screen as it happens.
- Tools: `search_professionals`, `get_professional_identity`, `get_match_evidence`, `prepare_paid_trial` (only creates a DRAFT, never charges).
- Alignment score is calculated by code from the structured data, so the score is the same every time. Claude explains the score and flags uncertainty, but never makes up facts.
- **Model:** Claude through your Anthropic API key, stored as a server-side secret. Fallback is the Lovable AI Gateway (Gemini/GPT) if no key is available. If calls fail, the screen shows a clear retry state with no made-up results.

## MCP server
- A public server route `/api/public/mcp` (JSON-RPC, MCP streamable HTTP) exposes the same 4 tools. The in-app agent and outside agents both use the same tool functions. A simple shared bearer token protects it.

## Stripe (test mode)
- "Approve & fund $300" sends a server request that opens Stripe Checkout in test mode. Metadata: candidate_id, trial_id, project_brief.
- After checkout, the user lands on `/trial/success?session_id=…`. The server checks the session with Stripe and marks the trial as `funded`. A webhook is optional backup.
- If Stripe isn't set up, the trial stays in DRAFT and the screen explains that funding is unavailable.

## Screens / routes
`/` brief → `/agent` workspace (request · live tool steps · permissions) → match result → approval panel → Stripe → `/trial/success` (funded + loop).
Visual style: near-black background, cream text, 7 trait colors, a fingerprint mark, and "evidence-backed" badges.

## Build sequence
1. Design system, plus all 5 screens running on static data (Priority 1)
2. Turn on Cloud, then add the schema, seed data, and wire up the real data (Priority 2)
3. Agent loop + tools + live step streaming (Priority 3)
4. Stripe test checkout + funded status saved (Priority 4)
5. MCP route + polish (Priority 5)

## Needed from you
- Anthropic API key (or OK to fall back to the Lovable AI Gateway)
- Stripe test secret key (`sk_test_…`)
