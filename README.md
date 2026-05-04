# Portfolio Blog App

A clean, simple developer portfolio and Markdown blog built with Next.js App Router, Tailwind CSS, Firebase Firestore, and `react-markdown`.

## Features

- Portfolio home page, projects page, and about page
- Blog listing at `/blogs`
- Blog detail pages at `/blog/[slug]`
- Local Markdown posts with frontmatter
- Auto calculated read time
- `react-markdown` rendering with GitHub-flavored Markdown
- Fenced code block syntax highlighting
- Firestore-powered public comments with one-level replies
- Dynamic blog metadata, `sitemap.xml`, and `robots.txt`
- Vercel-ready project structure

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Firebase project and a Firestore database.

3. Copy the environment file:

```bash
cp .env.example .env.local
```

4. Add your Firebase web app config to `.env.local`.

5. Run the development server:

```bash
npm run dev
```

6. Open `http://localhost:3000`.

## Firestore Collections

The app writes to these collections:

- `comments`: documents with `blogSlug`, `name`, `comment`, `parentId`, and `createdAt`

Top-level comments use `parentId: null`. Replies store the parent comment id in `parentId`.

For a simple public blog, start with rules like this and tighten them as your needs grow:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /comments/{commentId} {
      allow read: if true;
      allow create: if
        request.resource.data.blogSlug is string &&
        request.resource.data.name is string &&
        request.resource.data.comment is string &&
        (
          request.resource.data.parentId == null ||
          request.resource.data.parentId is string
        ) &&
        request.resource.data.name.size() <= 80 &&
        request.resource.data.comment.size() <= 1000;
    }
  }
}
```

## Add a Blog Post

Create a Markdown file in `data/blogs`:

```md
---
title: "Another Post"
slug: "another-post"
description: "A short SEO description for this post."
createdAt: "2026-05-03"
---

# Another Post

Write your article in Markdown.
```

The post will be listed automatically at `/blogs` and published at `/blog/another-post`.

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add the same environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to your production URL, for example `https://your-site.vercel.app`.
5. Deploy.

Vercel will run `npm install` and `npm run build` automatically for a Next.js project.
