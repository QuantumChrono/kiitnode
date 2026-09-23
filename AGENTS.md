# AGENTS.md — KIIT Node

Cross-tool project rules. Read PRD.md and DECISIONS.md first.

## Stack
Expo (React Native, TypeScript), Expo Router, NativeWind, Supabase (Postgres, Auth, RLS), Jest, Maestro.

## Non-negotiable rules
- Every table gets RLS. No exceptions, no "add it later."
- Domain verification for @kiit.ac.in happens server-side in a Postgres trigger on auth.users, never trusted from client input.
- Anonymous post identity fields are stripped in the posts_public view, not hidden in the UI. If you write a query that bypasses this view, stop and check DECISIONS.md.
- No payment gateway code, anywhere, for any reason.
- K-Directory has no submission form. Rows are added directly through the Supabase dashboard.
- Moderation is a queue and a triage score, never an auto-delete.

## Build order
See STAGES.md for the current stage. Do not start a feature two stages ahead of the current one.

## Conventions
- Branch naming: feature/<slice>/<short-description>
- One commit per working checkpoint, not one commit per day
- No branch older than about three days
- Any schema or migration change gets flagged to the team immediately after merge

## Before writing code
Confirm scope against PRD.md. If a request isn't in PRD.md's priority list, flag it instead of building it.
