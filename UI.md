# KIIT Node — UI/UX Design System and Interaction Specification

**Status:** Implementation specification  
**Platform priority:** Android-first, React Native / Expo if confirmed by the repository  
**Design intent:** Premium, warm, student-native, dependable, content-led  
**Hard constraint:** No glassmorphism, no `BlurView`, no backdrop blur, and no blur-dependent or transparency-dependent layout.

This document defines how KIIT Node should look and behave. It is not permission to rewrite working architecture or invent product features. First inspect the actual repository and map these guidelines onto the existing framework, navigation, theme, icon set, and reusable components. If a detail conflicts with a platform limitation or the actual stack, prefer a deterministic implementation and record a material decision in `DECISIONS.md`.

---

## 1. Product feeling

KIIT Node is a practical network for students who need teammates, campus goods, academic resources, events, and lost-item help. It should feel like a thoughtfully designed student product—not a corporate analytics dashboard, a generic admin template, a crypto app, or a hastily assembled social-media clone.

The desired impression:

- **Warm and approachable:** comfortable backgrounds, human-scale typography, restrained color, clear language.
- **Credible:** verified identity cues, consistent information hierarchy, honest status and error feedback.
- **Fast and low-friction:** predictable navigation, readable cards, compact but comfortable forms, no unnecessary confirmation steps.
- **Student-native:** useful context and conversational copy without forced slang, gamification, or childish decoration.
- **Polished through restraint:** precise spacing, well-aligned baselines, stable surfaces, good empty states, carefully selected icons, and consistent interactions.

“Premium” is not achieved by adding shadows, gradients, animated transitions, glowing accents, glass effects, or ornamental cards to every screen. It comes from correctness, clarity, visual rhythm, responsiveness, and details that hold up during real use.

## 2. Design principles and hard exclusions

### Required

1. Content and user tasks take visual priority over decoration.
2. Use semantic design tokens rather than scattered hard-coded colors.
3. Use solid or near-solid surfaces with reliable contrast on Android and iOS.
4. Use one established icon library already present in the repository, where possible.
5. Prefer simple, native-feeling interactions over custom animation systems.
6. Make loading, empty, error, disabled, success, and permission states intentional.
7. Keep layout behavior predictable with keyboard open, large text, narrow widths, and long content.
8. Respect the app’s existing navigation and safe-area conventions.
9. Reuse components when their behavior and visual role are genuinely shared.
10. Ensure the interface does not imply trust, payment protection, institutional endorsement, or safety guarantees that the product cannot provide.

### Prohibited unless the product owner explicitly changes this specification

- Glassmorphism or frosted-glass UI.
- `BlurView`, backdrop blur, blur filters, or reliance on blur APIs.
- Transparent navigation bars that depend on content visibly showing through them.
- Semi-transparent white overlays used to imitate glass cards.
- Large, soft shadows on every card or button.
- Neon/glowing borders, heavy gradients, gradient text, or gradient-filled content cards.
- Decorative blobs, random floating shapes, gratuitous motion, parallax, or animated backgrounds.
- Emoji used as the primary icon system for navigation or core actions.
- Excessive pills where a plain label or text action is clearer.
- Every item enclosed in a separate card; use whitespace and dividers where appropriate.
- Default-template aesthetics such as undifferentiated grey-on-grey panels, arbitrary rounded rectangles, or an all-black-and-white interface without meaningful accent color.
- New UI/animation libraries without a concrete gap, compatibility review, and documented reason.

Gradients are allowed only in restrained, limited contexts such as login/onboarding backgrounds or a specific hero treatment. They must not carry essential information, and the screen must remain attractive if gradient rendering differs slightly by device.

## 3. Color system

Treat these values as the initial reference palette. Inspect the current app and existing brand assets before consolidating tokens. If the repository already has a coherent accessible palette, preserve it where it better fits the product; document any intentional deviation. Do not maintain competing token systems.

### Light theme

| Semantic token | Reference value | Usage |
|---|---|---|
| `background` | `#F8F9FA` | Main screen background; soft off-white, not stark white |
| `surface` / `card` | `#FFFFFF` | Cards, sheets, form surfaces |
| `surfacePressed` | `#F1F3F5` | Pressed/selected neutral surface |
| `textPrimary` | `#111827` | Main text and high-priority labels |
| `textSecondary` | `#6B7280` | Metadata, descriptions, supporting labels |
| `textTertiary` | `#9CA3AF` | Low-priority hints only; never critical instructions |
| `separator` | `rgba(0,0,0,0.06)` | Hairline dividers and subtle outlines |
| `border` | `#E5E7EB` | Input outlines and boundaries that need clearer definition |
| `accent` | `#10B981` | Primary action, selected navigation, positive emphasis |
| `accentPressed` | `#059669` | Pressed primary action |
| `accentSoft` | `#D1FAE5` | Subtle selected/positive background where contrast is verified |
| `success` | `#047857` | Success text/icon where stronger contrast is needed |
| `warning` | `#B45309` | Warning text/icon |
| `danger` | `#DC2626` | Destructive action and error state |
| `info` | `#2563EB` | Informational state where needed |

### Dark theme

| Semantic token | Reference value | Usage |
|---|---|---|
| `background` | `#0E1116` | Main screen background |
| `surface` / `card` | `#161B22` | Cards, sheets, form surfaces |
| `surfacePressed` | `#21262D` | Pressed/selected neutral surface |
| `textPrimary` | `#F9FAFB` | Main text |
| `textSecondary` | `#9CA3AF` | Metadata and supporting text |
| `textTertiary` | `#6B7280` | Low-priority hints only |
| `separator` | `rgba(255,255,255,0.08)` | Hairline dividers |
| `border` | `#30363D` | Input outlines and meaningful boundaries |
| `accent` | `#10B981` | Primary accent; validate foreground contrast per use |
| `accentPressed` | `#34D399` | Pressed state where appropriate |
| `accentSoft` | `#064E3B` | Subtle selected/positive background |
| `success` | `#34D399` | Success text/icon |
| `warning` | `#FBBF24` | Warning text/icon |
| `danger` | `#F87171` | Error/destructive text/icon |
| `info` | `#60A5FA` | Informational state |

### Color rules

- Use semantic token names in components. Avoid adding local one-off colors unless there is a real semantic need.
- Green is the brand/action accent, not a background for every surface.
- Use status colors only when the status meaning is clear. Do not communicate status by color alone; include text or an icon.
- Keep primary text readable on all surfaces. Verify contrast instead of assuming a palette is accessible.
- Do not use tertiary text for essential instructions, prices, timestamps that matter, or form labels.
- Avoid hard-coded light-theme colors inside components that also render in dark mode.
- If dark mode is not supported by the current app, do not claim it is. Implement it only if the existing theme architecture supports it without destabilizing core functionality; otherwise document the gap and keep tokens structured for future support.

## 4. Typography

Use the system font by default unless the repository already includes a deliberate, licensed font family with good platform coverage. Typography should feel confident and readable, not oversized for decoration.

Reference scale:

| Role | Reference size | Weight | Notes |
|---|---:|---|---|
| Screen title | 28–34 pt | Bold / 700 | Use 34 pt mainly for authentication/hero contexts; most app screens should be closer to 28–30 |
| Section heading | 20–22 pt | Semibold / 600 | Clear hierarchy without shouting |
| Card/list title | 16–18 pt | Semibold / 600 | Use 17 pt for prominent content titles when it fits |
| Body | 15–16 pt | Regular / 400 | Default reading size |
| Supporting body | 14 pt | Regular / 400 | Secondary information, not long-form default text |
| Metadata | 12–13 pt | Regular / 400–500 | Dates, category, compact supporting labels |
| Button label | 15–16 pt | Semibold / 600 | Clear action wording |
| Small legal/help text | 12–13 pt | Regular / 400 | Must remain readable and must not contain the only explanation of a critical rule |

- Suggested body line height: 22–24 pt at 15–16 pt font size.
- Use sentence case. Avoid all-caps labels except very short, established metadata patterns.
- Avoid long runs of bold text. Bold should communicate hierarchy, not decorate paragraphs.
- Do not truncate a title or essential state if wrapping is reasonable.
- Support system font scaling. Do not force fixed heights on text-containing elements if that causes clipping.
- Use consistent number, date, and time formatting throughout the app.

## 5. Spacing, shape, borders, and elevation

Use a consistent spacing scale based on 4-point increments. A practical reference scale is 4, 8, 12, 16, 20, 24, 32, and 40 points.

- Screen horizontal padding: typically 16–20 pt, adjusted for device width and existing safe-area structure.
- Gap between related controls: 8–12 pt.
- Gap between distinct sections: 24–32 pt.
- Card internal padding: typically 16 pt; 12 pt is acceptable for compact list rows.
- Standard interactive control height: approximately 48–52 pt where appropriate; never below the platform’s practical minimum touch target.
- Minimum practical hit target: 44 × 44 pt, with platform-appropriate behavior.
- Standard card radius: 14–18 pt. Use a smaller consistent radius for inputs/chips and a larger radius only for major surfaces.
- Input radius: typically 10–12 pt.
- Pill radius: fully rounded only for compact tags, filters, or deliberately pill-shaped buttons.
- Prefer hairline borders and tonal contrast to shadows.
- Use elevation sparingly for elements that must clearly float above content, such as a modal sheet or anchored menu. Avoid shadowing every card.
- Avoid nested cards (a card inside a card inside another card) unless the information hierarchy truly needs them.
- Use dividers for dense lists where a full card per row would create visual noise.

## 6. Layout and responsive behavior

- Design for real Android devices first, while retaining compatibility with iOS if the app supports it.
- Respect safe areas and existing navigation layout. Do not add duplicate top/bottom insets.
- Do not rely on fixed screen dimensions. Use flex layouts, wrapping, and content-driven heights.
- Test long titles, long usernames, missing avatars, unusually long tags, large prices, and multi-line descriptions.
- Tags and action groups must wrap or reflow on narrow screens rather than clip or force horizontal overflow. Use horizontal scrolling only where it is an intentional interaction, such as a compact filter row.
- Ensure the keyboard does not cover the active input, submit action, or validation message. Preserve scroll position when practical.
- A screen should remain usable at larger font sizes. Avoid hard-coded row heights when text can wrap.
- Empty space should create hierarchy, not leave essential actions below the fold without reason.
- Do not introduce horizontal scrolling for the whole screen.
- Use skeletons only when they meaningfully reduce perceived waiting; otherwise use a clear loading indicator and stable layout.

## 7. Navigation, headers, and tab bars

- Navigation must be opaque or use a solid semantic surface. No blur, glass, or content-show-through effect.
- Use the existing navigation library and route model unless the audit identifies a concrete defect.
- Keep header height, title alignment, back behavior, and action placement consistent across sibling screens.
- Use the established icon set for navigation icons. Icons should have consistent stroke weight, size, and optical alignment.
- Bottom navigation should make the active destination obvious without a large decorative capsule or excessive animation.
- Keep labels visible when needed to prevent ambiguity. Do not use unfamiliar icons without labels for important destinations.
- Ensure the content scrolls behind neither an opaque header nor an opaque bottom bar in a way that hides content; use the existing inset/padding mechanism correctly.
- Preserve native back behavior and Android system back handling.
- Do not add tabs for future features that are not functional and in scope.

## 8. Buttons and interactive states

### Primary button

- One clearly dominant action per screen or form section.
- Use the accent color with verified foreground contrast.
- Reference height: 50 pt, with comfortable horizontal padding.
- Use concise verb-first labels: “Continue with KIIT Mail”, “Post listing”, “Send request”, “Publish post”.
- Provide distinct default, pressed, disabled, loading, and (where relevant) success/error states.
- Press feedback must be subtle. If scaling is used, keep it slight (roughly 0.98) and ensure it does not affect layout or cause jitter.
- Haptics are optional and must be subtle, supported by the installed library, and never required for feedback. Do not add a new dependency just for a trivial haptic.

### Secondary and destructive actions

- Secondary actions should not visually compete with the primary action.
- Use text or outline buttons when a filled button would create unnecessary emphasis.
- Destructive actions must be clearly named and separated from routine actions. Confirm irreversible or high-impact actions with a clear explanation.
- Do not style every action as a pill.
- Icon-only buttons need an accessible label and a sufficiently large hit target.

### Interaction feedback

- Every tap target must do what its label/icon promises.
- Disable duplicate submission while a request is pending where duplicate requests would be harmful.
- Loading feedback must not falsely imply success.
- Errors should explain what happened and what the user can do next. Preserve user-entered form values after recoverable failures.
- Success feedback should be proportional and should not block the next sensible action.
- Do not use alerts for every minor event. Use inline field errors, unobtrusive feedback, or native dialogs according to severity.

## 9. Forms and validation

- Put a persistent label above or clearly associated with each input. Placeholder text is not a label.
- Mark required fields clearly and explain meaningful constraints before submission where practical.
- Validate fields locally for immediate feedback and validate again on the server. Client validation is not a security boundary.
- Place error messages next to the field they describe and ensure they are accessible to assistive technology.
- Do not clear the entire form after a server/network failure.
- Use input types, keyboard types, autocomplete, and text capitalization appropriate to the field.
- Avoid asking for information the app does not use.
- For filters, show the active state, provide an obvious way to clear filters, and avoid silently retaining stale filters that produce an empty result.
- Before leaving a screen with meaningful unsaved input, either preserve the draft or warn the user where appropriate.
- Do not overvalidate fields in ways that reject reasonable student-entered names, descriptions, or team interests.

## 10. Screen-state requirements

Every data-driven screen must be deliberately designed for the applicable states below. Do not treat a spinner as the only non-success state.

1. **Initial loading:** stable layout, clear progress indication, no fabricated content.
2. **Populated:** correct hierarchy, clear primary action, realistic long-content handling.
3. **Empty:** explain why the area is empty and provide the next useful action where possible.
4. **Filtered empty:** explain that filters may be hiding results and offer a clear/reset action.
5. **Recoverable error:** explain the failure, offer retry, preserve user input.
6. **Offline/poor connection:** communicate when an action has not reached the server; do not imply offline persistence unless it exists.
7. **Permission denied:** explain the consequence and offer a settings path only when relevant.
8. **Authentication expired:** preserve the intended destination where safe and return the user through a coherent sign-in flow.
9. **Submitting:** prevent harmful duplicate submissions and show truthful progress.
10. **Success:** reflect the persisted result and offer a sensible next step.
11. **Disabled/unavailable:** explain why a control is disabled when the reason is not self-evident.
12. **Deleted/removed content:** show an appropriate fallback if the user returns to a stale link or screen.

## 11. Identity, trust, and safety cues

- Show verification status only when it is backed by the actual authentication/backend state.
- Do not display a decorative “verified” badge for users whose email has not been verified by the system.
- Anonymous posting means anonymous to other students, not anonymous to the system. Never expose the real author link in an anonymous post’s client/API response. The backend must retain accountable authorship as specified by the PRD and `DECISIONS.md`.
- Anonymous mode must be explicit at composition time and visually confirm the selected mode before publication.
- Explain what other students can see. Do not bury important privacy implications in tiny text.
- Report and block actions should be accessible from relevant user-generated content without being visually aggressive.
- Never imply that reporting guarantees an immediate response. The operational process must match the actual moderation setup.
- Marketplace screens must not imply payment escrow, delivery protection, seller vetting, or guaranteed safety. Clearly communicate direct student-to-student arrangements where appropriate.
- Do not reveal a student’s email address or private contact details by default unless the product’s documented behavior explicitly requires it and the user has consented.

## 12. Product-specific visual patterns

### 12.1 Authentication and onboarding

- Use a calm, uncluttered layout with the KIIT Node name, a concise explanation, and a clearly dominant sign-in action.
- A subtle three-stop background gradient is permitted if supported by the installed framework; reference light stops: `#F8F9FA`, `#E8F5E9`, `#F8F9FA`; dark stops: `#0E1116`, `#064E3B`, `#0E1116`.
- The sign-in form or action surface must remain a solid semantic surface, not a translucent glass card.
- The primary action may read “Continue with KIIT Mail” if this accurately describes the actual flow.
- Explain the `@kiit.ac.in` restriction clearly. Never promise that a domain string alone proves ownership; follow the actual verification flow.
- Show meaningful progress, invalid-domain feedback, expired-link recovery, resend limits, and network-error recovery according to the actual authentication provider.
- Developer/test bypasses must never be available in production builds. If a dev-only bypass exists, clearly isolate and guard it using the project’s actual build/environment mechanism.
- Avoid long marketing copy, decorative illustrations that delay the action, or unsupported institutional endorsement claims.

### 12.2 Teammate Matcher

The primary job is to help a student find compatible collaborators—not to make the app feel like a dating app or a competitive ranking platform.

- Make skill/stack tags easy to scan and compare.
- Present seriousness/commitment and weekly bandwidth in plain language with short explanations. Avoid judgmental labels such as “good” or “lazy”.
- Give each profile a strong hierarchy: identity/name, concise project or collaboration intent, skills, commitment expectations, bandwidth, and the next action.
- The contact/request action must match the real implemented flow. Do not show “Message” if no messaging system exists.
- Filters should be understandable, composable, resettable, and reflected in results.
- Provide a useful first-run empty state that explains how to create or complete a profile.
- Avoid fake match scores, unsupported compatibility percentages, or unexplained algorithmic rankings.
- Do not expose private email/contact details without a documented reason and consent.

### 12.3 Marketplace

The primary job is to discover relevant campus buy/sell/rent posts and arrange a direct handoff.

- Make item title, price/price expectation, condition, category, availability, and handoff landmark scannable when those fields exist in the actual data model.
- Use consistent image sizing and a graceful fallback for missing/broken images. Do not let images determine arbitrary row heights.
- Clearly distinguish free, fixed-price, negotiable, and rental terms if supported by the data model; do not invent semantics for absent fields.
- Rentals are a category/type, not a stateful rental-management system unless explicitly specified elsewhere.
- Use curated campus landmark tags only when the names are confirmed. Free-text landmark support should be length-limited and sanitized if the product allows it.
- Do not create a payment gateway or imply that KIIT Node processes UPI payments. UPI is arranged directly between students, outside the app.
- Explain listing states such as active, reserved, sold, or removed only if those states are supported by real persisted behavior.
- Make edit, mark-unavailable, delete, report, and contact actions clear and permission-aware.

### 12.4 Forum

The primary job is to share or find useful campus-relevant information.

- Prioritize readable titles and body text over metadata and reaction counts.
- Use a consistent category/tag system for notes/exam prep, society events, Lost & Found, and other approved campus-relevant topics.
- Anonymous mode must be unmistakable to the author before publication and must not leak identity to other students.
- Make post author identity, timestamp, category, title/body, attachments, and available actions easy to parse without stacking unnecessary cards.
- Long posts must be readable and must not be clipped behind fixed-height containers.
- Provide useful empty, loading, error, and filtered-empty states.
- Report/block affordances should be discoverable but not dominate the post.
- Do not add likes, follower counts, public reputation, trending scores, or gamified badges unless the PRD explicitly includes them and the functionality is real.

### 12.5 K-Directory

- Treat entries as team-curated content; do not add open submission.
- Present the entry’s useful information first, with clear contact or external links only where verified and intended for public display.
- Do not fabricate listings, organizations, contacts, or official status.
- Handle missing details gracefully without displaying empty labels or broken layout gaps.

### 12.6 Profile, settings, and account lifecycle

- Keep account status, verification state, editable profile fields, privacy controls, blocked users, and sign-out/deletion options logically grouped.
- Make destructive actions explicit and explain the consequences.
- Do not claim account deletion or content deletion is complete unless the backend confirms it and the documented retention behavior is accurate.
- Avoid collecting profile fields that have no clear product purpose.

### 12.7 Moderation and reports

- Keep moderation tools separate from normal user flows and restrict access through server-side authorization.
- Show the information needed to make a decision without exposing unnecessary private information.
- Use clear report status and resolution states only if backed by persisted workflow.
- Automation may triage or prioritize; it must not silently make high-impact final moderation decisions.
- If no actual moderation owner or escalation process exists, do not fabricate one. Record the required human action in `HUMAN_INPUT_REQUIRED.md`.

## 13. Cards, feeds, metadata, and tags

- Do not use the same card treatment for every kind of content. Use a feed row, listing card, profile card, or settings row according to the content and task.
- Feed item hierarchy should normally be: author/context → title → body/summary → tags/metadata → actions.
- A compact post header may include avatar, name, timestamp, and overflow menu. Do not cram all metadata into one tiny line.
- Use intrinsic-width tags/chips with sensible horizontal/vertical padding. Long tags must wrap, truncate with a deliberate policy, or scroll within a clearly bounded tag row; they must not clip unpredictably.
- Distinguish interactive filter chips from informational tags visually and behaviorally.
- Use consistent separators and alignment across repeated items.
- Avoid placing prominent “Message” and “Details” buttons on every item if a single tap on the card already opens details. Avoid duplicate affordances that perform the same action.
- Show counts only when they are real and useful. Do not add fake engagement indicators to make feeds look busy.
- For user-generated text, respect line breaks where appropriate and handle URLs safely.

## 14. Icons and imagery

- Reuse the icon library already installed and standardize stroke weight, visual size, and alignment.
- Do not use Unicode emoji as replacements for core navigation, edit, delete, report, search, or account icons.
- Pair unfamiliar or high-impact icons with text labels.
- Use avatars with a deterministic fallback (initials or a neutral shape) when no image is available.
- Handle broken image URLs and upload failures with a useful fallback and retry behavior.
- Crop images consistently without distorting them. Respect device memory and image dimensions.
- Do not add stock images merely to fill whitespace.
- Provide meaningful accessibility labels for non-decorative images; hide purely decorative assets from screen readers.

## 15. Motion and haptics

- Motion is optional and subordinate to task completion.
- Prefer native transitions already provided by the navigation system.
- Use short, subtle press feedback; avoid repeated spring effects that make lists feel bouncy or slow.
- Do not animate layout properties in ways that cause visible reflow or touch-target movement.
- Respect reduced-motion preferences where supported by the stack.
- Haptics may be used for a small number of meaningful interactions, but must not be the only signal that something happened.
- No animated gradient backgrounds, floating glass panels, decorative particle effects, or animation libraries added just for polish.

## 16. Accessibility and inclusive behavior

- Every interactive control must have a meaningful accessible name, role, and state.
- Use practical touch targets of at least 44 × 44 pt where feasible; smaller visual icons can sit inside larger hit areas.
- Do not convey errors, selection, verification, or status through color alone.
- Maintain readable contrast for text, controls, and focus/selected states.
- Support large text without clipping buttons, cards, labels, or tab navigation.
- Ensure screen-reader reading order matches the visual and task order.
- Inputs must expose labels, required state, errors, and help text to assistive technologies.
- Dialogs and sheets must have clear titles, dismissal behavior, and focus/reading order.
- Ensure keyboard users can reach and operate relevant controls if the platform/input mode supports it.
- Avoid flashing, unnecessarily moving elements, and time-limited messages that disappear before they can be read.

## 17. Trustworthy content and copy

- Use concise, specific, human wording. Avoid corporate filler and AI-sounding marketing claims.
- Prefer action labels that state what happens next.
- Avoid vague errors such as “Something went wrong” when the app can explain a safe next step.
- Never claim an action is saved, sent, verified, deleted, reported, or published before the backend confirms success.
- Explain limitations at the moment they matter: direct UPI arrangements, anonymous-to-peers behavior, curated directory, or unsupported contact actions.
- Avoid overpromising privacy, moderation response times, institutional affiliation, user authenticity, or marketplace safety.
- Keep empty-state copy useful and specific, not cute or overly promotional.

## 18. Component and token architecture

- Inspect the current stack before deciding where tokens and components live.
- Establish a single semantic theme source where practical. Avoid duplicate light/dark definitions scattered across screens.
- Use semantic names such as `background`, `surface`, `surfacePressed`, `textPrimary`, `textSecondary`, `separator`, `border`, `accent`, `danger`, and `success` rather than names tied to a single screen.
- Shared components should encapsulate real repeated behavior and visual meaning; do not create abstractions used only once unless they materially improve clarity.
- Keep components small enough to understand and test, but avoid fragmentation into dozens of trivial wrappers.
- Respect the existing project’s naming conventions, folder structure, and formatting.
- Avoid broad refactors that obscure the behavioral change or increase regression risk.
- Add or modify dependencies only when needed, supported by the installed platform versions, and documented.

## 19. Cross-platform stability rules

- Do not use blur as a surface primitive.
- Avoid depending on platform-specific alpha compositing, backdrop sampling, or complex shadows for the core visual hierarchy.
- Prefer opaque semantic backgrounds and hairline borders.
- Check font rendering, safe-area behavior, status bar contrast, keyboard behavior, modal layering, and bottom navigation on Android.
- If iOS is supported, check the same core flows there; do not claim parity without checking.
- Verify the actual installed Expo/React Native version before using APIs or props from newer documentation.
- Use platform-specific branches only for a demonstrated platform difference, not as a default styling strategy.

## 20. Required design audit and acceptance checklist

The implementation agent must evaluate and record the following rather than merely asserting compliance:

### Visual coherence
- [ ] One coherent semantic color/token system; no conflicting token sources.
- [ ] Consistent typography scale, spacing, radii, dividers, and icon style.
- [ ] No glassmorphism, BlurView, backdrop blur, or transparent bars that depend on content showing through.
- [ ] Gradients are limited and non-essential.
- [ ] Content hierarchy is obvious at a glance.
- [ ] No redundant cards, pills, duplicate actions, fake metrics, or ornamental UI.

### Behavior
- [ ] Every visible control has a verified action.
- [ ] Loading, empty, filtered-empty, error, disabled, submitting, and success states are handled where relevant.
- [ ] Forms preserve user input on recoverable failure.
- [ ] Duplicate submissions and stale results are handled where relevant.
- [ ] Navigation, back behavior, and safe areas remain correct.

### Responsive/accessibility
- [ ] Small-screen layout checked.
- [ ] Long titles, descriptions, tags, names, and prices checked.
- [ ] Keyboard and form scrolling checked.
- [ ] Larger text and screen-reader semantics checked as far as the environment permits.
- [ ] Contrast and touch targets checked.

### Trust and privacy
- [ ] Verification indicators reflect real backend state.
- [ ] Anonymous identity is not exposed to peers through API payloads or UI.
- [ ] Report/block controls and permissions match actual capabilities.
- [ ] Marketplace does not imply in-app payments or guarantees.
- [ ] No false institutional affiliation or fabricated community content.

### Verification and documentation
- [ ] `DECISIONS.md` records consequential choices and superseded decisions.
- [ ] `HUMAN_INPUT_REQUIRED.md` is updated based on discoveries and implementation, not left as a generic template.
- [ ] `UI_PERFECTION_SUMMARY.md` records defects, changed files, evidence, remaining issues, and next actions.
- [ ] Relevant tests, type checks, and build checks are run and their exact outcomes recorded.
- [ ] Android behavior is verified on a device/emulator when available; otherwise the limitation is explicit.

## 21. How to use this document

This document is the target visual and interaction system, not a mandate to replace working screens indiscriminately. The agent should:

1. Audit the existing UI against each applicable requirement.
2. Identify concrete defects and redundancies, prioritizing user-visible and trust/safety issues.
3. Preserve working behavior and architecture unless there is a clear reason to change it.
4. Implement shared tokens/components before applying isolated screen polish where that reduces inconsistency.
5. Test real flows, including failure states—not just screenshots of ideal states.
6. Update `DECISIONS.md`, `UI_PERFECTION_SUMMARY.md`, and `HUMAN_INPUT_REQUIRED.md` to match what the work actually established.
7. Distinguish what was verified from what was only reviewed or remains untested.

**The final visual standard:** warm background, reliable surface contrast, restrained emerald accent, strong typography, deliberate spacing, hairline separators, appropriate icons, responsive content, honest feedback, and stable platform behavior. Do not substitute blur, transparency, glow, or decoration for design quality.
