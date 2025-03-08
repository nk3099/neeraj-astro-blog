---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Incremental Static Regeneration (ISR)"
publishedDate: 2024-09-10
description: "Transitioning from Static to Dynamic Data Fetching in Next.js"
author: "Nitish Kumar"
image:
  url: ""
  alt: "Transitioning from Static to Dynamic Data Fetching in Next.js"
tags: ["TIL", "next.js", "learn-in-public"]
hashnodeUrl: "https://nov1ce.hashnode.dev/incremental-static-regeneration-isr"
---

In a recent TIL post, I discussed my approach to fetching data using webhooks and storing it in JSON files. However, I encountered an issue when deploying on Vercel—specifically, a lack of write access to the file system. To resolve this, I initially considered migrating to a Postgres instance on Supabase for a more robust and accurate data retrieval mechanism.

### ❌ The Problem with Static Rendering

While working on the pages for my blog ([`nov1ce.vercel.app/posts`](http://nov1ce.vercel.app/posts) and [`nov1ce.vercel.app/TIL`](http://nov1ce.vercel.app/TIL)), I noticed that despite using async functions to fetch data, the pages were still being rendered as static during the build process. This behavior is by design in Next.js as explained in the [documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching):

> If you are not using any [dynamic functions anywhere else in](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering) this route, it will be pre-rendered during `next build` to a static page. The data can then be updated using [Incremental Static Regeneration.](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

[Upon further investigation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) in the Next.js documentation, I realized there were a few nuances I hadn't fully grasped.

### ⚡ Understanding Dynamic Rendering in Next.js

In Next.js, dynamic rendering depends on the router being used:

- **Pages Router (Legacy):** Dynamic rendering is handled via `getServerSideProps`, a function that runs on the server during each request.
- **App Router (New):** In contrast, `getServerSideProps` is not supported within the `app/` directory. Instead, the App Router allows for direct use of `async/await` in components, enabling dynamic fetching directly within the component's code.

This approach seamlessly integrates dynamic data fetching with the App Router, providing greater flexibility and simplicity.

### 🔄 Current Approach: On-Demand Revalidation

For my blog and TIL pages, I've implemented On-Demand Revalidation with `revalidatePath`, utilizing webhooks provided by Hashnode to trigger API endpoints. These API endpoints are invoked to revalidate the pages on demand.

Hashnode currently allows fetching up to 50 posts, which is sufficient for my current needs. As a result, I've decided to postpone the integration with Supabase Postgres. Instead, I’m leveraging _Incremental Static Regeneration (ISR)_ and dynamic fetching provided by Next.js.

### 📚 Key Learnings

1. **`getServerSideProps` in Next.js:** This function is available only in the Pages Router and is not supported in the App Router.
2. **Implementing ISR:** There are several methods to implement ISR in Next.js:
   - `export const revalidate = 60`: This option revalidates the page every 60 seconds.
   - `revalidatePath`: A method for revalidating specific paths on demand.
   - `revalidateTag`: This method allows you to revalidate pages or parts of your site based on tags rather than specific paths. It’s particularly useful in scenarios where multiple pages or components rely on shared data that changes infrequently.

### 🛤️ Next Steps

Moving forward, I plan to delve into form handling in Next.js, focusing on server-side validation using Zod. I'll also explore how to effectively manage form actions, which will be crucial for future projects.
