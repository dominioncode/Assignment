# StudyHub - Project Setup and Development Guide

## 📋 Project Overview

**StudyHub** is a comprehensive web application designed to streamline assignment management, group work coordination, and academic result tracking for students and lecturers. The platform provides an intuitive GUI that enables seamless communication and collaboration between educational stakeholders.

### Key Objectives
✅ **Assignment Management**: Create, track, and manage individual and group assignments  
✅ **Group Coordination**: Organize students into groups for collaborative work  
✅ **Result Tracking**: View and manage semester-based academic results  
✅ **Study Materials**: Share and access course resources  
✅ **Real-time Notifications**: Keep users informed about important updates  

---

## 🏗️ Project Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI development |
| **Framework** | Next.js 14 | Server-side rendering, API routes |
| **Styling** | Tailwind CSS | Responsive design |
| **State Management** | Zustand | Global state management |
| **Icons** | Lucide React | UI icons |
| **Utilities** | date-fns | Date/time handling |
| **Code Quality** | ESLint, TypeScript | Type safety & linting |

### Directory Structure

```
projectwork2/
├── src/
│   ├── app/                           # Next.js App Router pages
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home/landing page
│   │   ├── auth/
│   │   │   └── login/page.tsx        # Login page
│   │   ├── student/                   # Student routes
│   │   │   ├── assignments/page.tsx  # View assignments
│   │   │   ├── groups/page.tsx       # Manage groups
│   │   │   ├── materials/page.tsx    # Access materials
│   │   │   └── results/page.tsx      # View results
│   │   └── lecturer/                  # Lecturer routes
│   │       ├── assignments/page.tsx  # Create assignments
│   │       ├── groups/page.tsx       # Manage groups
│   │       ├── materials/page.tsx    # Upload materials
│   │       └── results/page.tsx      # Manage results
│   ├── components/
│   │   ├── DashboardLayout.tsx        # Main layout wrapper
│   │   ├── AssignmentCard.tsx         # Assignment display
│   │   └── ...
│   ├── lib/
│   │   ├── types.ts                   # TypeScript interfaces
│   │   ├── store.ts                   # Zustand state
│   │   └── utils.ts                   # Helper functions
│   └── styles/
│       └── globals.css                # Global styles
├── public/                            # Static assets
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── tailwind.config.ts                 # Tailwind config
├── next.config.js                     # Next.js config
└── README.md                          # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation Steps

1. **Navigate to project directory**
   ```bash
   cd c:\Users\amara\Desktop\PROJECTS\projectwork2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will install all required packages listed in `package.json`:
   - React 18
   - Next.js 14
   - TypeScript 5
   - Tailwind CSS
   - Zustand
   - Lucide React
   - date-fns

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open application**
   - Navigate to `http://localhost:3000` in your browser
   - You should see the StudyHub landing page

5. **Login with demo credentials**
   - **Email**: demo@example.com
   - **Password**: demo123
   - **Role**: Choose Student or Lecturer

---

## 📱 Application Features

### For Students

| Feature | Description |
|---------|-------------|
| **📋 My Assignments** | View all assignments with deadlines and status |
| **👥 My Groups** | Join or create study groups for collaborative work |
| **📊 My Results** | View grades semester-wise with detailed breakdown |
| **📚 Study Materials** | Download course resources and materials |
| **🔔 Notifications** | Get alerts for new assignments and grade updates |

**Access**: `/student/*`

### For Lecturers

| Feature | Description |
|---------|-------------|
| **✍️ Create Assignments** | Set individual, group, or study assignments |
| **👫 Manage Groups** | Create and organize student groups |
| **📝 Grade Submissions** | Review and grade student work |
| **📤 Upload Materials** | Share course resources with students |
| **📈 View Results** | Manage and publish semester results |

**Access**: `/lecturer/*`

---

## 🎨 UI/UX Design System

### Color Palette

```css
Primary Blue:      #3B82F6
Secondary Blue:    #1E40AF
Success Green:     #10B981
Danger Red:        #EF4444
Warning Orange:    #F59E0B
Dark Gray:         #1F2937
Light Gray:        #F3F4F6
```

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Component Examples

- **Cards**: White background with subtle borders
- **Buttons**: Rounded corners with hover effects
- **Forms**: Clean input fields with focus states
- **Tables**: Striped rows for readability
- **Navigation**: Sidebar with collapsible menu

---

## 🔄 State Management with Zustand

The app uses **Zustand** for simple, scalable state management.

### Store Structure

```typescript
// Access store
import { useAppStore } from '@/lib/store'

// Use in components
const currentUser = useAppStore((state) => state.currentUser)
const assignments = useAppStore((state) => state.assignments)

// Update state
const addAssignment = useAppStore((state) => state.addAssignment)
```

### Store Features

- **Auth**: Current user management
- **Assignments**: CRUD operations
- **Submissions**: Track student work
- **Groups**: Manage group memberships
- **Results**: Store semester results
- **Notifications**: User alerts

---

## 📝 Data Models

### User
```typescript
interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'lecturer' | 'admin'
  department: string
  studentId?: string
  employeeId?: string
}
```

### Assignment
```typescript
interface Assignment {
  id: string
  title: string
  description: string
  type: 'individual' | 'group' | 'study'
  courseId: string
  dueDate: Date
  totalMarks: number
  createdBy: string
  createdAt: Date
}
```

### Submission
```typescript
interface Submission {
  id: string
  assignmentId: string
  submittedBy: string
  submissionDate: Date
  marks?: number
  feedback?: string
  status: 'submitted' | 'graded'
}
```

### SemesterResult
```typescript
interface SemesterResult {
  id: string
  studentId: string
  semester: 'first' | 'second'
  year: number
  courseId: string
  obtainedMarks: number
  grade: string
}
```

---

## 🔒 Security Considerations

### Implemented Features
✅ Role-based access control (RBAC)  
✅ User authentication (demo)  
✅ Input validation  
✅ TypeScript for type safety  

### Future Enhancements
- [ ] JWT authentication
- [ ] Password hashing
- [ ] Rate limiting
- [ ] HTTPS enforcement
- [ ] Data encryption
- [ ] Audit logging

---

## 🎯 Development Workflow

### Creating a New Page

1. Create file in `src/app/[role]/[feature]/page.tsx`
2. Use `'use client'` directive for client components
3. Import types from `@/lib/types`
4. Use Zustand store for state
5. Style with Tailwind CSS classes

Example:
```typescript
'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'

export default function FeaturePage() {
  const data = useAppStore((state) => state.data)
  
  return (
    <div className="p-6">
      {/* Page content */}
    </div>
  )
}
```

### Creating a New Component

1. Create file in `src/components/ComponentName.tsx`
2. Export as named export
3. Define TypeScript interfaces for props
4. Use Tailwind for styling

Example:
```typescript
import React from 'react'
import type { Assignment } from '@/lib/types'

interface CardProps {
  assignment: Assignment
}

export const AssignmentCard: React.FC<CardProps> = ({ assignment }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      {/* Component content */}
    </div>
  )
}
```

---

## 🧪 Testing & Debugging

### Development Tools

- **TypeScript**: Type checking
- **ESLint**: Code linting
- **Next.js Dev Tools**: Built-in debugging
- **Browser DevTools**: Chrome/Firefox developer tools

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Modules not found | Run `npm install` |
| Tailwind not loading | Check `tailwind.config.ts` |
| TypeScript errors | Verify type imports |
| State not updating | Check Zustand selectors |

---

## 📚 Using TypeScript Types

All types are centralized in `src/lib/types.ts`:

```typescript
import type { User, Assignment, Submission } from '@/lib/types'

const user: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'student',
  department: 'Engineering'
}
```

---

## 🚀 Build & Deployment

### Production Build

```bash
npm run build
npm start
```

### Build Process

1. TypeScript compilation
2. Next.js optimization
3. Asset minification
4. Code splitting
5. Image optimization

---

## 📦 Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint checks |

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Real-time notifications with WebSocket
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] File upload system
- [ ] Email notifications

### Phase 3
- [ ] Advanced analytics
- [ ] Student-lecturer messaging
- [ ] Plagiarism detection
- [ ] Mobile app (React Native)

### Phase 4
- [ ] API documentation
- [ ] User roles expansion
- [ ] Attendance tracking
- [ ] Assessment rubrics

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -m 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Open a pull request

---

## 📞 Support & Resources

- **Documentation**: See `README.md`
- **Issues**: Report in GitHub issues
- **Contact**: Development team

---

## 📄 License

MIT License - Feel free to use for educational purposes.

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Status**: Active Development
