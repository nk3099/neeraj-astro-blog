---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Building an Agentic AI Chatbot for Table Booking"
publishedDate: 2025-03-22
description: "Building an Agentic AI Chatbot for Table Booking"
author: "Neeraj Kumar"
image:
  url: ""
  alt: "Agentic AI"
tags:
  ["TIL", "Python", "learn-in-public", "Agent-AI", "Function-calling", "LLM"]
featuredPost: false
---

In today’s digital age, AI chatbots are transforming how businesses interact with their customers. Imagine being able to book a table at a busy restaurant without waiting in line or making a phone call—just by chatting with an intelligent system that handles everything for you. This blog takes you through the creation of an AI-powered chatbot designed to simplify restaurant table reservations.

The chatbot uses Large Language Models (LLMs) to communicate with users in a conversational, human-like manner. It collects key details such as the reservation name, time, and the number of attendees, checks availability against existing bookings, and confirms reservations. While it is built with Groq LLM—a model that’s not as advanced as the latest Claude models—it performs well in function calling. Additionally, the quality of prompts plays a significant role in making the bot more interactive and user-friendly, allowing developers to enhance the chatbot’s performance by optimizing these prompts.

This blog outlines the system’s key components, including how tool schemas are used to connect the chatbot to backend functions. It also highlights the design and code structure, offering a clear understanding for developers and enthusiasts alike.

Finally, we discuss areas for future improvement, such as enhancing error handling and adding features like rescheduling reservations. Simple adjustments like refining prompts can make a big difference in creating a chatbot that delivers a smooth and engaging user experience.

### Overview of the Table Booking System

The chatbot takes user inputs like the reservation name, time, and the number of attendees for a party. It processes the request through three primary functions:

- `ask_user`: Facilitates the conversation with users by leveraging an LLM (Groq LLM in this case).

- `get_booking_slots`: Checks available slots by reading a CSV file based on the user's input.

- `book_table`: Confirms the reservation by validating the details and updating the booking records.

> Note : Note: We are using Groq LLM, which is less capable compared to the latest Claude models. However, despite its limitations, Groq LLM demonstrates decent performance in function calling. Prompt design plays a crucial role in enhancing interactivity and user-friendliness—optimizing the prompts can significantly improve the bot's effectiveness.

Upon successful booking, the bot provides confirmation, and the reservation details are reflected in a `bookings.csv` file, sourced initially from `bookings_original.csv`.

### Core Functions and Schemas

To enable smooth interaction between the LLM and the backend logic, we define tool schemas for each function. These schemas describe how the LLM can call the functions to process user queries.

1. `ask_user` Function

   Schema:

   ```json
   {
     "type": "function",
     "function": {
       "name": "ask_user",
       "description": "Prompts the user for input and returns their response.\n\nThis function displays the provided `input_prompt` and waits for the user to enter a message.\nThe user's input is then returned as a string.\n\nReturns:\n    The user's input message.",
       "parameters": {
         "properties": {
           "input_prompt": {
             "description": "The prompt to display to the user, instructing them on what information to provide.",
             "title": "Input Prompt",
             "type": "string"
           }
         },
         "required": ["input_prompt"],
         "type": "object"
       }
     }
   }
   ```

   Code:

   ```python
    def ask_user(input_prompt: str) -> str:
        user_input = input(f"💬 {input_prompt}\n👉 Enter Message: ")
        return user_input
   ```

2. `get_booking_slots` Function

   Schema:

   ```json
   {
     "type": "function",
     "function": {
       "name": "get_booking_slots",
       "description": "Retrieves available booking slots for a given party size within a 1-hour time range around the provided time.\n\nThis function reads the booking data from a CSV file and checks for available tables that match the requested party size\nwithin a 1-hour window before and after the given time. The results are returned as a formatted string with available\nslots listed by time.\n\nReturns:\n    A formatted string containing the available time slots and tables that can accommodate the given party size.\nIf no slots are available, the returned string will be empty.",
       "parameters": {
         "properties": {
           "party_size": {
             "description": "The number of people in the party. The function will find tables that can accommodate at least this size.",
             "title": "Party Size",
             "type": "integer"
           },
           "time": {
             "description": "The time for which the booking is being requested, in \"HH:MM\" format (e.g., \"19:00\").",
             "title": "Time",
             "type": "string"
           }
         },
         "required": ["party_size", "time"],
         "type": "object"
       }
     }
   }
   ```

   Code:

   ```python
   def get_booking_slots(party_size: int, time: str):
       # Step 1: Read the CSV file containing booking data
       # Step 2: Convert the input time into a datetime object
       # Step 3: Define a 1-hour time range around the input time
       # Step 4: Initialize a list to hold available slots
       # Step 5: Iterate over bookings to find matching slots
       # Step 6: Sort the list of available slots by time
       # Step 7: Format the results into a readable list
       # Step 8: Convert the results list to a string and return
   ```

3. `book_table` Function

   Schema:

   ```json
   {
     "type": "function",
     "function": {
       "name": "book_table",
       "description": "Books a table for a given time and reservation name if the slot is available.\n\nThis function checks the availability of a specific table at the provided time.\nIf the table is available, the booking is added to the `bookings.csv` file. \nIf the table is already booked, it returns a failure message.\n\nReturns:\n    Returns `True` if the booking was successful, `False` otherwise.",
       "parameters": {
         "properties": {
           "table_name": {
             "description": "The name of the table to book (e.g., \"Table 1\").",
             "title": "Table Name",
             "type": "string"
           },
           "time": {
             "description": "The time of the booking in the format \"HH:MM\" (e.g., \"19:00\").",
             "title": "Time",
             "type": "string"
           },
           "reservation_name": {
             "description": "The name of the person making the reservation.",
             "title": "Reservation Name",
             "type": "string"
           }
         },
         "required": ["table_name", "time", "reservation_name"],
         "type": "object"
       }
     }
   }
   ```

   Code:

   ```python
   def book_table(table_name: str, time: str, reservation_name: str) -> bool:
       # Step 1: Read the current bookings from the CSV file
       # Step 2: Iterate through the list of bookings to find the correct row and time
       # Step 3: Check for table availability within the same time slot
       # Step 4: If booking time matches and the table is available, update the booking
       # Step 5: Write the updated bookings back to the CSV
       # Step 6: Return success message if the booking was successful
       # Slot is already booked, return failure message
       # Step 7: If no matching slot is found, return failure message
   ```

### Generating Function Schemas

Defining JSON schemas for each function can be labor-intensive. To simplify this, we use Mirascope, a tool that generates schemas automatically by parsing the function definitions and docstrings. Here's an example of how it's implemented:

```python
from mirascope.groq import GroqTool

def ask_user(input_prompt: str) -> str:
    """
    Prompts the user with a given message and returns their input.

    Args:
        input_prompt (str): The message or question to display to the user.

    Returns:
        str: The user's input as a string.
    """
    user_input = input(f"💬 {input_prompt}\n👉 Enter Message: ")
    return user_input


tool_type = GroqTool.from_fn(ask_user)
print(tool_type.tool_schema())  # prints the Groq-specific tool schema
```

```bash
(.venv) ➜  agentic-ai-meeting-scheduler git:(main) ✗ python -u "/Users/nitishkumar/Documents/learn-by-building/a
gentic-ai-meeting-scheduler/tools/schema/mirascope_schema.py"
{'type': 'function', 'function': {'name': 'ask_user', 'description': "Prompts the user with a given message and returns their input.\n\nReturns:\n    The user's input as a string.", 'parameters': {'properties': {'input_prompt': {'description': 'The message or question to display to the user.', 'title': 'Input Prompt', 'type': 'string'}}, 'required': ['input_prompt'], 'type': 'object'}}}
```

### User Interaction Log

Below is an example of how the bot interacts with the user during a table booking session, including the tool being called, the parameters used, and the system's response at each step:

```bash
(.venv) ➜  agentic-ai-meeting-scheduler git:(main) ✗ python3 booking_bot.py
💬 Tell me about the time/seats you'd like to book.
👉 Enter Message: 4pm
✨ System Response: ChatCompletionMessage(content=None, role='assistant', executed_tools=None, function_call=None, reasoning=None, tool_calls=[ChatCompletionMessageToolCall(id='call_mb5t', function=Function(arguments='{"input_prompt":"What is your reservation name?"}', name='ask_user'), type='function'), ChatCompletionMessageToolCall(id='call_c3f0', function=Function(arguments='{"input_prompt":"How many people are in your party?"}', name='ask_user'), type='function'), ChatCompletionMessageToolCall(id='call_51zc', function=Function(arguments='{"input_prompt":"You mentioned 4pm. Is that correct?"}', name='ask_user'), type='function')])

Tool use Block: id='call_mb5t' input='{"input_prompt":"What is your reservation name?"}' name='ask_user' type='tool_use'
💬 What is your reservation name?
👉 Enter Message: nk
🛠️ Using Tool [ask_user]: nk

✨ System Response: ChatCompletionMessage(content=None, role='assistant', executed_tools=None, function_call=None, reasoning=None, tool_calls=[ChatCompletionMessageToolCall(id='call_k2bz', function=Function(arguments='{"input_prompt":"How many people will be in your party?"}', name='ask_user'), type='function')])

Tool use Block: id='call_k2bz' input='{"input_prompt":"How many people will be in your party?"}' name='ask_user' type='tool_use'
💬 How many people will be in your party?
👉 Enter Message: 4
🛠️ Using Tool [ask_user]: 4

✨ System Response: ChatCompletionMessage(content=None, role='assistant', executed_tools=None, function_call=None, reasoning=None, tool_calls=[ChatCompletionMessageToolCall(id='call_qkfa', function=Function(arguments='{"party_size":4,"time":"16:00"}', name='get_booking_slots'), type='function')])

Tool use Block: id='call_qkfa' input='{"party_size":4,"time":"16:00"}' name='get_booking_slots' type='tool_use'
1900-01-01 16:00:00 1900-01-01 15:00:00 1900-01-01 17:00:00 printing the times
🛠️ Using Tool [get_booking_slots]: ['🕒 15:00 - table5 (4p)', '🕒 15:00 - table6 (4p)', '🕒 15:00 - table7 (4p)', '🕒 15:00 - table8 (4p)', '🕒 17:00 - table5 (4p)', '🕒 17:00 - table6 (4p)', '🕒 17:00 - table7 (4p)', '🕒 17:00 - table8 (4p)']

✨ System Response: ChatCompletionMessage(content=None, role='assistant', executed_tools=None, function_call=None, reasoning=None, tool_calls=[ChatCompletionMessageToolCall(id='call_fag6', function=Function(arguments='{"input_prompt":"Which time and table would you like to book? (e.g., \'15:00 - table5\')"}', name='ask_user'), type='function')])

Tool use Block: id='call_fag6' input='{"input_prompt":"Which time and table would you like to book? (e.g., \'15:00 - table5\')"}' name='ask_user' type='tool_use'
💬 Which time and table would you like to book? (e.g., '15:00 - table5')
👉 Enter Message: 15:00 - table5
🛠️ Using Tool [ask_user]: 15:00 - table5

✨ System Response: ChatCompletionMessage(content=None, role='assistant', executed_tools=None, function_call=None, reasoning=None, tool_calls=[ChatCompletionMessageToolCall(id='call_p16a', function=Function(arguments='{"reservation_name":"nk","table_name":"table5","time":"15:00"}', name='book_table'), type='function')])

Tool use Block: id='call_p16a' input='{"reservation_name":"nk","table_name":"table5","time":"15:00"}' name='book_table' type='tool_use'
🛠️ Using Tool [book_table]: ✅ Booking Success: table5 at 15:00 for nk

✨ System Response: ChatCompletionMessage(content='Your table is booked! You have successfully reserved table 5 at 15:00 for nk.', role='assistant', executed_tools=None, function_call=None, reasoning=None, tool_calls=None)
```

### Future Scope and Improvements

1. Error Handling:
   Handle scenarios where function calling fails due to missing tools. Implement robust error handlers to prevent the bot from hanging or requiring a conversation restart.

2. UI Enhancements:
   Develop a user-friendly UI component to complement the chatbot.

3. Advanced Features:
   Add capabilities for rescheduling bookings and handling modifications seamlessly.

4. Enhanced Analytics:
   Track user interactions and booking trends to improve functionality.

5. Error Logging:
   Use tools like Sentry for tracking and debugging issues in production.

### Further Reading

- For a deep dive into function calling, check out my previous blog: [Function Calling](https://nkumar37.vercel.app/posts/function_calling)

- Explore the complete repository: [booking table agentic bot](https://github.com/iamheavymetalx7/learn-by-building/tree/main/agentic-ai-meeting-scheduler)

<!-- Original Post : https://github.com/pixegami/claude-booking-bot -->
