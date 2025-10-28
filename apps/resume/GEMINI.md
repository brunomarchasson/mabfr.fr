# Project Overview

This is a Next.js project that serves as a resume viewer. It's built with React, TypeScript, and Tailwind CSS. The application supports multiple visual styles for the resume, including a default style, a "modern" style with animations, and a 3D style. It also uses `react-i18next` for internationalization.

The project is structured with a clear separation of concerns. The `app` directory contains the main application pages and layouts, while the `components` directory holds the reusable UI components. The different resume styles are implemented as separate components in the `components/resume` directory.

# Building and Running

To get the project up and running, follow these steps:

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    This will start the development server on [http://localhost:3000](http://localhost:3000).

3.  **Build for production:**
    ```bash
    pnpm build
    ```

4.  **Run in production mode:**
    ```bash
    pnpm start
    ```

5.  **Lint the code:**
    ```bash
    pnpm lint
    ```

# Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Utility classes are preferred over custom CSS.
*   **Components:** Components are written in TypeScript and use React functional components with hooks.
*   **Internationalization:** The `next-intl` library is used for internationalization. Text strings are stored in `messages/{locale}.json` files.
*   **Resume Data:** The resume data is fetched from a JSON file and typed with TypeScript interfaces in `types/resume.ts`.
*   **Visual Styles:** Different visual styles for the resume can be selected using the `style` query parameter in the URL (e.g., `?style=modern`).
