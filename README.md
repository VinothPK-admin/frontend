# PK Cycle Mart & Tech Hub

The application has a Next.js storefront in `frontend` and a FastAPI service in `backend`. Production can use Supabase Postgres for products and Supabase Auth for administrator accounts; local development can continue to use SQLite.

## Run locally

1. Install the API dependencies and start the backend:

   ```powershell
   cd backend
   python -m pip install -r requirements.txt
   uvicorn main:app --reload
   ```

   For local development, the API uses `backend/lumina.db` when no database URL is set. To use Supabase, set `SUPABASE_DATABASE_URL` to the project's Postgres connection string (with SSL enabled), `SUPABASE_URL` to `https://hwppnlaaiosdzmorbtyb.supabase.co`, and either `SUPABASE_PUBLISHABLE_KEY` or `SUPABASE_ANON_KEY` to the project's public key. `SUPABASE_DATABASE_URL` takes precedence over `DATABASE_URL`. Set `FRONTEND_ORIGINS` to a comma-separated list of allowed storefront origins outside local development. Do not run `seed.py` against production; it inserts sample catalog records.

2. In another terminal, install and start the storefront:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Set `NEXT_PUBLIC_API_URL` to the API origin and `NEXT_PUBLIC_SUPABASE_URL` plus `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the same Supabase project settings. `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported for legacy anon keys. The project URL defaults to the Cycle Mart project ref above; a public key is required for login.

The seed script adds its demo catalog records without deleting other database records. Legacy cycle rows migrate as out of stock and stay out of the available cycle catalog until the shop confirms them through an inventory import.

## Supabase Auth and admin access

Create the shop administrator as a user in Supabase Auth. Open `/admin` and sign in with that user's email and password. The backend verifies every bearer token with Supabase Auth and only accepts users whose trusted `app_metadata` contains `is_admin: true` or `role: "admin"`. Do not use `user_metadata` for this permission because users can edit it. In the Supabase SQL Editor, an authorized project owner can grant access to one exact account with:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
where email = 'admin@example.com';
```

Use the actual administrator email in that statement. Keep sign-ups restricted in Supabase Auth if the shop does not want public account creation. The browser only receives the publishable/anon key; never put the database password or a Supabase service-role/secret key in `NEXT_PUBLIC_*` variables. Keep both apps behind HTTPS in production.

## Move the local catalog to Supabase

Set `SUPABASE_DATABASE_URL` in the backend environment to the Supabase Postgres connection string from the project's Connect settings. Install backend requirements, then preview and run the idempotent copy from the `backend` directory:

```powershell
python migrate_sqlite_to_supabase.py --dry-run
python migrate_sqlite_to_supabase.py
```

The command copies categories and products by their slugs, updating matching records and leaving unrelated Supabase rows intact. It does not copy user accounts. Keep a database backup before the first production migration. After migration, the API and the CSV importer both use the Supabase database URL.

## Manage cycle inventory

Open `/admin` in the storefront. Admins can add cycles, edit details, and update availability; updates are served from the same API-backed catalog that visitors see. Existing image paths must reference files already deployed under `frontend/public/images/cycles/`. CSV import remains available for bulk changes.

## Import cycle inventory

Use `backend/cycle-inventory-template.csv` as a blank header template. Place product photos in `frontend/public/images/cycles/`, then fill a UTF-8 CSV with these columns:

| Column | Required | Meaning |
| --- | --- | --- |
| `name` | Yes | Product/model name |
| `brand` | Yes | Cycle brand |
| `cycle_type` | Yes | For example, city, kids, or MTB; use types present in the shop list |
| `availability` | Yes | `in_stock`, `on_request`, or `out_of_stock` |
| `image` | Yes | Public path such as `/images/cycles/model-photo.jpg` |
| `price_inr` | No | Whole rupee amount; blank prices display as “Ask for price” |
| `slug` | No | Stable product identifier; generated from brand, name, and wheel size when blank |
| `wheel_size`, `description` | No | Display and filtering details |
| `frame_size`, `age_group`, `gear_count`, `brake_type`, `color`, `frame_material`, `spec_*` | No | Optional product specifications |

From the `backend` directory, validate before importing:

```powershell
python import_cycles.py path\to\cycle-inventory.csv --dry-run
python import_cycles.py path\to\cycle-inventory.csv
```

The importer updates matching slugs and adds new ones. It reports invalid rows and imports the valid rows; it does not delete products omitted from a CSV, so mark sold-out products `out_of_stock` in the file. Each CSV row is treated as the full record for that product: blank optional fields clear their previous values. No cycle stock is considered available until it is explicitly marked `in_stock` or `on_request`. The API health endpoint is available at `/health`.
