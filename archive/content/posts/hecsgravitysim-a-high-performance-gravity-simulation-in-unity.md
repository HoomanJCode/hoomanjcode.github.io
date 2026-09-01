---
title: "HEcsGravitySim: A High-Performance Gravity Simulation in Unity"
type: "post"
slug: "hecsgravitysim-a-high-performance-gravity-simulation-in-unity"
date: "2025-05-02T21:36:44+03:30"
updated: "2025-05-02T21:37:34+03:30"
tags: ["Art"]
cover: "../../media/posts/6/Capture-1.png"
summary: "HEcsGravitySim is a multi-threaded gravity simulation using Unity's ECS and Job System&hellip;"
original_url: "https://hooman.jalalpoor.com/hecsgravitysim-a-high-performance-gravity-simulation-in-unity/"
---
HEcsGravitySim is a multi-threaded gravity simulation using Unity's ECS and Job System for real-time performance. 🚀

## Introduction

Gravity simulations are computationally expensive, especially when dealing with numerous objects. In this project, **HEcsGravitySim**, we tackle this challenge using **Unity's ECS (Entity Component System)** and **Job System** to leverage multi-threading for real-time calculations. Instead of processing thousands of gravitational interactions on a single thread, which would be highly inefficient, we distribute the computations across multiple threads for a significant performance boost.

## The Problem: Gravity Calculation Bottleneck

In a naive implementation of a gravity simulation, each planet applies a force to every other planet. This results in a **nested loop** with **O(n²) complexity**, where each frame requires computing forces for every pair of planets. With **1000 planets**, this means 1,000,000 force calculations per frame! Running this on a single thread would lead to severe performance issues.

## The Solution: Multi-Threading and Data-Oriented Programming

To overcome this computational bottleneck, we use Unity's **Data-Oriented Technology Stack (DOTS)**, which includes:

- **Job System** – Enables multithreaded computations efficiently.
- **ECS (Entity Component System)** – Provides a high-performance, data-oriented programming model.
- **Hybrid Renderer Package** – Ensures optimized rendering.
- **Unity Physics (Havok Physics)** – Handles physics interactions accurately.

By structuring the simulation using **ECS and Jobs**, we efficiently distribute calculations across multiple CPU cores, leading to a significant boost in performance and real-time simulation capabilities.

## Gravity Calculation Formula

The gravitational force between two planets is calculated using Newton's Law of Universal Gravitation:

F=Gm1m2r2F = G \frac{m_1 m_2}{r^2}

Where:

- FF is the gravitational force,
- GG is the gravitational constant,
- m1,m2m_1, m_2 are the masses of the two planets,
- rr is the distance between the two planets.

### Unity Implementation Example:

```glsl
float3 direction = planet2.Position - planet1.Position;
float distanceSquared = math.lengthsq(direction) + 0.0001f; // Avoid division by zero
float forceMagnitude = (G * planet1.Mass * planet2.Mass) / distanceSquared;
float3 force = math.normalize(direction) * forceMagnitude;
```

## Project Breakdown

### 1. **Random Planet Generator**

- A class that generates **randomly placed planets** within the simulation space.
- Assigns each planet a **random velocity and mass**.

### 2. **Planet Component Data**

- Stores essential planet properties such as:
  - Position
  - Velocity
  - Mass

### 3. **Gravity System**

- Uses **Entity Query** to fetch all planets.
- Executes a **multithreaded job** each frame to calculate gravitational forces efficiently.
- Applies forces to the **Velocity Component**, allowing the physics engine to update positions automatically.

### 4. **Job System for Parallel Processing**

- Each frame, the system:
  1. Loops over all planet entities using **nested loops**.
  2. Distributes the calculations across multiple CPU cores using **Jobs**.
  3. Applies the calculated forces to **update velocity** components.
  4. The physics engine then computes the new positions.

## Performance Gains

By implementing **ECS and Job System**, we achieve:

- **Massively improved performance** due to parallel processing.
- **Real-time gravity simulation** with thousands of planets.
- **Efficient memory management**, reducing CPU bottlenecks.
- **Smooth rendering** using the Hybrid Renderer package.

## Conclusion

HEcsGravitySim showcases the power of **Data-Oriented Programming** in Unity, enabling efficient and scalable physics simulations. With **ECS, Job System, and Unity Physics**, we can simulate complex gravitational interactions at real-time speeds, even with thousands of entities.

If you're interested in high-performance game development or physics simulations, exploring Unity's **DOTS ecosystem** is a great step forward!

Stay tuned for further improvements and optimizations! 🚀

### GitHub Repository

Check out the source code on GitHub: [HEcsGravitySim](https://github.com/HoomanJCode/HEcsGravitySim)
