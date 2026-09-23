# DECISIONS.md — KIIT Node

One entry per real call. Read before questioning why something is built a certain way.

## Expo (React Native) over bare RN or a web-wrapped app
Apple rejects webview wrapper apps under Guideline 4.2, Minimum Functionality. Expo also exports to web for free later if that's ever needed. No reason to build a web app first and wrap it.

## Supabase over Firebase or a custom backend
Postgres, real RLS, resource-based pricing instead of per-operation. Strong fit for a small team.

## No payment gateway in Marketplace
83.3% of surveyed students want in-person handoff with UPI, not an in-app payment flow. Building a payment system would be solving a problem students don't have.

## K-Directory is team-curated, not open submission
Simpler to build, no moderation queue needed for it at launch. Open submission is a planned v2 feature once there's usage data to justify it.

## Anonymous posts strip identity at the API layer, never delete the author link in the database
The raw table always keeps user_id. Clients query a view that nulls identity fields when is_anonymous is true. This is what lets the moderation system respond to a genuine threat without making true anonymity a security hole. See schema.sql, posts_public view.

## AI moderation is triage only, never auto-block
OpenAI Moderation API flags posts for priority human review. It never deletes or hides content on its own. A model is wrong often enough in both directions that full automation isn't safe at this scale.

## Android only, APK plus a landing page, at launch
Zero budget for app store fees. Apple has no free sideloading path. This is Android-first by necessity, not a lesser choice. No rebuild needed to add stores later, since the app was built native from day one.

## Kanban, not Scrum
Team is too small for sprint ceremonies to add coordination value they're meant to provide.

## Report abuse prevented by a database constraint, not app logic
UNIQUE(post_id, reporter_id) on the reports table. A single user's second report on the same post is rejected outright, not just discouraged in the UI.
