---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Automating Gmail Labeling and Notifications with n8n"
publishedDate: 2025-05-25
description: "Build a smart email classifier using n8n's no-code workflow automation with AI and Gmail integration."
author: "Nitish Kumar"
image:
  url: ""
  alt: "n8n Gmail workflow"
tags: ["TIL", "n8n", "learn-in-public", "automation", "AI", "email", "no-code"]
featuredPost: false
---

# Automating Gmail Labeling and Notifications with n8n

### Introduction

After exploring **n8n** in my [previous post](https://nkumar37.vercel.app/posts/exploring_n8n), I wanted to put its automation power to the test with a real-world use case. Like many of us, I use multiple email accounts, and realistically, I don’t have time to check each one every day. This often leads to missing important messages buried under less relevant ones.

To solve this, I built an intelligent email classification system using n8n. It automatically tags incoming emails into one of four categories: Very Important, Promotional, Spam, or Other. Based on the classification, the workflow takes specific actions—such as applying Gmail labels or, in the case of very important emails, forwarding them to my primary inbox to make sure I don’t overlook them.

In this blog, I’ll walk you through how I built this fully automated Gmail workflow powered by AI and n8n to keep my inbox organized and make sure nothing important slips through the cracks.

### 🧠 Workflow Overview

The goal of this project was to:

- Trigger the workflow upon receiving a new email.
- Use an AI model to classify the content.
- Automatically label the email in Gmail.
- If the email is **Very Important**, send it to my daily-use email account for follow-up.

Here’s a snapshot of the workflow in action:

![n8n Gmail Workflow](https://raw.githubusercontent.com/iamheavymetalx7/learn-by-building/main/n8n-gmail-automation/Capture-2025-05-25-160902.png)

### 🔧 Nodes Used in the Workflow

#### 1. **Gmail Trigger**

- **Purpose**: Starts the workflow when a new email arrives.
- **Setup**: Connected to my Gmail account and configured to react to `new:message`.

#### 2. **Text Classifier (AI Model)**

- **Purpose**: Uses a language model via Groq to classify the email content into one of:

  - `very-important`
  - `promotional`
  - `spam-email`
  - `other`

- **How It Works**:
  - The email body is passed to the Groq Chat Model node.
  - The model responds with a label based on the content.
  - The output is routed to one of the four branches accordingly.

#### 3. **Gmail Labeling Nodes**

Each output from the classifier is connected to a Gmail node that adds the corresponding label:

- **Gmail1**: Adds label `other`
- **Gmail2**: Adds label `promotional`
- **Gmail3**: Adds label `spam`
- **Gmail**: Adds label `very-important`

#### 4. **Gmail4: Send to Self**

- **Purpose**: If the email is `very-important`, send a copy to my daily-use Gmail account.
- **Note**: This ensures I don’t miss critical messages even if I'm not checking all accounts frequently.

### 🤖 Why Use AI Here?

Using an LLM (via Groq) allows for a context-aware, semantic classification. It’s not just about keyword matching but truly understanding the intent of the email. This makes the system more adaptable and intelligent compared to rule-based filters.

### 📌 Key Learnings

- **n8n’s visual interface** makes workflow building intuitive.
- **Groq’s Chat Model** integrates seamlessly and offers powerful classification.
- **Conditional branching in n8n** enables elegant handling of multiple scenarios.
- **Automating routine email triage** saves mental bandwidth and ensures important tasks aren’t missed.

### 💡 What Can You Build On Top?

- Connect to Slack or Telegram to ping you on high-priority emails.
- Store logs of classified emails in a Google Sheet for review.
- Periodically clean spam or promotional folders automatically.

---

### Closing Thoughts

This was a great exercise in blending **no-code automation** with **AI-powered decision-making**. The flexibility n8n provides allows you to scale such workflows into business-grade systems effortlessly.

If you're drowning in email or looking for a smart assistant to triage your inbox, give this a try!

### References

[Github Repo](https://github.com/iamheavymetalx7/learn-by-building/tree/main/n8n-gmail-automation)
