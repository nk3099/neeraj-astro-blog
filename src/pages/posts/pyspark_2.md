---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Part 2 - PySpark: DataFrames, Spark SQL, and Schema Management"
publishedDate: 2025-03-06
description: "PySpark - Part 2"
author: "Nitish Kumar"
image:
  url: ""
  alt: "PySpark Part 2"
tags: ["Python", "PySpark"]
featuredPost: true
---

### Recap: PySpark Foundations

In [Part 1](https://nkumar37.vercel.app/posts/pyspark_1) of this PySpark series, we explored the basics of Apache Spark, focusing on RDDs (Resilient Distributed Datasets), transformations, actions, and the underlying execution model.

We discussed the importance of partitions, the difference between narrow and wide transformations, and how Spark jobs, stages, and tasks are orchestrated for distributed data processing.

If you’re new to Spark or want a refresher on RDDs, transformations, and actions, check out the [previous post](https://nkumar37.vercel.app/posts/pyspark_1).

---

### Part 2: Higher-Level APIs in Apache Spark

As Spark evolved, so did its APIs. While RDDs provide fine-grained control, most real-world data engineering and analytics tasks benefit from higher-level abstractions: **DataFrames** and **Spark SQL**. These APIs offer powerful, expressive, and optimized ways to work with structured data.

#### Why Move Beyond RDDs?

- **Productivity**: DataFrames and Spark SQL allow you to write less code for complex tasks.
- **Performance**: Spark’s Catalyst optimizer can optimize DataFrame and SQL queries for better performance.
- **Interoperability**: DataFrames are easily convertible to SQL tables and vice versa, enabling seamless integration with BI tools and SQL workflows.

### Working with DataFrames

A **DataFrame** is a distributed collection of data organized into named columns, similar to a table in a relational database.

1. Load the data file and create a Spark Dataframe
2. Apply Transformations
3. Write the results back to Storage.
   (Spark Session is an entry point to the Spark Cluster in case of Higher Level
   APIs. Spark Context is for lower level RDDs)

#### Creating a DataFrame

The standard way to create a DataFrame from a CSV file:

```python
df = spark.read \
    .format("csv") \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .load("/path/to/your/file.csv")
```

- SparkSession is the entry point for DataFrame and SQL functionality.
- SparkContext is used for lower-level RDD operations.

### DataFrames and SQL Tables: Interoperability

DataFrames and Spark SQL tables are interconvertible:

```python
orders_df.createOrReplaceTempView("orders")
```

- orders_df is your DataFrame.
- createOrReplaceTempView registers it as a temporary SQL table called "orders".

Now, you can run SQL queries directly:

```python
filtered_df = spark.sql("SELECT * FROM orders WHERE order_status = 'Closed'")
```

To convert a Spark SQL table back to a DataFrame:

```python
orders_df = spark.read.table("orders")
orders_df.show()
```

### Temporary Views: Local vs Global

Spark provides several ways to register DataFrames as tables:

- createOrReplaceTempView: Creates or replaces a temporary view (session-scoped).
- createTempView: Errors out if the view already exists.
- createGlobalTempView: Creates a global view accessible across Spark sessions.
- createOrReplaceGlobalTempView: Replaces any existing global view.

### Managing Databases and Tables

1. Create a Database:
   ```python
   spark.sql("CREATE DATABASE IF NOT EXISTS my_database")
   ```
2. Show Databases:
   ```python
   spark.sql("SHOW DATABASES").show()
   ```
3. Show Tables:
   ```python
   spark.sql("SHOW TABLES").show()
   ```

### DataFrame API vs Spark SQL API: Practical Examples

Let’s see how common analytics tasks can be performed using both APIs.

1. Top 15 Customers by Number of Orders

- DataFrame API:

  ```python
  result = orders_df.groupBy("customer_id").count().sort("count", ascending=False).limit(15)
  ```

- Spark SQL:

  ```python
  result = spark.sql("""
      SELECT customer_id, COUNT(order_id) AS count
      FROM orders
      GROUP BY customer_id
      ORDER BY count DESC
      LIMIT 15
  """)
  ```

2. Customers with Most Closed Orders

- DataFrame API:

  ```python
  results = orders_df.filter("order_status = 'CLOSED'") \
      .groupBy("customer_id").count().sort("count", ascending=False)
  ```

- Spark SQL
  ```python
  results = spark.sql("""
      SELECT customer_id, COUNT(order_id) AS count
      FROM orders
      WHERE order_status = 'CLOSED'
      GROUP BY customer_id
      ORDER BY count DESC
  """)
  ```

### Actions, Transformations, and Utility Functions

- Actions: count, show, head, tail, collect
- Transformations: groupBy.count, orderBy, filter, distinct, join
- Utility Functions: printSchema, createOrReplaceGlobalTempView

### Schema Inference vs Explicit Schema

When reading data, Spark can automatically infer the schema (data types and column names) by scanning the input file. This is convenient, but not always reliable or efficient.

#### 1. Schema Inference (Automatic)

By default, Spark tries to infer the schema if you set `inferSchema` to `true`:

```python
df = spark.read \
    .format("csv") \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .load("/documents/orders.csv")
df.printSchema()
```

**Drawbacks of Schema Inference:**

- **Incorrect Data Types:** Spark may misinterpret column types (e.g., reading IDs as integers when they should be strings).
- **Performance Overhead:** Inferring schema requires scanning the entire dataset, which can be slow for large files.
- **Inconsistent Results:** Schema inference can yield different results if the data is inconsistent or contains malformed records.

#### 2. Explicit Schema Definition (Recommended)

To avoid these issues, it’s best to define the schema explicitly. There are two main approaches:

**A. String Schema**

You can specify the schema as a string:

```python
orders_schema = 'order_id long, order_date date, cust_id long, ord_status string'
df = spark.read \
    .format("csv") \
    .schema(orders_schema) \
    .option("header", "true") \
    .load("/documents/orders.csv")
df.printSchema()
```

**B. StructType Schema (More Flexible & Recommended)**

For more control and clarity, use `StructType` and `StructField` from `pyspark.sql.types`:

```python
from pyspark.sql.types import StructType, StructField, LongType, DateType, IntegerType, StringType

orders_schema_struct = StructType([
    StructField("order_id", LongType()),
    StructField("order_date", DateType()),
    StructField("cust_id", LongType()),
    StructField("ord_status", StringType())
])

df = spark.read \
    .format("csv") \
    .schema(orders_schema_struct) \
    .option("header", "true") \
    .load("/documents/orders.csv")
df.printSchema()
```

**Benefits of Explicit Schema:**

- Guarantees correct data types and column names.
- Avoids the overhead of scanning data for inference.
- Makes your ETL pipelines more robust and predictable.

### DataFrame Read Modes

1. permissive (default): Malformed records become NULL.
2. failfast: Errors out on malformed records.
3. dropMalformed: Drops malformed records.

### Creating DataFrames from RDDs

- Approach 1:

  ```python
  spark.createDataFrame(rdd, schema)
  ```

  or

  ```python
  spark.createDataFrame(rdd).toDF(*list_of_column_names)
  ```

- Approach 2:
  ```
  rdd.toDF(schema)
  ```

### Dataframe Transformations

| Transformations      | Description                                   | Syntax                                                                                                                                           |
| -------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. withColumn        | To add a new Column or change existing column | `df2 = df1.select("<list-of-column-names>", expr("<expression>"))` <br> or <br> `df2 = df1.selectExpr("<list-of-column-names-and-expressions>")` |
| 2. withColumnRenamed | To rename an existing Column                  | `df2 = df1.withColumnRenamed("<existing-column-names>", "<new-column-name>")`                                                                    |
| 3. drop              | To drop a Column                              | `df2 = df1.drop("<list-of-column-names>")`                                                                                                       |

Note:

- In case of “select” we will have to explicitly segregate the column
  names and expressions and mention the expressions used within
  an expr.
- In case of “selectExpr”, it automatically identifies whether the
  value passed is a column name or an expression and accordingly
  actions it.

### Removing Duplicates

- `df2 = df1.distinct()` — removes duplicates across all columns.
- `df2 = df1.dropDuplicates(["col1", "col2"])` — removes duplicates based on specific columns.

### What’s Next? (Coming in Part 3)

Stay tuned for the next part of this series, where we’ll unlock even more advanced Spark concepts and practical tips, including:

1. **Joins in Spark**: Deep dive into different types of joins (inner, left, right, outer), how Spark executes them, and when to use broadcast joins for optimal performance on large and small datasets.
2. **Repartition vs Coalesce**: Understand the differences between these two powerful DataFrame operations, and learn how to efficiently manage data distribution and optimize resource usage in your Spark jobs.
3. **Spark UI & Resource Manager (YARN)**: Get hands-on with Spark’s web UI to monitor, debug, and optimize your jobs. Learn how YARN manages resources and how to interpret job metrics for better performance tuning.
4. **Caching Strategies**: Discover when and how to cache RDDs, DataFrames, and tables to speed up iterative computations and avoid redundant processing.
5. **File Formats Explained**: Compare row-based formats like CSV with column-based formats like Parquet. Learn the trade-offs, best use cases, and how file format choices impact performance and storage.
