## higher level api in apache spark

1. dataframes
2. sparkSQL

previously understood about RDD and functionality

Working of Dataframes

1. Load the data file and create a Spark Dataframe
2. Apply Transformations
3. Write the results back to Storage.
   (Spark Session is an entry point to the Spark Cluster in case of Higher Level
   APIs. Spark Context is for lower level RDDs)

standard way to create a Dataframe

```df = spark.read \
.format("csv") \
.option("header","true") \
.option("inferschema","true") \
.load("<file-path>")
```

dataframe and sql table
Dataframes and Spark SQL tables are interconvertible.

- sparksql table from daatframe

```
orders_df.createOrReplaceTempView("orders")
```

- orders_df = dataframr
- createOrReplaceTempView = function to convert DF to sparkSQL table
- orders = sparkSQL table/view distributed across clusters

- we can execeut normal sql queries on the sparkSQL table view created form dataframe

```
filtered_df=  spark.sql("select * from orders where order_status='Closed'")
```

- converting from sparkSQL to datagrame
  orders_df = spark.read.table("orders")
  orders_df.show()

---

Other alternative to create a SparkSQL table from Dataframe
createOrReplaceTempView - creates a table. If the table exists, then it
replaces the existing table without throwing any error.

createTempView - creates a table. If the table already exists, then it
errors out, stating the table already exists.

createGlobalTempView - The table view will be visible across other
applications as well. If the table already exists, then it errors out, stating the
table already exists.

createOrReplaceGlobalTempView - replaces any existing table view
with the newly created table.

---

Creating a Spark Table
If a table is created without selecting the Database in which it has to be
created, it will be created under the Default Database.

- To create Database
  spark.sql(“create database if not exists <Database-name-with-path>”)

- To view the database
  spark.sql(“show databases”)

- To view the databases with a certain pattern in their name
  spark.sql(“show databases”).filter(“namespace like ‘<pattern>%’”).show()

- To view the tables
  spark.sql(“show tables”).show()

---

Working with Spark SQL API Vs Dataframe API
Use cases to understand the working of these higher level APIs

1. Top 15 customers who placed most number of orders
   DataFrame way -
   result = ordersdf.groupBy(“customer_id”).count().sort(“count”,
   ascending = false).limit(15)

SparkSQL way -
result = spark.sql(“select customer_id, count(order_id) as count
from orders group by customer_id order by count desc limit 15”)

2. Customers with most number of orders
   DataFrame way -
   results = ordersdf.filter(“order_status =
   ‘CLOSED’”.groupBy(“customer_id”).count().sort(“count”, ascending =
   false )

SparkSQL way -
results = spark.sql(“select customer_id, count(order_id) as count
from orders where order_status = ‘CLOSED’ group by customer_id order
by count desc” )

---

Action
Examples of action: count, show, head, tail, collect
Examples of Transformations: groupBy.count,orderBy, filter, distinct, join
Utility function (neither action nor transforamtion) : printSchema, createOrReplaceGlobalTempView

---

Key take away:

Schema Inference Challenges Inferring schema is not the best choice in
spite of its code level advantages because -

1. It could lead to incorrect schema inference
2. Spark has to scan the data to infer the schema which is time consuming
   and burdens the system, thereby affecting the performance.

```
df = spark.read \
.format("csv") \
.option("header","true") \
.option("inferSchema", "true") \
.load("\documents\orders.csv")
```

## Two ways to enforce Schema are as follows:

1. method one

```
orders_schema = 'order_id long, order_date date, cust_id long, ord_status string'

df = spark.read \
.format("csv") \
.schema(orders_schema)\
.load("\documents\orders.csv")
```

2. method two (more preferred, works everytime)

````
from pyspark.sql.types import *

orders_schema_struct = StructType([
StructField("orderid", LongType()),
StructField("orderDate", DateType()),
StructField("custid", IntegerType()),
StructField("orderStatus", StringType())
])

df = spark.read \
.format("csv") \
.schema(orders_schema_struct)\
.load("\documents\orders.csv")```


## DataFrame Read Modes
- permissive (default method) : incase of any mismatch, convert the values to NUll without impacting the rest of the results
- failfast: errors out on ecountering any malformed record
- dropMalformed : any malformed results will be eliminated and rest of record in proper shape will be processed



## Creating Dataframe from RDD
Dataframe - Is an RDD with a structure associated with it.

- approach 1:
spark.createDataFrame(rdd,schema)
or
spark.createDataFrame(rdd).toDF(list-of-column-names)

- approach 2:
rdd.toDF(schema)


## DataFrame Transformations
# Dataframe Transformations

| Transformations       | Description                                         | Syntax                                                                                              |
|-----------------------|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| 1. withColumn         | To add a new Column or change existing column       | `df2 = df1.select("<list-of-column-names>", expr("<expression>"))`  <br> or <br> `df2 = df1.selectExpr("<list-of-column-names-and-expressions>")` |
| 2. withColumnRenamed  | To rename an existing Column                        | `df2 = df1.withColumnRenamed("<existing-column-names>", "<new-column-name>")`                      |
| 3. drop               | To drop a Column                                    | `df2 = df1.drop("<list-of-column-names>")`                                                          |


Note:
- In case of “select” we will have to explicitly segregate the column
names and expressions and mention the expressions used within
an expr.
- In case of “selectExpr”, it automatically identifies whether the
value passed is a column name or an expression and accordingly
actions it.



## Removal of duplicates from Dataframe
Transformations to handle duplicate
1. df2 = df1.distinct() [removes duplicates when all the columns are
considered]
2. df2 = df1.dropDuplicates() [removes

----
in upcoming blog:
1. spark UI and resource manager (YARN)
2. Caching rdd, spark tables and dataframes
3. kinds of file format : row based (csv) vs column based (parquet)


````
