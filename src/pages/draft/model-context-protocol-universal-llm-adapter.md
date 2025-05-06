---
layout: ../../layouts/MarkdownPostLayout.astro
title: "MCP: The Universal Adapter for LLM Tool Calling"
publishedDate: 2025-04-18
description: ""
author: "Nitish Kumar"
image:
  url: ""
  alt: ""
tags: ["MCP", "AI", "Python"]
---

Integrating multiple LLM providers (OpenAI, Anthropic Claude, Groq, etc.) often means wrestling with inconsistent APIs. For example, OpenAI’s Chat API uses a `functions` list and returns completions in `response.choices[0].message`, whereas Claude’s API uses a `tools` list and returns an assistant message with a `content` array of blocks. Groq’s API is OpenAI-compatible and returns `tool_calls` inside `response.choices[0].message`. These differences force developers to write provider-specific parsing logic, which complicates code and hurts productivity.

### Function/Tool Schema Differences

- **OpenAI (GPT-4/GPT-3.5)** – Defines a `functions` parameter with JSON-schema parameters. For example:

  ```py
  functions = [{
      "name": "get_weather",
      "description": "Get the current weather",
      "parameters": {
          "type": "object",
          "properties": {
              "location": {"type": "string"},
              "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
          },
          "required": ["location"]
      }
  }]
  response = openai.ChatCompletion.create(
      model="gpt-4-0613",
      messages=[{"role":"user","content":"Weather in Boston?"}],
      functions=functions
  )

  ```

  The model’s function call is found in `response.choices[0].message.function_call` (if it chooses to call a function).

- **Anthropic Claude** – Uses a top-level `tools` array with entries `{name, description, input_schema}` in JSON Schema format. For example:

  ```python
  {
    "tools": [
      {
        "name": "get_weather",
        "description": "Get the current weather",
        "input_schema": {
          "type": "object",
          "properties": {
            "location": {"type": "string"},
            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
          },
          "required": ["location"]
        }
      }
    ],
    "messages": [
      {"role": "user", "content": "What’s the weather in SF today?"}
    ]
  }
  ```

  Claude integrates tool use into its chat flow. When Claude decides to use a tool, it returns an assistant message containing a `tool_use` block (with the tool `name` and `input`) within its `content` array.

- **Groq** - Supports OpenAI-compatible tool definitions. In a Groq chat request you pass a `tools` array where each element has `"type": "function"` and a nested `"function"` spec with `name`, `description`, and `parameters`. For example:
  ```python
  {
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get the current weather",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {"type": "string"},
              "unit": {"type": "string", "enum": ["celsius","fahrenheit"]}
            },
            "required": ["location"]
          }
        }
      }
    ]
  }
  ```
  The model will then output a `tool_calls` object (under `message.tool_calls`) when it wants to invoke a tool.

### Response Schema Differences

- **OpenAI/Groq** - Both use a `choices` list for chat completions. You get the assistant’s reply in `response.choices[0].message`. If a function/tool is called, OpenAI puts it in `message.function_call`, and Groq puts it in `message.tool_calls`. For example, a Groq response might look like:

  ```py
  {
    "choices": [{
      "message": {
        "role": "assistant",
        "tool_calls": [
          {
            "id": "call_123",
            "type": "function",
            "name": "get_weather",
            "arguments": "{\"location\": \"New York, NY\"}"
          }
        ]
      }
    }]
  }
  ```

  You’d extract the function name and arguments from `response.choices[0].message.tool_calls`.

- **Claude** - Returns a single message object (no `choices` array). Its structure includes `role` and a `content` array of blocks. For example:

  ```python
  {
    "role": "assistant",
    "content": [
      {"type": "text", "text": "Here's the weather:"},
      {
        "type": "tool_use",
        "id": "toolu_ABC",
        "name": "get_weather",
        "input": {"location": "San Francisco, CA", "unit": "celsius"}
      }
    ],
    "stop_reason": "tool_use"
  }
  ```

  Here `content[1]` is a `tool_use` block with the tool name and input parameters. This is quite different from the OpenAI/Groq pattern of a `tool_calls` list.

These mismatches force code like:

```python
if provider == "openai":
    call = response.choices[0].message.get("function_call")
    args = json.loads(call["arguments"])
elif provider == "groq":
    call = response.choices[0].message.tool_calls[0]
    args = json.loads(call["arguments"])
elif provider == "claude":
    blocks = response["content"]
    call_block = next(b for b in blocks if b["type"] == "tool_use")
    args = call_block["input"]
```

Such branching logic is error-prone and hard to maintain, especially as you add more models.

### Introducing Model Context Protocol (MCP)

![MCP](https://www.descope.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxqb1f63q68s1%2F2x3R1j8peZzdnweb5m1RK3%2Fa8628561358334a605e7f291560fc7cc%2FMCP_learning_center_image_1-min__1_.png&w=1920&q=75)

The Model Context Protocol (MCP) is an open standard designed to `unify` tool-calling and response formats across all LLMs. In MCP, tools are defined once in a standard manifest (like a JSON document) with names, schemas, etc. An LLM client then communicates with an MCP server (via JSON-RPC or HTTP) to invoke tools. Crucially, the `same protocol` works with any model or provider.

According to its spec, MCP provides a “standardized interface for AI models interacting with external systems”. For example, an MCP server can expose tools, resources, and prompts, and every tool description follows the same JSON-schema format. OpenAI and Google have announced MCP support, and Anthropic built it, so all major models can use it.

In practice, using MCP means you stop writing provider-specific parsing. For instance, you could do something like:

```python
from mcp.client import MCPClient

client = MCPClient(manifest="tools.json")
# Call model through MCP – MCP handles calling the right provider
response = client.chat_completions(model="anymodel", messages=conversation)
if response.functions:
    for func in response.functions:
        name = func.name
        args = func.args
        result = run_tool(name, **args)
    final = client.chat_completions(model="anymodel", messages=conversation, tools_result=result)
    print(final.content)
```

Here `response.functions` would be an MCP-standard array of function calls, no matter which LLM was used under the hood. You don’t need to check` if provider=="openai"` vs `claude` vs `groq`; MCP provides a single, unified schema for tool calls and results.

#### Code Comparison: Before vs. After MCP

**Without MCP (provider-specific):**

```python
# Call model and handle tool results manually
if provider == "openai":
    resp = openai.ChatCompletion.create(model="gpt-4", messages=messages, functions=functions)
    msg = resp.choices[0].message
    if msg.get("function_call"):
        name = msg.function_call.name
        args = json.loads(msg.function_call.arguments)
        result = run_tool(name, **args)
        # then append result and continue...
elif provider == "claude":
    resp = anthropic.messages.create(model="claude-3-7-sonnet", messages=messages, tools=tools)
    # Extract tool_use block from resp.content list
    blocks = resp.content
    tool_block = next(b for b in blocks if b["type"] == "tool_use")
    name = tool_block["name"]
    args = tool_block["input"]
    result = run_tool(name, **args)
    # then append result and continue...
elif provider == "groq":
    resp = groq_client.chat.completions.create(model="llama-3.3-70b-versatile", messages=messages, tools=tools)
    msg = resp.choices[0].message
    if msg.tool_calls:
        call = msg.tool_calls[0]
        name = call.name
        args = json.loads(call.arguments)
        result = run_tool(name, **args)
```

Each branch expects a different JSON structure (OpenAI uses `.message.function_call`, Claude uses `.content` array with type “tool_use”, Groq uses `.message.tool_calls`).

**With MCP (unified):**

```python
from mcp.client import ClientSession

# Connect to an MCP server that knows about our tools
session = ClientSession(url="http://localhost:port")
session.initialize(model=chosen_model)
response = session.chat_complete(messages=messages)
if response.tool_calls:
    for call in response.tool_calls:
        name = call.tool  # unified field name
        args = call.arguments
        result = run_tool(name, **args)
        session.append_tool_result(call.id, result)
    final = session.chat_complete()
    print(final.content)
```

Now there’s no if `provider==...` logic. The MCP client presents `response.tool_calls` in a standard way, and each call has `.tool` and `.arguments`. This works the same regardless of the actual LLM you’re using. The tooling (MCP manifest and server) handles the differences behind the scenes.

### Developer Productivity and Maintainability

Adopting MCP brings major benefits:

- Unified Schema: Define tools once in the MCP manifest; any model can use them. No more duplicating JSON schemas for OpenAI, Claude, etc.
- Simpler Code: One code path handles responses. You parse `response.tool_calls `(or similar) instead of writing separate parsers for each vendor.
- Easier Testing: Tools and prompts are consistent across LLMs, so your tests don’t need to mock each provider’s quirks.
- Future-Proof: As new models emerge, they can plug into MCP with minimal code changes on your side. Your app logic stays the same.
- Security/Control: MCP supports fine-grained permissions and explicit consent (e.g. Claude can ask the user to allow a tool call), giving more consistent governance of tools.

In short, MCP is like a “universal plug” for LLM tools. It eliminates the messy **“N×M” adapter problem of supporting N models and M tools**. Developers can focus on building tools and conversation logic, while MCP handles the plumbing. The result is cleaner, more maintainable code and faster development when integrating AI capabilities.

### References

Official docs and examples for each provider’s tool-calling (OpenAI, Anthropic, Groq).

<!-- Original Post: Documented by myself -->
