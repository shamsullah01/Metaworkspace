# MetaWorkspace Local Development Setup

This guide will help you set up and run the MetaWorkspace application locally on your machine using VS Code.

## Project Structure

```
MetaWorkspace_Local_Setup/
├── frontend/             # React frontend application
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── ...
├── backend/              # Flask backend application
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── static/       # Built frontend files will be copied here
│   │   └── main.py
│   ├── venv/             # Python virtual environment
│   └── requirements.txt
└── README.md             # This file
```

## Initial Setup Steps

1.  **Clone this repository** (if you haven't already).
2.  **Navigate to the `MetaWorkspace_Local_Setup` directory** in your terminal.

    ```bash
    cd MetaWorkspace_Local_Setup
    ```

3.  **Backend Setup (Python/Flask)**

    a.  **Navigate to the `backend` directory:**
        ```bash
        cd backend
        ```
    b.  **Create and activate a Python virtual environment:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    c.  **Install backend dependencies:**
        ```bash
        pip install -r requirements.txt
        ```
    d.  **Return to the root directory:**
        ```bash
        cd ..
        ```

4.  **Frontend Setup (React/Vite)**

    a.  **Navigate to the `frontend` directory:**
        ```bash
        cd frontend
        ```
    b.  **Install frontend dependencies using pnpm (recommended) or npm/yarn:**
        ```bash
        pnpm install
        # or npm install
        # or yarn install
        ```
    c.  **Build the frontend for production (this will create the `dist` folder):**
        ```bash
        pnpm run build
        # or npm run build
        # or yarn build
        ```
    d.  **Return to the root directory:**
        ```bash
        cd ..
        ```

5.  **Copy Built Frontend to Backend Static Folder**

    ```bash
    cp -r frontend/dist/* backend/src/static/
    ```

## Running the Application

1.  **Start the Backend Server:**

    a.  **Navigate to the `backend` directory:**
        ```bash
        cd backend
        ```
    b.  **Activate the virtual environment:**
        ```bash
        source venv/bin/activate
        ```
    c.  **Run the Flask application:**
        ```bash
        python src/main.py
        ```
    The backend server will start on `http://localhost:5000`.

2.  **Access the Application:**

    Open your web browser and go to `http://localhost:5000`.

    You can now sign in with GitHub (simulated) and explore the MetaWorkspace.

## VS Code Recommendations

-   **Python Extension**: For Flask development.
-   **ESLint Extension**: For JavaScript linting.
-   **Prettier Extension**: For code formatting.
-   **Live Server Extension**: (Optional) For quick frontend development without full backend.

Enjoy your MetaWorkspace local development experience!

