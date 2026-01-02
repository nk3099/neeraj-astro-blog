---
layout: ../../layouts/MarkdownPostLayout.astro
title: "SQL Challenge: Day 2 – Business Days Calculation"
publishedDate: 2026-01-02
description: "Calculate business days between create and resolved dates by excluding weekends and public holidays"
author: "Neeraj Kumar"
image:
  url: ""
  alt: ""
tags: ["SQL", "DATENAME"]
featuredPost: false
---

## 🚀 Introduction

Welcome to **Day 2 of the SQL Challenge** 👋  
In this challenge, we solve a very common real-world SQL problem:  
**calculating business days between two dates**.

This logic is widely used in:
- Ticketing and support systems (SLA calculations)
- Delivery and turnaround time tracking
- Business and operational reports

---

## 🧩 Problem Statement

> **Problem:**  
> Write a SQL query to calculate the number of **business days** between `create_date` and `resolved_date` by:
>
> - Excluding **weekends (Saturday & Sunday)**
> - Excluding **public holidays**
> - Ensuring holidays that fall on weekends are not double-counted

---

## 📊 Table Structure

We are working with two tables.

### 🗂️ Table: `tickets`
- `ticket_id` – Unique identifier for the ticket  
- `create_date` – Ticket creation date  
- `resolved_date` – Ticket resolution date  

### 🗂️ Table: `holidays`
- `holiday_date` – Date of the public holiday  
- `reason` – Holiday description  

---

## 🧪 Sample Data

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
🛠️ Approach / Logic
To calculate business days, we follow these steps:

Calculate the total number of days between create_date and resolved_date

Subtract weekend days using DATEDIFF(WEEK)

Subtract public holidays

Ensure holidays falling on weekends are excluded from holiday count

🔹 Step 1: Exclude Weekends
First, remove weekends from the total day count.

sql
Copy code
SELECT 
    A.ticket_id,
    A.create_date,
    A.resolved_date,
    (A.excluding_weekend_days - A.no_of_holidays) AS business_days
FROM (
    SELECT 
        ticket_id,
        create_date,
        resolved_date,
        COUNT(holiday_date) AS no_of_holidays,
        DATEDIFF(DAY, create_date, resolved_date) AS total_days,
        DATEDIFF(DAY, create_date, resolved_date)
          - 2 * DATEDIFF(WEEK, create_date, resolved_date)
          AS excluding_weekend_days
    FROM tickets
    LEFT JOIN holidays 
        ON holiday_date BETWEEN create_date AND resolved_date
    GROUP BY ticket_id, create_date, resolved_date
) A;
⚠️ Issue
If a holiday falls on a Saturday or Sunday, it gets subtracted twice:

Once as a weekend

Once as a holiday

🔹 Step 2: Identify Weekend Days
sql
Copy code
-- Saturday
SELECT DATENAME(WEEKDAY, '2022-08-13');   -- Saturday
SELECT DATEPART(WEEKDAY, '2022-08-13');   -- 7

-- Sunday
SELECT DATEPART(WEEKDAY, '2022-08-14');   -- 1
This helps us exclude holidays that occur on weekends.

✅ Final Solution: Correct Business Days Calculation
Exclude holidays that fall on weekends so that only business holidays are subtracted.

sql
Copy code
SELECT 
    A.ticket_id,
    A.create_date,
    A.resolved_date,
    (A.excluding_weekend_days - A.no_of_holidays) AS business_days
FROM (
    SELECT 
        ticket_id,
        create_date,
        resolved_date,
        COUNT(holiday_date) AS no_of_holidays,
        DATEDIFF(DAY, create_date, resolved_date) AS total_days,
        DATEDIFF(DAY, create_date, resolved_date)
          - 2 * DATEDIFF(WEEK, create_date, resolved_date)
          AS excluding_weekend_days
    FROM tickets
    LEFT JOIN holidays 
        ON holiday_date BETWEEN create_date AND resolved_date
       AND DATENAME(WEEKDAY, holiday_date) NOT IN ('Saturday', 'Sunday')
    GROUP BY ticket_id, create_date, resolved_date
) A;
📈 Output / Result (Expected)
ticket_id	business_days
1	2
2	8
3	10

⚠️ Edge Cases & Notes
Assumes Saturday and Sunday are weekends

DATENAME(WEEKDAY) behavior may vary with language settings

Logic shown is SQL Server–specific (DATEDIFF, DATENAME)

🎯 Key Takeaways
DATEDIFF(WEEK) is a simple way to remove weekends

Always exclude weekend holidays to avoid double counting

This approach is ideal for SLA and turnaround-time calculations

💡 Variations & Extensions
Rewrite using CROSS APPLY

Use a calendar table for more flexibility

Adapt for different weekend definitions