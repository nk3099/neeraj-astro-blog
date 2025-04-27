---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Securing JSON-RPC: Authentication Strategies"
publishedDate: 2025-04-25
description: "Securing JSON-RPC: Authentication Strategies"
author: "Nitish Kumar"
image:
  url: ""
  alt: "Securing JSON-RPC: Authentication Strategies"
tags: ["TIL", "JavaScript", "learn-in-public", "json-rpc"]
---

JSON-RPC gives you elegant, direct access to server methods—but without authentication, you're essentially leaving the back door wide open. This post shows you how to implement robust security without sacrificing simplicity.

This post is a security-focused follow-up to [Bharathvaj Ganesan's Introduction to JSON-RPC](https://bharathvaj.com/posts/json-rpc-uncovered/).

### What You'll Learn

In this tutorial, we'll enhance a basic JSON-RPC implementation by adding two authentication methods:

- **API Key Authentication**: Simple and effective for service-to-service communication
- **JWT Authentication**: More robust for user-specific permissions and identity management

We'll maintain JSON-RPC's elegant simplicity while adding the security layer necessary for production environments.

#### Prerequisites

- Basic understanding of JSON-RPC (review the [original post](https://bharathvaj.com/posts/json-rpc-uncovered/) if needed)
- Familiarity with Node.js and Express
- Understanding of authentication concepts

### ⚡ Quick Recap: What’s JSON-RPC Again?

[JSON-RPC](https://www.jsonrpc.org/specification) is a stateless, lightweight remote procedure call (RPC) protocol that uses JSON to encode messages. It supports:

- **Request:** A method call with optional parameters and an ID.
- **Response:** A result or error, tied to the request ID.
- **Notification:** A method call without an ID (no response expected).

It can work over **HTTP**, **WebSocket**, or **TCP**, and feels like texting your server to do stuff.

### 🧱 The Problem: It’s Too Open

A vanilla JSON-RPC endpoint will accept calls from _anyone_. That’s cool for demos, but risky in production. We need to lock things down with **authentication**.

#### 🔑 Method 1: API Key Authentication

API keys provide a simple yet effective way to authenticate clients. They're perfect for service-to-service communication where you don't need user-specific permissions.

##### ✅ Client Request with API Key

On the client side, simply include the API key in your request headers:

```javascript
// Use API key authentication
const AUTH_MODE = "api-key";
const API_KEY = "my-api-key-123";

// Add the API key to headers
function getAuthHeaders() {
  if (AUTH_MODE === "api-key") {
    return { "x-api-key": API_KEY };
  }
  return {};
}

// Make an authenticated RPC call
async function sendRpcRequest(body) {
  const res = await fetch("http://localhost:3000/rpc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  return await res.json();
}
```

On the server side, we validate the API key before processing any request:

```javascript
// Server-side API key validation logic
const VALID_API_KEYS = new Set(["my-api-key-123", "another-key-456"]);

// This is part of our authenticate middleware
if (apiKey && VALID_API_KEYS.has(apiKey)) {
  req.apiKey = apiKey; // Store the API key for potential logging/auditing
  return next(); // Proceed to handle the RPC request
} else {
  // Authentication failed
  return res
    .status(401)
    .json(
      jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest("Unauthorized"))
    );
}
```

#### 🛡️ Method 2: JWT Authentication

JWT (JSON Web Tokens) provides more sophisticated authentication with the ability to encode user information directly in the token.

##### ✅ Client Request with JWT Key

First, obtain a JWT token from your authentication endpoint:

```javascript
// Get a JWT token
async function fetchJwtToken() {
  const res = await fetch("http://localhost:3000/token");
  const data = await res.json();
  JWT_TOKEN = data.token;
}

// Set up JWT authentication
const AUTH_MODE = "jwt";
let JWT_TOKEN = ""; // Will be populated by fetchJwtToken()

// Configure headers for JWT auth
function getAuthHeaders() {
  if (AUTH_MODE === "jwt") {
    return { Authorization: `Bearer ${JWT_TOKEN}` };
  }
  return {};
}
```

Then use it for your RPC calls:

```javascript
// Make an authenticated RPC call
async function makeAuthenticatedCall() {
  // First ensure we have a token
  if (AUTH_MODE === "jwt") {
    await fetchJwtToken();
  }

  // Then make the RPC call
  const result = await sendRpcRequest(jsonrpc.request(1, "add", [5, 3]));
  console.log("Result:", result);
}
```

On the server side, we verify the JWT before proceeding:

```javascript
// Server-side JWT verification
if (authHeader?.startsWith("Bearer ")) {
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store user info for potential use in methods
    return next();
  } catch (err) {
    return res
      .status(401)
      .json(
        jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest("Invalid JWT"))
      );
  }
}
```

### 🧪 Bonus: Support Both API Key & JWT

The best approach is often to support multiple authentication methods. Our server already does this with a unified authentication middleware:

**server.js**

```javascript
const express = require("express");
const jsonrpc = require("jsonrpc-lite");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";
const VALID_API_KEYS = new Set(["my-api-key-123", "another-key-456"]);

// Auth middleware - JWT or API Key
// here: authenticate middleware runs first.
// If authentication fails, it can stop the request and return an error.
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const apiKey = req.headers["x-api-key"];

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res
        .status(401)
        .json(
          jsonrpc.error(
            null,
            jsonrpc.JsonRpcError.invalidRequest("Invalid JWT")
          )
        );
    }
  } else if (apiKey && VALID_API_KEYS.has(apiKey)) {
    req.apiKey = apiKey;
    return next();
  } else {
    return res
      .status(401)
      .json(
        jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest("Unauthorized"))
      );
  }
}

const methods = {
  add: (params) => {
    if (!Array.isArray(params) || params.length !== 2)
      throw jsonrpc.JsonRpcError.invalidParams("Bad params, no sum!");
    return params[0] + params[1];
  },
  greet: (params) => {
    if (!params?.name)
      throw jsonrpc.JsonRpcError.invalidParams("No name, no fame!");
    return `Yo, ${params.name}, what’s good?`;
  },
  log: (params) => {
    if (!params?.message)
      throw jsonrpc.JsonRpcError.invalidParams("No message to log!");
    console.log(`Notification: ${params.message}`);
    return null;
  },
};

app.post("/rpc", authenticate, (req, res) => {
  const parsed = jsonrpc.parseObject(req.body);
  console.log(parsed);

  if (parsed.type === "invalid") {
    return res
      .status(400)
      .json(jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest()));
  }

  const { type, payload } = parsed;

  if (type === "notification") {
    try {
      if (!methods[payload.method]) throw jsonrpc.JsonRpcError.methodNotFound();
      methods[payload.method](payload.params);
      return res.status(204).send();
    } catch (error) {
      return res.status(204).send();
    }
  }

  if (type === "request") {
    try {
      if (!methods[payload.method]) throw jsonrpc.JsonRpcError.methodNotFound();
      const result = methods[payload.method](payload.params);
      res.json(jsonrpc.success(payload.id, result));
    } catch (error) {
      res.status(400).json(jsonrpc.error(payload.id, error));
    }
  }
});

app.get("/token", (req, res) => {
  const token = jwt.sign({ user: "testUser" }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});
app.listen(3000, () =>
  console.log("🔗 JSON-RPC server at http://localhost:3000")
);
```

**client.js**

```js
const jsonrpc = require("jsonrpc-lite");

const AUTH_MODE = "jwt";
let JWT_TOKEN = ""; //fetchJwtToken function handles this
const API_KEY = "my-secret-api-key"; // api-key needs to be replaced

function getAuthHeaders() {
  if (AUTH_MODE === "jwt") {
    console.log("Using JWT authentication");
    return { Authorization: `Bearer ${JWT_TOKEN}` };
  } else if (AUTH_MODE === "api-key") {
    return { "x-api-key": API_KEY };
  }
  return {};
}

async function fetchJwtToken() {
  const res = await fetch("http://localhost:3000/token");
  const data = await res.json();
  JWT_TOKEN = data.token;
}

async function sendRpcRequest(
  body,
  skipResponse = false,
  addAuthentication = true
) {
  const headers = {
    "Content-Type": "application/json",
    ...(addAuthentication ? getAuthHeaders() : {}),
  };

  const res = await fetch("http://localhost:3000/rpc", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (skipResponse) {
    return res.status;
  }

  return await res.json();
}

async function test() {
  if (AUTH_MODE === "jwt") {
    await fetchJwtToken();
  }
  console.log(
    "✅ With Auth - add([5, 3]):",
    await sendRpcRequest(jsonrpc.request(1, "add", [5, 3]), false, true)
  );
  console.log(
    "✅ With Auth - greet({ name: 'Alice' }):",
    await sendRpcRequest(
      jsonrpc.request(2, "greet", { name: "Alice" }),
      false,
      true
    )
  );
  console.log(
    "✅ With Auth - notification:",
    await sendRpcRequest(
      jsonrpc.notification("log", {
        message: "Hello",
      }),
      true,
      true
    )
  );

  console.log(
    "🚫 No Auth - add([1, 2]):",
    await sendRpcRequest(jsonrpc.request(3, "add", [1, 2]), false, false)
  );
}

test();
```

We will be seeing the followings logs in client terminal

```bash
======= JWT AUTHENTICATION TESTS =======
Using JWT authentication
✅ JWT Auth - add([5, 3]): { jsonrpc: '2.0', id: 1, result: 8 }
Using JWT authentication
✅ JWT Auth - greet({ name: 'Alice' }): { jsonrpc: '2.0', id: 2, result: 'Yo, Alice, what’s good?' }
Using JWT authentication
✅ JWT Auth - notification: 204

======= API KEY AUTHENTICATION TESTS =======
i-am-here
✅ API Key Auth - add([10, 20]): { jsonrpc: '2.0', id: 3, result: 30 }
i-am-here
✅ API Key Auth - greet({ name: 'Bob' }): { jsonrpc: '2.0', id: 4, result: 'Yo, Bob, what’s good?' }
i-am-here
✅ API Key Auth - notification: 204

======= NO AUTHENTICATION TESTS (SHOULD FAIL) =======
🚫 No Auth - add([1, 2]): {
  jsonrpc: '2.0',
  id: null,
  error: { message: 'Invalid request', code: -32600, data: 'Unauthorized' }
}
🚫 No Auth - greet({ name: 'Charlie' }): {
  jsonrpc: '2.0',
  id: null,
  error: { message: 'Invalid request', code: -32600, data: 'Unauthorized' }
}
🚫 No Auth - notification: 401
```

### ✅ Wrap-Up: RPC, But Make It Safe

JSON-RPC already makes calling remote functions fun and easy — now we’ve added secure access using two battle-tested approaches. Choose based on your needs:

API Key for quick-and-easy control.

JWT for deeper user-based logic.

### 🚀 What’s Next?

⏳ Rate limit per API key or user

🌐 Upgrade to WebSocket for real-time secure RPC

### 🙌 Big Shoutout

This post builds on an awesome intro to JSON-RPC written by [Bharathvaj Ganesan](https://bharathvaj.com/). Go check it out — it’s lighthearted, informative, and rpc-licious.

Let’s keep rpc-king it. 👑
