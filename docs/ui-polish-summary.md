UI polish & accessibility iteration — bootstrap-admin-redesign
=================================

Summary of changes in this iteration:

- Added accessible focus styles and prefers-reduced-motion support in `src/styles/theme.css`.
- Introduced micro-interactions and touch-size improvements for buttons and cards.
- Added keyboard shortcuts across assignment and materials pages: '/' focuses search, 'n' opens create/upload modal, and Escape closes modals.
- Converted several key pages to themed components: assignments, groups, materials, questions, results.
  - Used `assignment-card`, `table-theme`, and shadowless/borderless cards for consistent visual language.
- Improved accessibility attributes (aria-labels) for CTAs and action buttons across pages.
- Added small modal UIs for quick-create flows for demo purposes on assignments and materials pages.

Files touched (high level):
- src/styles/theme.css
- src/app/student/assignments/page.tsx
- src/app/lecturer/assignments/page.tsx
- src/app/student/groups/page.tsx
- src/app/lecturer/groups/page.tsx
- src/app/student/materials/page.tsx
- src/app/lecturer/materials/page.tsx
- src/app/student/results/page.tsx
- src/app/student/questions/page.tsx
- src/components/AssignmentCard.tsx

Next steps (optional):
- Continue the polish for remaining pages (quizzes, profile widgets, admin tables).
- Add focus trapping for modals and improve keyboard-only flows further.
- Add a reduced-motion toggle in the UI to let users override system preferences.

Use this file as a quick reference when creating your PR or including these notes in PR description.
