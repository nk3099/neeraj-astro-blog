---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Integrating Ngrok, Next.js, and Hashnode Webhooks"
publishedDate: 2024-09-07
description: ""
author: "Nitish Kumar"
image:
  url: ""
  alt: ""
tags: ["ngrok", "next.js", "webhooks"]
hashnodeUrl: "https://nov1ce.hashnode.dev/integrating-ngrok-hashnode-webhook-api"
---

In this blog post, I'll summarize the key concepts and techniques I learned while working on my "Today I Learned" (TIL) episode. This includes dynamic content fetching with Next.js, handling webhooks, and utilizing Ngrok for local development.

### 📄 Dynamic Blog Fetching with Next.js

Previously, I fetched blog posts manually, but I wanted to automate this process. To achieve dynamic content fetching, I used Next.js server-side fetching. Here’s a step-by-step breakdown:

**Fetching Blog Data**:

- I leveraged the Hashnode API with GraphQL to fetch blog details such as title, slug, and tags.
- The data is then displayed on the TIL and Posts pages. Currently, I’m working on reordering the content to improve the user experience.

### 🔄 Using Webhooks for Real-Time Updates

Webhooks are an excellent way to keep your data updated in real time. Here’s how I implemented them:

1. **Webhook Implementation**:

   - When an update occurs (like a new blog post), Hashnode triggers a webhook that hits an endpoint in my Next.js application.
   - This endpoint updates a `data.json` file, which is used to fetch and display posts on the TIL and Posts pages based on their tags.

2. **Testing with Ngrok**:
   - To test the webhook integration, I used Ngrok. Ngrok allows you to expose your local server to the internet, making it easy to test webhooks.
   - After setting up Ngrok, I used Postman to send requests to my local server and verify that the webhook updates were processed correctly.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1725737187350/f38852af-a2e5-4f67-82b1-d53330450b09.png?auto=compress,format&format=webp)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1725737071710/0ab14e9c-d24e-4ab3-91b4-975bd582f38c.png?auto=compress,format&format=webp)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1725737077401/83e5a12d-2bb1-4ce9-997f-74cea0036ed4.png?auto=compress,format&format=webp)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1725737208250/798aa390-b8e2-4305-abe0-69724dd64b03.png?auto=compress,format&format=webp)

### 🌐 Fetching Data in Next.js

In Next.js, there are different methods to fetch data based on your needs:

1. **Using `async/await`**: This method is useful for data fetching in client-side code or when you need to handle asynchronous operations directly in your component.

2. **Using `getServerSideProps()`**: This method fetches data server-side on each request, making it ideal for dynamic content that changes frequently or depends on request data.

### 🛠️ Next.js API Routes

In Next.js 13+, API routes are defined within the `app/api/{folderName}/route.ts` file. Unlike previous versions, you must explicitly define the request type (GET, POST, DELETE) within the `export default function` in the `route.ts` file.

### 🔮 Future Plans

I’m planning to integrate a database, likely PostgreSQL with Supabase, to manage and store blog data. I will also use webhooks to keep the database updated with new posts, modifications, or deletions.
