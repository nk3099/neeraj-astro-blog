---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Getting Started with FastAPI"
publishedDate: 2025-02-10
description: "Building High-Performance APIs in Python"
author: "Nitish Kumar"
image:
  url: ""
  alt: "Building High-Performance APIs in Python"
tags: ["TIL", "Python", "learn-in-public"]
---




FastAPI is a modern, fast (high-performance), web framework for building APIs with Python. It’s based on standard Python type hints and is designed for building robust, production-ready web applications quickly and efficiently.

## ✨ Why Choose FastAPI?

Before we dive into the code, let's quickly touch upon why FastAPI is gaining so much popularity:

*   **Easy to Learn:**  FastAPI's intuitive design and clear documentation make it accessible to developers of all levels.
*   **Rapid Development:**  The framework's features, like automatic data validation and interactive documentation, significantly accelerate the development process.
*   **High Performance:**  Built on top of Starlette and Pydantic, FastAPI delivers impressive speed and efficiency.
*   **Asynchronous by Default:** FastAPI embraces asynchronous programming, allowing you to handle multiple requests concurrently with ease.

---

## 🛠️ Installation

Getting started with FastAPI is a breeze. You'll need to install both FastAPI and Uvicorn, the ASGI server that powers FastAPI applications:

```bash
pip install fastapi
pip install uvicorn
```

---

## 🕹️ Your First FastAPI Application
Let's start with the classic "Hello, World!" example to see FastAPI in action:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "Nitish"}

```

Explanation:

- We import the FastAPI class.
- We create an instance of the FastAPI class, called app.
- We define a route using the @app.get("/") decorator, specifying that the root function should handle GET requests to the root path ("/").
- The root function returns a simple JSON response.

---

## 🏃‍♂️ Running Your Server
To run your FastAPI application, navigate to your project directory in the terminal and execute the following command:

```bash
uvicorn main:app --reload
```

Explanation:

- uvicorn: This invokes the Uvicorn server.
- main:app: This specifies the location of your application. main is the name of your Python file (e.g., main.py), and app is the name of your FastAPI instance.
- --reload: This crucial flag tells Uvicorn to automatically restart the server whenever you make changes to your code, making development a lot smoother.

Terminal Output:

```bash
(fastapivenv) ➜  FastAPI uvicorn main:app --reload
INFO:     Will watch for changes in these directories: ['/Users/nkumar37/Desktop/NK-Personal/FastAPI']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [24320] using StatReload
INFO:     Started server process [24324]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:50732 - "GET / HTTP/1.1" 200 OK
```
You can now access your application by opening http://127.0.0.1:8000 in your browser.

---

## ➕ Adding More Routes
Now that we have a basic setup, let's expand our application by adding more routes. We will create a simple to-do list.

```python
from fastapi import FastAPI

items = []
app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "Nitish"}

@app.post("/items")
def create_item(item: str):
    items.append(item)
    return items

```

Explanation:

- We initialize an empty list called items to store our to-do items.
- We define a new route using the @app.post("/items") decorator. This means that the create_item function will be executed when a POST request is sent to /items.
- The create_item function takes a string argument named item representing the new item text.
- We append the new item to the items list and return the updated list

**Testing with Curl**

You can test this endpoint by sending a POST request using curl in your terminal:

```bash
curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:8000/items?item=apple'

```
This command sends a POST request to /items with the query parameter item set to "apple".

**Retrieving Items**

Now, let's add a route to retrieve items:

```python
@app.get("/items/{item_id}")
def get_item(item_id: int) -> str:
    item = items[item_id]
    return item

```

Explanation:

- We use @app.get("/items/{item_id}") to define a route that takes a path parameter item_id.
- The get_item function receives item_id as an integer.
- We use the item_id to access the corresponding item from the items list.
- The item is then returned.
- Note: since every time you reload, the items list will be empty, make sure to add items to items list before running this.


**Handling Errors**

What happens if we try to retrieve an item that doesn't exist? Let's implement error handling:

```python
from fastapi import FastAPI, HTTPException
# ... other imports

@app.get("/items/{item_id}")
def get_item(item_id: int) -> str:
    if item_id < len(items):
        item = items[item_id]
        return item
    else:
        raise HTTPException(status_code=404, detail="Item  {item_id} not found")


```

Explanation:

- We import HTTPException from fastapi.
- We add a check to see if item_id is within the valid range of the items list.
- If item_id is out of range, we raise an HTTPException with a 404 status code (Not Found) and a descriptive error message.

---

## 🛣️ Request and Path Parameters

We've already used path parameters in the `/items/{item_id}` route. Now, let's explore request parameters:

```python
@app.get('/items')
def list_items(limit: int = 10):
    return items[:limit]

```

Explanation:

- We define a new GET route for /items.
- The list_items function takes an optional limit parameter, with a default value of 10.
- It returns a slice of the items list, up to the specified limit.

Even though both create_item and list_items use the same /items endpoint, they are handled differently because they use different HTTP request methods (POST and GET, respectively).

---

## 🎨 Data Validation with Pydantic
FastAPI seamlessly integrates with Pydantic, a powerful library for data validation and parsing. Let's enhance our to-do list by adding data validation:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# ...

class Item(BaseModel):
    text: str = None
    is_done: bool = False

# ...

@app.post("/items")
def create_item(item: Item):
    items.append(item)
    return items

@app.get("/items/{item_id}")
def get_item(item_id: int) -> Item:
    if item_id < len(items):
        item = items[item_id]
        return item
    else:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")

```
Explanation:

- We import BaseModel from pydantic.
- We define a class Item that inherits from BaseModel.
- We define two attributes: text (a string) and is_done (a boolean), both with default values.
- In the create_item function, we change the type hint for item to Item. This tells FastAPI to expect a JSON payload that conforms to the Item model.
- In the get_item function, we now specify the response model with the response type Item .
-  You have to send the items as a json payload.

**Sending JSON Payloads**
Now, when you use curl to create an item, you need to send a JSON payload:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"text":"apple"}' 'http://127.0.0.1:8000/items'

```

---

## 📤 Response Models
We can also use Pydantic models to define the structure of our API responses, using response_model argument.

```python
@app.get('/items', response_model=list[Item])
def list_items(limit: int = 10):
    return items[:limit]

@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int) -> Item:
    if item_id < len(items):
        item = items[item_id]
        return item
    else:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")

```

Explanation:

- We have added response_model = list[Item] to /items GET request which will show the response as a list of the item objects.
- We also have added response_model=Item for the get_item function which will show the response as the item object.

---

## 🌐 Interactive API Documentation
One of the most impressive features of FastAPI is its automatic interactive API documentation, powered by OpenAPI.

To access it, go to `http://127.0.0.1:8000/docs#/` in your browser. You'll find:
- Interactive Documentation: You can try out your API endpoints directly from the browser, execute test calls.
- Clear Endpoint Definitions: Each endpoint is clearly documented, including the expected request parameters, body, and response formats.
- Schema Definitions: You can see the definitions of your Pydantic models.

Also if you click on `openapi.json`, it will give you the complete json data file of all the `api` details that you have in the project.

🆚 FastAPI vs. Flask
Let's briefly compare FastAPI with another popular Python web framework, Flask:

---

## Feature Comparison 📊

| Feature               | **FastAPI**                                 | **Flask**                                      |
|-----------------------|---------------------------------------------|------------------------------------------------|
| **Asynchronous**       | Built-in and encouraged                     | Requires external libraries                   |
| **Ease of Use**        | Modern, intuitive, and concise              | Simple, but can become verbose                |
| **Performance**        | High performance thanks to Starlette        | Good, but generally slower                    |
| **Adoption**           | Rapidly growing                             | Very popular, large community                 |
| **Data Validation**    | Built-in with Pydantic                      | Requires manual or external validation        |

---

📂 **For full code access, refer to [this repo here]([https://github.com/iamheavymetalx7/fastapi-and-pydantic](https://github.com/iamheavymetalx7/learn-by-building/tree/main/fastapi-and-pydantic))**.

