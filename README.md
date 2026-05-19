# Portfolio Blog App

A clean, simple developer portfolio and Supabase-backed blog built with Next.js App Router and Tailwind CSS.

## Features

- Portfolio home page, projects page, and about page
- Blog listing at `/blogs`
- Blog detail pages at `/blog/[slug]`
- Supabase-backed posts created from `/admin/blog`
- Auto calculated read time
- Quill rich text editing with side-by-side preview
- Logged-in-only comments and likes
- Admin-only blog create/update flow
- Dynamic blog metadata, `sitemap.xml`, and `robots.txt`
- Vercel-ready project structure

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project.

3. Copy the environment file:

```bash
cp .env.example .env.local
```

4. Add your Supabase config to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Run `supabase/schema.sql` in the Supabase SQL editor, then set your own row in `public.users` to `role = 'admin'`.

6. Run the development server:

```bash
npm run dev
```

7. Open `http://localhost:3000`.

## Add a Blog Post

Login as an admin at `/admin/blog`, write the post in Quill, preview it, and publish. Posts are stored in the Supabase `blogs` table.

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add the same environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to your production URL, for example `https://your-site.vercel.app`.
5. Deploy.

Vercel will run `npm install` and `npm run build` automatically for a Next.js project.
