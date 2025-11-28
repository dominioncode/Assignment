# 🚀 Quick Start Guide - StudyHub

## ⚡ Get Running in 5 Minutes

### Step 1: Install Dependencies (2 minutes)
```bash
cd c:\Users\amara\Desktop\PROJECTS\projectwork2
npm install
```

### Step 2: Start Development Server (1 minute)
```bash
npm run dev
```

### Step 3: Open in Browser (1 minute)
```
http://localhost:3000
```

### Step 4: Login with Demo Account (1 minute)
- **Email**: demo@example.com
- **Password**: demo123
- **Choose**: Student or Lecturer

---

## 📋 What You'll See

### Home Page
- Role selection cards (Student/Lecturer)
- Feature highlights
- Login button for each role

### Student Dashboard
- My Assignments (with search & filters)
- My Groups (join/create groups)
- Study Materials (download resources)
- My Results (view grades by semester)

### Lecturer Dashboard
- Manage Assignments (create/edit/delete)
- Manage Groups (organize students)
- Upload Materials (share resources)
- Student Results (grade management)

---

## 🎯 Key Features

### 📚 For Students
✅ View all assignments with due dates  
✅ Join group projects  
✅ Access study materials  
✅ Track semester results & grades  
✅ Get notifications  

### 👨‍🏫 For Lecturers
✅ Create assignments  
✅ Organize student groups  
✅ Upload study materials  
✅ Manage & publish results  
✅ Track submissions  

---

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start dev server (hot reload)

# Production
npm run build        # Create production build
npm start           # Run production server

# Code Quality
npm run lint        # Check code with ESLint
```

---

## 📂 Project Structure (Simple View)

```
src/
├── app/
│   ├── page.tsx              ← Home page
│   ├── auth/login/page.tsx   ← Login
│   ├── student/              ← Student pages
│   └── lecturer/             ← Lecturer pages
├── components/               ← Reusable components
├── lib/
│   ├── types.ts             ← Data types
│   ├── store.ts             ← State management
│   └── utils.ts             ← Helper functions
└── styles/
    └── globals.css          ← Global styles
```

---

## 💡 Common Tasks

### View a Student Page
1. Go to home page
2. Click "Get Started" → Student
3. Login with demo credentials
4. Browse "My Assignments"

### View a Lecturer Page
1. Go to home page
2. Click "Get Started" → Lecturer
3. Login with demo credentials
4. Click "Manage Assignments"

### Modify Styling
- Edit `src/styles/globals.css`
- Or use Tailwind classes in components

### Add New Page
1. Create: `src/app/[role]/[feature]/page.tsx`
2. Add to navigation if needed
3. Use existing components

### Update Data
- Sample data in each page component
- Ready for backend integration
- Use Zustand store for state

---

## 🎨 Customization Quick Tips

### Change Colors
File: `tailwind.config.ts`
```typescript
colors: {
  primary: '#3B82F6',      // Change here
  secondary: '#1E40AF',    // Change here
}
```

### Change Logo/Title
File: `src/app/page.tsx` or `src/components/DashboardLayout.tsx`
```typescript
<span className="text-2xl font-bold">StudyHub</span>  // Change text
```

### Add New Feature
1. Create component in `src/components/`
2. Create page in `src/app/[role]/[feature]/`
3. Add to navigation in `DashboardLayout.tsx`
4. Add types in `src/lib/types.ts` if needed

---

## 🔗 Important Links

| Item | Location |
|------|----------|
| Main Documentation | `README.md` |
| Setup Guide | `SETUP_GUIDE.md` |
| Project Summary | `PROJECT_SUMMARY.md` |
| File Manifest | `FILE_MANIFEST.md` |
| Home Page | `/` |
| Student Dashboard | `/student/assignments` |
| Lecturer Dashboard | `/lecturer/assignments` |

---

## 🐛 Troubleshooting

### npm install fails
```bash
# Try clearing cache
npm cache clean --force
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001  # Use different port
```

### Styles not loading
```bash
# Rebuild Tailwind
npm run dev  # Usually auto-recompiles
```

### TypeScript errors
```bash
# Check TypeScript
npm run build
```

---

## 📱 Responsive Design

The app works on:
- ✅ Desktop (1200px+)
- ✅ Tablet (640px - 1200px)
- ✅ Mobile (< 640px)

Test by:
1. Pressing F12 in browser
2. Clicking device toolbar
3. Select mobile preset

---

## 🎓 Next Learning Steps

1. **Understand the Code**
   - Read `src/lib/types.ts` - understand data structure
   - Read `src/lib/store.ts` - understand state management
   - Read a page component - understand page structure

2. **Try Modifying**
   - Change colors in `tailwind.config.ts`
   - Add a new field in `types.ts`
   - Create a new component

3. **Learn Technologies**
   - React basics: https://react.dev
   - Next.js: https://nextjs.org/docs
   - Tailwind: https://tailwindcss.com
   - TypeScript: https://www.typescriptlang.org

4. **Plan Backend Integration**
   - Create API routes in `src/app/api/`
   - Connect Zustand store to API
   - Add database queries
   - Implement authentication

---

## ✅ Launch Checklist

Before going to production:

- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` successfully
- [ ] Website loads on `http://localhost:3000`
- [ ] Can login as student
- [ ] Can login as lecturer
- [ ] All pages are accessible
- [ ] Responsive on mobile
- [ ] Read documentation

---

## 🎉 You're Ready!

Your StudyHub application is ready to explore and develop further!

### Quick Actions:
1. **Run**: `npm run dev`
2. **Open**: `http://localhost:3000`
3. **Test**: Login with demo credentials
4. **Explore**: Check all pages and features
5. **Customize**: Edit colors, text, add features
6. **Deploy**: When ready with backend

---

## 📞 Need Help?

1. Check `README.md` for detailed info
2. Check `SETUP_GUIDE.md` for development
3. Check `FILE_MANIFEST.md` for file details
4. Review type definitions in `src/lib/types.ts`
5. Check component props in component files

---

## 🚀 Next Phase (After Setup)

1. **Backend Setup**
   - Create API routes
   - Set up database
   - Implement authentication

2. **Integration**
   - Connect frontend to backend
   - Replace sample data
   - Add real functionality

3. **Testing**
   - Test all features
   - Fix bugs
   - Optimize performance

4. **Deployment**
   - Build: `npm run build`
   - Deploy to Vercel/Netlify
   - Set up domain
   - Configure HTTPS

---

**Happy Coding! 🎓**

For more details, see the comprehensive documentation files in the project root.
