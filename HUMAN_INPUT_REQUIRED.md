# KIIT Node — Human Input Required

**Purpose:** A temporary, living register of decisions or external tasks that cannot safely be completed by repository inspection, approved research, local testing, or engineering judgment alone.

**Important:** The entries below are only an initial hypothesis based on the product brief. The agentic coding agent MUST audit every entry against the actual repository and its findings, then update this file throughout the run. Do not assume all listed items still apply. Add newly discovered human-only actions, reprioritize items, resolve items supported by evidence, and mark items `NO LONGER NEEDED` when implementation makes them irrelevant. Preserve a concise audit trail; never leave this as an untouched boilerplate checklist.

**Rule:** Keep the register short, current, and actionable. Ordinary engineering bugs belong to the agent, not this file. Every open item needs an owner role, exact action, reason human input is required, recommendation, risk, and evidence required to close it. Do not mark an item complete based on an assumption or code changes alone when external confirmation is needed.

**Statuses:** `OPEN` · `IN PROGRESS` · `WAITING` · `RESOLVED` · `NO LONGER NEEDED`

**Agent update cadence:** Update after reconnaissance, after each major implementation phase, after verification, and immediately before the final report. Keep a dated dashboard at the top with accurate counts of current open items. The final report must list current open blockers/important items and summarize what was added, updated, resolved, or marked no longer needed.

---

## H-001 — Confirm moderation escalation owner and contact

- **Priority:** BLOCKING
- **Status:** OPEN
- **Owner role:** Product owner / moderation lead
- **Needed:** Provide a real, monitored contact and name/role of the person or team responsible for urgent reports.
- **Why human input is required:** The codebase cannot establish who is actually monitoring safety reports or whether an address/number is authorized for this purpose.
- **Recommended approach:** Use a dedicated monitored contact rather than a developer's personal account, if available. Define coverage hours and an outside-hours response.
- **Risk if unresolved:** Users may report threats or serious abuse into an unmonitored queue; the product could imply a safety response that does not exist.
- **Evidence to close:** Contact confirmed by its owner, monitoring responsibility accepted, and response/escalation procedure documented.

## H-002 — Approve moderation policy and operating procedure

- **Priority:** BLOCKING
- **Status:** OPEN
- **Owner role:** Product owner / moderation lead
- **Needed:** Confirm who can review reports, what actions they can take, what counts as urgent, and how decisions are recorded.
- **Why human input is required:** These are operational and policy responsibilities, not purely technical choices.
- **Recommended approach:** Start with a small, explicit human workflow; automation may triage but must not make high-impact final decisions.
- **Risk if unresolved:** Reports may be collected without a reliable path to review and resolution.
- **Evidence to close:** Named role(s), permissions, report categories, escalation rules, and realistic coverage documented in `DECISIONS.md` or the operational runbook.

## H-003 — Review privacy policy, community rules, and terms

- **Priority:** BLOCKING BEFORE PUBLIC LAUNCH
- **Status:** OPEN
- **Owner role:** Product owner; obtain qualified advice where appropriate
- **Needed:** Review the actual policies presented to users, including data collected, retention, deletion, moderation, anonymous posting, user-generated content, and marketplace limitations.
- **Why human input is required:** Engineering cannot independently make legal assurances or determine institutional obligations.
- **Recommended approach:** Draft policy text from actual implementation behavior, then have the responsible owner review it. Do not copy generic policy text that contradicts the app.
- **Risk if unresolved:** Users may receive inaccurate privacy or safety claims.
- **Evidence to close:** Approved, published policy destinations that work in the app and accurately describe the product.

## H-004 — Confirm institutional branding and endorsement wording

- **Priority:** IMPORTANT BEFORE PUBLIC LAUNCH
- **Status:** OPEN
- **Owner role:** Product owner / institutional contact, if applicable
- **Needed:** Confirm which KIIT name, logo, colors, and wording can be used, and whether any official affiliation/endorsement claim is authorized.
- **Why human input is required:** Repository inspection cannot establish permission or institutional endorsement.
- **Recommended approach:** Use neutral product branding and avoid claims that KIIT officially endorses the app unless authorization is confirmed.
- **Risk if unresolved:** Misleading affiliation claims or avoidable branding disputes.
- **Evidence to close:** Written approval or a documented decision to use non-affiliation wording and permitted assets.

## H-005 — Confirm production authentication configuration

- **Priority:** BLOCKING BEFORE PUBLIC LAUNCH
- **Status:** OPEN
- **Owner role:** Product owner / backend or infrastructure owner
- **Needed:** Confirm the production auth provider, sender/domain setup, redirect/deep-link configuration, rate limits, and account recovery behavior.
- **Why human input is required:** Production provider dashboards, credentials, and domain ownership may not be accessible in the repository.
- **Recommended approach:** Have the responsible owner verify the full flow using a real test account without exposing secrets in source control.
- **Risk if unresolved:** Students may be unable to verify, or verification links may be unsafe or misconfigured.
- **Evidence to close:** End-to-end production-like test result recorded without storing tokens or private account data.

## H-006 — Confirm contact model for Teammate Matcher

- **Priority:** IMPORTANT
- **Status:** OPEN
- **Owner role:** Product owner
- **Needed:** Choose among the existing in-app request/message model, a privacy-conscious contact action already implemented, or a simpler request flow.
- **Why human input is required:** The choice changes user expectations and potentially scope. The agent should first inspect what already exists and recommend the smallest reliable option.
- **Recommended approach:** Preserve a working existing flow if it is safe. Do not expose student email addresses by default or add a full chat system without a clear need.
- **Risk if unresolved:** Users may find opportunities but have no clear, safe way to contact each other.
- **Evidence to close:** Selected flow and rationale recorded in `DECISIONS.md`; acceptance criteria added to the PRD if needed.

## H-007 — Confirm seriousness and weekly bandwidth options

- **Priority:** IMPORTANT
- **Status:** OPEN
- **Owner role:** Product owner, ideally validated with a few students
- **Needed:** Approve plain-language choices for commitment level and expected/available hours.
- **Why human input is required:** These labels shape how students represent expectations; the code alone cannot validate whether the wording is understood by the target audience.
- **Recommended approach:** Use a small set of descriptive, non-judgmental options and avoid ranking people as “good” or “bad.”
- **Risk if unresolved:** Students may interpret filters differently and make poor matches.
- **Evidence to close:** Final labels and short explanations recorded in `DECISIONS.md` and reflected consistently in forms and filters.

## H-008 — Confirm Marketplace taxonomy and campus landmarks

- **Priority:** IMPORTANT
- **Status:** OPEN
- **Owner role:** Product owner / student pilot group
- **Needed:** Approve the initial categories and the public handoff landmark list.
- **Why human input is required:** Campus-specific place names and appropriate handoff spots should not be invented by an implementation agent.
- **Recommended approach:** Start with a short curated list of familiar public locations. Do not imply that any location is officially supervised or guaranteed safe.
- **Risk if unresolved:** Confusing or inaccurate tags, or unsafe claims about handoff locations.
- **Evidence to close:** Approved category/landmark list recorded in the project documentation or configuration.

## H-009 — Confirm initial seed content and contributor consent

- **Priority:** IMPORTANT BEFORE LAUNCH
- **Status:** OPEN
- **Owner role:** Product owner / community launch lead
- **Needed:** Recruit real contributors and obtain permission to publish seed posts, opportunities, and listings.
- **Why human input is required:** The agent cannot fabricate real community activity or obtain consent on behalf of contributors.
- **Recommended approach:** Seed a small amount of genuine, useful content from willing students; make ownership and removal paths clear.
- **Risk if unresolved:** The app launches into an empty feed or uses content without permission.
- **Evidence to close:** Seed plan, contributors, consent, and owner/expiry review documented. No fabricated accounts or metrics.

## H-010 — Confirm account deletion and retention policy

- **Priority:** IMPORTANT BEFORE PUBLIC LAUNCH
- **Status:** OPEN
- **Owner role:** Product owner / backend owner
- **Needed:** Approve what happens to authored content, reports, moderation audit records, and personal data when an account is deleted.
- **Why human input is required:** Retention may be affected by policy, safety, technical dependencies, or legal requirements.
- **Recommended approach:** Define user-facing behavior and retention before promising complete deletion. Preserve only what is necessary and justified.
- **Risk if unresolved:** The UI may promise deletion that the backend cannot deliver, or erase records needed for abuse investigations.
- **Evidence to close:** Approved retention matrix and tested deletion behavior documented.

## H-011 — Confirm whether institutional or external moderation support exists

- **Priority:** LATER / BLOCKING IF THE PRODUCT CLAIMS IT
- **Status:** OPEN
- **Owner role:** Product owner
- **Needed:** Confirm whether the app has any authorized relationship with KIIT staff, student affairs, or another organization for escalation.
- **Why human input is required:** This cannot be inferred from the code or branding.
- **Recommended approach:** If no relationship exists, describe the app's actual independent moderation process and do not imply institutional response.
- **Risk if unresolved:** Users may assume a report reaches official campus authorities when it does not.
- **Evidence to close:** Written confirmation of the relationship or explicit wording that no official relationship is claimed.

## H-012 — Production release and migration approval

- **Priority:** BLOCKING FOR ANY PRODUCTION CHANGE
- **Status:** OPEN
- **Owner role:** Product owner / infrastructure owner
- **Needed:** Approve release timing, production migrations, environment changes, and rollback plan after reviewing the audit.
- **Why human input is required:** The implementation agent must not make irreversible production changes without authorization.
- **Recommended approach:** Test in local/staging first and provide a concise deployment checklist.
- **Risk if unresolved:** Data loss, service disruption, or unintended public release.
- **Evidence to close:** Explicit approval and a documented backup/rollback plan for the proposed change.

---

## Agent-maintained entries

Add new items only when a real human/external decision is required. Before adding one, verify that the answer cannot be found in the repository, established by a safe test, or resolved with a reversible engineering choice.

Use this template:

```md
## H-XXX — [Short action title]

- **Priority:** BLOCKING / IMPORTANT / LATER
- **Status:** OPEN
- **Owner role:** [Role]
- **Needed:** [Specific answer or action]
- **Why human input is required:** [Why code inspection/research cannot resolve it]
- **Recommended approach:** [Recommendation and trade-off]
- **Risk if unresolved:** [Concrete consequence]
- **Evidence to close:** [Specific proof]
```

## Closure rule

This file may be archived or removed after all blocking items are resolved and the product owner agrees it is no longer needed. Do not delete it merely because the implementation work is finished; unresolved operational dependencies must remain visible.
