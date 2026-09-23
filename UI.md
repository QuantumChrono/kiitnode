# UI.md — KIIT Node Apple Human Interface Guidelines (HIG) Specification

## 1. Non-Negotiable Anti-AI Redlines
- **NO Generic Tailwind Palettes:** Never use `slate-900`, `gray-800`, `zinc-900`, or standard raw Tailwind hex codes. Use ONLY the semantic iOS tokens below.
- **NO Pure White Screen Backgrounds:** In light mode, the root screen background is ALWAYS `#F2F2F7`. Pure `#FFFFFF` is strictly reserved for elevated card surfaces.
- **NO Edge-to-Edge Separators:** Within grouped list cards, dividers MUST have a 16pt left margin (`marginLeft: 16`) so they align with label text and do not touch the left edge.
- **NO Thick Borders:** All borders on cards, glass docks, and dividers MUST use `borderWidth: StyleSheet.hairlineWidth`.
- **Continuous Corners (Squircles):** Every rounded container MUST declare `style={{ borderCurve: 'continuous' }}` alongside its `borderRadius`.
- **Targeted Glassmorphism:** Blurs (`expo-blur`) are ONLY used for the Floating Tab Bar Dock and Top Navigation Bar. Content cards must remain solid to preserve text legibility and contrast.

---

## 2. Apple iOS Semantic Color Palette

### Light Mode (Default)
| Token | Hex / RGBA | Role |
| :--- | :--- | :--- |
| `ios-bg` | `#F2F2F7` | Root screen grouped background |
| `ios-card` | `#FFFFFF` | Inset grouped card surface |
| `ios-card-pressed` | `#E5E5EA` | Pressed state for cards/rows |
| `ios-label` | `#000000` | Primary text (90% contrast) |
| `ios-secondary-label` | `rgba(60, 60, 67, 0.60)` | Secondary text, captions, metadata |
| `ios-tertiary-label` | `rgba(60, 60, 67, 0.30)` | Placeholders, inactive icons |
| `ios-separator` | `rgba(60, 60, 67, 0.18)` | Hairline row dividers |
| `ios-glass-border` | `rgba(0, 0, 0, 0.08)` | Specular edge for light glass |
| `ios-green` | `#34C759` | Verified badges, primary action buttons |
| `ios-green-tint` | `rgba(52, 199, 89, 0.12)` | Subtle pill badge background |
| `ios-blue` | `#007AFF` | Primary interactive links/toggles |

### Dark Mode (OLED Pure Black)
| Token | Hex / RGBA | Role |
| :--- | :--- | :--- |
| `ios-bg` | `#000000` | Pure OLED black root background |
| `ios-card` | `#1C1C1E` | Primary elevated card surface |
| `ios-card-pressed` | `#2C2C2E` | Pressed state for cards/rows |
| `ios-label` | `#FFFFFF` | Primary white text |
| `ios-secondary-label` | `rgba(235, 235, 245, 0.60)` | Subtitles, secondary metadata |
| `ios-tertiary-label` | `rgba(235, 235, 245, 0.30)` | Inactive icons, subtle text |
| `ios-separator` | `rgba(84, 84, 88, 0.55)` | Hairline row dividers |
| `ios-glass-border` | `rgba(255, 255, 255, 0.16)` | Specular highlight for dark glass |
| `ios-green` | `#30D158` | Dark mode system green |
| `ios-green-tint` | `rgba(48, 209, 88, 0.16)` | Subtle pill badge background |
| `ios-blue` | `#0A84FF` | Dark mode system blue |

---

## 3. Typography Scale (SF Pro Specifications)

All text elements must follow Apple's exact scale and tracking:
- **Large Title:** 34pt, Bold (`fontWeight: '700'`), Line Height: 41pt, Letter Spacing: `0.37`
- **Title 1:** 28pt, Bold (`fontWeight: '700'`), Line Height: 34pt, Letter Spacing: `0.36`
- **Title 2:** 22pt, Bold (`fontWeight: '700'`), Line Height: 28pt, Letter Spacing: `0.35`
- **Title 3:** 20pt, Semibold (`fontWeight: '600'`), Line Height: 25pt, Letter Spacing: `0.38`
- **Headline:** 17pt, Semibold (`fontWeight: '600'`), Line Height: 22pt, Letter Spacing: `-0.41`
- **Body:** 17pt, Regular (`fontWeight: '400'`), Line Height: 22pt, Letter Spacing: `-0.41`
- **Callout:** 16pt, Regular (`fontWeight: '400'`), Line Height: 21pt, Letter Spacing: `-0.32`
- **Subheadline:** 15pt, Regular (`fontWeight: '400'`), Line Height: 20pt, Letter Spacing: `-0.24`
- **Footnote:** 13pt, Regular (`fontWeight: '400'`), Line Height: 18pt, Letter Spacing: `-0.08`
- **Caption 1:** 12pt, Regular (`fontWeight: '400'`), Line Height: 16pt, Letter Spacing: `0.0`
- **Caption 2 (Micro):** 11pt, Semibold (`fontWeight: '600'`), Line Height: 13pt, Letter Spacing: `0.07`, Text Transform: `'uppercase'`

---

## 4. Component Blueprints

### A. The Floating Capsule Dock (Tab Bar)
- **Positioning:** Floating capsule dock.
  - `position: 'absolute'`
  - `bottom: insets.bottom > 0 ? insets.bottom + 8 : 20`
  - `left: 20`, `right: 20`
  - `height: 66`
  - `borderRadius: 33`
  - `borderCurve: 'continuous'`
- **Material:**
  - `<BlurView intensity={85} tint={theme === 'dark' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}>`
  - Android fallback background: Light `rgba(255, 255, 255, 0.88)` / Dark `rgba(28, 28, 30, 0.88)`
  - Border: `borderWidth: StyleSheet.hairlineWidth`, `borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)'`
  - Apple Ambient Shadow:
    `shadowColor: '#000'`, `shadowOffset: { width: 0, height: 10 }`, `shadowOpacity: theme === 'dark' ? 0.4 : 0.12`, `shadowRadius: 24`, `elevation: 10`

### B. Inset Grouped Table Card (iOS Settings Style)
- Replaces generic isolated cards with grouped list containers.
- Container:
  - `backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF'`
  - `borderRadius: 16`
  - `borderCurve: 'continuous'`
  - `overflow: 'hidden'`
  - `borderWidth: StyleSheet.hairlineWidth`
  - `borderColor: theme === 'dark' ? 'rgba(84, 84, 88, 0.55)' : 'rgba(0, 0, 0, 0.06)'`
- Rows:
  - `minHeight: 52`
  - `paddingHorizontal: 16`
  - `flexDirection: 'row'`, `alignItems: 'center'`, `justifyContent: 'space-between'`
- Separator:
  - `height: StyleSheet.hairlineWidth`
  - `backgroundColor: theme === 'dark' ? 'rgba(84, 84, 88, 0.55)' : 'rgba(60, 60, 67, 0.18)'`
  - `marginLeft: 16` (Crucial: never spans edge-to-edge)

### C. Circular Glass Quick-Actions (Reference: Contact Card)
- 44×44 or 48×48 circular action buttons (`borderRadius: 24`, `borderCurve: 'continuous'`)
- Background: Light `rgba(0, 0, 0, 0.04)` / Dark `rgba(255, 255, 255, 0.10)`
- Centered icon with secondary label underneath (11pt uppercase caption).

### D. Primary Action Button
- Height: `50pt`
- `borderRadius: 14`, `borderCurve: 'continuous'`
- Background: `theme === 'dark' ? '#30D158' : '#34C759'`
- Label: 17pt, Semibold, Pure White (`#FFFFFF`)
- Active Opacity: `0.85`

# UI.md — KIIT Node Apple Human Interface Guidelines (HIG) Specification

## 1. Anti-AI Rules (Strictly Enforced)
1. **NO Greeting Cards:** Eliminate all "Welcome back, [Name]!" hero cards. Apple apps (App Store, Apple Music, Settings) use clean Large Titles ("Teammates", "Market", "Forum") anchored at the top.
2. **NO Fake Status Indicators:** Strip the glowing green "online dot" beside "KIIT Node". Apple does not clutter brand titles with decorative dots.
3. **NO Fixed Container Heights:** Text containers MUST NEVER use `h-14`, `h-20`, or fixed pixel heights. Use `flex-col`, `gap-y-1`, and `paddingVertical: 14` with intrinsic sizing to prevent text collision.
4. **NO Pure White Screen Backgrounds:** 
   - Light Mode Screen: `#F2F2F7` (Apple System Grouped Background)
   - Light Mode Cards: `#FFFFFF` (Elevated White Surface)
   - Dark Mode Screen: `#000000` (OLED Pure Black)
   - Dark Mode Cards: `#1C1C1E` (Apple System Gray 6 Surface)
5. **Hairline Dividers Only:** All borders and row dividers must use `borderWidth: StyleSheet.hairlineWidth`. Never use 1px or 2px solid borders.
6. **Continuous Squircle Geometry:** Every card, button, and pill MUST declare `style={{ borderCurve: 'continuous' }}`.

---

## 2. Centralized Semantic Color Tokens (`useThemeColors`)

Every icon, text color, and border MUST consume this color system:

| Token | Light Mode | Dark Mode | Purpose |
| :--- | :--- | :--- | :--- |
| `bg` | `#F2F2F7` | `#000000` | Full-screen background |
| `card` | `#FFFFFF` | `#1C1C1E` | Inset grouped cards & surfaces |
| `cardPressed` | `#E5E5EA` | `#2C2C2E` | Touch feedback state |
| `label` | `#000000` | `#FFFFFF` | Primary headings & high-contrast text |
| `secondaryLabel` | `rgba(60, 60, 67, 0.60)` | `rgba(235, 235, 245, 0.60)` | Metadata, subtext, timestamps |
| `tertiaryLabel` | `rgba(60, 60, 67, 0.30)` | `rgba(235, 235, 245, 0.30)` | Placeholders, inactive icons |
| `separator` | `rgba(60, 60, 67, 0.18)` | `rgba(84, 84, 88, 0.55)` | Hairline dividers (indented 16pt) |
| `glassBg` | `rgba(255, 255, 255, 0.82)`| `rgba(28, 28, 30, 0.82)` | Frosted glass layer |
| `glassBorder` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.14)` | Specular edge highlight |
| `tint` | `#34C759` | `#30D158` | Apple System Green (verified badges, active tabs) |
| `tintBg` | `rgba(52, 199, 89, 0.12)` | `rgba(48, 209, 88, 0.16)` | Translucent badge background |
| `blue` | `#007AFF` | `#0A84FF` | Action links & secondary icons |
| `red` | `#FF3B30` | `#FF453A` | Destructive actions (Sign Out) |

---

## 3. Typography Hierarchy (SF Pro Standards)
- **Large Title:** 34pt, Bold (`fontWeight: '700'`), Line Height: 41pt, Letter Spacing: `0.37`
- **Title 2:** 22pt, Bold (`fontWeight: '700'`), Line Height: 28pt, Letter Spacing: `0.35`
- **Headline:** 17pt, Semibold (`fontWeight: '600'`), Line Height: 22pt, Letter Spacing: `-0.41`
- **Body:** 15pt, Regular (`fontWeight: '400'`), Line Height: 20pt, Letter Spacing: `-0.24`
- **Footnote / Badge:** 13pt, Medium (`fontWeight: '500'`), Line Height: 18pt, Letter Spacing: `-0.08`
- **Caption 2 (Micro):** 11pt, Semibold (`fontWeight: '600'`), Letter Spacing: `0.07`, Uppercase

---

## 4. The Floating Glass Capsule Dock (Tab Bar)
To eliminate the icon vertical-shift bug on Android:
- Use a dedicated Custom TabBar component replacing Expo's default renderer.
- **Container Geometry:**
  - `position: 'absolute'`
  - `bottom: Math.max(insets.bottom + 8, 16)`
  - `left: 20`, `right: 20`
  - `height: 64`
  - `borderRadius: 32`
  - `borderCurve: 'continuous'`
  - `overflow: 'hidden'`
  - Hairline specular border + ambient drop shadow (`shadowRadius: 20`, `shadowOpacity: 0.12`, `elevation: 8`).
- **Tab Item Layout:**
  - `flex: 1`, `alignItems: 'center'`, `justifyContent: 'center'`, `height: '100%'`.
  - Icon size: `22pt`.
  - Label: `10pt`, Semibold, `marginTop: 3`.
  - Active color: `colors.tint`, Inactive: `colors.tertiaryLabel`.

---

## 5. Screen Layout & Card Standards
- **Screen Container:** Root `<View style={{ flex: 1, backgroundColor: colors.bg }}>`
- **Scroll Content:** `contentContainerStyle={{ paddingTop: insets.top + 60, paddingBottom: insets.bottom + 100, paddingHorizontal: 16 }}`
- **Feed Cards:**
  - `backgroundColor: colors.card`
  - `borderRadius: 20`, `borderCurve: 'continuous'`
  - `padding: 16`
  - `borderWidth: StyleSheet.hairlineWidth`, `borderColor: colors.separator`
  - Apple ambient shadow in light mode (`shadowOpacity: 0.04`, `shadowRadius: 12`).
- **Grouped Table Lists:**
  - Inset grouped card containing rows separated by indented dividers (`marginLeft: 16`).

  # UI.md — KIIT Node Apple Human Interface Guidelines (HIG) Specification (v3)

## 1. Android Glassmorphism Formula (Guaranteed Execution)
On Android, `BlurView` alone can render completely clear. True Apple frosted glass on Android MUST be a 4-layer composition:
1. `<BlurView intensity={85} tint={isDark ? 'dark' : 'light'} experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />`
2. **Semi-transparent backdrop layer:** 
   - Light: `backgroundColor: 'rgba(255, 255, 255, 0.85)'`
   - Dark: `backgroundColor: 'rgba(22, 22, 24, 0.85)'`
3. **Hairline specular border:** `borderWidth: StyleSheet.hairlineWidth`, `borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)'`
4. **Overflow clipping:** `overflow: 'hidden'`, `borderCurve: 'continuous'`

---

## 2. Sticky Frosted Header Specification
- Header MUST be sticky/fixed:
  `position: 'absolute'`, `top: 0`, `left: 0`, `right: 0`, `zIndex: 50`
- Top padding: `paddingTop: insets.top`
- Content height: `48pt`
- Total height: `insets.top + 48`
- Hairline bottom border: `borderBottomWidth: StyleSheet.hairlineWidth`, `borderColor: colors.separator`
- **Scroll View Requirement:** Every tab's `ScrollView` / `FlatList` MUST set:
  `contentContainerStyle={{ paddingTop: insets.top + 56, paddingBottom: insets.bottom + 96, paddingHorizontal: 16 }}`
  This guarantees content scrolls *behind* the frosted header without escaping above the status bar.

---

## 3. Custom Floating Capsule Dock (TabBar)
Never use default `tabBarStyle`. Use a custom `tabBar` component:
- **Frame:** `position: 'absolute'`, `bottom: Math.max(insets.bottom + 8, 16)`, `left: 20`, `right: 20`, `height: 64`, `borderRadius: 32`, `borderCurve: 'continuous'`
- **Backdrop:** Layered `BlurView` + `colors.glassBg` + specular hairline border.
- **Tab Items:** `flex: 1`, `height: '100%'`, `alignItems: 'center'`, `justifyContent: 'center'`.
  - Icon: `22pt`, centered.
  - Label: `10pt`, Semibold, `marginTop: 3`, centered.
  - Active color: `colors.tint`, Inactive: `colors.tertiaryLabel`.

---

## 4. Floating Action Button (Glass "+")
- Sticky bottom-right glass button for creating posts:
  - `position: 'absolute'`, `bottom: insets.bottom + 90`, `right: 20`, `width: 54`, `height: 54`, `borderRadius: 27`, `borderCurve: 'continuous'`
  - Background: `colors.tint` (Apple System Green) with white `Plus` icon.
  - Soft shadow: `shadowColor: '#000'`, `shadowOffset: { width: 0, height: 6 }`, `shadowOpacity: 0.25`, `shadowRadius: 14`, `elevation: 8`.

---

## 5. Apple Sheet Modal Specification
- Presentation: Bottom Sheet Modal (`animationType="slide"`, `transparent={true}`).
- Sheet Container:
  - `backgroundColor: colors.card`
  - `borderTopLeftRadius: 28`, `borderTopRightRadius: 28`
  - `borderCurve: 'continuous'`
  - Top grabber: `width: 36`, `height: 5`, `borderRadius: 2.5`, `backgroundColor: colors.tertiaryLabel`, `alignSelf: 'center'`, `marginVertical: 10`.