PR: UI polish — accessible modal, reduced-motion toggle, keyboard shortcuts
=========================================================

This PR contains a set of frontend polish and accessibility improvements implemented on the
`bootstrap-admin-redesign` branch. Main highlights:

- Reusable accessible Modal component: `src/components/Modal.tsx` — traps focus, supports keyboard close (Escape) and restores focus to previously focused element.
- Reduced Motion toggle: `src/components/ReducedMotionToggle.tsx` — lets users override system reduced-motion and persists preference to localStorage. Applies `html.reduce-motion` to disable animations/transitions site-wide.
- Moved inline modals to the shared `Modal` component (student/lecturer assignments, materials pages).
- Small UX improvements: keyboard shortcuts (`/` to focus search, `n` to open create/upload modal), accessible aria labels for buttons and actions.
- Style/CSS: `src/styles/theme.css` updated to support reduce-motion override, consistent table and card visuals, focus-visible refinements.

Files touched (not exhaustive):
- src/components/Modal.tsx
- src/components/ReducedMotionToggle.tsx
- src/components/DashboardLayout.tsx
- src/styles/theme.css
- src/app/student/assignments/page.tsx
- src/app/lecturer/assignments/page.tsx
- src/app/lecturer/materials/page.tsx
  ... and several pages updated for consistent look & accessibility.

Testing & Notes:
- Built locally (production), ran TypeScript diagnostics — no errors reported in modified files.
- Visual verification: Search shortcuts and 'n' to open modals work in dev environment (client only).

Next steps / suggestions for reviewers:
- Add focus-trap tests or E2E tests for modal keyboard behavior.
- Consider adding a UI switch in settings for motion preferences or exposing the toggle in a settings page.
- Add automated accessibility checks (axe) in CI to prevent regressions.
