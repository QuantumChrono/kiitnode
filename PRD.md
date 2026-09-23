# PRD.md — KIIT Node

## Problem
KIIT students coordinate over scattered WhatsApp groups, notice boards, and Reddit threads. No single trusted space exists.

## Users
KIIT students only. Verified by @kiit.ac.in email.

## Priority features, in order (validated by a 30-student survey, not assumption)

1. **Teammate Matcher.** 83.3% picked this as the single feature they'd use most. Skill/stack tags (UI/UX, backend, ML, etc.) plus two non-technical filters: seriousness level and weekly bandwidth. 70% cited skill mismatch and work-ethic mismatch as top blockers, equally.
2. **Marketplace.** Buy/sell/rent. No payment gateway. 83.3% want in-person handoff with UPI. A location/landmark tag field (46.7% wanted specific spots tagged: hostel gates, food courts). Rentals are a category tag, not a stateful tracking system.
3. **Forum.** Notes/exam-prep sharing (90%), society events (73.3%), Lost & Found (56.7%) on the same tag system. Anonymous posting validated (60% want it), with the safety design in DECISIONS.md.

Also: verified domain gate. K-Directory, team-curated only, not open submission.

## Explicit non-goals for this build
- No payment gateway, ever, for Marketplace
- No open submission to K-Directory (v2 feature)
- No fully automated moderation (AI triages, humans decide)
- No iOS at launch (no app store budget)
- No peer badge/reputation system yet (needs usage history to mean anything)
- No campus navigation/maps, no "section selection simulator" (out of scope, interesting, not this cycle)

## Anonymity design
Anonymous to other students. Never anonymous to the system. The database always keeps the real author link. The API response strips it for anonymous posts. See DECISIONS.md.

## Success criteria for MVP
- Seed group (survey respondents + recruits) onboarded within the first week of launch
- Real posts happening within 48 hours of launch, not an empty feed
- Moderation queue functioning, with a real escalation contact in place for genuine threats
