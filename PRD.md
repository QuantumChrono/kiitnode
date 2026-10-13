# KIIT Node — Product Requirements Document (PRD)

**Document status:** Replacement draft for implementation and audit  
**Product:** KIIT Node  
**Platform at launch:** Android-first mobile app  
**Primary audience:** KIIT students  
**Authentication requirement:** Verified `@kiit.ac.in` email  
**Product principle:** A trusted, useful campus network that feels considered, fast, safe, and distinctly made for KIIT—not a generic social feed with a campus logo.

---

## 1. Executive summary

KIIT Node is a verified campus network for students who need to find collaborators, exchange useful goods, and share campus-relevant information without coordinating across disconnected WhatsApp groups, notice boards, and Reddit threads.

The MVP has three primary experiences, in priority order:

1. **Teammate Matcher** — help students find collaborators whose skills, seriousness, and weekly availability fit the work.
2. **Marketplace** — let students list items to buy, sell, or rent and arrange an in-person handoff, normally using UPI directly between students.
3. **Forum** — provide one organized place for notes and exam preparation, society events, Lost & Found, and other campus-relevant posts.

The app is restricted to verified KIIT email accounts. K-Directory is curated by the product team and is not an open-submission directory in the MVP. Anonymous forum posting is supported only as *public-facing pseudonymity*: the community does not see the author's identity, but the system retains an accountable author link.

This PRD describes user-visible behavior, edge cases, states, safeguards, and operational requirements. It is the product source of truth for the MVP. Where this document conflicts with an older implementation, screenshot, mock-up, or informal assumption, do not silently preserve the old behavior: inspect the code and current product decisions, identify the conflict, and resolve it explicitly in `DECISIONS.md`.

## 2. Product context and evidence

### 2.1 The problem

KIIT students coordinate across fragmented channels. Relevant posts are hard to discover later, context is lost in group chats, collaboration expectations are often unclear, and campus transactions require trust that generic marketplaces do not provide.

KIIT Node should reduce the work required to answer questions such as:

- Who is looking for a teammate with my skills and compatible availability?
- Where can I find a used textbook, rent a calculator, or sell a hostel item?
- Where are the notes, exam-prep resources, society events, or lost-item notices relevant to me?
- Is this person a verified member of the KIIT community?
- How do I report a harmful post or suspicious listing?

### 2.2 Survey evidence

A survey of 30 students informed feature priority. Treat these as directional findings from a small sample, not universal population estimates:

- 83.3% selected Teammate Matcher as the single feature they would use most.
- 70% identified skill mismatch and work-ethic mismatch as top collaboration blockers, equally.
- 83.3% preferred in-person marketplace handoff with UPI rather than an in-app payment flow.
- 46.7% wanted listings to identify specific campus handoff spots, such as hostel gates or food courts.
- 90% wanted notes/exam-prep sharing; 73.3% wanted society events; 56.7% wanted Lost & Found.
- 60% wanted anonymous posting.

These findings justify the initial order of work. They do not remove the need to validate usability, trust, safety, and actual behavior after launch.

### 2.3 Product outcome

The product should create useful campus interactions, not maximize time spent in the app. Success is measured by successful matches, completed handoffs, useful forum activity, and safe resolution of reports—not raw post volume alone.

## 3. Goals

### 3.1 MVP goals

- Make access exclusive to students who can verify a `@kiit.ac.in` email address.
- Help students discover and contact compatible teammates.
- Support simple buy/sell/rent listings without processing payments.
- Organize campus discussion and resources using a coherent category/tag system.
- Allow anonymous-to-peers forum posting while preserving system accountability.
- Give users clear controls to edit, delete, block, report, and manage their content.
- Provide a working human moderation process and an actionable escalation contact before launch.
- Deliver a polished, accessible, responsive Android-first experience with coherent loading, empty, error, and success states.
- Make the app useful during the first week through a seeded initial community and clear onboarding.

### 3.2 Product quality goals

- Predictable navigation and consistent interaction patterns.
- Clear trust cues without implying that verification guarantees honesty or safety.
- Fast perceived performance, stable scrolling, and graceful network failure behavior.
- No dead buttons, placeholder screens, silent failures, misleading status indicators, or fake data in production.
- A visual system that feels intentional and campus-social rather than corporate, cluttered, or homemade.
- Maintainable code with clear ownership of state, API contracts, error handling, and shared components.

## 4. Non-goals and hard boundaries

The following are explicitly out of scope for the MVP unless the product owner changes this section in writing:

1. **No in-app payment gateway.** KIIT Node does not collect, hold, route, refund, or escrow money for Marketplace transactions.
2. **No open K-Directory submissions.** Directory entries are curated by authorized maintainers.
3. **No fully automated moderation decisions.** Automated systems may detect, classify, prioritize, or queue content. Humans decide consequential moderation actions.
4. **No iOS launch requirement.** The initial launch is Android-first. Keep architecture portable where practical, but do not delay the MVP for App Store work.
5. **No reputation, trust score, or peer badge system.** Verification is an access control, not a character endorsement.
6. **No campus navigation, live maps, route planning, or section-selection simulator.**
7. No public student profiles that expose private contact details by default.
8. No direct messaging system that is inaccessible to moderation/reporting controls or that exposes email addresses by default.
9. No real-money in-app wallet, payment ledger, refunds, or transaction guarantees.
10. No AI-generated moderation verdicts that automatically ban users or permanently remove content without a defined human-review policy.

The product owner may approve future scope changes, but implementation agents must not quietly expand scope.

## 5. Users and core jobs

### 5.1 Primary user groups

- **Project initiator:** has an idea, assignment, competition, or project and needs collaborators.
- **Potential teammate:** has skills and limited time, and wants projects with clear expectations.
- **Marketplace buyer:** wants a relevant item nearby and needs clear condition, price, and handoff information.
- **Marketplace seller/lender:** wants to find a campus buyer or renter without managing an elaborate transaction system.
- **Forum contributor:** shares notes, questions, event details, or a Lost & Found notice.
- **Forum reader:** wants to find useful, recent, relevant information quickly.
- **Moderator/operator:** reviews reports, resolves disputes, removes unsafe content, and communicates with affected users.
- **Directory maintainer:** updates a curated directory entry and verifies that the information remains accurate.

### 5.2 User needs

- I can tell what the app is for within the first minute.
- I can verify my account without understanding technical email terminology.
- I can create a useful post without completing a long, unnecessary form.
- I can see relevant details before contacting someone.
- I can distinguish a verified account from an endorsement of that person's behavior.
- I can recover from mistakes and understand why an action failed.
- I can report or block someone without having to confront them.
- I can use the app with a small screen, larger text, slow network, or keyboard open.
- I can leave the app and return without losing a draft unexpectedly.

## 6. Information architecture and navigation

Use a small, stable primary navigation model. The exact tab names may follow the existing app's established architecture if it already works, but the core destinations must remain discoverable:

1. **Home / Feed:** useful campus posts and entry points to major features.
2. **Teams:** Teammate Matcher.
3. **Marketplace:** buy/sell/rent listings.
4. **Forum:** category-based campus posts.
5. **Profile / Account:** own profile, posts, saved items, settings, help, and sign-out.

If the current app uses a different navigation model, audit it against these user jobs before replacing it. Do not add duplicate destinations that lead to the same content. Navigation labels must be understandable without insider knowledge.

### 6.1 Navigation requirements

- The selected destination is visually and programmatically identifiable.
- Navigation state survives ordinary screen transitions.
- Back behavior is predictable and does not unexpectedly exit a multi-step flow.
- Opening a detail screen and returning preserves useful context: scroll position, selected filters, and list state where practical.
- Authentication-required routes redirect to sign-in and return the user to the intended destination after successful verification.
- Destructive actions do not occur because of accidental navigation taps.
- Every visible navigation item has a working destination.
- Avoid nested navigation patterns that trap the user or create duplicate back stacks.

## 7. Account creation, authentication, and verification

### 7.1 Access rule

Only users with a successfully verified `@kiit.ac.in` email may access the authenticated student network. Do not treat a typed email address as proof of ownership.

### 7.2 Required flow

1. User opens the app and sees a concise explanation of the verified KIIT network.
2. User enters a KIIT email address.
3. Input is trimmed and normalized consistently; domain matching is case-insensitive.
4. Validate the address format and permitted domain before sending a verification request.
5. Send a one-time verification link or code using the existing supported authentication provider.
6. Show a clear confirmation state explaining that the user should check their inbox.
7. Support resend with a visible cooldown and meaningful error messages.
8. Validate the token/code securely on the server/provider.
9. On success, create or retrieve the account and establish an authenticated session.
10. Continue onboarding only for first-time users; returning users should not repeat onboarding unnecessarily.
11. If the user follows a valid verification link on a different device, handle the handoff safely and explain any required next step.

### 7.3 Security and edge cases

- Reject lookalike domains, subdomains, trailing junk, whitespace tricks, and unrelated email domains.
- Do not accept `student@kiit.ac.in.example.com` or `student@notkiit.ac.in`.
- Do not expose whether a particular email already has an account in a way that enables account enumeration.
- Rate-limit verification requests and code attempts.
- Verification tokens must expire and be single-use where supported.
- Resending should invalidate or safely supersede prior codes according to provider behavior.
- Never log passwords, access tokens, verification codes, or full sensitive authentication payloads.
- Persist sessions using platform-appropriate secure storage and the selected auth SDK's supported mechanism.
- On sign-out, clear local authenticated state and sensitive cached data.
- On account deletion, revoke sessions and handle backend data according to the documented retention policy.
- Handle expired links, reused links, invalid codes, provider outages, delayed email, offline state, and rate limits with actionable messaging.
- Do not build custom password storage if a managed auth provider is already used.
- If the existing authentication mechanism is incomplete or insecure, document the risk and implement the safest compatible solution rather than polishing a broken flow.

### 7.4 Profile setup

Collect only what is needed for useful participation. The minimum profile should include a display name and whatever small set of fields is required for the core experiences. Do not require a phone number, roll number, home address, or public personal details without a documented necessity.

The user should be able to edit allowed profile fields. Clearly distinguish private account fields from public-facing profile fields. Email addresses must not be shown publicly by default.

### 7.5 Session states

Support: signed out, verification pending, authenticated, session expired, account restricted, and account deletion pending/completed where relevant. Each state needs a clear next action. A stale local session must not be treated as authenticated when the backend rejects it.

## 8. Onboarding and first-run experience

- Explain the app's three primary jobs in plain language.
- State why KIIT email verification is required.
- Explain the difference between account verification and a guarantee of trustworthiness.
- Ask for optional profile details only when their benefit is clear.
- Do not front-load permission prompts. Request notifications only when the user understands their value, and allow refusal.
- Do not block the user with an elaborate carousel that repeats the login screen.
- Show a useful empty state for each core feature and a path to create the first contribution.
- If the community has been seeded, surface genuinely useful starter content; never fake engagement, invent users, or display fabricated counts.
- Allow users to skip optional personalization and change preferences later.

## 9. Teammate Matcher

### 9.1 Purpose

Help a student find collaborators based on skills, work expectations, and weekly availability. This is the highest-priority product experience.

### 9.2 Core entities

A team opportunity should have, at minimum:

- Title.
- Short description/problem statement.
- Project type or context (for example, course project, hackathon, research, personal project, startup idea).
- Required or preferred skill/stack tags.
- Seriousness/commitment expectation.
- Weekly time-bandwidth expectation.
- Number or types of roles sought, if applicable.
- Application/contact method supported by the product.
- Creator and timestamps.
- Status: open, paused, filled/closed, or removed.
- Report and moderation metadata kept separately from public display data.

A student seeking a team may have a discoverable profile with skill tags and weekly bandwidth, plus a short optional introduction. Do not force users to publish every profile field.

### 9.3 Skill and stack tags

- Use a curated, consistent tag vocabulary for common areas such as UI/UX, frontend, backend, mobile, AI/ML, data, cybersecurity, cloud/devops, hardware/robotics, design, research, and product.
- Allow multiple tags.
- Prevent visually distinct duplicates caused by case, spacing, or synonyms.
- Provide search or filtering for tags.
- Display tags as compact, readable chips that wrap on small screens.
- Do not imply that a tag is a verified skill or certification.
- If custom tags are later permitted, sanitize them and route abuse-prone terms through moderation. A curated MVP vocabulary is preferred.

### 9.4 Seriousness / commitment

This field captures expectations, not moral worth. Use a small set of plain-language choices with short descriptions. The exact labels should be finalized with the product owner and recorded in `DECISIONS.md`; avoid ambiguous labels such as “good” or “bad.”

The user should understand whether an option refers to a casual learning project, a consistent side project, a deadline-driven competition, or a high-commitment effort. A team opportunity's expectation must be visible before the user expresses interest.

### 9.5 Weekly bandwidth

- Use understandable ranges rather than false precision.
- Let opportunity creators specify expected hours or a bandwidth band.
- Let prospective teammates state their own availability.
- Do not equate more hours with a better candidate.
- Make mismatches visible as information, not as a hidden exclusion or judgment.
- Avoid collecting exact timetables or detailed daily routines in the MVP.

### 9.6 Browse, search, and filter

Users should be able to:

- Browse recent open opportunities.
- Search titles and descriptions.
- Filter by relevant skill tags, project type, commitment, and bandwidth.
- Clear all filters.
- See active filter state.
- See a useful empty state if no results match.
- Refresh results and understand when data is stale or unavailable.
- Open a detail page without losing their place in the list.
- Report an opportunity.
- Save/bookmark an opportunity only if the app supports a reliable saved-items model; if present, it must work across sessions.

Do not build a complex recommendation algorithm for the MVP unless one already exists and is demonstrably reliable. Clear filters and relevant sorting are better than opaque scoring.

### 9.7 Create and manage an opportunity

- Validate required fields before submission and show errors next to the relevant fields.
- Preserve entered data when validation fails or a network request fails.
- Prevent duplicate submissions caused by repeated taps.
- Provide a submitting state and success confirmation.
- Let the owner edit, pause, reopen, mark filled/closed, or delete their own opportunity.
- Confirm destructive deletion and explain what is removed.
- Closed or filled opportunities must not appear as open in discovery.
- A closed opportunity may remain visible to its owner with a clear status.
- If another user has already opened a detail page, show its current status rather than allowing an application to a closed opportunity.
- Prevent unauthorized edits using server-side ownership checks, not just hidden UI buttons.

### 9.8 Express interest and contact

Use the existing supported contact model. Do not introduce an unrelated chat subsystem merely to make the feature appear complete.

If there is an in-app message/request flow:
- Show the recipient, opportunity, and message context.
- Prevent repeated accidental requests.
- Show pending/sent/accepted/declined states only if the backend persists them.
- Allow the receiver to respond, decline, or report.
- Provide block/report access.
- Do not expose private email or phone details by default.

If the current app uses a simpler contact action, audit its privacy, reliability, abuse potential, and failure states; document the chosen approach in `DECISIONS.md`.

### 9.9 Matcher safety and quality

- Users can report misleading, discriminatory, spam, or abusive opportunities.
- A user can block another user where supported by the shared block model.
- Blocked users should not be able to use the app's supported contact surface to continue unwanted interaction.
- No public ranking of students, compatibility score presented as objective truth, or reputation badge in the MVP.
- Explain that profile tags and stated availability are self-reported.
- Avoid promising that the app will guarantee a team or a successful project.

## 10. Marketplace

### 10.1 Purpose and transaction model

Marketplace supports simple campus buy/sell/rent listings. KIIT Node is a discovery and coordination tool, not a payment processor, escrow provider, guarantor, or delivery service.

No in-app payment gateway. Users coordinate handoff and any UPI payment directly with each other. The UI must not imply that KIIT Node has verified an item, seller, payment, or transaction.

### 10.2 Listing fields

A listing should support:

- Clear title.
- Description.
- One or more item photos if image upload already exists or can be added safely.
- Category.
- Intent: sell, buy, or rent/lend, using a clear model that does not confuse listing ownership.
- Price or rental amount when applicable.
- Condition for physical goods, where relevant.
- Availability/status.
- Campus handoff location/landmark tag.
- Optional availability window or handoff note, without requiring exact personal schedules.
- Creator and timestamps.
- Report/moderation metadata separate from public display fields.

Do not ask for unnecessary private information. Never require a user's room number or home address for a public listing.

### 10.3 Categories and tags

- Use a manageable curated category list that covers common student needs: books/notes where legally appropriate, electronics/accessories, hostel/room items, clothing, cycles/transport accessories, stationery, calculators, sports, and miscellaneous.
- Rentals are a category/intent in the listing model, not a separate stateful rental-management system.
- The taxonomy must be editable by maintainers without code changes where the current architecture supports it.
- Tags must be consistent and readable; avoid uncontrolled tag sprawl.

### 10.4 Location/landmark tags

- Support campus landmarks such as hostel gates, food courts, academic blocks, or other owner-approved public handoff spots.
- Use a curated list when feasible; if free text is retained, validate length and moderate abuse-prone content.
- Location is a coordination hint, not live tracking.
- Do not collect or expose live GPS location in the MVP.
- Do not represent a landmark as an officially safe or supervised transaction point unless KIIT has actually designated it as such.
- Users should arrange handoffs in public places and use their own judgment.

### 10.5 Browse, search, and filters

Users should be able to:
- Browse recent and available listings.
- Search title and description.
- Filter by category, intent, price range where meaningful, condition where meaningful, and landmark.
- Clear filters.
- View a clear empty state.
- Open a detail page with photos, description, price, condition, location tag, poster, and current status.
- Report a listing and block the poster.
- Return to the list without losing filters/scroll position where practical.

Sort order must be explainable, typically newest first. Do not advertise “best deal” or “verified seller” unless those concepts are defined and supported.

### 10.6 Listing lifecycle

Minimum statuses should distinguish available/open from unavailable/closed/sold/rented where applicable. Avoid creating a complicated reservation system.

- Owner can edit, mark unavailable, mark sold/rented, reopen when valid, or delete.
- Status changes must be persisted by the backend.
- Closed listings must not be shown as available in default discovery.
- Users contacting the owner should see a stale/closed status if the listing changed after it was opened.
- Repeated submission taps must not create duplicate listings.
- Editing a listing must not silently reset its status or remove photos without warning.
- Deletion must be confirmed and enforced server-side.

### 10.7 Contact and payment safety

- Do not add a payment gateway, wallet, escrow, payment collection, or transaction fee.
- Do not store UPI PINs, banking credentials, card details, or payment authorization data.
- If a UPI ID is shown, it must be user-supplied, clearly optional, and not imply platform verification; preferably keep payment coordination out of public listing text unless there is a justified product decision.
- Warn users not to share OTPs, UPI PINs, passwords, or remote-access codes.
- Never instruct a buyer to approve a collect request to “receive” money.
- Encourage users to inspect the item and confirm payment themselves.
- Do not guarantee refunds, item quality, seller reliability, or transaction completion.
- Provide report/block controls and a short safety guidance entry point.

### 10.8 Photos and uploads

If photos are supported:
- Validate file type and size on client and server.
- Handle upload progress, retry, cancellation, failure, and removal.
- Avoid showing broken image placeholders without a recovery path.
- Use thumbnails and appropriately sized media for lists.
- Respect device permissions and request access only when needed.
- Do not make photo upload a blocker if the user cannot grant permission; allow a text-only listing if product rules permit.
- Strip unnecessary metadata such as GPS EXIF where practical.
- Prevent unsupported file types and unsafe remote content.
- Use authenticated or appropriately scoped storage rules.

If uploads do not exist, the implementation agent must inspect the current backend/storage architecture before adding them and record cost, security, and dependency implications.

## 11. Forum

### 11.1 Purpose

The forum is an organized place for campus-relevant knowledge and updates. It should not become an unmoderated anonymous confession board or a generic engagement-maximizing social network.

### 11.2 Core categories

- Notes and exam preparation.
- Society/club events.
- Lost & Found.
- General campus discussion or help, if needed to avoid forcing posts into the wrong category.

The first three categories are the validated priority categories. Additional categories should be limited and justified. Use one coherent tag system where possible.

### 11.3 Post fields

- Title where appropriate.
- Body text.
- Category and optional tags.
- Optional attachments only if supported safely.
- Author display identity or anonymous display mode.
- Created/updated timestamps.
- Status and moderation metadata.
- Report counts and internal review data must not be exposed publicly.

### 11.4 Browse and discover

- Show a sensible default feed, typically recent posts.
- Let users filter by category and tag.
- Support search if the backend can deliver consistent results.
- Distinguish pinned/official information from ordinary user posts.
- Do not make a post look official just because it has many interactions.
- Show edit/update time when useful.
- Show deleted, removed, locked, or unavailable content states clearly and consistently.
- Preserve list context when opening and returning from a post.

### 11.5 Create, edit, delete

- Provide a straightforward composer with category, title/body, tags, and anonymity control.
- Explain anonymous posting before the first anonymous submission.
- Validate required fields and length limits.
- Preserve drafts after validation or recoverable network errors.
- Prevent duplicate submission.
- Let the author edit or delete their own posts, subject to moderation/retention rules.
- Clearly distinguish user-deleted content from moderator-removed content where the policy permits.
- Do not allow editing to bypass moderation restrictions.
- If comments/replies exist in the current app, audit them for the same ownership, reporting, blocking, and deletion rules. Do not add comments merely by default if the MVP does not need them.

### 11.6 Anonymous posting: strict contract

Anonymous means anonymous to other students, not anonymous to KIIT Node's system.

- The database must retain the real author relationship for every post, including anonymous posts.
- Server-side authorization must decide whether the public response includes the author's public identity.
- For anonymous posts, public APIs must not return the author's email, account ID, profile URL, display name, or another field that enables trivial identity recovery.
- Do not rely on client-side hiding of identity fields.
- Keep internal moderation access to the author link limited to authorized personnel and appropriate audit logs.
- Avoid including identity-bearing information in public URLs, analytics events, push notifications, error logs, or cached public payloads.
- A moderator's access to anonymous identity must be need-based and auditable.
- Anonymous mode must be clearly labeled in the composer and post view.
- Do not promise absolute anonymity: content itself may reveal identity, and the system retains an accountable link.
- Establish and communicate the circumstances under which identity may be accessed for safety or legal escalation.
- If the current backend cannot reliably enforce this separation, treat it as a release blocker.

### 11.7 Lost & Found-specific safeguards

- Ask users not to publish sensitive identifiers, full addresses, room numbers, access codes, or full images of identity documents.
- Encourage a general description and safe claim verification.
- Do not expose a claimant's private details publicly.
- Let users update a post to indicate that an item has been returned/found, if the current data model supports it.
- Avoid allowing fraudulent claims to be treated as verified by the platform.
- If the post contains a visible phone number or other personal data, provide reporting and moderation handling.

### 11.8 Educational resources and copyright

- Encourage sharing notes or materials the student has permission to distribute.
- Do not market the app as a place to distribute pirated textbooks, paid course content, leaked exam papers, or unauthorized personal data.
- Provide a report category for copyright or unauthorized-material concerns.
- Moderators need a defined way to hide or remove reported material while reviewing it.

## 12. Shared social interactions

Only include interactions that have real product value and backend support.

### 12.1 Reactions, comments, saves, and sharing

For each interaction present in the current codebase, verify:
- Its meaning is clear.
- Its count is accurate and not fabricated.
- Its state persists across sessions.
- Repeated taps are idempotent or otherwise safely handled.
- The UI communicates pending, success, and failure states.
- It respects block, moderation, and deleted-content behavior.
- It has accessibility labels and adequate touch targets.
- It does not expose private information in a shared link.

Do not keep decorative action buttons that do nothing. Remove an interaction if it is redundant, unsupported, or outside MVP scope.

### 12.2 Notifications

Notifications are optional unless an existing core workflow depends on them. If present:
- Ask permission contextually, not at first launch without explanation.
- Provide in-app settings for available notification categories.
- Do not send duplicate notifications for one event.
- Avoid sensitive details in lock-screen text.
- Respect blocked users and muted/closed content.
- Deep links must open the intended content safely and handle deleted or inaccessible content.
- The product must remain usable if notification permission is denied.

### 12.3 Saved items

If bookmarks/saved posts exist:
- Save/unsave must persist.
- Saved items must have a discoverable destination.
- Deleted or removed items must render safely.
- Do not add bookmarks unless the full flow works.

## 13. User profiles and account controls

A profile is a lightweight campus identity, not a public dossier.

- Show only intentionally public fields.
- Never expose email, phone, roll number, private metadata, or auth-provider IDs by default.
- Let users edit allowed profile fields.
- Provide a clear list of the user's own opportunities, listings, and posts where useful.
- Support sign-out.
- Provide account deletion or a documented, accessible request path if immediate deletion is not technically available.
- Explain what deletion means for posts, reports, moderation records, and legally necessary retention.
- Prevent account deletion from leaving broken public content or orphaned ownership references.
- Let users review basic privacy/safety guidance.
- Provide links to terms, privacy policy, community rules, and support/contact only when those destinations are real and maintained. Do not ship dead links or fabricated policy text.

## 14. Blocking, reporting, moderation, and escalation

### 14.1 Report flow

Users must be able to report relevant content and, where supported, the user behind it.

- Provide a report action from post/listing/opportunity detail and relevant profile/contact surfaces.
- Offer a short, curated reason list: spam/scam, harassment/threat, impersonation, unsafe transaction, inappropriate content, unauthorized/copyrighted material, misleading listing, privacy exposure, other.
- Allow optional explanatory text with a reasonable length limit.
- Confirm that the report was submitted; do not imply that the reported content is automatically removed.
- Prevent accidental duplicate reports where practical.
- Avoid exposing the reporter to the reported user.
- Handle failed report submission with retry and preserve the report reason.
- Keep report metadata private.

### 14.2 Moderation queue

A functioning moderation queue is a launch requirement. It may be a small internal interface or a secure, documented operational process if the app has no admin panel, but it must not depend on a developer manually searching production tables without access controls.

Minimum queue data:
- Report ID and timestamp.
- Content type and target ID.
- Report reason and optional details.
- Report status: new, in review, actioned, dismissed, escalated.
- Assigned reviewer, if applicable.
- Internal notes and action history.
- Link to the content and relevant context.
- A restricted view of author identity only where required for review.
- Clear action options appropriate to reviewer permissions.

### 14.3 Human decision model

Automation may prioritize reports or flag suspicious patterns. It must not make irreversible or high-impact moderation decisions without human review unless an explicitly documented emergency policy authorizes temporary containment.

Moderation actions may include:
- No action / dismiss with reason.
- Remove or hide content.
- Lock replies or interaction, if supported.
- Warn the user.
- Temporarily restrict posting/contact.
- Suspend or ban an account where the authority and policy permit.
- Escalate credible threats, imminent danger, exploitation, or other serious incidents to the designated contact/appropriate authorities.

Actions must be permission-controlled and auditable. Avoid silent, untraceable database edits.

### 14.4 Safety escalation

Before launch, identify a real, monitored escalation contact and define:
- Who receives urgent reports.
- What qualifies as urgent.
- Expected response window during stated coverage hours.
- What happens outside coverage hours.
- How credible threats and immediate danger are handled.
- How moderation decisions and evidence are retained.
- How the team avoids promising emergency response if no one is monitoring the channel.

Do not display an invented hotline, fake SLA, or unmonitored contact address.

### 14.5 Block behavior

If blocking is supported:
- Make the action easy to find and reversible from settings where appropriate.
- Confirm the action and explain its effects.
- Prevent supported direct contact between the two accounts.
- Hide or de-emphasize each other's content according to a documented policy.
- Apply the rule server-side where applicable; client-only hiding is insufficient.
- Ensure blocked status does not leak private information.
- Audit interactions such as existing conversations, comments, mentions, and notifications.

### 14.6 Community rules

Publish concise, readable rules covering harassment, threats, discrimination, spam, impersonation, scams, privacy exposure, unsafe transactions, and unauthorized content. Rules must reflect what moderators can actually enforce.

## 15. Search, sorting, and filtering

Across all modules:
- Search should have a visible, accessible input and a clear action to clear the query.
- Debounce network requests where appropriate.
- Handle empty queries, no results, slow responses, errors, and stale results.
- Do not show old results as if they match a new query.
- Filters should be visible, understandable, combinable where useful, and easy to reset.
- Applied filters must match the results shown.
- Search terms must be handled safely and must not be interpolated into unsafe database queries.
- Sorting labels must describe actual backend behavior.
- If a feature is too small to justify search, do not ship a decorative search field that returns irrelevant results.

## 16. Design and interaction quality

### 16.1 Visual direction

The app should feel like a premium campus utility with social warmth: clear hierarchy, confident typography, restrained color, generous spacing, and quick, tactile interactions. It must not feel like a generic corporate dashboard, a copied template, or an overdecorated student hackathon prototype.

Use the separate UI specification as the detailed visual source of truth if present. The following are product-level requirements:

- Use one coherent design token system for light and dark themes.
- Prefer opaque semantic surfaces and stable cross-platform rendering.
- Do not use glassmorphism, `BlurView`, backdrop blur, or transparency-based glass panels. Android rendering inconsistency is an explicit reason for this prohibition.
- Use gradients selectively for onboarding or a small hero surface, not as a background for every card or navigation element.
- Use consistent spacing, radii, typography, icon sizing, and interaction states.
- Use the project's existing icon library consistently. Avoid mixing emoji with interface icons.
- Avoid gratuitous shadows, glows, borders, and animated decoration.
- Make content—not decoration—the visual focus.
- Cards should have a reason to exist; do not wrap every text block in a card.
- Social posts should feel native to a campus community, not like enterprise CRM records.
- Make important actions visually clear and secondary actions quiet.
- All states must be designed: loading, skeleton/placeholder, empty, error, disabled, pressed, success, restricted, offline, and stale content as relevant.
- No clipped tags, overlapping text, off-screen buttons, or inaccessible controls at small screen widths.
- Support Android system font scaling without critical content becoming unusable.

### 16.2 Motion and tactile feedback

- Use short, purposeful transitions only where they clarify a state change.
- Avoid large spring animations, repeated bounces, and motion that slows common tasks.
- Respect reduced-motion preferences where available.
- Haptics are optional and should be subtle; the app must work if unavailable.
- Press feedback must not make a button appear to change state before an action actually succeeds.

### 16.3 Responsive layout

- Test narrow and large Android screens, keyboard-open forms, system bars, notches/cutouts, and larger font scales.
- Wrap tag rows and action groups rather than forcing fixed-width layouts.
- Avoid fixed heights for text containers unless content is guaranteed to fit.
- Use safe-area handling consistently.
- Scrolling forms must keep focused fields and primary actions reachable when the keyboard is open.
- Do not hide errors behind the keyboard.
- Avoid nested scroll views unless the interaction requires them and is tested.

## 17. Accessibility

Accessibility is part of implementation, not a post-launch enhancement.

- All interactive controls have meaningful accessible names and roles.
- Icon-only controls have labels.
- Touch targets should be at least 44–48 dp where practical.
- Text and controls meet WCAG AA contrast targets where applicable.
- Do not communicate state through color alone.
- Support Android font scaling and screen readers.
- Use logical reading/focus order.
- Ensure modal/dialog focus and dismissal behavior is predictable.
- Provide labels and errors for form inputs.
- Status messages such as upload complete or report submitted should be announced appropriately.
- Avoid unnecessary flashing or motion.
- Test at increased font scale and with a screen reader for critical flows.

## 18. Data model and API contract principles

The implementation agent must inspect the actual schema and backend before changing data structures. This PRD does not prescribe a database vendor.

Minimum principles:
- Every user-owned record has a stable identifier, owner relationship, and server-managed timestamps.
- Ownership and permissions are checked server-side.
- Public response DTOs are intentionally shaped; do not serialize internal database rows wholesale.
- Anonymous posts use separate public and internal representations.
- Status values are finite, documented, and validated.
- Deletion behavior and retention are explicit.
- Report records cannot be modified by the reporting user after submission except through a defined correction process.
- List endpoints paginate and have stable ordering.
- Search/filter parameters are validated and bounded.
- Mutating requests handle retries/idempotency where practical.
- Server errors do not expose stack traces, secrets, database structure, or internal IDs unnecessarily.
- Client models handle missing optional fields and forward-compatible additions.
- Database constraints/indexes support real query patterns.
- No fake success response when persistence failed.
- No client-side-only authorization.
- Avoid a schema rewrite unless the audit shows a concrete need.

Before changing a schema, record the reason, migration/backfill approach, rollback risk, and compatibility impact in `DECISIONS.md`.

## 19. Reliability and error handling

Every network-dependent action must have:
- A pending state that prevents accidental duplicate actions.
- A success state that reflects confirmed server/provider success.
- An error state with plain-language explanation and a next step.
- Retry behavior for recoverable failures.
- Protection against stale or out-of-order responses overwriting newer state.
- Safe behavior when the app is backgrounded or reopened mid-flow.

The app must handle:
- No network.
- Intermittent/slow network.
- Server/provider outage.
- Authentication expiry.
- Rate limits.
- Invalid or missing data.
- Empty result sets.
- Deleted or moderated content.
- Permission denial.
- Upload failure, if uploads exist.
- Repeated taps and navigation during requests.
- Partial success where one operation succeeds and a dependent operation fails.

Do not expose raw exception text to end users. Keep developer diagnostics useful but scrub secrets and personal data.

## 20. Privacy and data minimization

- Collect only information needed for the product's stated jobs.
- Make public vs private fields explicit.
- Do not expose student email addresses by default.
- Do not collect live location in the MVP.
- Do not place sensitive data in analytics, crash logs, push notifications, or URLs.
- Limit access to moderation identity data and maintain audit trails for sensitive actions.
- Document retention and deletion behavior.
- Use appropriate transport security and backend access rules.
- Provide an understandable privacy policy before public launch; do not invent legal claims.
- Never claim that the app is officially endorsed by KIIT unless that authorization exists.
- Verification proves control of a KIIT email account at verification time; it does not prove identity, good intent, skill, item quality, or safety.

## 21. Performance and resource use

- Avoid loading every record into memory.
- Use pagination/infinite scrolling with stable ordering for growing lists.
- Optimize images and avoid fetching full-resolution images for feed thumbnails.
- Prevent repeated network requests caused by re-renders or duplicate listeners.
- Cache only what is useful and ensure private data is cleared or invalidated appropriately on sign-out.
- Avoid expensive animations on scrolling lists.
- Provide a clear loading state without blocking the entire app for unrelated data.
- Handle low-memory conditions gracefully.
- Do not add a new library without a clear need and compatibility review.

## 22. Analytics and product measurement

Analytics are optional and must not delay core functionality. If used:
- Define events around meaningful actions, such as verification completed, opportunity created, contact initiated, listing marked sold, forum post created, and report submitted.
- Avoid collecting post bodies, emails, phone numbers, private message contents, or anonymous-author identity in general analytics.
- Do not use tracking to infer sensitive personal traits.
- Document consent and retention as appropriate.
- Do not fabricate metrics or display counters unsupported by the backend.

## 23. Operational readiness and launch

Before launch:
- Seed a small set of real, permissioned, useful posts/listings/opportunities with the contributors' consent.
- Ensure seeded content is clearly genuine and can be updated or removed by its owner/maintainer.
- Recruit the initial group, including survey respondents and other students, and provide a simple onboarding guide.
- Verify authentication delivery and account recovery paths.
- Establish the moderation queue and real escalation contact.
- Test the report-to-resolution path end-to-end.
- Test backend access rules with at least two different accounts and unauthorized requests.
- Check that production configuration contains no development bypass that is accessible to ordinary users.
- Ensure logs do not expose tokens or anonymous identity.
- Provide support and privacy/community-policy destinations that actually work.
- Have a rollback plan for a bad release or migration.
- Keep a known-issues list and a way for users to report bugs.

## 24. Acceptance criteria by module

### Authentication
- A valid `@kiit.ac.in` account can complete verification and access protected routes.
- An unverified or non-permitted account cannot access protected data by navigating directly or calling the API.
- Expired, invalid, reused, or rate-limited verification attempts produce clear errors.
- Returning users are restored to a valid session where supported.
- Sign-out clears authenticated UI and sensitive cached state.
- No auth secrets appear in logs or public API payloads.

### Teammate Matcher
- A user can browse, search, and filter open opportunities.
- A user can create an opportunity with validated required fields.
- Owner edits and status changes persist.
- Closed opportunities do not appear as open.
- Unauthorized users cannot edit or delete another user's opportunity.
- Contact/interest actions, if present, have real persistence and error states.
- Report/block controls are available and functional.

### Marketplace
- A user can browse and filter available listings.
- A user can create, edit, close, reopen where valid, and delete their own listing.
- Listing status is persisted and reflected in discovery and detail screens.
- Landmark tags are clear and do not require live GPS.
- No in-app payment processing exists.
- No UI implies platform guarantees for payments, item quality, or seller trust.
- Uploads, if present, validate files and handle failure safely.

### Forum
- A user can create, edit, and delete their own post according to policy.
- Category/tag filters return correct results.
- Anonymous posts hide identity from ordinary public responses and retain an internal author relationship.
- No identity-bearing field leaks through API payloads, public links, analytics, or notifications.
- Reporting and moderation work end-to-end.
- Removed/deleted posts do not leave broken or misleading UI.

### Shared quality
- Every visible control has a working action or is removed.
- All major screens have loading, empty, error, and success states as applicable.
- Core forms preserve data after recoverable failures.
- Navigation/back behavior is consistent.
- Critical flows work with keyboard open and larger font size.
- No critical type/lint/build errors are introduced.
- Android behavior is verified on an actual device or emulator; iOS portability is considered but iOS launch is not required.

## 25. MVP success criteria

The initial operational targets are:
- The seed group—survey respondents plus recruits—is onboarded within the first week of launch.
- Real, useful posts are being created within 48 hours of launch.
- The moderation queue is functioning and the real escalation contact is in place before launch.

Also measure, where the data can be collected responsibly:
- Verification completion and failure rate.
- Time to first useful action.
- Number of active opportunities and proportion that remain open/accurate.
- Marketplace listing contact rate and self-reported handoff completion, if collected without intrusive tracking.
- Forum posts by useful category.
- Reports acknowledged and resolved within the team's actual coverage.
- User-reported trust, usability, and perceived usefulness.

Do not optimize for daily active users or screen time in isolation. Avoid presenting a small sample as statistically conclusive.

## 26. Open questions and decision policy

The implementation agent must not silently guess at high-impact product choices. Add unresolved decisions to `HUMAN_INPUT_REQUIRED.md` and record the current recommendation plus evidence in `DECISIONS.md`.

Likely decisions to verify include:
- Exact authentication provider and email verification mechanism.
- Public profile fields and display-name rules.
- The precise seriousness and weekly bandwidth choices.
- Whether contact is an in-app request, existing messaging integration, or a simpler contact flow.
- Whether image uploads are already supported and what storage/security model is used.
- Which marketplace categories and landmarks are approved.
- Whether forum comments/reactions/bookmarks are truly in MVP scope.
- Moderation operators, escalation contact, coverage hours, and retention policy.
- Terms/privacy/community rules and any institutional authorization.
- Account deletion semantics and required retention.
- Notification requirements and whether they are necessary for MVP.

For each unresolved question, distinguish:
1. **Blocking:** cannot responsibly ship without an answer.
2. **Safe default:** can proceed with a conservative reversible choice.
3. **Later:** can be deferred without compromising the MVP.

Do not ask the user to decide implementation details that can be resolved by repository inspection, tests, standards, or a reversible engineering choice.

## 27. Change-control rules

- This PRD is the product-level source of truth, but it does not override legal obligations or actual backend constraints.
- `DECISIONS.md` records consequential choices, rationale, alternatives, and date.
- `HUMAN_INPUT_REQUIRED.md` records only questions that genuinely need a human or external organization.
- The implementation agent must preserve existing working behavior unless it is redundant, unsafe, broken, or in conflict with an approved product requirement.
- Remove dead, duplicate, misleading, or out-of-scope features rather than leaving decorative controls.
- Avoid speculative architecture and unnecessary dependencies.
- Do not delete data, perform destructive migrations, change production credentials, publish releases, or contact external people without explicit authorization.
- Make changes in small, reviewable steps and run relevant checks after each meaningful phase.
- Document known gaps honestly; never mark a feature complete solely because the screen looks finished.

## 28. Definition of done

KIIT Node's MVP is done when:
- The core user jobs are supported end-to-end, not just visually.
- Authentication and access control are enforced by the backend.
- Teammate Matcher, Marketplace, and Forum have coherent lifecycle and error states.
- Anonymous posting has a tested public/internal identity boundary.
- Reports reach a functioning human moderation process.
- A real escalation contact and response procedure exist.
- All visible controls work or have been removed.
- The interface is coherent, accessible, and stable on Android.
- No glassmorphism or blur-dependent UI remains.
- Documentation reflects the actual implementation, including `PRD.md`, `DECISIONS.md`, and `HUMAN_INPUT_REQUIRED.md`.
- Automated checks and manual smoke tests are recorded.
- Any remaining non-blocking gaps are explicit, owned, and not disguised as completed functionality.
