StudyHub - Example Express Auth Server

This is a small standalone server for local development demonstrating secure user registration, login, and JWT authentication.

Quick start (Windows PowerShell):

1. Copy the example env and set secure values:

```powershell
cd server
copy .env.example .env
# Edit .env and set JWT_SECRET to a strong secret
notepad .env
```

2. Install dependencies:

```powershell
npm install
```

3. Run in development (auto-restarts with changes):

```powershell
npm run dev
```

4. API endpoints:

- POST /register
  - body: { email, password, name, class (optional), role (optional) }
  - returns 201 with { id }

- POST /login
  - body: { email, password }
  - returns { token }

- GET /me
  - header: Authorization: Bearer <token>
  - returns authenticated user (without password_hash)

Security notes:
- Use a strong randomly generated `JWT_SECRET` stored in environment variables.
- Use HTTPS in production.
- Use a production-ready DB (Postgres, MySQL) and run proper migrations.
- Increase `BCRYPT_SALT_ROUNDS` for higher security (tradeoff: CPU cost).

Integration:
- You can call these endpoints from your Next.js frontend or convert them into Next.js API routes.
