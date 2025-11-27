# StudyHub - Assignment & Study Management System

A comprehensive platform for students and lecturers to manage assignments, coordinate group work, track academic results, and share study materials efficiently.

## 🎯 Features

### For Students
- **📋 View Assignments**: Browse all course assignments with detailed information
- **👥 Group Management**: Form and participate in group projects
- **📊 Track Results**: View grades and results semester by semester
- **📚 Study Materials**: Access course materials and resources
- **🔔 Notifications**: Real-time updates on assignments and submissions

### For Lecturers
- **✍️ Create Assignments**: Set individual, group, and study assignments
- **👫 Group Coordination**: Organize student groups for projects
- **📝 Grading System**: Review and grade submissions with feedback
- **📤 Material Sharing**: Upload and manage study resources
- **📈 Progress Tracking**: Monitor student submissions and performance

## 🛠️ Tech Stack

- **Frontend**: React 18 with Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Utilities**: date-fns
- **Language**: TypeScript

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── auth/
│   │   └── login/page.tsx       # Login page
│   ├── student/
│   │   ├── assignments/page.tsx # Student assignments
│   │   ├── groups/page.tsx      # Student groups
│   │   ├── materials/page.tsx   # Study materials
│   │   └── results/page.tsx     # Semester results
│   └── lecturer/
│       ├── assignments/page.tsx # Manage assignments
│       ├── groups/page.tsx      # Manage groups
│       ├── materials/page.tsx   # Upload materials
│       └── results/page.tsx     # View results
├── components/
│   ├── DashboardLayout.tsx      # Main dashboard layout
│   ├── AssignmentCard.tsx       # Assignment card component
│   └── ...                      # Other components
├── lib/
│   ├── types.ts                 # TypeScript types and interfaces
│   ├── store.ts                 # Zustand state management
│   └── utils.ts                 # Utility functions
└── styles/
    └── globals.css              # Global styles

public/                          # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd projectwork2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (if needed)
   Create a `.env.local` file in the root directory

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### For Students

1. **Login**: Use your student credentials to access the platform
2. **View Assignments**: Navigate to "My Assignments" to see all your course tasks
3. **Submit Work**: Click on an assignment to submit your work before the deadline
4. **Join Groups**: Go to "My Groups" to join or create study groups
5. **Check Results**: View your semester results in the "My Results" section
6. **Download Materials**: Access study resources in "Study Materials"

### For Lecturers

1. **Login**: Use your lecturer credentials
2. **Create Assignment**: Click "Create Assignment" to add new tasks
3. **Manage Groups**: Organize student groups for collaborative work
4. **Grade Submissions**: Review student submissions and provide feedback
5. **Upload Materials**: Share course resources and study materials
6. **Track Progress**: Monitor student performance and submission rates

## 🎨 User Interface

### Dashboard Features
- **Sidebar Navigation**: Easy access to all main features
- **Top Bar**: User profile, notifications, and logout
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Customizable theme (future enhancement)

### Key Pages

#### Home Page (`/`)
- Role selection (Student/Lecturer)
- Feature highlights
- Quick access to login

#### Login Page (`/auth/login`)
- Email and password authentication
- Role-based login
- Demo credentials option
- Remember me functionality

#### Student Dashboard
- Assignment list with filtering
- Group membership view
- Semester-based result tracking
- Study material library

#### Lecturer Dashboard
- Assignment management
- Submission tracking
- Student group organization
- Result publishing interface

## 📊 Data Models

### User
- Student: ID, name, email, department, studentId
- Lecturer: ID, name, email, department, employeeId

### Assignment
- Title, description, type (individual/group/study)
- Due date, total marks, course reference
- Instructions, attachments

### Submission
- Assignment reference, student/group reference
- Submission date, files, status
- Marks, feedback, reviewer

### SemesterResult
- Student ID, semester, year
- Course information, marks, grade

### Group
- Name, assignment reference
- Members list, creation date

## 🔒 Security Features

- Role-based access control (RBAC)
- User authentication
- Data validation
- Secure file handling (to be implemented)

## 🔄 State Management with Zustand

The app uses Zustand for global state management:

```typescript
// Example: Access current user
const currentUser = useAppStore((state) => state.currentUser)

// Example: Add assignment
const addAssignment = useAppStore((state) => state.addAssignment)
```

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced grading rubrics
- [ ] Student-Lecturer messaging
- [ ] Calendar integration
- [ ] Analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Integration with LMS platforms
- [ ] Plagiarism detection
- [ ] Video submission support
- [ ] Achievement badges

## 🔧 Configuration

### Tailwind CSS Colors
```javascript
colors: {
  primary: '#3B82F6',      // Blue
  secondary: '#1E40AF',    // Dark Blue
  success: '#10B981',      // Green
  danger: '#EF4444',       // Red
  warning: '#F59E0B',      // Orange
  dark: '#1F2937',         // Dark Gray
  light: '#F3F4F6',        // Light Gray
}
```

### API Integration Points (Future)
- Authentication service
- Assignment CRUD operations
- Submission handling
- Result generation
- File upload service

## 📝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React community for extensive libraries
- Tailwind CSS for styling utilities
- Lucide for beautiful icons

---

**StudyHub** - Making academic collaboration seamless and efficient! 🎓

## 🗄️ Database management (DB helpers)

This repository includes cross-platform helper scripts to manage development databases (supports sqlite3 for local dev and mysql2 for MySQL/XAMPP).

Add database config in `server/.env` (or in the root `.env`), for example:

```
# switch DB client to mysql2 or sqlite3
DB_CLIENT=mysql2
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=assignment_dev
```

Helper scripts (run from project root):

```powershell
npm run db:create   # create the database (for MySQL) or touch sqlite file
npm run db:migrate  # run knex migrations
npm run db:seed     # seed demo users + run migrations
npm run db:drop     # drop database (for MySQL) or delete sqlite file

Convenience helpers (shorthand):

```powershell
npm run db:setup    # create -> migrate -> seed
npm run db:reset    # drop -> create -> migrate -> seed (clean start)
```
```

Notes:
- Scripts load `server/.env` by default so you can keep DB credentials out of repo root.
- `DB_CLIENT=sqlite3` is the safest local default (no external MySQL required).
- Use `DB_CLIENT=mysql2` if you want to use XAMPP / a MySQL instance.

