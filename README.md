# AI Coding Assistant

This is a full-stack AI Coding Assistant application built with a modern web stack, featuring a React/Vite frontend and an Express/tRPC backend. The application is configured for seamless deployment on Vercel.

## 🚀 Features

*   **Full-Stack Architecture:** Separated client (React/Vite) and server (Express/tRPC) for clear separation of concerns.
*   **Vercel Ready:** Includes `vercel.json` and build configurations for a smooth monorepo deployment on Vercel.
*   **TypeScript:** Full type safety across the entire codebase.
*   **tRPC:** End-to-end type-safe APIs for robust communication between the client and server.
*   **Drizzle ORM:** Modern, type-safe ORM for database interactions (configured for MySQL).
*   **OpenAI Integration:** Core functionality relies on the OpenAI API for AI-powered coding assistance.
*   **Modern UI:** Built with Tailwind CSS and Radix UI components.

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, Vite | Fast development and modern UI |
| **Backend** | Express, tRPC | Robust, type-safe API layer |
| **Database** | MySQL, Drizzle ORM | Type-safe database access |
| **Styling** | Tailwind CSS, Radix UI | Utility-first CSS and accessible components |
| **Deployment** | Vercel | Serverless deployment for both frontend and backend |

## ⚙️ Setup and Installation

### Prerequisites

*   Node.js (v18+)
*   pnpm (recommended package manager)
*   A MySQL database instance
*   An OpenAI API Key

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rajshah9305/AIcodingassistant.git
    cd AIcodingassistant
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and populate it with your configuration. You can use the provided `.env.example` as a template.

    ```bash
    cp .env.example .env
    # Edit .env with your actual values
    ```

4.  **Run Database Migrations (if needed):**
    ```bash
    pnpm run db:push
    ```

5.  **Start the development server:**
    ```bash
    pnpm run dev
    ```
    The application will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## ☁️ Vercel Deployment

The project is pre-configured for Vercel.

1.  **Connect Repository:** Connect your GitHub repository to a new Vercel project.
2.  **Configure Build Settings:** Vercel should automatically detect the monorepo structure from `vercel.json`.
    *   **Build Command:** `pnpm run build`
    *   **Root Directory:** `/`
3.  **Set Environment Variables:** In your Vercel project settings, you **must** add all the variables from the `.env.example` file (excluding the `PORT` and local database connection details if using a remote provider like PlanetScale or Neon).

| Variable | Description |
| :--- | :--- |
| `VITE_APP_ID` | Application ID |
| `JWT_SECRET` | Secret for cookie signing |
| `DATABASE_URL` | Remote MySQL connection string |
| `OAUTH_SERVER_URL` | OAuth server URL |
| `OWNER_OPEN_ID` | Owner's OpenID |
| `BUILT_IN_FORGE_API_URL` | Forge API URL |
| `BUILT_IN_FORGE_API_KEY` | Forge API Key |
| `OPENAI_API_KEY` | Your OpenAI API Key |
| `AWS_ACCESS_KEY_ID` | AWS S3 Access Key |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 Secret Key |
| `AWS_REGION` | AWS S3 Region |
| `AWS_BUCKET_NAME` | AWS S3 Bucket Name |

## 🤝 Contributing

Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License.
