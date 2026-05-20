# Portfolio Blog App

A production-shaped portfolio plus Medium-style article platform built with Next.js App Router, Supabase, Zustand, Tailwind CSS, Quill, and toast notifications.

## What Is Included

- Portfolio pages for home, projects, and about
- Server-side paginated blog listing at `/blogs`
- Blog detail pages at `/blogs/[slug]`
- Email/password login and signup in a reusable global modal
- Zustand stores for auth state and global modal state
- Toast notifications with `react-hot-toast`
- Shared UI primitives for buttons, circular loaders, fullscreen loading, and pagination
- Dynamic metadata, canonical URLs, `sitemap.xml`, and `robots.txt`

## Project Structure

```txt
app/                 Next.js routes, metadata, sitemap, robots
components/auth/     Login and signup modal
components/blog/     Blog cards, editor, article HTML, interactions
components/providers Global client providers
components/ui/       Reusable UI primitives
data/common/         Portfolio content
lib/                 Supabase clients and blog data access
models/              Shared domain types
store/               Zustand auth and UI stores
styles/              Tailwind global styles
supabase/            Database schema and RLS policies
utils/               Small shared utility types
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Run `supabase/schema.sql` in the Supabase SQL editor.

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Supabase Auth

The app uses Supabase email/password auth. New users can create an account from the login modal, and Supabase can send the email verification message for free on the hosted plan.

To enable email verification:

1. Go to Supabase Dashboard -> Authentication -> Providers -> Email.
2. Keep Email provider enabled.
3. Enable Confirm email.
4. Set Site URL to your app URL, for example `http://localhost:3000` locally and your Vercel URL in production.
5. Add any Redirect URLs you use, for example `http://localhost:3000/**` and `https://your-domain.com/**`.

Supabase handles the verification email and confirmation link. For production, configure SMTP in Supabase Auth settings if you want better deliverability and custom sender branding.

## Useful Commands

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment

Deploy on Vercel, add the same environment variables, and set `NEXT_PUBLIC_SITE_URL` to the production URL. Vercel will install dependencies and build the Next.js app automatically.
