# Guide: Local Setup and Production API Connection

This guide outlines how to get the local PostgreSQL/NestJS backend running, troubleshoot issues, and connect your real production API.

---

## 🔌 Connecting to Your Real API

Once you have your production API URL (e.g. `https://api.infistyle.com`), follow these steps:

1. **Open the Frontend Root Directory**:
   Go to the root of the project `vistaprint-rerpli/`.
2. **Open the `.env` File**:
   Locate the `.env` file at the root.
3. **Change the API URL**:
   Replace the local URL with your production API URL:
   ```env
   VITE_BACKEND_URL=https://your-real-api-domain.com
   ```
4. **Deploy / Build**:
   Rebuild or redeploy your frontend. The Vite compiler will automatically bind the production API endpoint to the client queries.

---

## 💻 Running the Application Locally

If the local setup is not working on your machine, it is usually due to database connection settings. Follow this checklist to resolve it:

### Prerequisite 1: PostgreSQL Database Setup
1. **Ensure PostgreSQL is running** on your local machine (default port: `5432`).
2. **Create a Database**: Open pgAdmin or psql and create a database named `infistyle`.
3. **Configure Connection String**:
   - Open the backend configuration file: `backend/.env`
   - Update the `DATABASE_URL` with your local PostgreSQL username and password:
     ```env
     DATABASE_URL="postgresql://<your_postgres_username>:<your_postgres_password>@localhost:5432/infistyle?schema=public"
     ```

### Prerequisite 2: Initialize Database and Schema (Prisma)
Open your terminal inside the `backend/` directory and run:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Compile database migrations**:
   This creates all required tables (`users`, `refresh_tokens`, etc.) in your local PostgreSQL:
   ```bash
   npx prisma migrate dev --name init
   ```
3. **Seed the Database**:
   This inserts the default administrator account:
   ```bash
   npx prisma db seed
   ```
   - **Admin User**: `admin@infistyle.com`
   - **Admin Password**: `AdminPassword123`

---

## 🚀 Starting the Servers

To run the application locally, start both the backend and frontend dev servers:

### Step 1: Start NestJS Backend
In your terminal, navigate to the `backend/` folder and run:
```bash
npm run start:dev
```
The server will boot up on `http://localhost:3000`.

### Step 2: Start React Frontend
In a new terminal window, navigate to the root directory `vistaprint-rerpli/` and run:
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`. Open this URL in your browser to test it.
