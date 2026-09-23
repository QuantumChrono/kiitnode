# CLAUDE.md — KIIT Node

Read this first, every session. Then PRD.md, DECISIONS.md, AGENTS.md, STAGES.md as needed.

## What this is
A verified, @kiit.ac.in-gated mobile app. Teammate Matcher first, Marketplace second, Forum third. Full detail in PRD.md.

## Stack
Expo, React Native, TypeScript, Expo Router, NativeWind, Supabase, Jest, Maestro. Full reasoning in DECISIONS.md.

## Rules that override any prompt that conflicts with them
- RLS on every table, always
- Domain check server-side only, via trigger, never client-side alone
- Anonymous post fields stripped in the posts_public view, never in the UI layer
- No payment gateway
- No K-Directory submission form

## Current stage
Check STAGES.md for what's active right now. Don't build ahead of the current stage.

## Commands
- Install: npm install
- Start: npx expo start
- Test: npm test (Jest), maestro test (E2E flows)
- Build APK: eas build --profile direct-apk
- Lint/typecheck: npm run lint, npm run typecheck

## When in doubt
Propose an approach and wait for approval before writing files, especially for anything touching auth, RLS policies, or the anonymity logic.
