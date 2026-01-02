
---
layout: ../../layouts/MarkdownPostLayout.astro
title: "SQL: Day 2"
publishedDate: 2026-01-02
description: "Calculate business days excluding weekends and holidays"
author: "Neeraj Kumar"
image:
  url: ""
  alt: ""
tags: ["SQL", "CROSS APPLY", "Business Days"]
featuredPost: false
---

## 🚀 Introduction

Welcome to **Day 2 of the SQL Challenge**!  
Today’s task is to calculate **business days** between two dates by excluding **weekends** and **public holidays**. This is a common requirement in ticketing systems, SLAs, and reporting dashboards.

---

### ✅ Problem Setup

We have two tables:

- **tickets** → contains `ticket_id`, `create_date`, and `resolved_date`
- **holidays** → contains `holiday_date` and `reason`

Here’s the schema and sample data:

```sql
CREATE TABLE tickets (
    ticket_id VARCHAR(10),
    create_date DATE,
    resolved_date DATE
);

CREATE TABLE holidays (
    holiday_date DATE,
    reason VARCHAR(100)
);

DELETE FROM tickets;
INSERT INTO tickets VALUES
(1,'2022-08-01','2022-08-03'),
(2,'2022-08-01','2022-08-12'),
(3,'2022-08-01','2022-08-16');

DELETE FROM holidays;
INSERT INTO holidays VALUES
('2022-08-11','Rakhi'),
('2022-08-15','Independence Day'),
('2022-08-13','Test Holiday');
``
