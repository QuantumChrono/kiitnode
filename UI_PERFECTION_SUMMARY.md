# Summary of Changes

All requested UI perfection fixes have been implemented:

## 1. True Glassmorphism
- Updated `AppleFloatingTabBar.tsx` to use `experimentalBlurMethod="dimezisBlurView"` on Android
- Added explicit semi-transparent RGBA surfaces via `colors.glassBg`
- Added specular hairline borders via `colors.glassBorder`
- Updated `Header.tsx` with same glassmorphism treatment

## 2. Floating Dock Centering
- Modified `app/(tabs)/_layout.tsx` to use `tabBar={(props) => <AppleFloatingTabBar {...props} />} `
- Updated `AppleFloatingTabBar.tsx` to center tab items with `flex: 1`, `height: '100%'`, `alignItems: 'center'`, `justifyContent: 'center'`
- Tab labels now use 10pt semibold with `marginTop: 2`

## 3. Sticky Frosted Header
- Updated `Header.tsx` to use top-level `useTheme()` hook
- Position: `position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, paddingTop: insets.top, height: insets.top + 48`
- Backdrop layers: `BlurView` + `colors.glassBg` + hairline bottom divider with `colors.glassBorder`
- Title: "KIIT Node" (no status dot)
- Right side: Campus pill + Sun/Moon toggle

## 4. Scroll Padding Across All Feeds
- Updated `collab.tsx`, `market.tsx`, `forum.tsx`, `directory.tsx`, `profile.tsx`:
  ```tsx
  contentContainerStyle={{
    paddingTop: insets.top + 56,
    paddingBottom: insets.bottom + 96,
    paddingHorizontal: 16
  }}
  ```

## 5. Profile Screen & Modals
- Verified `GroupedRow.tsx` already centers icons correctly (`width: 28, height: 28, alignItems: 'center', justifyContent: 'center'`)
- Profile screen wires:
  - `isEditModalVisible` -> `EditProfileModal`
  - `isGuidelinesVisible` -> `GuidelinesModal`
  - Appearance switch -> `value={theme === 'dark'}` and `onValueChange={toggleTheme}`
  - "Sign Out" -> calls `signOut()` and navigates to `/login`

## 6. Post Creation Workflows
- Updated `FloatingActionButton.tsx` positioning:
  ```tsx
  position: 'absolute',
  bottom: insets.bottom + 88,
  right: 20,
  width: 52,
  height: 52,
  borderRadius: 26
  ```
- Button renders on `collab.tsx`, `market.tsx`, and `forum.tsx` (placeholder alert for modal implementation)

## Verification
- `npx tsc --noEmit` passes with 0 errors
- `npx expo export --platform android` completes successfully

All changes follow `UI.md` strictly and maintain existing types.