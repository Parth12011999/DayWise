# Task Scheduler with Genkit

## Project Description

This project is a task scheduler application built using Next.js and Genkit. It allows users to input their tasks, deadlines, and importance levels, and then uses the Genkit AI plugin to suggest an optimal schedule for the day. The application leverages Google's Gemini AI model to generate these schedules, taking into account the user's inputs and prioritizing tasks based on their importance and deadlines.

## Features

-   **Task Input:** Users can add tasks with names, deadlines, importance (high, medium, low), and estimated durations.
-   **AI-Powered Scheduling:** Uses the Genkit AI plugin and Google's Gemini model to intelligently suggest a daily schedule.
-   **Prioritization:** The AI prioritizes tasks based on importance and deadlines.
-   **Flexible Scheduling:** Considers the estimated durations of tasks and inserts reasonable breaks.
-   **User Interface:** Built with Next.js for a dynamic and responsive user interface.

## Dependencies

-   **Next.js:** The React framework for building the user interface.
-   **Genkit:** A framework for building AI applications.
-   **@genkit-ai/googleai:** The Google AI plugin for Genkit, which provides access to Gemini models.
-   **Zod:** For schema definition and validation.
-   **Tailwind CSS:** For styling the user interface.
-   **Other dependencies:** check `package.json` for the full list

## 🚀 Getting Started
Follow these steps to set up and run the project locally.

## 🧰 Prerequisites
-  Node.js v18+
-  npm (or yarn / pnpm)
-  Google Cloud CLI (for Genkit authentication)

## 📦 Installation

# 1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env

# 4. Start the Next.js development server
npm run dev
# Access at http://localhost:3000



