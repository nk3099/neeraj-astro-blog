---
layout: ../../layouts/MarkdownPostLayout.astro
title: "SQL Challenge: Day 2 – Business Days Calculation"
publishedDate: 2026-01-02
description: "Calculate business days between create and resolved dates by excluding weekends and public holidays"
author: "Neeraj Kumar"
tags: ["SQL", "DATENAME"]
featuredPost: false
---

# SQL Challenge: Day 2 – Business Days Calculation

## Use Case

Calculating business days between two dates is essential for:
- SLA calculations in ticketing systems
- Delivery and turnaround time tracking
- Business and operational reporting

This ensures accurate timelines by excluding weekends and public holidays.

---

## Question

Write a SQL query to calculate the number of **business days** between `create_date` and `resolved_date` by:
- Excluding weekends (Saturday & Sunday)
- Excluding public holidays
- Avoiding double-counting holidays that fall on weekends

---

## Table Structure

### `tickets`
- `ticket_id` – Unique identifier for the ticket
- `create_date` – Ticket creation date
- `resolved_date` – Ticket resolution date

### `holidays`
- `holiday_date` – Date of the public holiday
- `reason` – Holiday description

---

## Sample Data

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

-- Sample Tickets
DELETE FROM tickets;
INSERT INTO tickets VALUES
(1,'2022-08-01','2022-08-03'),
(2,'2022-08-01','2022-08-12'),
(3,'2022-08-01','2022-08-16');

-- Sample Holidays
DELETE FROM holidays;
INSERT INTO holidays VALUES
('2022-08-11','Rakhi'),
('2022-08-15','Independence Day'),
('2022-08-13','Test Holiday');
```

---

## Approach

1. Calculate total days between `create_date` and `resolved_date`.
2. Subtract weekends using `DATEDIFF(WEEK)`.
3. Subtract public holidays.
4. Exclude holidays that fall on weekends to avoid double-counting.

---

## Final Solution

```sql
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
```

---

## Expected Output

| ticket_id | business_days |
|-----------|---------------|
| 1         | 2             |
| 2         | 8             |
| 3         | 10            |

---

## Notes
- Assumes Saturday and Sunday are weekends.
- `DATENAME(WEEKDAY)` behavior may vary with language settings.
- Logic shown is SQL Server–specific.

---

## Key Takeaways
- Use `DATEDIFF(WEEK)` to remove weekends.
- Always exclude weekend holidays to avoid double counting.
- Ideal for SLA and turnaround-time calculations.
