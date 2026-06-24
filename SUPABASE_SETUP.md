# Supabase Setup Guide for NextStep

## 1. Create the Users Table in Supabase

Go to your Supabase dashboard and run this SQL in the SQL Editor to create the users table:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  plan TEXT DEFAULT 'Free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
```

**Note:** If you get "relation 'users' already exists", this table already exists. The schema above should match the existing structure.

## 2. Set Vercel Environment Variables

Add these two environment variables to your Vercel project settings:

| Variable Name | Value |
|---|---|
| `SUPABASE_URL` | `https://kbfunfdxptyjgwzbfdyq.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZnVuZmR4cHR5amd3emJmZHlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjI0MDg1NSwiZXhwIjoyMDk3ODE2ODU1fQ.6fDxRNDHtF-lfBuhOxhBtmat13WqI1W_78HIVpojygc` |

**To set these in Vercel:**
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add the two variables above
4. Redeploy the project

## 3. Local Development (Optional)

To test locally with Supabase, create a `.env.local` file in the `NextStep/` directory:

```env
SUPABASE_URL=https://kbfunfdxptyjgwzbfdyq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZnVuZmR4cHR5amd3emJmZHlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjI0MDg1NSwiZXhwIjoyMDk3ODE2ODU1fQ.6fDxRNDHtF-lfBuhOxhBtmat13WqI1W_78HIVpojygc
```

Then run the backend with:
```bash
npm run dev:api
```

## 4. How It Works

- **Signup:** Backend uses Supabase Auth Admin API to create users, then stores profile data in the `users` table
- **Login:** Backend verifies credentials via Supabase Auth, retrieves profile from `users` table
- **Sessions:** Backend generates UUID tokens and stores them in `db.sessions` (JSON file) for simplicity
- **Fallback:** If Supabase env vars are not set, the backend falls back to JSON-based auth (for local dev)

## 5. Testing

After deployment, try signing up at: `https://your-vercel-url/signup.html`

Check that:
- New users appear in Supabase `Authentication` → `Users`
- User profile data appears in the `users` table
- Login works with the same credentials
- Profile persists across page refreshes (stored in localStorage)

---

**Your Supabase Project ID:** kbfunfdxptyjgwzbfdyq
