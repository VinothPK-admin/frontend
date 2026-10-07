# PK Cycle Mart & Tech Hub

The application has a Next.js storefront in `frontend` and a FastAPI service in `backend`. The API reads product and category data from SQLite.

## Run locally

1. Install the API dependencies and start the backend:

   ```powershell
   cd backend
   python -m pip install -r requirements.txt
   python seed.py
   uvicorn main:app --reload
   ```

   The SQLite database is stored beside the backend by default. Set `DATABASE_URL` to use another supported async SQLAlchemy database URL and install its driver. Set `FRONTEND_ORIGINS` to a comma-separated list of allowed storefront origins when the app is not running at `http://localhost:3000`.

2. In another terminal, install and start the storefront:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   The storefront defaults to `http://localhost:8000` for the API. Set `NEXT_PUBLIC_API_URL` before starting Next.js to use a different API URL.

The seed script inserts or refreshes its sample categories and products without deleting other database records. The API health endpoint is available at `/health`.
