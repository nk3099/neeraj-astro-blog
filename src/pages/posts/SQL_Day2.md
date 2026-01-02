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

**Day 2 Challenge :**  

```sql
Day2: Business Days

create table tickets
(
ticket_id varchar(10),
create_date date,
resolved_date date
);
delete from tickets;
insert into tickets values
(1,'2022-08-01','2022-08-03')
,(2,'2022-08-01','2022-08-12')
,(3,'2022-08-01','2022-08-16');
create table holidays
(
holiday_date date
,reason varchar(100)
);
delete from holidays;
insert into holidays values
('2022-08-11','Rakhi'),('2022-08-15','Independence day'),('2022-08-13','test_holiday');

select * from tickets;
select * from holidays;
```

### ✅ Problem Setup

write sql query to find business day between create date and resolved date by excluding weekends and public holidays

```sql
select A.ticket_id, A.create_date,A.resolved_date,(A.excluding_weekend_days-A.no_of_holidays) as business_days
from
(select ticket_id,create_date,resolved_date,count(holiday_date) as no_of_holidays,
datediff(day,create_date,resolved_date) as total_days,
datediff(day,create_date,resolved_date) - 2*datediff(week,create_date,resolved_date) as excluding_weekend_days
from tickets
left join holidays on holiday_date between create_date and resolved_date
group by ticket_id, create_date,resolved_date) A
```

-- IF holiday is on the weekend, then calculate business holidays
--ie, weekend means saturday (or) sunday

-- select datename(weekday,'2022-08-13'); //ie. Saturday
--select datepart(weekday,'2022-08-13'); //ie. 7 (saturday-7, sunday-1)

```sql
select A.ticket_id, A.create_date,A.resolved_date,(A.excluding_weekend_days-A.no_of_holidays) as business_days
from
(
select ticket_id,create_date,resolved_date,count(holiday_date) as no_of_holidays,
datediff(day,create_date,resolved_date) as total_days,
datediff(day,create_date,resolved_date) - 2*datediff(week,create_date,resolved_date) as excluding_weekend_days
from tickets
left join holidays on holiday_date between create_date and resolved_date and datename(weekday,holiday_date) not in ('Saturday','Sunday')
group by ticket_id, create_date,resolved_date
) A
```


