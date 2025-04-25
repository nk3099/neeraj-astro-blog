---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Data Validation with Pydantic"
publishedDate: 2025-02-20
description: "Pydantic: Data Validation in Python Made Easy"
author: "Nitish Kumar"
image:
  url: ""
  alt: "### Pydantic: Data Validation in Python Made Easy"
tags: ["TIL", "Python", "learn-in-public"]
---

In the world of Python programming, one of the challenges that developers often encounter is the lack of static typing. Unlike statically typed languages like C++, Python uses dynamic typing. This means that when you declare a variable, you don't need to explicitly specify its type, leading to flexibility but also potential issues in larger codebases.

Let’s explore the concept of dynamic typing in Python and how it contrasts with static typing in other languages like C++:

**🧐 Dynamic Typing vs Static Typing**
Python (Dynamic Typing):
```python 
x = 10
```

C++ (Static Typing):
```c++
int x = 10;
```
In Python, you can assign any type of value to a variable without needing to declare the type explicitly. This gives you flexibility, but as your application grows larger, it becomes increasingly difficult to track what type a variable should be. This issue is especially prominent when working with function arguments.


### ⚠️ The Problem with Dynamic Typing 
With dynamic typing, it becomes easier to accidentally create invalid objects or pass incorrect types to functions. This can introduce bugs that are difficult to detect during development. As the size and complexity of the project grow, keeping track of types manually becomes unwieldy.

---

## 🛠️ Enter Pydantic: A Solution to Data Validation 
Pydantic is a robust library designed to solve these challenges. It enhances Python’s dynamic typing by providing powerful data validation, type hinting, and serialization features. Today, we’ll dive into how Pydantic can help ensure your data models are validated and correctly typed with ease.

Pydantic is widely used by some of the top tech companies, making it a powerful tool in modern Python applications. Let’s look at how it helps with data validation and how you can start using it effectively.

### 🌟 Key Benefits of Pydantic 
1. Type Hints: Pydantic ensures type safety by enforcing types on the fields of data models.

2. Data Validation: It validates data automatically when you create model instances, ensuring correctness.

3. JSON Serialization: Pydantic models can easily be serialized into JSON, making it simple to work with APIs and other data formats.


### 📦 Installing Pydantic 
To get started with Pydantic, you’ll first need to install it in your Python environment. You can do this by running the following command:

```bash
pip install pydantic

```

Once you have Pydantic installed, you're ready to start using it for model creation and validation!

---

## 🏗️ Building a Simple Model with Pydantic 
Let’s walk through an example where we define a `User` model. This model will have three fields: `name`, `email`, and `age`. The `BaseModel` class from Pydantic will be the foundation of our model, ensuring that the fields are properly validated.

**Defining a Model**
```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str
    age: int

```
In the code above, we define a User model where:

- `name` is a string
- `email` is a string
- `age` is an integer

With Pydantic, you don’t just define the structure of the model; it also takes care of validating the types of the attributes. Now, let’s move on to creating an instance of this model.


###  🧱  Creating an Instance of the Model
You can create an instance of the User model by passing the values directly:

```python
user = User(
    name="Json",
    email="json@pydantic.com",
    age=2
)

```
Alternatively, if you have data coming from an API or a dictionary, you can easily unpack it to create the model instance:

```python

user_data = {
    "name": "jack",
    "email": "jack@pydantic.com",
    "age": 4
}

user = User(**user_data)

```
This approach is incredibly useful when working with responses from APIs, as you can directly pass the data to the model, and Pydantic will ensure that the data is validated against the model’s schema.

### 🔑 Accessing Model Attributes 
Once the model instance is created, you can access its attributes like this:

```python
print(user.name)
print(user.email)
print(user.age)
```

---

## 🧪 Data Validation
One of the core strengths of Pydantic is its automatic data validation. When you define a model, Pydantic ensures that all the data passed into it matches the expected types. If not, it throws a clear and helpful error message.

Let’s see an example:

```python

from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str
    age: int

# This will raise a validation error because age is expected to be an integer
user = User(
    name="Json",
    email="json@pydantic.com",
    age="twenty"  # ❌ Invalid type
)


```

### 📧 Validating Email with EmailStr
Pydantic offers built-in types for common validations. For instance, you can validate whether a string is a valid email address using the `EmailStr` type.

```python

from pydantic import BaseModel, EmailStr

class User(BaseModel):
    name: str
    email: EmailStr  # ✅ Validates email format
    age: int

user = User(
    name="Json",
    email="json@pydantic.com",
    age=2
)

```

If you pass an invalid email (like `"hello@not"`), Pydantic will raise a ValidationError. This makes it incredibly powerful when accepting user input or API data.

---

## 🛠️ Custom Validation: Fine-Grained Control
Sometimes, you need to enforce custom rules beyond basic type validation. For that, Pydantic provides the @validator decorator, which lets you define your own validation logic for any field.

Here’s an example where we ensure that age must be positive:

```python
from pydantic import BaseModel, EmailStr, validator

class User(BaseModel):
    name: str
    email: EmailStr
    age: int

    @validator("age")
    def validate_age(cls, age):
        if age <= 0:
            raise ValueError(f"Age must be positive, got: {age}")
        return age

# ❌ This will raise an error because age is negative
user = User(
    name="Json",
    email="json@pydantic.com",
    age=-2
)

```

---

## 🔄 JSON Serialization and Deserialization

Pydantic models can be easily converted to and from JSON, which is a massive plus when working with APIs or storing structured data.

**➡️ Model to JSON String**

To convert a Pydantic model to a JSON string, simply call .json() on the instance:

```python
user_to_json = user.json()
print(user_to_json)

```


**➡️ Model to Python Dictionary**

If you prefer a plain Python dictionary (for further manipulation or sending to another service):

```py

user_dict = user.dict()
```

**⬅️ JSON String to Pydantic Model**
Have a JSON string and want to parse it back into a Pydantic model? Use parse_raw():

```python
json_str = '{"name":"Nitish", "email":"test@email.com", "age":24}'
user_from_json = User.parse_raw(json_str)

```

---

## 🥊 Pydantic vs Dataclasses

Pydantic is often compared with Python’s built-in `@dataclass`. Here’s a quick comparison to show what sets them apart:

| Feature           | ✅ Pydantic         | 🟡 Dataclass     |
|-------------------|---------------------|------------------|
| Type Hints        | ✅ Supported        | ✅ Supported     |
| Data Validation   | ✅ Built-in         | ❌ Manual        |
| Serialization     | ✅ Out of the box   | ⚠️ Manual        |
| Built-in Module   | ❌ (Third-party)    | ✅ Built-in      |


> 🧠 While dataclasses are great for lightweight data containers, Pydantic is the go-to choice when you need robust validation, serialization, and clearer error handling.

---

📂 **For full code access, refer to [this repo here](https://github.com/iamheavymetalx7/learn-by-building/tree/main/fastapi-and-pydantic)**.
