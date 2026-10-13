# KIIT Node — Master Audit, Restoration, and Product Revamp Prompt

You are the senior product engineer, mobile UX lead, QA lead, security-minded reviewer, and pragmatic technical architect responsible for auditing and restoring KIIT Node into a coherent, production-minded campus app.

This is not a request to merely restyle a few screens, generate a new design, or add features. It is a full **product, UI/UX, functionality, reliability, and documentation audit**. Your job is to understand the actual repository, determine what works, identify what is broken or redundant, preserve good working behavior, fix incomplete flows, remove misleading or out-of-scope functionality, and leave behind an implementation that is materially more reliable and polished.

Think like an experienced team taking ownership of an app after an inconsistent first build. The end user is the central constraint. Every screen, control, data transition, permission, error, and visual choice must make sense to a KIIT student using a real Android phone under ordinary conditions—including weak connectivity, a small screen, a keyboard covering part of the form, expired authentication, stale content, and uncertainty about whom to trust.

The result should not feel like a homemade app assembled in a month by a solo developer in 2017. It should feel deliberate, modern, warm, fast, and credible. Premium does not mean excessive animation, blur, gradients, shadows, or decoration. Premium means clear hierarchy, consistent behavior, high-quality details, restraint, speed, accessibility, and trust.

## 0. Required source documents and authority

Read these before making substantive changes:

1. `PRD.md` — product scope, user jobs, requirements, acceptance criteria.
2. `DECISIONS.md` — existing decisions and rationale.
3. The project's current UI/design specification, including `UI.md` or its replacement if present.
4. `README.md`, package manifests, app configuration, environment examples, and relevant setup docs.
5. Existing tests and any deployment/backend documentation.
6. `HUMAN_INPUT_REQUIRED.md`, if present.
7. Relevant source files, navigation structure, data models, API/client modules, auth configuration, and reusable UI components.

The PRD is the default product source of truth. Existing code is evidence of current behavior, not proof that behavior is correct. Existing decisions are important context but can be superseded if demonstrably unsafe, obsolete, contradictory, or technically invalid. Never silently override a consequential decision: explain the conflict, recommend a resolution, update `DECISIONS.md`, and request human input only if the choice genuinely belongs to the product owner.

If a required document is absent, do not invent its contents. Record the absence, create or repair the document if appropriate, and proceed with conservative reversible choices where possible.

## 1. Mission and outcome

Perform a full restoration and revamp across these dimensions:

- **Product coherence:** the implemented app matches the intended KIIT Node product rather than a collection of disconnected screens.
- **Functional integrity:** each visible control performs its advertised action and each core user journey works end-to-end.
- **UX quality:** navigation, forms, feedback, empty states, loading states, errors, recovery, and destructive actions are consistent.
- **Visual quality:** the app has a coherent visual language, strong hierarchy, good typography, stable cross-platform surfaces, and thoughtful details.
- **Trust and safety:** verification, anonymous posting, reports, blocks, moderation, privacy, and marketplace expectations are accurate and enforceable.
- **Technical quality:** state handling, API contracts, data ownership, performance, accessibility, and failure behavior are sound.
- **Scope discipline:** remove redundant, dead, deceptive, insecure, or out-of-scope features instead of keeping them because they already exist.
- **Operational readiness:** document the manual tasks, external dependencies, moderation ownership, and launch blockers.
- **Maintainability:** improve the code without needless rewrites or introducing libraries to solve problems the current stack already handles.

Do not optimize for code volume or novelty. Optimize for a reliable product that users can understand and use successfully.

## 2. Non-negotiable operating rules

### 2.1 Inspect first; change second

Do not begin by rewriting screens based on assumptions. Map the repository, trace the real behavior, run the app or tests where possible, and build an evidence-based audit.

Before each significant change, know:
- What behavior currently exists.
- Which source files and backend functions implement it.
- Whether it is actually used.
- Whether it works end-to-end.
- What depends on it.
- What regression the change could cause.
- How the change will be verified.

Do not claim a feature works merely because the UI is present. Follow the request from UI through state management, API/backend, persistence, authorization, and back to visible feedback.

### 2.2 Preserve good work

Keep functional, well-designed code unless there is a clear reason to change it. Refactor the smallest sensible surface. Do not replace the entire architecture simply because you prefer another pattern.

Preserve existing working authentication, routing, backend integrations, and data models unless inspection demonstrates a defect or a conflict with the PRD. Avoid breaking changes and destructive migrations.

### 2.3 No fake completeness

Never:
- Leave buttons that do nothing.
- Simulate successful persistence when the server failed.
- Display fake users, fabricated counts, dummy listings, or placeholder success states as real data.
- Hide broken functionality behind decorative UI.
- claim a manual task has been completed when it needs a human.
- use client-only hiding as a substitute for server-side authorization.
- silently swallow errors.
- mark a requirement complete without evidence.
- leave “TODO” behavior in a core flow without documenting it as a blocker.

If a feature is not ready, either finish it, remove it from the user-facing MVP when safe and approved by scope, or clearly document the blocker. Do not create a misleading half-feature.

### 2.4 Human approval boundaries

You may inspect, test, refactor, create local files, update documentation, and implement safe in-scope changes. Do not, without explicit authorization:
- deploy or publish a release;
- contact KIIT, students, vendors, moderators, or other external people;
- create or change production credentials;
- make purchases or incur paid service costs;
- delete production data;
- perform an irreversible production migration;
- send real emails or notifications to users;
- make legal claims or represent the app as institutionally approved;
- create a moderation or emergency contact from invented information.

Use test accounts and local/staging environments where possible. If a test could affect real users or data, stop and document the required human action.

### 2.5 Research and source quality

You may research current best practices when research would materially improve the decision. Use authoritative sources first: official platform documentation, official framework documentation, security guidance from recognized standards bodies, and primary vendor docs. Use reputable secondary sources for product and UX context.

Research specific questions, not the internet at large. Examples:
- current React Native/Expo behavior for the version installed in this repository;
- secure auth/session practices supported by the actual provider;
- Android accessibility and target-size guidance;
- image upload/security requirements for the actual storage provider;
- OWASP guidance relevant to the actual architecture;
- current platform constraints around permissions, notifications, and deep links.

Do not blindly copy a reference app. Do not introduce a dependency solely because an article recommends it. Record links and a concise rationale in `DECISIONS.md` when research changes a material implementation decision. Do not pretend that an external guideline automatically satisfies legal compliance.

## 2.6 `HUMAN_INPUT_REQUIRED.md` is a living work register — mandatory behavior

`HUMAN_INPUT_REQUIRED.md` is not a static template, a prefilled list to leave untouched, or a document to update only at the end. You are responsible for maintaining it continuously as repository evidence changes what actually needs a human. Treat it as the handoff queue between autonomous engineering work and the product owner.

### At the start

1. Read the existing file if it exists. Preserve useful history and any previously supplied human answers.
2. Compare every open item against the repository, current configuration, existing documentation, safe local tests, and research you can perform yourself.
3. Do not assume a pre-existing item is still valid. Mark it `RESOLVED` or `NO LONGER NEEDED` only when you have concrete evidence, and record that evidence. Do not close an item merely because you implemented a related UI.
4. Create the file if it is absent, with a brief status summary and only evidence-based actions that truly require human input.

### During every phase

After reconnaissance, after each major implementation phase, after testing, and before the final report, update the register. For every discovered issue, decide whether it is: (a) solvable by repository inspection or research, (b) safely solvable by you with a reversible engineering choice, (c) an implementation defect you should fix, or (d) a genuine human/external dependency. Only category (d) belongs as an open human action. Do not offload normal engineering work to the user.

Add an item when you discover a real requirement for a human to provide authority, a fact unavailable to you, consent, policy judgment, external account/domain access, a production credential/configuration action, a moderation owner, approval, or a risky/irreversible operation. Make the request specific enough that the person can complete it without guessing. Include your recommended answer where you can justify one, but never fabricate the missing fact.

Update existing entries when evidence changes their priority, owner, scope, recommendation, risk, or closure criteria. If the repository answers a question that was previously open, close it and cite the evidence/path/test. If you discover an additional manual task, add it immediately rather than waiting until the end. If an action becomes unnecessary because you removed the feature or chose a safer supported implementation, mark it `NO LONGER NEEDED` and explain why. Do not erase closed entries; retain a concise audit trail.

### Required item format

Each open item must have:
- a stable ID (`H-001`, `H-002`, etc.);
- priority (`BLOCKING`, `IMPORTANT`, or `LATER`);
- status (`OPEN`, `IN PROGRESS`, `WAITING`, `RESOLVED`, or `NO LONGER NEEDED`);
- owner role;
- exact action or decision required;
- why you cannot responsibly complete it yourself;
- your recommended option and relevant trade-off;
- concrete risk if unresolved;
- exact evidence required to close it;
- source/evidence discovered during this run, where applicable.

Keep the top of the file useful as a live dashboard: last updated, current counts of open blockers/important/later items, and the next actions the owner should take. Recalculate these counts after updates; never leave stale counts. Separate **must be done before release** from **can wait**. Avoid duplicates: merge overlapping requests while preserving relevant history. Do not ask for information already available in repository files or accessible through approved tools.

### Never do these things

- Do not leave generic boilerplate items open without checking whether they apply to this actual app.
- Do not claim that a human task is complete based on code changes alone when it requires external confirmation.
- Do not add every unresolved bug to this file; bugs you can fix are your responsibility.
- Do not close production auth, policy, moderation, consent, branding, or deployment actions without appropriate evidence.
- Do not invent names, email addresses, contacts, credentials, campus landmarks, approvals, or organizational relationships.
- Do not remove a user-provided answer or overwrite explicit human decisions.

Before finishing, audit every entry one by one. The final report must summarize only the current open human actions, identify newly added or closed items, and point to the updated file. If there are no genuine human actions, say so and explain why; do not keep artificial items open merely to make the file look populated.

## 3. Product context

KIIT Node is a verified campus network for KIIT students. Access is gated by verified `@kiit.ac.in` email. Its three prioritized experiences are:

1. **Teammate Matcher:** skills/stack tags, seriousness/commitment expectations, and weekly bandwidth.
2. **Marketplace:** buy/sell/rent discovery, location/landmark tags, direct in-person handoff and direct UPI arrangement; no payment gateway.
3. **Forum:** notes/exam preparation, society events, Lost & Found, and other limited campus-relevant categories; anonymous-to-peers posting with accountable internal authorship.

K-Directory is team-curated, not open submission. Moderation is human-decided; automation may triage. iOS is not a launch requirement. Peer reputation/badges, campus navigation, live maps, and a section-selection simulator are out of scope.

A 30-student survey is directional evidence: 83.3% prioritized Teammate Matcher; 70% cited skill mismatch and work-ethic mismatch equally; 83.3% preferred in-person marketplace handoff with UPI; 46.7% wanted specific handoff landmarks; 90% wanted notes/exam prep, 73.3% society events, 56.7% Lost & Found; 60% wanted anonymous posting. Do not overstate this sample as representative of every KIIT student.

## 4. Stage 1 — Repository reconnaissance

Start by inspecting, not editing.

1. Identify the framework, runtime, package manager, navigation system, state/data layer, backend, auth provider, storage provider, testing tools, and build scripts.
2. Inspect project structure and key manifests. Confirm versions instead of assuming them.
3. Identify app entry points, route groups, shared layouts, theme tokens, typography, icon library, reusable components, form components, API clients, auth/session code, and error handling.
4. Trace the main data entities and their ownership rules.
5. Inspect all screens and routes, including less visible settings, developer utilities, admin routes, and old/duplicate implementations.
6. Identify development-only behavior, mock data, bypasses, placeholder endpoints, dead code, duplicate screens, deprecated packages, and feature flags.
7. Run available checks before changes: type-check, lint, tests, and build or Expo validation as applicable. Record pre-existing failures separately.
8. Launch the app on an Android emulator/device if available. If not available, state that limitation and use the strongest available static and automated verification.
9. Read the `readonly/` directory only as a visual/inspiration reference if it exists. **Treat it as immutable.** Never modify it, import its source into production, or copy its implementation wholesale. Extract high-level lessons only.
10. Build an inventory of every route/screen and every interactive control.

Create or update `AUDIT.md` with:
- architecture summary;
- screen/route inventory;
- feature inventory;
- current test/build status;
- dependency and risk notes;
- known assumptions;
- high-risk security/privacy findings;
- findings grouped by severity;
- proposed work phases.

Do not dump huge source files into the audit. Link findings to paths, symbols, routes, and reproducible steps.

## 5. Stage 2 — Build a feature and interaction inventory

For each screen, inspect every interactive element: buttons, icon buttons, cards, tags, tabs, search fields, filters, sort controls, forms, menus, bottom sheets, dialogs, swipe gestures, pull-to-refresh, links, notification actions, and empty-state CTAs.

Record each item with:
- screen and control;
- user-visible label/action;
- expected behavior;
- current implementation path;
- actual behavior observed;
- backend/API/persistence dependency;
- loading/success/error/disabled states;
- accessibility label/role;
- authorization/privacy implications;
- classification: keep, fix, simplify, remove, or needs human decision;
- evidence and test plan.

Use this checklist for every control:
1. Does it visibly communicate that it is interactive?
2. Does it have a real action?
3. Does that action do what its label promises?
4. Is the action safe if tapped twice?
5. Is there a pending state?
6. Is success shown only after success is confirmed?
7. Is failure visible and recoverable?
8. Is user input preserved after recoverable failure?
9. Does it work on a slow or disconnected network?
10. Is it keyboard/screen-reader accessible?
11. Does it obey ownership and permission rules?
12. Does it work after navigation away/back or app restart where persistence is expected?
13. Does it conflict with another control or duplicate another feature?
14. Does it belong in the MVP?
15. Can the user undo or recover from an accidental action?

Remove redundant UI, but do not remove a feature with meaningful existing usage or data implications without documenting the impact. A visually redundant control is not enough evidence to delete backend behavior. Distinguish hiding/removing UI from deleting data or schema.

## 6. Stage 3 — Audit each core feature end-to-end

Use `PRD.md` as the acceptance source. For each feature, trace the whole flow, not just the screen.

### 6.1 Authentication and onboarding
Test:
- valid KIIT address;
- non-KIIT address;
- lookalike domain;
- uppercase domain and whitespace;
- malformed address;
- verification request success/failure;
- resend cooldown/rate limit;
- expired/invalid/reused code/link;
- delayed email/provider outage;
- sign-in from another device where supported;
- session restore;
- expired session;
- sign-out and cached-state clearing;
- protected route direct access;
- account restricted/deleted states;
- developer bypass exposure in production.

Verify domain enforcement server-side/provider-side. Never rely on client validation alone. Do not leak account existence or auth tokens.

### 6.2 Teammate Matcher
Test:
- browse and stable sorting;
- search and combined filters;
- clear filters;
- no results and network failure;
- create with valid data;
- missing/invalid/overlong fields;
- tag normalization and duplicate tags;
- request retry and repeated taps;
- edit own opportunity;
- attempt to edit another user's opportunity;
- pause/close/filled/reopen behavior;
- stale detail after closure;
- deletion and confirmation;
- contact/interest workflow and its persistence;
- report/block behavior;
- profile privacy;
- list context when returning from detail.

Confirm seriousness and weekly bandwidth represent expectations and availability, not a public character score. Do not add an opaque compatibility score unless approved and validated.

### 6.3 Marketplace
Test:
- browse, search, filters, reset, empty state;
- listing creation, validation, edit, status transitions, delete;
- sell/buy/rent intent semantics;
- price and condition display;
- landmark tags;
- photo permission, upload progress, unsupported type, size limit, failure, retry, remove, and broken image if uploads exist;
- repeated submit;
- unauthorized edit/delete;
- closed listing in a stale detail view;
- contact and report/block;
- no in-app payment or wallet code;
- no false promise of transaction protection.

Check the entire data path for uploaded files: permissions, storage rules, public/private access, metadata, deletion behavior, and resource limits. Do not add a new storage provider before assessing the existing one.

### 6.4 Forum
Test:
- category/tag browse and filtering;
- create/edit/delete;
- draft preservation and duplicate-submit protection;
- anonymity toggle and its explanatory text;
- public payload for anonymous posts;
- internal moderation access to authorship;
- report/block flow;
- removed/deleted/locked states;
- Lost & Found privacy risks;
- copyright/unauthorized material reporting;
- comments/reactions/bookmarks only if they already exist or are approved MVP scope.

For anonymous posts, inspect server responses, API serializers, database relationships, notifications, deep links, analytics, crash logs, and cached objects. Verify that ordinary clients cannot recover the author's identity through hidden fields or predictable IDs. The database must retain the real author relationship. If server-side separation is not enforceable, classify it as a release blocker.

### 6.5 Shared systems
Audit:
- navigation and back stack;
- global theme and theme switching;
- forms and validation;
- toast/snackbar/dialog patterns;
- search and pagination;
- image handling;
- notifications and deep links if present;
- user profile and account controls;
- saved items if present;
- reports, blocks, moderation queue, and escalation;
- offline and retry behavior;
- error logging and analytics privacy;
- settings and support links;
- app configuration and release-mode behavior.

## 7. Stage 4 — Risk-first prioritization

Prioritize by user harm and release risk, not by how visually obvious the issue is.

Suggested severity:
- **P0 / release blocker:** auth bypass, cross-user data access, anonymous identity leak, exposed secret, destructive data loss, unsafe moderation gap for a known serious risk, production crash in core flow.
- **P1 / critical:** core feature cannot complete, wrong ownership enforcement, misleading payment/trust claim, data corruption, report submission silently failing, app unusable for a major screen-size/accessibility case.
- **P2 / important:** significant UX inconsistency, unreliable filtering, broken recovery, duplicate actions, performance problems affecting common flows.
- **P3 / polish:** minor visual inconsistencies, non-critical copy, subtle spacing or motion issues.

Fix P0/P1 before spending substantial time on polish. If a P0 issue cannot be fixed safely without a human or backend owner, stop the affected release path, document it, and do not mask it with UI.

## 8. Stage 5 — Design system and visual revamp

Create or consolidate a single design system. Follow the current UI specification if present; if it conflicts with the cross-platform requirements below, record the conflict and update the specification rather than layering contradictory styles.

### 8.1 Visual intent
- Premium, contemporary, campus-social, confident, human, restrained.
- Strong information hierarchy and legibility.
- Consistent layout rhythm, typography, iconography, surface treatment, and action placement.
- Content is the focal point.
- Distinguish core actions from secondary actions.
- Use brand color intentionally, not everywhere.
- Avoid the visual language of an enterprise admin dashboard or a generic generated template.

### 8.2 Explicit prohibition: glassmorphism
Do not use:
- `BlurView`;
- backdrop blur;
- frosted glass panels;
- translucent cards intended to blur content behind them;
- opacity-based “glass” surfaces;
- blur-dependent tab bars, navigation, or dialogs.

Reason: cross-platform rendering—especially Android—is inconsistent and can be visually glitchy. Use opaque semantic surfaces, subtle borders, spacing, typography, and carefully limited shadows instead. Do not install `expo-blur` for this project. Remove it only if unused and safe to remove.

### 8.3 Theme architecture
- Use centralized semantic tokens for background, surface, pressed surface, primary/secondary/tertiary text, separator, border, accent, success, warning, error, and disabled states.
- Support light/dark themes if the current app supports them or the existing UI specification requires them.
- Avoid scattering raw hex values through screens.
- Components should consume semantic colors rather than infer theme from arbitrary screen state.
- Confirm all foreground/background combinations have adequate contrast.
- Do not use color alone to communicate status.
- Keep the existing stack's theme conventions if they are sound; do not create a parallel theme system.

### 8.4 Cross-platform determinism
- Prefer opaque colors and native, stable layout primitives.
- Avoid platform-dependent tricks unless tested on Android.
- Avoid fixed dimensions that break under font scaling.
- Wrap chips and action rows.
- Use consistent safe-area and keyboard handling.
- Use the existing icon library; do not mix emoji as UI icons.
- Use subtle press feedback only; no oversized scaling or animation.
- Use gradients selectively for onboarding or a limited hero region, not every card or navigation surface.
- Do not add a new animation or UI library for decorative polish.

### 8.5 Screen-by-screen work
For each screen:
1. State its primary user job.
2. Identify the primary action.
3. Remove redundant or low-value elements.
4. Rebuild hierarchy and spacing consistently.
5. Improve copy and labels where unclear.
6. Design loading, empty, error, disabled, and success states.
7. Validate narrow screen, large font, keyboard, safe areas, and screen reader.
8. Confirm all visual elements map to real behavior.
9. Verify light/dark contrast where relevant.
10. Capture or record before/after evidence if the environment allows.

Do not restyle every screen in one uncontrolled rewrite. Use shared components and tokens, then migrate screens in coherent batches.

## 9. UX quality rules for all flows

### Forms
- Group fields by user mental model, not database schema.
- Label fields persistently; placeholders are examples, not the only labels.
- Explain constraints before submission when they matter.
- Validate inline and focus the first invalid field where practical.
- Preserve inputs after recoverable errors.
- Disable or guard duplicate submission while a request is pending.
- Make optional fields explicit.
- Do not require data without a user or product reason.
- Keep the primary action reachable with the keyboard open.
- Use appropriate input types and autocomplete.

### Lists and feeds
- Use stable keys and stable ordering.
- Paginate; do not load the entire dataset by default.
- Avoid flashing the entire screen during small refreshes.
- Clearly distinguish initial loading from refresh.
- Provide empty states that explain why the list is empty and what the user can do.
- Do not show stale query results under a new search label.
- Preserve scroll/filter state where reasonable.

### Destructive actions
- Confirm deletion or irreversible changes.
- State the consequence plainly.
- Never present a destructive action as a harmless navigation button.
- Use server-side ownership checks.
- Provide undo only if the backend and timing model genuinely support it.

### Feedback
- Success appears only after confirmed success.
- Errors say what happened and what the user can try.
- Avoid raw technical errors.
- Do not rely on color or haptics alone.
- Avoid success messages that disappear before a screen-reader user can perceive them.

### Copy
- Use concise, concrete language.
- Avoid corporate jargon, generic filler, fake urgency, manipulative engagement language, and ambiguous labels.
- Explain verification, anonymity, handoff, reporting, and restrictions in plain terms.
- Do not claim the app is officially endorsed or that users/items are “safe” unless that is true and substantiated.

## 10. Security, privacy, and trust review

Inspect the actual backend and auth provider; do not assume the client is a security boundary.

Check:
- server-side authentication and authorization;
- row-level/security rules or equivalent access policies;
- object ownership on create/read/update/delete;
- public DTOs and unintended internal-field serialization;
- anonymous author identity separation;
- rate limits for verification, reports, posting, and contact;
- input validation and output encoding;
- upload permissions, size/type limits, and deletion;
- secrets in source, logs, environment files, build output, and repository history where inspectable;
- token storage and session lifecycle;
- account enumeration and spam risks;
- deep-link authorization;
- cached private data after sign-out;
- report/moderation permissions and audit logs;
- data retention and deletion semantics;
- dependency vulnerabilities using available project tooling;
- production build flags and developer-only bypasses.

Never paste secrets into the audit or final report. Refer to the variable/path name and redact values. Do not print environment file contents.

For every finding, state severity, impact, evidence, fix, and verification. Do not claim formal security certification.

## 11. Moderation and operational reality

Moderation is not complete because a “Report” button exists.

Verify that:
- a report is persisted;
- a moderator can see it through an authorized workflow;
- the report can be assigned/reviewed/actioned/dismissed/escalated;
- actions and notes are auditable;
- anonymous authorship is only visible to authorized reviewers when needed;
- users receive an accurate acknowledgement;
- a real escalation contact and actual monitoring owner are defined before launch.

If no moderation UI exists, determine whether a secure small admin interface or an explicitly documented manual process is the least-risk viable MVP option. Do not create a hidden, unaudited admin route. Never invent an escalation contact or claim coverage that has not been confirmed.

Add unresolved operational work to `HUMAN_INPUT_REQUIRED.md`, with an owner role, reason, risk, and exact action needed.

## 12. Dependency and architecture discipline

Before adding, removing, or upgrading a package:
- Check whether the current stack already provides the capability.
- Inspect current versions and compatibility.
- Consider app size, native build implications, maintenance, licensing, security, and platform support.
- Prefer built-in capabilities or existing dependencies.
- Use the package manager and versioning conventions already in the repository.
- Run type-check/build/tests after changes.
- Update lockfiles correctly.
- Remove a dependency only when all imports and required runtime usage are gone.
- Do not upgrade unrelated packages as part of a visual revamp.
- Do not replace a working backend/auth provider just because another is fashionable.

If a database/schema migration is necessary:
- explain why;
- design a forward migration and, where practical, rollback plan;
- account for existing records;
- avoid destructive defaults;
- test against local/staging data;
- document operational steps;
- ask for human approval before production execution.

## 13. Testing strategy

Use the strongest tests available in the project. Add tests for important behavior rather than snapshotting every visual detail.

### Minimum test layers
1. **Static checks:** type-check, lint, formatting if configured.
2. **Unit tests:** validation, tag normalization, status transitions, public DTO shaping, permission helpers where testable.
3. **Component/interaction tests:** forms, disabled/loading states, filters, dialogs, accessibility labels where supported.
4. **Integration tests:** auth, data persistence, ownership enforcement, report creation, anonymous response shaping.
5. **Manual smoke tests:** real Android device/emulator, keyboard, font scaling, offline/retry, navigation, theme if applicable.
6. **Security checks:** direct unauthorized API attempts, cross-account access, anonymous payload inspection, production bypass check.
7. **Regression checks:** repeat core flows after refactors.

Do not invent test results. If infrastructure or credentials are unavailable, report the exact limitation and the manual action needed. Distinguish tests run, tests not run, and tests blocked.

### Core end-to-end smoke scenarios
- New student verifies a valid KIIT email and completes onboarding.
- Non-KIIT address is rejected at the appropriate stage.
- Returning student opens the app with a valid session.
- Student creates and closes a teammate opportunity.
- Another student searches/filters and opens that opportunity.
- A user cannot edit another student's opportunity by manipulating the client/API.
- Student creates a marketplace listing and marks it unavailable/sold/rented.
- Another student sees the updated state.
- Student creates an anonymous forum post; another ordinary account cannot identify the author through the API or UI.
- A student reports content; an authorized moderator can review it.
- Network failure during a create action does not lose the draft or create duplicates.
- Sign-out clears private cached information.
- All visible primary navigation destinations work.
- No development bypass is exposed in a production build.

## 14. Documentation work is part of the deliverable

Maintain these files:

### `PRD.md`
Replace or update the old PRD with a detailed product specification. It must define user jobs, feature requirements, states, edge cases, non-goals, security/privacy constraints, acceptance criteria, success measures, and open decisions. Keep it readable and internally consistent.

### `DECISIONS.md`
Preserve prior decisions and add/update entries whenever a meaningful product or architecture choice is made. Each entry should contain:
- date;
- decision/status;
- context/problem;
- options considered;
- selected option;
- rationale/evidence;
- trade-offs;
- affected features/files;
- migration or rollout notes if relevant;
- whether human approval is needed.

Do not erase the history of a decision without reason. Mark superseded decisions as superseded and link to the replacement.

### `HUMAN_INPUT_REQUIRED.md`
Create/update a temporary, actionable list of decisions or tasks that cannot be safely completed through repository inspection or engineering judgment alone. It is not a dump of every unknown.

Each item must include:
- ID and priority (blocking / important / later);
- the exact question or action;
- why engineering cannot resolve it alone;
- recommended default if there is one;
- consequence of not answering;
- required person/role (e.g. product owner, moderator lead, institutional contact, backend owner);
- acceptance/evidence needed to close it;
- status: open, answered, blocked, completed.

Include external/manual work such as confirming a real moderation escalation contact, reviewing legal/policy copy, obtaining permission for seeded content, checking institutional branding/authorization, confirming production auth email configuration, and approving any production migration. Do not include things you can resolve by reading the code or running tests.

### `AUDIT.md`
Maintain the repository/feature audit, findings, evidence, and test status. Keep it concise enough to use.

### `UI_PERFECTION_SUMMARY.md`
Summarize design-system changes, screen improvements, platform considerations, accessibility checks, and any known visual limitations. Do not use it as a substitute for tests or the audit.

Update all documentation to reflect reality. Do not mark a manual task completed without evidence.

## 15. Work plan and execution order

Execute in controlled phases. You may combine adjacent phases when the repository is small, but preserve the logic and verify each stage.

### Phase A — Baseline and map
- Inspect repository and documents.
- Run baseline checks.
- Inventory routes, features, controls, data flows, and dependencies.
- Write/update `AUDIT.md`.
- Identify P0/P1 risks.
- Do not make broad visual changes yet.

### Phase B — Resolve product contradictions
- Compare implementation against PRD and `DECISIONS.md`.
- List contradictions, dead features, and uncertain requirements.
- Make safe, reversible decisions based on evidence.
- Update `DECISIONS.md`.
- Put genuine human decisions in `HUMAN_INPUT_REQUIRED.md`.
- Do not block all work on non-blocking questions.

### Phase C — Security and core functionality
- Fix P0/P1 defects first.
- Verify auth and ownership.
- Verify anonymous identity separation.
- Verify report submission and moderation workflow.
- Fix broken core create/edit/status/delete flows.
- Add tests around fixes.
- Remove unsafe shortcuts and production-only bypasses.

### Phase D — Design-system foundation
- Consolidate semantic tokens and reusable components.
- Remove blur/glass surfaces and unstable visual effects.
- Standardize typography, spacing, buttons, chips, cards, dividers, dialogs, forms, and feedback.
- Confirm light/dark behavior where applicable.
- Do not redesign all screens independently.

### Phase E — Screen-by-screen UX restoration
- Work in user-priority order: authentication/onboarding, Teammate Matcher, Marketplace, Forum, shared profile/settings, moderation/admin surfaces.
- For each screen, test loading/empty/error/success/disabled states.
- Remove redundant controls and out-of-scope features.
- Keep working functionality intact.
- Verify narrow screens, keyboard, font scaling, and navigation.

### Phase F — Reliability, accessibility, performance
- Address request races, duplicate submits, pagination, image loading, stale state, error recovery, focus order, contrast, target sizes, and text scaling.
- Avoid speculative optimization without a demonstrated issue.
- Add targeted tests.

### Phase G — Final verification
- Re-run all relevant static checks, tests, and builds.
- Run core end-to-end smoke scenarios.
- Inspect the final diff for accidental changes, secrets, unused imports/dependencies, debug bypasses, unrelated formatting, and modified `readonly/` files.
- Confirm that all visible controls work.
- Update `DECISIONS.md`, `UI.md`, `UI_PERFECTION_SUMMARY.md`, and `HUMAN_INPUT_REQUIRED.md` based on what the audit and implementation actually established. The human-input file must reflect the current state, not the original template.
- Produce a final report with evidence and honest limitations.

## 16. Safe decision-making: when to fix, remove, defer, or ask

Use this decision framework:

**Fix now** when the feature is in the PRD, broken, and the correct behavior is clear.

**Keep** when the feature works, is in scope, has real value, and does not create a security/UX contradiction.

**Simplify** when the feature's goal is valid but the implementation has unnecessary steps, duplicated controls, or avoidable complexity.

**Remove from the MVP UI** when the feature is out of scope, redundant, decorative-only, misleading, or too incomplete to ship. Before removing, check deep links, data dependencies, and whether another flow depends on it. Document meaningful removals.

**Defer** when the feature is non-essential, costly, and not needed for the core user job. Do not build speculative future infrastructure.

**Ask a human** only when a decision depends on authority, real-world facts, policy, consent, legal judgment, credentials, an external commitment, or an irreversible product choice. Give a recommendation and explain the trade-off; do not ask open-ended questions that the repository or research can answer.

If a requirement conflicts with security or platform reality, do not follow it blindly. Document the conflict and choose the safest behavior that preserves the product goal.

## 17. Definition of a premium result

The result should exhibit the following qualities:

- A new user can understand the product and verify their account without confusion.
- The three core features feel like parts of one product.
- Lists are scannable, content has hierarchy, and primary actions are obvious.
- Forms are short, understandable, forgiving, and recoverable.
- Feedback is immediate but truthful.
- The app never suggests an action succeeded when it did not.
- No screen feels visually overloaded or like a default template.
- Surface contrast and typography carry the design; blur and decoration do not.
- Cards, tags, buttons, icons, and spacing follow a coherent system.
- The app is usable on smaller screens and with larger text.
- Users can report and block abuse without being pushed into confrontation.
- Privacy claims match actual backend behavior.
- Anonymous posting has a demonstrable identity boundary.
- Marketplace UI does not imply payment protection or guaranteed trust.
- Dead, duplicate, and out-of-scope functionality is removed or clearly deferred.
- Known gaps are explicit and actionable.
- Documentation and tests match the code that actually ships.

## 18. Required final report

At the end, provide a concise but evidence-based report with these sections:

1. **Overall status:** ready / ready with known non-blocking gaps / not ready; explain why.
2. **Major changes:** grouped by authentication, Matcher, Marketplace, Forum, shared UX/design, safety, architecture.
3. **Features removed or deferred:** what changed and why.
4. **Decisions updated:** summarize entries added to `DECISIONS.md`.
5. **Human actions required:** list the current open blocking/important items from `HUMAN_INPUT_REQUIRED.md`; also summarize which items you added, updated, resolved, or marked no longer needed during this run.
6. **Verification performed:** exact commands run and results; tests/builds not run and why.
7. **Security/privacy findings:** fixed, remaining, and unverified.
8. **Known limitations:** no vague “some issues remain”; give specific paths/flows.
9. **Changed files:** meaningful list with rationale.
10. **Release recommendation:** identify any release blockers. Never say “production ready” without evidence.

## 19. Final instructions

- Start with reconnaissance and an audit, not a rewrite.
- Make progress independently where safe.
- Treat `PRD.md`, `DECISIONS.md`, and actual repository behavior as a system that must be reconciled, not as documents to blindly obey in isolation.
- Use research to resolve real uncertainty, not as a substitute for inspecting the code.
- Keep the user experience and the real student on the other side of the screen in mind at every stage.
- Be ruthless about dead controls and redundant features, but conservative with working behavior and existing data.
- Prioritize trust, safety, correctness, and coherence over visual novelty.
- Do not stop after producing a plan. Carry the work through implementation and verification as far as the environment and permissions allow.
- Do not conceal blocked work. Put genuine human/external dependencies in `HUMAN_INPUT_REQUIRED.md`.
- Do not modify anything in `readonly/`.
- Do not add glassmorphism or blur-dependent UI.
- Finish by updating the documentation and reporting exactly what was and was not verified.

Begin by listing the project root, reading the source documents, checking repository status, and running the baseline checks. Then proceed phase by phase. But do it all in this prompt.

so yeah fix what's broken or absent. add what should be there. remove what's redundant.
