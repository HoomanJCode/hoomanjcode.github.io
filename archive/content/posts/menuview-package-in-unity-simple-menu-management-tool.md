---
title: "MenuView-Package in Unity: Simple Menu Management Tool"
type: "post"
slug: "menuview-package-in-unity-simple-menu-management-tool"
date: "2025-05-02T21:41:03+03:30"
updated: "2025-05-05T02:24:19+03:30"
tags: ["Tools"]
cover: "../../media/posts/7/website-favicon-for-a-game-developer.png"
summary: "This is my simple UnityGameEngine menu management tool and I want to&hellip;"
original_url: "https://hooman.jalalpoor.com/menuview-package-in-unity-simple-menu-management-tool/"
---
This is my simple UnityGameEngine menu management tool and I want to share it with my friends. You can Create some Menus and switch between them and manage them at multiple layers.

## Introduction

Managing menus efficiently in Unity can be challenging, especially when dealing with a single scene. To simplify this process, I created **MenuView-Package**, a simple and effective menu management tool for Unity Game Engine. With this tool, you can create menus, switch between them quickly using button functions, and manage them across different layers effortlessly.

## Why I Created MenuView-Package

When developing games in Unity, I often found handling menus within a single scene to be cumbersome. Unity’s built-in UI management system requires manual toggling of GameObjects and tracking menu states, which can lead to unstructured and inefficient code.

I created **MenuView-Package** to:

- Provide a **structured and simple way** to manage menus within a single scene.
- Allow developers to **switch between menus instantly** via button functions.
- Offer **a reusable and scalable approach** to menu navigation.
- Reduce the need for **manual UI state tracking**.

With MenuView-Package, handling menus within a single scene becomes seamless, making it easier to maintain and extend UI systems in Unity projects.

## What It Does & How It Simplifies Menu Handling

MenuView-Package provides an efficient way to create and manage multiple menus in Unity. It allows you to:

- **Create menus easily** by inheriting from `MenuView`.
- **Switch between menus dynamically** with simple commands.
- **Manage menus across multiple layers**, ensuring structured navigation.
- **Avoid redundant UI state management**, as the package keeps track of the last active view.
- **Call functions in UI buttons** to switch menus rapidly without extra logic.

By handling menu navigation programmatically, this tool significantly reduces UI-related complexity and ensures a smoother development process.

## Getting Started

Using MenuView-Package is straightforward. Follow these steps to integrate it into your Unity project:

### 1. Importing the Package

To use MenuView-Package, you need to import it via the Unity Package Manager:

- Open **Unity Package Manager**.
- Select **Add package from git URL: [MenuView-Package](https://github.com/HoomanJCode/MenuView-Package)**
- Enter the package URL and import it into your project.

### 2. Creating a Menu Script

Each menu in your game should be defined as a script inheriting from `MenuView`. Here’s how you can set up your menu scripts:

#### Example 1: Main Game Menu

Create a script named `MainGameMenu.cs` and inherit from `MenuView` instead of `MonoBehaviour`.

```csharp
using MenuViews;

public class MainGameMenu : MenuView
{
    protected override void Init()
    {
        // Initialize buttons, texts, events, and more
        throw new System.NotImplementedException();
    }

    // Available commands:
    // ChangeCurrentView<AuthMenu>();
    // ChangeToLastView();
    // LastView { get; }
    // GetCurrentView();
}
```

#### Example 2: Authentication Menu

Similarly, create another menu script for authentication, like `AuthMenu.cs`:

```csharp
using MenuViews;

public class AuthMenu : MenuView
{
    protected override void Init()
    {
        throw new System.NotImplementedException();
    }
}
```

#### Example 3: Settings Menu

Another common menu is a settings menu. Here’s how you can create one:

```csharp
using MenuViews;

public class SettingsMenu : MenuView
{
    protected override void Init()
    {
        // Initialize settings options here
    }
}
```

#### Example 4: Pause Menu

A pause menu can be added in a similar way:

```csharp
using MenuViews;

public class PauseMenu : MenuView
{
    protected override void Init()
    {
        // Initialize pause menu options here
    }
}
```

## Managing Menus

Once your menus are set up, you can manage them using various commands:

- `ChangeCurrentView<T>()` - Switch to a specific menu view.
- `ChangeToLastView()` - Return to the previous menu.
- `LastView` - Retrieve the last active menu.
- `GetCurrentView()` - Get the currently active menu.
- `CloseThisView()` - Close the current menu.
- `CloseAll()` - Close all menus in the current layer.

## How to Use in UI Buttons

One of the key features of this package is the ability to call functions in UI buttons to switch menus easily. Here’s how you can do it:

1. Attach a `Button` component to your UI button.
2. In the **OnClick()** event of the button, add a function call like:
  - `MainGameMenu.ChangeCurrentView<AuthMenu>();`
  - `AuthMenu.ChangeToLastView();`

This makes switching between menus fast and seamless without writing extra logic.

## Why Use MenuView-Package?

- **Easy to integrate** – Just import the package and modify your menu scripts.
- **Simplifies menu switching** – No need for complex UI state management.
- **Supports multiple UI layers** – Useful for games with deep menu structures.
- **Works within a single scene** – No need for scene transitions for menu changes.
- **Reduces development time** – Provides a streamlined approach to menu navigation.

## Conclusion

MenuView-Package is a lightweight and powerful tool to handle UI menus in Unity seamlessly. Whether you’re building a simple game or a complex application, this tool can help streamline your UI navigation. Feel free to try it out and share your feedback!
