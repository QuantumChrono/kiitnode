# UI.md — KIIT Node Apple Human Interface Guidelines (HIG) Specification

This document consolidates the previous UI specifications into one implementation spec. Repeated rules, color tables, typography entries, and component definitions have been merged so that each requirement appears once. Where earlier snippets conflicted, the implementation rule below is the resolved version.

> **Implementation note:** This is a KIIT Node design specification inspired by Apple's platform conventions. The exact numeric typography values below are the project's chosen SF Pro scale, not a claim that every value is an Apple-published HIG constant. Apple recommends system fonts, semantic label colors, adaptive system colors, familiar components, restrained brand color, and appropriate contrast. [Apple HIG / Developer Documentation](https://developer.apple.com/design/human-interface-guidelines/)

---

## 1. Non-Negotiable Anti-AI / Design Redlines

### 1.1 No generic Tailwind palettes

Never use generic Tailwind palette names or arbitrary raw Tailwind colors such as:

- `slate-900`
- `gray-800`
- `zinc-900`
- Standard raw Tailwind hex values

Use the semantic KIIT Node color tokens defined in Section 2.

### 1.2 No pure-white screen backgrounds

The root screen background is never pure white.

- **Light mode screen:** `#F2F2F7`
- **Light mode cards/elevated surfaces:** `#FFFFFF`
- **Dark mode screen:** `#000000`
- **Dark mode cards/elevated surfaces:** `#1C1C1E`

Pure `#FFFFFF` is reserved for elevated light-mode card surfaces.

### 1.3 No greeting-card hero UI

Do not create generic hero cards such as:

> "Welcome back, [Name]!"

Use clean Large Titles anchored at the top, for example:

- `Teammates`
- `Market`
- `Forum`

The interface should prioritize useful content rather than decorative branding.

### 1.4 No fake status indicators

Do not place a decorative glowing green "online dot" beside `KIIT Node`. Brand titles should remain clean.

### 1.5 No fixed text-container heights

Text containers must not use fixed heights such as:

- `h-14`
- `h-20`
- Arbitrary fixed pixel heights

Use intrinsic sizing with flexbox, for example:

```tsx
{
  flexDirection: 'column',
  gap: 4,
  paddingVertical: 14,
}
```

This prevents text collision and allows content to grow naturally.

### 1.6 Hairline borders only

All card borders, glass borders, specular borders, and row dividers must use:

```tsx
borderWidth: StyleSheet.hairlineWidth
```

or the corresponding directional property such as:

```tsx
borderBottomWidth: StyleSheet.hairlineWidth
```

Never use arbitrary `1px` or `2px` borders for these UI elements. React Native documents `StyleSheet.hairlineWidth` specifically for thin lines and dividers. [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)

### 1.7 Continuous squircle geometry

Every rounded container, card, button, pill, sheet, and circular action that uses `borderRadius` should also declare:

```tsx
borderCurve: 'continuous'
```

`borderCurve: 'continuous'` is a supported React Native view style on iOS 13+. On Android, treat it as an iOS-specific enhancement rather than assuming it changes Android rendering. [React Native View Style Props](https://reactnative.dev/docs/0.84/view-style-props)

### 1.8 Targeted glassmorphism

Blur is reserved for:

- Floating Tab Bar Dock
- Sticky Top Navigation / Header
- Other explicitly designated glass controls

Content cards remain solid. Do not turn ordinary feed cards, grouped lists, or content surfaces into translucent glass because that reduces text legibility and weakens visual hierarchy.

### 1.9 Branding restraint

KIIT Green is an accent, not the default color for every interactive element.

Apple's current guidance similarly recommends using an accent color judiciously and avoiding excessive use across controls. [Apple HIG — Branding](https://developer.apple.com/design/human-interface-guidelines/branding)

---

## 2. Centralized Semantic Color Tokens

Every icon, text color, background, border, badge, and interactive state must consume this semantic color system instead of hard-coded component-specific colors.

| Token | Light Mode | Dark Mode | Purpose |
|---|---|---|---|
| `bg` | `#F2F2F7` | `#000000` | Full-screen root background |
| `card` | `#FFFFFF` | `#1C1C1E` | Inset grouped cards and elevated surfaces |
| `cardPressed` | `#E5E5EA` | `#2C2C2E` | Pressed state for cards/rows |
| `label` | `#000000` | `#FFFFFF` | Primary headings and high-contrast text |
| `secondaryLabel` | `rgba(60, 60, 67, 0.60)` | `rgba(235, 235, 245, 0.60)` | Metadata, subtext, timestamps |
| `tertiaryLabel` | `rgba(60, 60, 67, 0.30)` | `rgba(235, 235, 245, 0.30)` | Placeholders, inactive icons, subtle text |
| `separator` | `rgba(60, 60, 67, 0.18)` | `rgba(84, 84, 88, 0.55)` | Hairline dividers; indent by 16pt in grouped lists |
| `glassBg` | `rgba(255, 255, 255, 0.82)` | `rgba(28, 28, 30, 0.82)` | Frosted-glass fallback/tint layer |
| `glassBorder` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.14)` | Specular glass edge |
| `tint` | `#34C759` | `#30D158` | KIIT Green / Apple System Green accent |
| `tintBg` | `rgba(52, 199, 89, 0.12)` | `rgba(48, 209, 88, 0.16)` | Subtle green badge background |
| `blue` | `#007AFF` | `#0A84FF` | Action links, secondary interactive icons |
| `red` | `#FF3B30` | `#FF453A` | Destructive actions such as Sign Out |

### Semantic color aliases

If the codebase already uses the older names, map them as follows:

| Older name | Canonical name |
|---|---|
| `ios-bg` | `bg` |
| `ios-card` | `card` |
| `ios-card-pressed` | `cardPressed` |
| `ios-label` | `label` |
| `ios-secondary-label` | `secondaryLabel` |
| `ios-tertiary-label` | `tertiaryLabel` |
| `ios-separator` | `separator` |
| `ios-glass-border` | `glassBorder` |
| `ios-green` | `tint` |
| `ios-green-tint` | `tintBg` |
| `ios-blue` | `blue` |

The semantic system corresponds to Apple's general model of primary, secondary, tertiary, and quaternary label colors, system backgrounds, grouped backgrounds, and separator colors. [Apple UIKit UI Element Colors](https://developer.apple.com/documentation/uikit/ui-element-colors)

### Light-mode reference palette

```text
ios-bg             #F2F2F7
ios-card           #FFFFFF
ios-card-pressed   #E5E5EA
ios-label          #000000
ios-secondary-label rgba(60, 60, 67, 0.60)
ios-tertiary-label  rgba(60, 60, 67, 0.30)
ios-separator       rgba(60, 60, 67, 0.18)
ios-glass-border    rgba(0, 0, 0, 0.08)
ios-green           #34C759
ios-green-tint      rgba(52, 199, 89, 0.12)
ios-blue            #007AFF
```

### Dark-mode reference palette

```text
ios-bg             #000000
ios-card           #1C1C1E
ios-card-pressed   #2C2C2E
ios-label          #FFFFFF
ios-secondary-label rgba(235, 235, 245, 0.60)
ios-tertiary-label  rgba(235, 235, 245, 0.30)
ios-separator       rgba(84, 84, 88, 0.55)
ios-glass-border    rgba(255, 255, 255, 0.16)
ios-green           #30D158
ios-green-tint      rgba(48, 209, 88, 0.16)
ios-blue            #0A84FF
```

Apple recommends adaptive semantic colors rather than hard-coded colors when building native interfaces; for this React Native implementation, the `colors` object provides the equivalent semantic abstraction. [Apple HIG — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)

---

## 3. Color Neutrality — 90/10 Rule

The visual hierarchy should remain approximately:

- **90% neutral:** cards, badges, secondary buttons, surfaces, and most interface elements use whites, blacks, grays, or semantic neutral surfaces.
- **10% brand/accent:** KIIT Green is reserved primarily for:
  - Floating `+` button
  - Verified checkmarks/badges
  - Active tab icons
  - Other genuinely primary status/action indicators

### Feed action buttons

`Contact` and `Message` buttons must be neutral pills:

```tsx
backgroundColor: colors.cardPressed
```

Do not make them green merely because they are interactive.

### Text hierarchy

Use:

```tsx
colors.label
colors.secondaryLabel
colors.tertiaryLabel
```

for primary, secondary, and muted content respectively.

Maintain sufficient contrast in both appearances. Apple recommends at least 4.5:1 contrast for foreground/background combinations and encourages stronger contrast for small custom text. [Apple HIG — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)

---

## 4. Typography — SF Pro Project Scale

Use the system font / SF Pro family where available. Apple recommends system fonts for legibility and accessibility. [Apple HIG — Labels](https://developer.apple.com/design/human-interface-guidelines/labels)

The KIIT Node project typography scale is:

| Style | Size | Weight | Line Height | Letter Spacing | Other |
|---|---:|---|---:|---:|---|
| Large Title | 34pt | 700 | 41pt | `0.37` | — |
| Title 1 | 28pt | 700 | 34pt | `0.36` | — |
| Title 2 | 22pt | 700 | 28pt | `0.35` | — |
| Title 3 | 20pt | 600 | 25pt | `0.38` | — |
| Headline | 17pt | 600 | 22pt | `-0.41` | — |
| Body | 17pt | 400 | 22pt | `-0.41` | Primary body scale |
| Callout | 16pt | 400 | 21pt | `-0.32` | — |
| Subheadline | 15pt | 400 | 20pt | `-0.24` | — |
| Footnote | 13pt | 400 | 18pt | `-0.08` | — |
| Caption 1 | 12pt | 400 | 16pt | `0.0` | — |
| Caption 2 / Micro | 11pt | 600 | 13pt | `0.07` | Uppercase |

### Implementation note on the earlier conflicting Body value

An earlier draft listed Body as `15pt / 20pt / -0.24`, while the fuller typography specification listed Body as `17pt / 22pt / -0.41` and separately defined Subheadline as `15pt / 20pt / -0.24`.

The consolidated specification therefore uses:

- **Body:** `17 / 22 / -0.41`
- **Subheadline:** `15 / 20 / -0.24`

This preserves both intended scales without assigning two different definitions to the same token.

### Footnote / badge usage

The earlier specification also described:

```text
Footnote / Badge: 13pt, Medium (500), 18pt, -0.08
```

For implementation, use:

- **Footnote:** `13pt`, Regular (`400`), `18pt`, `-0.08`
- **Badge text where medium emphasis is required:** `13pt`, Medium (`500`), `18pt`, `-0.08`

This keeps the original Footnote and Badge intent without conflating them into one typography token.

### Caption 2

```tsx
fontSize: 11,
fontWeight: '600',
letterSpacing: 0.07,
textTransform: 'uppercase',
```

---

## 5. Screen Layout & Safe Areas

### Root container

Every screen should start from:

```tsx
<View
  style={{
    flex: 1,
    backgroundColor: colors.bg,
  }}
>
```

### Standard scroll content

For screens with a fixed/sticky header:

```tsx
contentContainerStyle={{
  paddingTop: insets.top + 56,
  paddingBottom: insets.bottom + 96,
  paddingHorizontal: 16,
}}
```

For screens where the top navigation/header requires the additional 4pt separation used by the earlier draft:

```tsx
contentContainerStyle={{
  paddingTop: insets.top + 60,
  paddingBottom: insets.bottom + 100,
  paddingHorizontal: 16,
}}
```

Use the first value (`+56`) as the canonical default for the sticky-header architecture. Use the second only where the specific screen has a taller header/content offset.

The important invariants are:

- Content must not escape above the status bar.
- Content must scroll behind the frosted header where intended.
- Bottom content must remain clear of the floating dock.

---

## 6. Sticky Frosted Header / Top Navigation

The header is fixed and sits above scrolling content.

### Frame

```tsx
{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
}
```

### Safe-area layout

```tsx
{
  paddingTop: insets.top,
  height: insets.top + 48,
}
```

The visible content/header area is `48pt`, with the status-bar safe area added above it.

### Border

```tsx
{
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.separator,
}
```

### Header behavior

- It must remain sticky/fixed.
- Scrolling content passes behind it.
- It must not allow content to render into the status-bar region.
- Use the glass construction defined in Section 10.

---

## 7. Floating Glass Capsule Dock — Tab Bar

Never use Expo/React Navigation's default visual `tabBarStyle` for this design. Use a dedicated custom `tabBar` component.

The purpose is to eliminate the Android icon vertical-shift issue and provide deterministic geometry.

### Frame

```tsx
{
  position: 'absolute',
  bottom: Math.max(insets.bottom + 8, 16),
  left: 20,
  right: 20,
  height: 64,
  borderRadius: 32,
  borderCurve: 'continuous',
  overflow: 'hidden',
}
```

The earlier draft used `height: 66` / `borderRadius: 33`. The consolidated specification uses `64 / 32` because it matches the later custom-tab-bar architecture while preserving the capsule geometry.

### Material

Use layered glass:

1. Blur layer.
2. Semantic translucent `colors.glassBg` layer.
3. Hairline specular border.
4. `overflow: 'hidden'` for clipping.

See Section 10 for the current Expo Android implementation.

### Ambient shadow

```tsx
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: isDark ? 0.4 : 0.12,
  shadowRadius: 20,
  elevation: 8,
}
```

The earlier `shadowRadius: 24 / elevation: 10` values are retained as an optional heavier variant, but the canonical dock uses `20 / 8` to match the later specification.

### Tab item layout

```tsx
{
  flex: 1,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
}
```

### Tab item typography

- Icon: `22pt`
- Label: `10pt`
- Label weight: Semibold (`600`)
- Label `marginTop`: `3`
- Active color: `colors.tint`
- Inactive color: `colors.tertiaryLabel`

---

## 8. Inset Grouped Table Card — iOS Settings Style

Use grouped list containers instead of generic isolated cards when presenting rows/settings-style information.

### Container

```tsx
{
  backgroundColor: colors.card,
  borderRadius: 16,
  borderCurve: 'continuous',
  overflow: 'hidden',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: isDark
    ? 'rgba(84, 84, 88, 0.55)'
    : 'rgba(0, 0, 0, 0.06)',
}
```

### Rows

```tsx
{
  minHeight: 52,
  paddingHorizontal: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}
```

Do not assign fixed heights to text-bearing row content. `minHeight` is acceptable because it provides a minimum while allowing intrinsic content to grow.

### Dividers

```tsx
{
  height: StyleSheet.hairlineWidth,
  backgroundColor: colors.separator,
  marginLeft: 16,
}
```

The `marginLeft: 16` is mandatory. Dividers must align with label content and must never span edge-to-edge.

---

## 9. Feed Cards

Feed/content cards use solid surfaces rather than glass.

```tsx
{
  backgroundColor: colors.card,
  borderRadius: 20,
  borderCurve: 'continuous',
  padding: 16,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.separator,
}
```

### Light-mode ambient shadow

```tsx
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 2,
}
```

Do not apply a heavy shadow in dark mode.

### 3D card finish

Cards may additionally use a subtle specular top edge:

```tsx
{
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: isDark
    ? 'rgba(255, 255, 255, 0.10)'
    : 'rgba(255, 255, 255, 0.80)',
}
```

This should not replace the required semantic border; it is an additional subtle highlight.

---

## 10. True Glassmorphism — Android & iOS

For a glass component where content visibly scrolls behind the element, the outer container must remain transparent.

### Important Android implementation correction

Older versions of this specification used:

```tsx
experimentalBlurMethod="dimezisBlurView"
```

Current Expo BlurView documentation uses `blurMethod="dimezisBlurView"` and, in current stable Android implementations, supports `BlurTargetView` + `blurTarget` for actual background blurring. The older prop is therefore not the canonical implementation for current Expo SDKs. [Expo BlurView documentation](https://docs.expo.dev/versions/latest/sdk/blur-view/)

### Current glass structure

For current Expo SDKs, use a structure equivalent to:

```tsx
import { BlurTargetView, BlurView } from 'expo-blur';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

const targetRef = useRef<View | null>(null);

<View style={styles.glassHost}>
  <BlurTargetView
    ref={targetRef}
    style={StyleSheet.absoluteFill}
  >
    {/* Background/content that should be blurred */}
  </BlurTargetView>

  <BlurView
    blurTarget={targetRef}
    blurMethod="dimezisBlurView"
    intensity={90}
    tint={isDark ? 'systemThickMaterialDark' : 'systemThickMaterialLight'}
    style={StyleSheet.absoluteFill}
  />

  <View
    pointerEvents="none"
    style={[
      StyleSheet.absoluteFill,
      {
        backgroundColor: isDark
          ? 'rgba(15, 15, 15, 0.65)'
          : 'rgba(255, 255, 255, 0.65)',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isDark
          ? 'rgba(255, 255, 255, 0.15)'
          : 'rgba(0, 0, 0, 0.08)',
      },
    ]}
  />

  <View
    pointerEvents="none"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(255, 255, 255, 0.80)',
    }}
  />

  {/* Glass content goes here */}
</View>
```

And the host should use:

```tsx
const styles = StyleSheet.create({
  glassHost: {
    position: 'absolute',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderRadius: 32,
    borderCurve: 'continuous',
  },
});
```

### Why the layering exists

The composition is:

1. **Blur layer** — provides background distortion.
2. **Translucent tint/backdrop** — prevents the glass from becoming visually clear or washed out.
3. **Hairline border** — provides the specular edge.
4. **Top highlight** — adds the slight raised/3D appearance.
5. **Content** — remains above the material layers.

Expo's current documentation also notes that `BlurView` needs appropriate background content to blur and that `overflow: 'hidden'` is useful when clipping rounded BlurView containers. [Expo BlurView](https://docs.expo.dev/versions/latest/sdk/blur-view/)

### iOS material

For iOS, the preferred tint values are:

```tsx
tint={
  isDark
    ? 'systemThickMaterialDark'
    : 'systemThickMaterialLight'
}
```

Other valid system material tints can be used where a thinner or lighter material is specifically required.

---

## 11. Circular Glass Quick Actions

Quick actions follow a contact-card style.

### Geometry

Use either:

- `44 × 44`
- `48 × 48`

For a `48 × 48` action:

```tsx
{
  width: 48,
  height: 48,
  borderRadius: 24,
  borderCurve: 'continuous',
}
```

### Background

Light:

```tsx
backgroundColor: 'rgba(0, 0, 0, 0.04)'
```

Dark:

```tsx
backgroundColor: 'rgba(255, 255, 255, 0.10)'
```

### Content arrangement

The icon goes **inside** the circle.

The label goes **outside**, underneath the circle.

```tsx
<View style={{ alignItems: 'center' }}>
  <View
    style={{
      width: 48,
      height: 48,
      borderRadius: 24,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.10)'
        : 'rgba(0, 0, 0, 0.04)',
    }}
  >
    <Icon />
  </View>

  <Text
    style={{
      marginTop: 6,
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.07,
      textTransform: 'uppercase',
      color: colors.secondaryLabel,
    }}
  >
    Label
  </Text>
</View>
```

---

## 12. Primary Action Button

Primary actions may use KIIT Green.

### Geometry

```tsx
{
  minHeight: 50,
  borderRadius: 14,
  borderCurve: 'continuous',
  paddingHorizontal: 20,
  alignItems: 'center',
  justifyContent: 'center',
}
```

`minHeight` is used rather than a fixed text-container height so accessibility and multiline content can expand naturally.

### Background

```tsx
backgroundColor: isDark ? '#30D158' : '#34C759'
```

Prefer the semantic equivalent:

```tsx
backgroundColor: colors.tint
```

### Label

- `17pt`
- Semibold (`600`)
- `#FFFFFF`

### Active/pressed opacity

```tsx
opacity: pressed ? 0.85 : 1
```

---

## 13. Tactile Press States

Every meaningful `Pressable` button or tappable card should provide a consistent physical response.

### Canonical press interaction

```tsx
<Pressable
  style={({ pressed }) => [
    {
      transform: [{ scale: pressed ? 0.97 : 1 }],
      opacity: pressed ? 0.85 : 1,
    },
  ]}
>
  {/* Content */}
</Pressable>
```

Do not combine this with arbitrary per-component scale values unless a component has a documented reason to behave differently.

For cards, preserve the semantic pressed surface:

```tsx
backgroundColor: pressed
  ? colors.cardPressed
  : colors.card
```

---

## 14. Floating Action Button — Glass "+"

A sticky bottom-right action button is used for creating posts.

### Position

```tsx
{
  position: 'absolute',
  bottom: insets.bottom + 90,
  right: 20,
  width: 54,
  height: 54,
  borderRadius: 27,
  borderCurve: 'continuous',
}
```

### Appearance

```tsx
backgroundColor: colors.tint
```

Use a white `Plus` icon.

### Shadow

```tsx
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 14,
  elevation: 8,
}
```

The button is called "glass +" in the original specification, but because it uses an opaque accent fill rather than a translucent material, its implementation should be treated as a floating accent button rather than a literal frosted-glass surface.

---

## 15. Apple Sheet Modal

Use a bottom-sheet presentation for creation/editing flows where appropriate.

### Presentation

```tsx
<Modal
  animationType="slide"
  transparent={true}
>
  {/* Sheet */}
</Modal>
```

### Sheet container

```tsx
{
  backgroundColor: colors.card,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  borderCurve: 'continuous',
}
```

### Top grabber

```tsx
{
  width: 36,
  height: 5,
  borderRadius: 2.5,
  borderCurve: 'continuous',
  backgroundColor: colors.tertiaryLabel,
  alignSelf: 'center',
  marginVertical: 10,
}
```

---

## 16. Grouped Lists vs. Feed Cards

Use the correct surface for the information type.

### Grouped/settings information

Use:

- `colors.card`
- `borderRadius: 16`
- `borderCurve: 'continuous'`
- Rows with `minHeight: 52`
- `paddingHorizontal: 16`
- Hairline separators
- `marginLeft: 16` on separators

### Feed/content information

Use:

- `colors.card`
- `borderRadius: 20`
- `borderCurve: 'continuous'`
- `padding: 16`
- Hairline border
- Light ambient shadow
- Optional top-edge specular highlight

Do not turn every UI surface into a generic rounded card.

---

## 17. Profile Quick Actions

Profile quick actions must follow this structure:

```tsx
<View style={{ alignItems: 'center' }}>
  <View style={styles.circle}>
    <Icon />
  </View>

  <Text style={styles.label}>
    Label
  </Text>
</View>
```

Rules:

- Icon is inside the circle.
- Text is outside the circle.
- Text is below the circle.
- Caption styling follows the micro/caption typography.
- Avoid placing the label inside the circular button.

---

## 18. Market / Collaboration Cards

Do not use full-width colored strips for:

- `Selling`
- Tags
- Categories
- Similar metadata

Instead, use compact pills:

```tsx
{
  alignSelf: 'flex-start',
}
```

The pill should only be as wide as its content.

### Layout

Use flexbox rows to pack:

- Price
- Title
- Action

into a compact structure without excessive vertical height.

Example:

```tsx
<View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  }}
>
  <View style={{ flex: 1 }}>
    {/* Title / metadata */}
  </View>

  <Text>{price}</Text>

  {/* Action */}
</View>
```

Do not create large full-width colored banners merely to communicate a tag or selling state.

---

## 19. Component Rules Summary

### Every rounded component

```tsx
borderRadius: ...,
borderCurve: 'continuous',
```

### Every border/divider

```tsx
borderWidth: StyleSheet.hairlineWidth
```

or the corresponding directional property.

### Every grouped-list divider

```tsx
marginLeft: 16
```

### Every screen

```tsx
backgroundColor: colors.bg
```

### Every elevated card

```tsx
backgroundColor: colors.card
```

### Every semantic text color

Use:

```tsx
colors.label
colors.secondaryLabel
colors.tertiaryLabel
```

### Every primary accent

Use:

```tsx
colors.tint
```

### Every floating glass surface

Use:

- Transparent host
- Blur layer
- Semantic translucent fallback/tint
- Hairline border
- Overflow clipping
- Optional top specular highlight

### Every tappable element

Use the standard pressed interaction:

```tsx
transform: [{ scale: pressed ? 0.97 : 1 }],
opacity: pressed ? 0.85 : 1,
```

where appropriate.

---

## 20. Reference Implementation Tokens

A centralized theme object should look approximately like:

```tsx
export const lightColors = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  cardPressed: '#E5E5EA',

  label: '#000000',
  secondaryLabel: 'rgba(60, 60, 67, 0.60)',
  tertiaryLabel: 'rgba(60, 60, 67, 0.30)',

  separator: 'rgba(60, 60, 67, 0.18)',

  glassBg: 'rgba(255, 255, 255, 0.82)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',

  tint: '#34C759',
  tintBg: 'rgba(52, 199, 89, 0.12)',

  blue: '#007AFF',
  red: '#FF3B30',
} as const;

export const darkColors = {
  bg: '#000000',
  card: '#1C1C1E',
  cardPressed: '#2C2C2E',

  label: '#FFFFFF',
  secondaryLabel: 'rgba(235, 235, 245, 0.60)',
  tertiaryLabel: 'rgba(235, 235, 245, 0.30)',

  separator: 'rgba(84, 84, 88, 0.55)',

  glassBg: 'rgba(28, 28, 30, 0.82)',
  glassBorder: 'rgba(255, 255, 255, 0.14)',

  tint: '#30D158',
  tintBg: 'rgba(48, 209, 88, 0.16)',

  blue: '#0A84FF',
  red: '#FF453A',
} as const;
```

Use a single runtime-selected object:

```tsx
const colors = isDark ? darkColors : lightColors;
```

Components should consume `colors`, not duplicate light/dark hex values throughout the codebase.

---

## 21. Reference Floating Dock

```tsx
<View
  style={[
    {
      position: 'absolute',
      bottom: Math.max(insets.bottom + 8, 16),
      left: 20,
      right: 20,
      height: 64,
      borderRadius: 32,
      borderCurve: 'continuous',
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.glassBorder,

      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.4 : 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
  ]}
>
  {/* Glass material layers */}

  {/* Tab items */}
</View>
```

The material itself should follow Section 10 rather than assuming that a single `BlurView` is sufficient on Android.

---

## 22. Reference Header

```tsx
<View
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: insets.top + 48,
    paddingTop: insets.top,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  }}
>
  {/* Blur/material layers */}

  <View
    style={{
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* Header content */}
  </View>
</View>
```

---

## 23. Reference Screen

```tsx
<View
  style={{
    flex: 1,
    backgroundColor: colors.bg,
  }}
>
  <ScrollView
    contentContainerStyle={{
      paddingTop: insets.top + 56,
      paddingBottom: insets.bottom + 96,
      paddingHorizontal: 16,
    }}
  >
    {/* Screen content */}
  </ScrollView>

  {/* Sticky/floating header */}

  {/* Floating tab dock */}

  {/* Optional floating + button */}
</View>
```

For a `FlatList`, apply the same spacing through `contentContainerStyle`.

---

## 24. Final Implementation Rules

The interface should read as a restrained Apple-style system rather than a collection of generic AI-generated cards.

The implementation must therefore preserve these invariants:

1. No generic Tailwind palettes.
2. No pure-white light-mode root background.
3. No greeting-card hero sections.
4. No decorative online/status dots beside `KIIT Node`.
5. No fixed heights on text containers.
6. Hairline borders only.
7. Continuous corner curves wherever rounded geometry is used.
8. Semantic theme colors everywhere.
9. Solid content cards; glass only for designated navigation/floating surfaces.
10. Grouped-list separators are indented by exactly `16pt`.
11. The tab bar is a custom floating capsule.
12. The top navigation is a sticky/fixed frosted header.
13. Scrolling content passes behind the frosted header without entering the status-bar area.
14. Tab icons are `22pt`; tab labels are `10pt` semibold with `3pt` top margin.
15. Primary actions use KIIT Green; secondary actions remain neutral.
16. Quick-action icons remain inside circles; labels remain below the circles.
17. Market/collaboration tags use intrinsic-width pills, not full-width colored strips.
18. Pressable controls use the standardized `0.97` scale / `0.85` opacity pressed state where appropriate.
19. Cards can use the subtle specular top edge to reinforce depth.
20. Android glass uses the current Expo BlurView API rather than the obsolete `experimentalBlurMethod` property.
21. `BlurTargetView` / `blurTarget` should be used with current Expo Android blur where actual background blur is required.
22. `overflow: 'hidden'` is required when clipping rounded glass surfaces.
23. Typography uses the project SF Pro hierarchy defined in Section 4.
24. The theme is centralized so light/dark values are not scattered across components.
25. Accessibility and intrinsic sizing take precedence over rigid visual dimensions.

The goal is not to maximize decoration. The goal is a consistent system: semantic surfaces, restrained color, predictable geometry, readable typography, controlled depth, and platform-familiar interaction patterns.
