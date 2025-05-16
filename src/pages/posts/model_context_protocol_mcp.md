---
layout: ../../layouts/MarkdownPostLayout.astro
title: "MCP : Model Context Protocol"
publishedDate: 2025-05-04
description: "Learning about MCP"
author: "Nitish Kumar"
image:
  url: ""
  alt: "Learning about MCP"
tags: ["MCP", "Python", "learn-in-public","Gen-AI"]
featuredPost: True
---

> *“Why did the AI cross the road? To call a function on the other side—with MCP!”*

### 🗂️ Table of Contents

1. [🛋️ Introduction](#🛋️-introduction)
2. [🌉 Bridging the Gap: Why MCP?](#🌉-bridging-the-gap-why-mcp)
3. [🏢 MCP Architecture: Who Talks to Whom?](#🏢-mcp-architecture-who-talks-to-whom)
4. [🛠️ MCP Primitives: Tools, Resources, Prompts](#🛠️-mcp-primitives-tools-resources-prompts)
5. [🔌 Transport Mechanisms: Stdio vs. SSE](#🔌-transport-mechanisms-stdio-vs-sse)
6. [🧑‍💻 My Implementations](#my-implementations)
    - [📻 1. Stdio: The “Walkie-Talkie” Approach](#📻-1-stdio-the-walkie-talkie-approach)
    - [🌐 2. SSE: The “Long-Distance Relationship”](#🌐-2-sse-the-long-distance-relationship)
    - [🤖 3. LLM + Tools: The “Supercharged Chatbot”](#🤖-3-llm--tools-the-supercharged-chatbot)
7. [📝 Practical Considerations: Should You MCP?](#📝-practical-considerations-should-you-mcp)
8. [🔑 Key Takeaways](#🔑-key-takeaways)
9. [🏁 Conclusion: Is MCP for You?](#🏁-conclusion-is-mcp-for-you)
10. [📚 Further Reading](#📚-further-reading)
11. [🔗 References & Further Learning](#🔗-references--further-learning)

---

### 🛋️ Introduction

Remember when you needed a different remote for every device in your living room? One for the TV, another for the sound system, and a third for that ancient DVD player you never use? It was chaos—until the universal remote came along and saved the day.

The **Model Context Protocol (MCP)** is the universal remote for your AI tools. It’s the new kid on the AI block, and everyone’s buzzing about it. But is it a revolution, or just another fancy gadget? Spoiler: it’s more like finally having one remote to rule them all—no more juggling APIs for every tool!

If you’ve ever wished your LLM could just “call a friend” (or a function) without learning a new language, MCP is your answer. It’s not magic, but it *is* a standardized way for LLMs to interact with external tools and services. By the end of this post, you’ll know how to wire up your own AI tools with MCP—and maybe even retire a few remotes of your own.

### 🌉 Bridging the Gap: Why MCP?

Let’s face it: AI agents are only as smart as the tools they can use. Imagine asking your AI to check the weather, only to get a blank stare (or worse, a hallucinated answer about “sunny with a chance of meatballs”). Frustrating, right?

MCP bridges the gap between your LLM and the outside world—whether that’s your local file system, a weather API, or your company’s HR database. It’s like giving your AI a phone and a contact list, so it can finally call the right people (or tools) when you need answers.

**Two main use cases:**
- **Personal Use:** Plug MCP into your favorite AI tools (Claude Desktop, IDEs, etc.).
- **Backend Integration:** Embed MCP into your Python apps and agent systems for seamless tool access. No more “Sorry, I can’t do that”—your AI can finally get stuff done.

*Think of MCP as the “universal translator” for your AI’s function-calling needs. No more language barriers between your LLM and the tools you love!*

### 🏢 MCP Architecture: Who Talks to Whom?

Picture a busy office: you (the host) ask your assistant (the client) to fetch a file from the archives (the server). MCP formalizes this workflow:

- **MCP Hosts:** The “boss” (Claude, IDEs, your app)
- **MCP Clients:** The “assistant” (protocol client)
- **MCP Servers:** The “specialists” (file server, web search server, etc.)
- **Local Data Sources:** The “archives” (files, DBs)
- **Remote Services:** The “vendors” (APIs, external systems)

#### 🧬 Under the Hood: JSON-RPC 2.0

MCP messages are sent using the [JSON-RPC 2.0](https://www.jsonrpc.org/specification) protocol—a lightweight, widely-used standard for remote procedure calls. This means your tools and LLMs can communicate in a predictable, language-agnostic way.

### 🛠️ MCP Primitives: Tools, Resources, Prompts

- **Tools:** Like giving your LLM a Swiss Army knife—functions it can call (add numbers, fetch weather, etc.).
- **Resources:** The context—files, DB records, or anything your LLM might need to “read up on.”
- **Prompts:** Templates for LLM interactions (think: Mad Libs for AI).

*💡 Pro tip: Start with tools. They’re the easiest way to make your LLM actually “do” stuff!*

### 🔌 Transport Mechanisms: Stdio vs. SSE

#### 📻 Stdio: The “Walkie-Talkie” Approach

- **How it works:** Both client and server run locally, chatting over standard input/output.
- **When to use:** Local dev, quick prototyping, or when you don’t want to deal with networks.
- **Analogy:** Like passing notes in class—simple, direct, but you have to be in the same room.

#### 🌐 SSE: The “Long-Distance Relationship”

- **How it works:** Client and server talk over HTTP and Server-Sent Events (SSE).
- **When to use:** When your client and server are on different machines, or you want to scale.
- **Analogy:** Like texting your friend across the world—reliable, works over the internet, but needs a little setup.

### 🧑‍💻 My Implementations

Let’s get our hands dirty! Here’s how I actually used MCP—warts, wins, and all.

#### 📻 1. Stdio: The “Walkie-Talkie” Approach

This is the “hello world” of MCP. I started with the stdio transport because, let’s be honest, who wants to debug network issues on day one?

**How I did it:**
- Ran `client-stdio.py` and `server.py` in the same terminal.
- The client asked the server what tools it had (spoiler: just an `add` function).
- I asked it to add 2 + 3. It obliged. Math class, but with robots.

**Sample logs:**
```
(crash-course) ➜  3-simple-server-setup git:(main) ✗ python3 client-stdio.py
[INFO] Processing request of type ListToolsRequest
Available tools:
  - add: Add two numbers together
[INFO] Processing request of type CallToolRequest
2 + 3 = 5
```

**Takeaway:**  
Great for local tinkering. Like using a calculator app, but you built the calculator.

#### 🌐 2. SSE: The “Long-Distance Relationship”

Once I got bored of talking to myself (and my computer), I tried the SSE transport. Now my client and server could live on different machines—like a distributed team, but with less coffee.

**How I did it:**
- Started the server: `python server.py` (it listened on port 8050).
- The client (`client-sse.py`) connected to `/sse` for real-time, streaming communication.
- FastMCP handled the HTTP/SSE magic behind the scenes.

**Sample logs:**
```
(crash-course) ➜  3-simple-server-setup git:(main) ✗ python server.py
Running server with SSE transport
INFO:     Uvicorn running on http://0.0.0.0:8050 (Press CTRL+C to quit)
[INFO] Processing request of type ListToolsRequest
[INFO] Processing request of type CallToolRequest
```
From the client:
```
(crash-course) ➜  3-simple-server-setup git:(main) ✗ python3 client-sse.py 
Available tools:
  - add: Add two numbers together
2 + 3 = 5
```

**What’s really happening:**  
The client connects to `/sse`, the server streams responses (and “pings” to keep the line open). It’s like a walkie-talkie, but with WiFi.

#### 🤖 3. LLM + Tools: The “Supercharged Chatbot” (RAG-style, No Vector DB)

Here’s where things get spicy. I wanted my LLM to be more than a parrot—so I gave it tools and a knowledge base. No fancy vector DBs, just a humble `docs.json` file with Q&A pairs.

**How I did it:**
- The MCP server exposed a tool: `get_knowledge_base`, which returned all Q&A pairs as a formatted string.
- The client (an LLM, e.g., GroqLLM) got the user’s question.
- The LLM decided: “Do I know this, or should I phone a friend (the tool)?”
- If it called the tool, the server fetched the info and handed it back. The LLM then crafted a user-friendly answer.

**Sample logs:**
```
(crash-course) ➜  4-groq-integration git:(main) ✗ python3 client.py
[INFO] Processing request of type ListToolsRequest

Connected to server with tools:
  - get_knowledge_base: Retrieve the entire knowledge base as a formatted string.

Query: What is our company's vacation policy?
[INFO] Processing request of type ListToolsRequest
[INFO] Processing request of type CallToolRequest

Response: According to our company's knowledge base, full-time employees are entitled to 20 paid vacation days per year...
```

**Why this is cool:**  
- **MCP is the bridge**—the LLM can “phone a friend” (tool) when it needs help.
- The LLM chooses when to use its own brain vs. external knowledge.
- It’s like RAG (Retrieval-Augmented Generation), but with a simple tool instead of a vector DB. Sometimes, simple is smart!

### 📝 Practical Considerations: Should You MCP?

- **Don’t fix what isn’t broken:** If your current function-calling setup works, don’t rush to MCP-ify everything.
- **But…** If you’re building new projects, or want to make your tools reusable and modular, MCP is a game-changer.
- **Start small:** Try stdio for local dev, then graduate to SSE when you’re ready to go global.

### 🔑 Key Takeaways

- **MCP = Universal remote for your AI tools.**
- **Stdio:** Great for local dev and prototyping.
- **SSE:** Perfect for distributed, production-ready setups.
- **LLM + Tools:** Where the magic happens—give your AI real superpowers.
- **Don’t overcomplicate:** Sometimes a simple tool beats a fancy database.

### 🏁 Conclusion: Is MCP for You?

MCP isn’t just another buzzword—it’s a practical, powerful standard for making your LLMs actually *do* things. Whether you’re building a personal AI assistant or a production-grade agent, MCP gives you the foundation for modular, reusable, and scalable integrations.

So next time your AI asks, “Can I phone a friend?”—hand it the MCP manual and watch the magic happen. 🪄

### 📚 Further Reading

**🔒 Security Tip:**  
- If you’re exposing MCP endpoints, make sure to secure your JSON-RPC layer!  
- Check out my deep dive: [Securing JSON-RPC](https://nkumar37.vercel.app/posts/securing_json_rpc)

### 🔗 References & Further Learning

- [DeepLearning.AI - Model Context Protocol](https://learn.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic/lesson/fkbhh/introduction)
- [MCP Crash Course](https://www.youtube.com/watch?v=5xqFjh56AwM)
- [MCP Krish Naik](https://www.youtube.com/watch?v=MDBG2MOp4Go)
- [My Github](https://github.com/iamheavymetalx7/learn-by-building/tree/rough-branch)