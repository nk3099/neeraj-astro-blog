---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Understanding and Implementing Function Calling with LLMs"
publishedDate: 2025-03-12
description: "Understanding and Implementing Function Calling with LLMs"
author: "Nitish Kumar"
image:
  url: ""
  alt: "Understanding and Implementing Function Calling with LLMs"
tags: ["TIL", "Python", "learn-in-public", "LLM"]
---

Large Language Models (LLMs) like OpenAI’s GPT and Groq’s LLaMA models have dramatically improved in reasoning and answering user queries.
But what happens when an LLM doesn't have all the data internally? How can we make it "talk" to our own functions to fetch live, custom information such as retrieving the latest mutual fund data or checking the status of a UPI transaction.

In this blog, we'll understand what Function Calling is, why it matters, and implement a working example using Groq's LLaMA 3 model (llama3-70b-8192).

### 🚀 What is Function Calling in LLMs?

Function Calling allows a language model to decide when to call an external function (your code) to answer a question.
Rather than making up an answer, the model requests specific data from a defined tool or function you provide. The model itself decides whether or not a function call is needed based on the user prompt and the function definitions you provide — you don't manually control this for each interaction.

Note: Always write clear and descriptive function docstrings. This helps the model accurately understand when and which function to call, based on the user's request.

### 🎒 Overview of Project setup

We'll build a Groq-powered chatbot that can handle user queries about:

- 📈 Mutual funds
- 💸 UPI transactions

If the model needs external data, it will call a Python function we've written!

Main steps:

1. Connect to Groq’s API.
2. Define available functions (tools).
3. Let the model choose when to call a function.
4. Feed the function's response back into the chat.
5. Return the final answer to the user.

### 📦 Project Structure

```bash
├── main.py # main file for conversation flow
├── tools.py # contains callable functions
├── .env # contains API key
├── logging_config.py# config for logging events
├── tool_log.log # log file for function calls and responses
```

### 🛠️ Key Components Explained

#### 1. Setting up the Environment

In main.py, we first import required packages:

```python
from groq import Groq
import os, json, warnings
from dotenv import load_dotenv
from logging_config import logging
from tools import tools, get_response, mutual_fund, upi
```

- groq → To interact with the LLaMA3 model.
- dotenv → Load the .env file where API keys are stored securely.
- tools.py → Contains all our callable functions.

We also configure logging to track function calls and responses:

```python
logging.basicConfig(
    filename='tool_log.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filemode='w'
)
```

#### 2. Connecting to the Groq Client

We retrieve the API key:

```python
groq_api_key = os.getenv("GROQ_API")
client = Groq(api_key=groq_api_key)
MODEL = "llama3-70b-8192"
```

#### 3. Running the Conversation (run_conversation())

This is the heart of the chatbot:

```python
def run_conversation(user_prompt):
    messages = [
        {
            "role": "system",
            "content": ("You are a function-calling LLM that uses the data extracted from the functions "
                        "to answer questions around mutual funds, UPI transactions."
                        "Do not apologize. Only use tool data."),
        },
        {"role": "user", "content": user_prompt},
    ]
```

_The UPI transactions feature is a dummy implementation, intended solely to demonstrate how function calling works._

We tell the LLM that it must rely only on our tools to answer questions.

Here's the flow inside:

- Create a messages array starting with a system message describing the model’s role.
- Add the user's prompt.
- Make an initial call to the Groq API.
- Check if tool calls are present: _Tool calls are special structured responses from the model indicating that it wants to use a function._
  - If yes, call the right function(s) using extracted arguments.
  - Append the tool responses to messages.
  - Make a second call to get the final response after tool execution.
- If no tool is needed, directly return the first response

#### 4. Defining Tools Metadata

This is crucial because the LLM needs to know what arguments to expect for each function.

```python

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_response",
            "description": "Responding to a casual chat",
            "parameters": {
                "type": "object",
                "properties": {
                    "question": {
                        "type": "string",
                        "description": "Responding a casual chat",
                    }
                },
                "required": ["question"],
            },
        },
    },
    # mutual_fund and upi tools are also defined similarly inside tools.py.
]
```

#### 5. Function Execution

When the model decides to call a tool:

- We find the correct function.
- Parse the arguments.
- Call the function with these arguments.
- Log everything for debugging.

```python
function_name = tool_call.function.name
function_to_call = available_functions[function_name]
function_args = json.loads(tool_call.function.arguments)
function_response = function_to_call(**function_args)
```

### 🖥️ Sample Execution

Let's run the file:

```bash
python main.py
```

This will trigger the function with the following input:

```python
print(run_conversation("tell me about UTINEXT50.BO mutual fund"))

```

The console output will look like:

```bash
* The fund name is UTI Mutual Fund - UTI-Nifty Next 50 Exchange Traded Fund.
* The symbol is UTINEXT50.BO.
* The NAV (Net Asset Value) is not available.
* The 1-year return is 5.00%.
* The category is not available.
```

The following logs show the step-by-step process of how function calls are executed during the conversation:

```bash
2025-03-27 23:33:09,080 - INFO - HTTP Request: POST https://api.groq.com/openai/v1/chat/completions "HTTP/1.1 200 OK"
2025-03-27 23:33:09,091 - INFO - Response message: ChatCompletionMessage(content=None, role='assistant', executed_tools=None, function_call=None, reasoning=None, tool_calls=[ChatCompletionMessageToolCall(id='call_1ayb', function=Function(arguments='{"fund_symbol":"UTINEXT50.BO"}', name='mutual_fund'), type='function')])
2025-03-27 23:33:09,091 - INFO - Tool calls: [ChatCompletionMessageToolCall(id='call_1ayb', function=Function(arguments='{"fund_symbol":"UTINEXT50.BO"}', name='mutual_fund'), type='function')]
2025-03-27 23:33:09,639 - INFO - Calling tool: mutual_fund with arguments: {'fund_symbol': 'UTINEXT50.BO'}
2025-03-27 23:33:09,639 - INFO - Response: {"fund_name": "UTI Mutual Fund - UTI-Nifty Next 50 Exchange Traded Fund", "symbol": "UTINEXT50.BO", "nav": "N/A", "1_year_return": "5.00%", "category": "N/A"}
2025-03-27 23:33:10,014 - INFO - HTTP Request: POST https://api.groq.com/openai/v1/chat/completions "HTTP/1.1 200 OK"
```

Here's what happens behind the scenes when the model processes the query:

- Recognizing the Need: The model identifies that it needs information about the 1-year return of the specified mutual fund.
- Function Call: It automatically calls the mutual_fund() function with the argument fund_symbol="UTINEXT50.BO".
- Processing the Result: The model receives the function's response, which contains the relevant data.
- Answer Generation: It uses the retrieved data to craft a detailed and accurate response, such as:
  - Fund Name: UTI Mutual Fund - UTI-Nifty Next 50 Exchange Traded Fund
  - Symbol: UTINEXT50.BO
  - 1-Year Return: 5.00%

### 🧩 Why Use Function Calling?

✅ Fetch real-time data.
✅ Customize model behavior (e.g., fetch prices, query databases, etc.).
✅ Keep the model factual instead of hallucinating.
✅ Build powerful agents that feel truly intelligent.

### 📌 Tips for Using Function Calling Well

- Always validate user input before running any risky operations (avoid security risks).
- Timeout or handle errors if a tool doesn't respond.
- Use logging generously for tracking behavior and debugging.
- Be clear in your system prompt so that the model understands when to call a function.

### 🚀 Final Words

Function calling is a game-changer for how AI will interact with the world.
By combining powerful reasoning of LLMs with trusted, real-time functions, you create systems that are smart, reliable, and super useful.

For the complete repository, check it out [here](https://github.com/iamheavymetalx7/learn-by-building/tree/main/function-calling-python).
