---
layout: ../../layouts/MarkdownPostLayout.astro
title: "SQL: Day2"
publishedDate: 2026-01-02
description: ""
author: "Neeraj Kumar"
image:
  url: ""
  alt: ""
tags: ["CROSS APPLY"]
#hashnodeUrl: "https://nov1ce.hashnode.dev/integrating-ngrok-hashnode-webhook-api"
featuredPost: false
---

## 🚀 Introduction

**Day 2 Challenge:**  
Find the room types that are searched the most number of times. Output the room type alongside the number of searches for it.  
If the filter for room types contains multiple values, treat each unique room type as a separate row.  
Sort the result based on the number of searches in **descending order**.

---

### ✅ Problem Setup

Create a table `airbnb_searches` and insert sample data:

```sql
CREATE TABLE airbnb_searches (
    user_id INT,
    date_searched DATE,
    filter_room_types VARCHAR(200)
);

DELETE FROM airbnb_searches;

INSERT INTO airbnb_searches VALUES
(1,'2022-01-01','entire home,private room'),
(2,'2022-01-02','entire home,shared room'),
(3,'2022-01-02','private room,shared room'),
(4,'2022-01-03','private room');

SELECT * FROM airbnb_searches;


-- Check inserted data
SELECT * FROM airbnb_searches;

--Solution
SELECT 
    value AS room_type,
    COUNT(value) AS no_of_searches
FROM airbnb_searches
CROSS APPLY STRING_SPLIT(filter_room_types, ',')
GROUP BY value
ORDER BY no_of_searches DESC;

