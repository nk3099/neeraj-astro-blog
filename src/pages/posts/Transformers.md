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

![Encoder-Decoder Architecture](https://private-user-images.githubusercontent.com/52539396/462929815-2753482a-4cf8-497b-9eaf-8b349b1773fa.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTE4MTM4MTEsIm5iZiI6MTc1MTgxMzUxMSwicGF0aCI6Ii81MjUzOTM5Ni80NjI5Mjk4MTUtMjc1MzQ4MmEtNGNmOC00OTdiLTllYWYtOGIzNDliMTc3M2ZhLmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MDYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzA2VDE0NTE1MVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWZjM2E3MmRhNzUyYzUwZGI3NTQ3N2M0MGQ0ZjIwYThiZTc3NjMzNDVjYTE3OGQ1MzU5ZTc0NmUxNThkZTM3MjAmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.-uXuI4FNKQRvWES58LWlIQKjpIEBdMzAabUbS9wP2bA)

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

## ![Transformer Architecture](https://private-user-images.githubusercontent.com/52539396/462929825-35615e08-474c-40e4-89e6-add4384d4ee6.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTE4MTM4MTEsIm5iZiI6MTc1MTgxMzUxMSwicGF0aCI6Ii81MjUzOTM5Ni80NjI5Mjk4MjUtMzU2MTVlMDgtNDc0Yy00MGU0LTg5ZTYtYWRkNDM4NGQ0ZWU2LmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MDYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzA2VDE0NTE1MVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWU0M2U5YzJiNTA0NDhiNzY4NGZjMGNhMTE3OWE1N2QyOWY5ZWFkODA3NzE1YmFiMDMyYTBlYWMzYmZmNzQ1NWEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.sKNfrRbYEECrLeS_ClBrImnbyG3HMjLCyIshz44vnx4)

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

1. 📘 [How Transformers Work - DataCamp](https://www.datacamp.com/tutorial/how-transformers-work)
2. ✍️ [Transformers & Attention - Rakshit Kalra, Medium](https://medium.com/@kalra.rakshit/introduction-to-transformers-and-attention-mechanisms-c29d252ea2c5)

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
