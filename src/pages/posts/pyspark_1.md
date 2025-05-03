---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Part 1 - PySpark : Getting Started"
publishedDate: 2025-02-26
description: "PySpark - Part 1 : Getting Started with PySpark"
author: "Nitish Kumar"
image:
  url: ""
  alt: "Getting Started with PySpark"
tags: ["Python", "PySpark"]
---

This is the first blog in my PySpark learning journey, where I explore the foundational concepts of Spark, RDDs, and key PySpark functions. From understanding transformations to working with higher-order functions and partitioning, this blog serves as an introduction to the core building blocks of Spark and PySpark.

### Exploring Apache Spark and PySpark

Apache Spark is a powerful, plug-and-play compute engine designed for distributed processing. Whether you're dealing with massive datasets or building scalable machine learning models, Spark offers the tools and flexibility required for high-performance data processing.

### What Does Spark Need to Operate?

To function effectively, Spark relies on two critical components:

1. **Storage**: This can range from distributed file systems like HDFS to cloud-based solutions like:

   - Azure Data Lake Storage (ADLS Gen2)
   - Amazon S3
   - Google Cloud Storage

2. **Resource Manager**: This oversees resource allocation and scheduling, and options include:
   - YARN
   - Mesos
   - Kubernetes

#### Formal Definition of Apache Spark

Apache Spark is a multi-language engine designed for executing data engineering, data science, and machine learning tasks on a single node or a distributed cluster. Its seamless integration with Python, referred to as **PySpark**, makes it a popular choice among developers and data professionals.

### Understanding RDDs: The Building Blocks of Spark

At the heart of Apache Spark lies the **Resilient Distributed Dataset (RDD)**, the fundamental data structure that enables Spark's distributed data processing capabilities.

#### Key Features of RDDs

1. **Immutability**: Once an RDD is created, it cannot be altered. This ensures data consistency and allows for efficient fault tolerance.
2. **Lineage**: RDDs maintain a record of all transformations applied to their parent RDDs. This "lineage" enables Spark to recover lost data by re-executing the transformations as per the **Directed Acyclic Graph (DAG)** execution plan.

#### The DAG Execution Model

Spark employs a **Directed Acyclic Graph (DAG)** to represent the sequence of operations (transformations and actions) performed on RDDs. This model optimizes task execution and ensures resilience to failures. If an RDD is lost, Spark uses its lineage and the DAG to rebuild the data effortlessly.

### Higher-Order Functions in PySpark

**Higher-order functions** are an essential concept in PySpark and functional programming. These are functions that can take another function as a parameter or return a function as output.

#### Examples of Higher-Order Functions in PySpark

1. **`map`**: Applies a function to each element in the dataset, resulting in an equal number of output rows.
2. **`reduce`**: Aggregates the dataset into a single value.
3. **`reduceByKey`**: Performs aggregation for each distinct key in the dataset.

##### Key Differences: `reduce` vs `reduceByKey`

- **`reduce`**: Outputs a single aggregated value from the entire dataset.
- **`reduceByKey`**: Outputs an aggregated result for each distinct key. For example, if there are 100 distinct keys in the input data of 1000 rows, the output will contain 100 rows.

### Commonly Used PySpark Functions

1. **`map`**:

   - **Behavior**: Number of output rows equals the number of input rows.
   - **Usage**: Transform each row in the dataset.

2. **`reduce`**:

   - **Behavior**: Aggregates all rows into a single output value.
   - **Usage**: Compute totals, averages, or any aggregate result over the entire dataset.

3. **`reduceByKey`**:

   - **Behavior**: Number of output rows equals the number of distinct keys.
   - **Example**: If the input dataset contains 1000 rows with 100 unique keys, the output will have 100 rows.

4. **`filter`**:

   - **Behavior**: Filters rows based on a condition. Number of output rows is less than or equal to the number of input rows.
   - **Usage**: Narrow down the dataset based on specific criteria.

5. **`sortBy` / `sortByKey`**:

   - **`sortBy`**: Sorts rows based on values in ascending (default) or descending order.
   - **`sortByKey`**: Sorts rows based on keys.
   - **Behavior**: Number of output rows equals the number of input rows.

6. **`distinct`**:
   - **Behavior**: Outputs only unique rows, reducing the number of output rows.
   - **Usage**: Remove duplicates and get distinct values.

### Chaining Functions in PySpark

Function chaining is a common and powerful approach in PySpark that allows for cleaner, more concise code. By chaining transformations and actions together, we can streamline our data processing workflows, reducing the need for intermediate steps.

### Understanding RDD Partitions

In PySpark, **partitions** define the logical division of data across nodes in a cluster. Partitions play a crucial role in parallel processing and can significantly impact performance.

#### Checking the Number of RDD Partitions

The number of partitions in an RDD can be checked using the `getNumPartitions()` method:

```python
words = ("Nitish", "kumar", "nkumar37", "ipl", "football", "cricket")
words_rdd = spark.sparkContext.parallelize(words)
print(words_rdd.getNumPartitions())  # Output: 2
```

#### Default Partitioning Properties

1. defaultMinPartitions: Determines the minimum number of partitions Spark will create for an RDD.

- Accessed via spark.SparkContext.defaultMinPartitions.

2. defaultParallelism: Indicates the number of default tasks that can run in parallel.

- Accessed via spark.SparkContext.defaultParallelism.

### Choosing Between countByValue and reduceByKey

#### What is countByValue?

countByValue is an action in PySpark that combines the functionality of map and reduceByKey into a single step. It aggregates data and returns the count of each unique value.

#### When to Use countByValue vs reduceByKey

1. countByValue:

- Captures the output on a local (gateway) node.

- Best suited when no further parallel processing is required on the results.

2. reduceByKey:

- A transformation, meaning results remain distributed across the cluster.

- Ideal when further parallel processing is necessary.

#### Decision Guide:

Use `map + reduceByKey` if you plan to perform additional parallel processing.

Use `countByValue` for final results where no further transformations are required.

### Categories of Transformations

Transformations in PySpark are the foundation of data manipulation. They define how data is processed and distributed across the cluster.

#### 1. Narrow Transformations

- **Definition**: Transformations where no data shuffling occurs across the cluster.
- **Characteristics**:
  - Transformed data remains on the same machine.
  - Highly efficient as no network transfer is involved.
- **Examples**:
  - `map`
  - `filter`
  - `flatMap`

#### 2. Wide Transformations

- **Definition**: Transformations where data is shuffled across nodes for a global aggregation.
- **Characteristics**:
  - Involves network transfer of data.
  - Computationally expensive due to shuffling.
- **Examples**:
  - `reduceByKey`
  - `groupByKey`

![Illustration of Narrow and Wide Transformations](https://towardsdatascience.com/wp-content/uploads/2021/11/1u69zDQgxukpRQTiZZ6Alqg-1536x784.png)

#### Best Practices for Wide Transformations:

- Minimize the use of wide transformations as they involve costly shuffles.
- Perform wide transformations towards the end of the data pipeline when the dataset is already narrowed down.

### Tasks, Jobs, and Stages in PySpark

The execution model in PySpark is designed for distributed computation and is broken down into three key components: tasks, jobs, and stages.

#### 1. Tasks

- **Definition**: The smallest unit of execution in Spark.
- **Characteristics**:
  - The number of tasks equals the number of partitions.
  - Each partition is processed by an associated task.

#### 2. Jobs

- **Definition**: Represents a complete execution of an action.
- **Characteristics**:
  - The number of jobs equals the number of actions executed in the code.
  - Each action (e.g., `count`, `collect`, `save`) triggers a new job.

#### 3. Stages

- **Definition**: Represents a set of transformations executed as a single unit.
- **Characteristics**:
  - The number of stages equals the number of wide operations plus one.
  - A new stage is created whenever a wide transformation (e.g., `reduceByKey`) is encountered.

In the next blog, I will dive into concepts such as Spark joins, broadcast joins, the differences between repartition and coalesce, and higher-level APIs in Apache Spark, including DataFrames.

References:

1. https://towardsdatascience.com/6-recommendations-for-optimizing-a-spark-job-5899ec269b4b/
2. https://medium.com/@diehardankush/what-are-job-stage-and-task-in-apache-spark-2fc0d326c15f

<!-- This is content is part of a course that @iamheavymetalx7 took online -->
