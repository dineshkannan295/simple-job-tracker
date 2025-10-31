# Simple Job Tracker

**Ready-to-deploy ZIP** (Node.js + Express + SQLite). No login system.

## How to use

1. Unzip the project.
2. Run `npm install` in the project folder.
3. Start the app: `npm start` (default port 3000).
4. Open `http://localhost:3000` in your browser.

The SQLite database file will be created at `data/jobs.db` automatically.

## API Endpoints

- `GET /api/jobs` - list jobs
- `POST /api/jobs` - add job (JSON)
- `PUT /api/jobs/:id` - update job (JSON)
- `DELETE /api/jobs/:id` - delete job

## Fields
- ref_no
- client_name
- date_received (YYYY-MM-DD)
- allocated_to
- status (Pending, In Progress, Completed)
- remarks

Enjoy! - Jarvis
