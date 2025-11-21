Commit title:

feat(ui): Bootstrap admin redesign — Dashboard shell + pages

Commit description:

- Replace Tailwind-based dashboard layout with a Bootstrap admin shell (`DashboardLayout`) including an offcanvas sidebar for small screens and a static sidebar for larger screens.
- Add admin styles in `src/styles/admin.css` and a `.brand-gradient` helper for marketing/auth panels.
- Convert key pages and components to Bootstrap:
  - `src/app/auth/login/page.tsx` — migrated to Bootstrap input groups, cards, and layout.
  - `src/app/student/results/page.tsx` — updated to use Bootstrap tables/cards and `getGradeColor` mappings.
  - `src/lib/utils.ts` — map status/grade tokens to Bootstrap utility classes (badges/backgrounds).
  - `src/components/admin/*` — new admin components and `AdminCard` wrapper used across components.
  - `src/components/DashboardLayout.tsx` — fixed duplication and cleaned up the layout.
  - `src/components/AssignmentCard.tsx` — updated badge to use Bootstrap classes.

Notes:
- These are visual/styling changes only; underlying data/store logic unchanged.
- Please run `npm install` and `npm run dev` locally to verify styling and offcanvas interactions.

Suggested PR body:

This PR implements a Bootstrap-based admin UI across the app to provide a cohesive, maintainable design system.

What changed:
- Replaced Tailwind-dependent layout with a Bootstrap admin shell and reusable admin components (`AdminCard`, `SidebarNav`, `AdminTable`).
- Converted primary pages (login, results, assignments) to Bootstrap components and utilities.
- Centralized badge/status/grade styling in `src/lib/utils.ts` to return Bootstrap utility classes.

Why:
- Bootstrap provides consistent components and utility classes which make rapid UI iteration easier for this project and reduces reliance on Tailwind-specific utilities.

How to test locally:
1. From project root:

```powershell
npm install
npm run dev
```

2. Verify:
- Visit `/auth/login` to check the login layout and brand gradient.
- Log in as a demo user and visit student/lecturer pages (assignments, materials, groups, results).
- Resize window to confirm offcanvas sidebar behaviour on small screens.

If you want, I can split this into smaller commits (layout, pages, utils) or prepare a ready-to-merge branch/PR summary.
