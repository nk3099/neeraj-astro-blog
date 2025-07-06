---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Before Fine-Tuning: Deep Dive into Transformers"
publishedDate: 2025-07-06
description: "A structured, in-depth learn-in-public breakdown of transformers before fine-tuning"
author: "Nitish Kumar"
image:
  url: ""
  alt: "Deep Dive into Transformers"
tags: ["TIL", "Machine Learning", "learn-in-public", "transformers", "NLP"]
featuredPost: false
---

Recently, I started exploring **fine-tuning models** but realized I needed a **solid understanding of transformers** to know what exactly I am fine-tuning. This post captures my structured notes, learnings, and explanations for **transformers**, gathered from reading and videos, to build a strong foundation.

---

### 🚩 Why Transformers Matter

Transformers are **the backbone of modern NLP**, forming the architecture behind models like BERT, GPT, LLaMA, and T5. Introduced in [Attention Is All You Need](https://arxiv.org/abs/1706.03762), transformers **removed sequential bottlenecks** from RNNs/LSTMs by using **attention mechanisms**, enabling **parallelization, scalability, and efficiency**.

---

### 🛠️ The Architecture: Encoder-Decoder Structure

Transformers are composed of **stacked encoder and decoder layers**:

- **Encoder layers:** Encode the input sequence into context-rich representations.
- **Decoder layers:** Generate output sequences (useful in tasks like translation).

Each **encoder layer** contains:

1. Multi-head self-attention
2. Feed Forward Neural Network (FFNN)
3. Layer Normalization + Residual Connections

Each **decoder layer** includes:

1. Masked multi-head self-attention
2. Encoder-decoder (cross) attention
3. FFNN + Layer Normalization + Residuals

This structure enables **deep representation learning while retaining interpretability**.

---

### ✨ Why Transformers > RNNs/LSTMs

From my notes and [DataCamp](https://www.datacamp.com/tutorial/how-transformers-work):

- **RNNs/LSTMs** process sequentially, making them slow to train and hard to parallelize.
- They **struggle with long-term dependencies** due to vanishing/exploding gradients despite LSTM’s gating.
- **Transformers use self-attention**, allowing:
  ✅ Better long-range dependency handling  
  ✅ Parallel training  
  ✅ Scalability to large datasets

---

![Encoder-Decoder Architecture](https://github-production-user-asset-6210df.s3.amazonaws.com/52539396/462926716-39c22fdf-99df-4ee6-a8f0-4d696402cf7f.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250706%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250706T143011Z&X-Amz-Expires=300&X-Amz-Signature=b1a5989175c1fbd27da291cb592e3ea8115a98701bdfccd75d3536b87e8d37eb&X-Amz-SignedHeaders=host)

### 🧩 The Core: Self-Attention and Q, K, V

Self-attention enables each token to **attend to every other token** and compute **weighted representations**.

Key steps:

1. For each token:

   - Compute:
     - Query (**Q**)
     - Key (**K**)
     - Value (**V**)
   - These are linear projections of the embeddings.

2. Compute **attention scores** using dot product:

   $$
   \text{Attention Score} = Q \cdot K^T
   $$

3. Scale scores to stabilize gradients:

   $$
   \text{Scaled Score} = \frac{Q \cdot K^T}{\sqrt{d_k}}
   $$

   where \( d_k \) = dimension of key vectors.

4. Apply **softmax** for normalized attention weights:

   $$
   \alpha = \text{softmax}\left(\frac{Q \cdot K^T}{\sqrt{d_k}}\right)
   $$

5. Multiply with value vectors:

   $$
   \text{Output} = \alpha \cdot V
   $$

This enables **contextual representations**, where tokens dynamically decide what to focus on.

---

### 🔎 Multi-Head Attention: Detective Analogy

**Single attention head limitations:** May capture only one type of relationship.

**Multi-head attention:**

- Projects Q, K, V into multiple subspaces.
- Performs attention in **parallel across heads**.
- Concatenates and projects outputs.

**Analogy from the [Medium blog](https://medium.com/@kalra.rakshit/introduction-to-transformers-and-attention-mechanisms-c29d252ea2c5)**:

> Think of **multiple detectives solving a case**:
>
> - One checks fingerprints.
> - Another investigates the timeline.
> - Another interviews witnesses.
>
> Each focuses on different clues, combining them for a holistic understanding, similar to how **multi-head attention captures various dependencies simultaneously**.

---

### ⚡ Positional Encoding: Bringing Order to Tokens

Transformers lack recurrence and process tokens in parallel, requiring **positional encodings to inject order information**.

They:
✅ Help differentiate “Nitish loves AI.” vs. “AI loves Nitish.”  
✅ Allow the model to learn position-based relationships.

**Sinusoidal positional encoding:**

$$
PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{model}}}\right)
$$

$$
PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{model}}}\right)
$$

where:

- \( pos \): position in sequence
- \( i \): dimension index
- \( d\_{model} \): embedding dimension

These are **added to embeddings** before feeding into attention layers.

---

### 🪐 Feed Forward Networks and Layer Normalization

After multi-head attention, each layer includes:

- **Position-wise FFNN:**

  $$
  \text{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2
  $$

- **Layer normalization** and **residual connections** to stabilize and speed up training.

## ![Transformer Architecture](https://github-production-user-asset-6210df.s3.amazonaws.com/52539396/462926728-3ac58011-4f95-41d8-a6f3-4a17e2697ac4.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250706%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250706T143110Z&X-Amz-Expires=300&X-Amz-Signature=9120d7a841f374c865445ddbfa51eb670feec3f33a06d580f24a74b627483efc&X-Amz-SignedHeaders=host)

### 🪄 Putting It All Together

A **single transformer encoder layer**:

1. **Input + positional encodings**
2. Multi-head self-attention + residual + layer norm
3. FFNN + residual + layer norm

Stacking multiple layers allows **deep, hierarchical understanding of input sequences**.

---

### 💡 Practical Insights (From My Notes and Readings)

✅ Transformers are **parallelizable**, allowing faster GPU training.  
✅ They **handle long dependencies efficiently**.  
✅ Core building blocks:

- Self-attention
- Multi-head attention
- Positional encodings
- FFNN layers

They are the **foundation of models like GPT, BERT, LLaMA, and T5**, which are **pre-trained on large corpora and fine-tuned for downstream tasks**.

---

### 📚 Resources I Used

These resources helped me clarify transformers intuitively:

1. 📘 [How Transformers Work - DataCamp](https://www.datacamp.com/tutorial/how-transformers-work) – Key ideas + code.
2. ✍️ [Transformers & Attention - Rakshit Kalra, Medium](https://medium.com/@kalra.rakshit/introduction-to-transformers-and-attention-mechanisms-c29d252ea2c5) – Detective analogy + breakdowns.

---

If you found this helpful, let’s connect! I’m learning in public and would love to hear how you understood transformers or which part you found tricky while starting.

---

**Happy Learning! 🚀**

<!--
Resources:
- https://youtu.be/dn2anUU0d0U?si=AsJkmtT0okqpU_28
- https://youtu.be/OxfeK423y2I?si=mzun9VSNAjF1VN0l
- https://www.datacamp.com/tutorial/how-transformers-work
- https://medium.com/@kalra.rakshit/introduction-to-transformers-and-attention-mechanisms-c29d252ea2c5
-->
