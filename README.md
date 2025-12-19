# StudyHub - Assignment & Study Management System

A comprehensive platform for students and lecturers to manage assignments, coordinate group work, track academic results, and share study materials efficiently.

## 🎯 Features

### For Students

### For Lecturers

## 🛠️ Tech Stack


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

### Start the backend server

If you need to run only the backend server it lives in the `server/` folder. From the project root you can now run:

```powershell
npm run server      # start production server from project root
npm run server:dev  # run dev server (nodemon) from project root (delegates to server/)
```

Or from the `server/` folder directly:

```powershell
cd server
npm run server      # starts node index.js
npm run dev         # dev mode with nodemon
```

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

### Key Pages

#### Home Page (`/`)

#### Login Page (`/auth/login`)

#### Student Dashboard

#### Lecturer Dashboard

## 📊 Data Models

### User

### Assignment

### Submission

### SemesterResult

### Group

## 🔒 Security Features


## 🔄 State Management with Zustand

The app uses Zustand for global state management:

```typescript
// Example: Access current user
const currentUser = useAppStore((state) => state.currentUser)

// Example: Add assignment
const addAssignment = useAppStore((state) => state.addAssignment)
```

## 📱 Responsive Design


## 🎯 Future Enhancements


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

### AI: Raptor mini (Preview) — enable for all clients

This project includes an optional server-side route to forward model requests to a hosted Raptor mini (Preview) model. The forwarding route is intentionally gated behind an environment feature flag so you can enable it per-deployment.

How to enable:

1. Open `server/.env` (or use your deployment environment variables) and set the following values:

```env
# Enable or disable the preview
RAPTOR_MINI_ENABLED=true
# URL of your Raptor mini/preview model endpoint (e.g. https://api.example.com/raptor-mini/v1)
RAPTOR_MINI_URL=https://example.com/raptor-mini
# API key / token for the Raptor provider
RAPTOR_MINI_API_KEY=sk-your-secret-token
```

2. When `RAPTOR_MINI_ENABLED` is true the server will expose an authenticated proxy endpoint at:

```
POST /api/ai

Headers: Authorization: Bearer <JWT>
Body: JSON payload matching your Raptor provider (server forwards the JSON body as-is)
```

3. Use the client (authenticated) to POST to `/api/ai` — the server will forward the payload to `RAPTOR_MINI_URL` and return the provider's response.

Security note: Protect your RAPTOR_MINI_API_KEY and only enable this in trusted environments. The proxy is authenticated using the same JWT-based auth used by the app.

Running integration tests against a real Raptor endpoint

If you want CI or a developer machine to verify the actual upstream forwarding behavior you can provide a test endpoint and API key. The server contains an optional guarded integration test which will only run when these environment variables are present:

```bash
# In the server/ folder set these (CI/runner must set these securely)
RAPTOR_MINI_TEST_URL=https://your-raptor-endpoint.example/preview
RAPTOR_MINI_TEST_API_KEY=sk-your-test-key

# Then from the project root run (server tests are mocha-based in server/)
cd server
npm ci
npm test
```

The integration test is skipped when `RAPTOR_MINI_TEST_URL` is not set so it is safe to keep in CI pipelines — only runners with the needed secrets will exercise the live upstream.

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

Local MySQL (recommended dev quick start)
----------------------------------------

If you don't have a local MySQL setup, use the included Docker Compose to run a local MySQL instance for development.

From the `server/` directory:

```powershell
# starts a MySQL 8 container with a database named assignment_dev (root/example credentials)
docker compose up -d

# inspect health (optional)
docker compose ps

# then from project root run migrations + start server
cd server
npm ci
$env:DB_CLIENT='mysql2'
$env:MYSQL_HOST='127.0.0.1'
$env:MYSQL_PORT='3306'
$env:MYSQL_USER='root'
$env:MYSQL_PASSWORD='example'
$env:MYSQL_DATABASE='assignment_dev'
npm run db:migrate
node index.js
```

Note: Change credentials for production and add secrets in environment variables or your deployment platform.
```

- Use `DB_CLIENT=mysql2` if you want to use XAMPP / a MySQL instance.

=======
# Assignment
To help students ease off the stress of bulky assignments
>>>>>>> origin/main
