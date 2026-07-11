# Best Metall — CMS

A lightweight content management system for the Best Metall website. Flask
backend (Python + SQLite), with the existing static front-end kept exactly as
is — content is loaded at runtime from `/api/content` and applied through
`data-cms` attributes by `scripts/cms-loader.js`.

Every visible piece of the site is editable from the admin panel: the top bar,
logo, navigation menu, every body section (hero, marquee, about, services,
equipment, process, projects, testimonials, metrics, CTA, contact) and the
footer.

## Stack

- Python 3, Flask, SQLite
- JWT auth (`PyJWT`) + bcrypt password hashing
- Admin panel: TailwindCSS + Alpine.js (CDN, no build step)
- Telegram lead delivery for the contact form

## Project layout

```text
app.py                 # Flask app entry
passenger_wsgi.py      # WSGI entry for cPanel / Passenger
requirements.txt
.env.example           # Copy to .env or set vars in cPanel
backend/
  auth.py              # Login, JWT, admin user
  content.py           # /api/content CRUD
  database.py          # SQLite schema + SECTION_DEFINITIONS (all editable fields)
  upload.py            # Image uploads
  contact.py           # Contact form -> Telegram + stored in DB
admin/
  login.html           # Admin login
  dashboard.html       # Section list
  editor.html          # Section editor (generic, driven by definitions)
scripts/
  cms-loader.js        # Fetches /api/content and applies it to the page
index.html, styles/, scripts/, fonts/   # The website itself
uploads/               # Uploaded images (created on first run)
database.db            # SQLite (created on first run)
```

## Local run

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# optional overrides (defaults shown)
export ADMIN_EMAIL='admin@bestmetall.uz'
export ADMIN_PASSWORD='ChangeMe123!'
export SECRET_KEY='replace-this'
export JWT_SECRET='replace-this-too'

python app.py
```

Then open:

- **Site:** http://localhost:5000/
- **Admin:** http://localhost:5000/admin/login

On first run the app creates the SQLite schema, seeds every section with the
current website text, and creates one admin user.

### Default admin login

Used only when `ADMIN_EMAIL` / `ADMIN_PASSWORD` are not set:

| Field    | Value                 |
|----------|-----------------------|
| Email    | `admin@bestmetall.uz` |
| Password | `ChangeMe123!`        |

Change these before deployment.

## API

**Public**
- `GET /api/content` — full content tree (used by the website)
- `POST /api/contact` — contact form submission

**Protected** (require `Authorization: Bearer <token>`)
- `POST /api/login`
- `GET /api/sections`
- `GET /api/content/<section>`
- `PUT /api/content/<section>`
- `POST /api/upload`

## How content reaches the page

`scripts/cms-loader.js` runs after the page loads, fetches `/api/content`, and:

- fills singular text via `data-cms="section.key"`
- sets links/images via `data-cms-href`, `data-cms-src`, `data-cms-alt`
- shows/hides sections via `data-cms-visible="section.visible"`
- rebuilds repeating blocks (menu items, service cards, equipment, process
  steps, projects, testimonials, metrics, footer badges, working hours) by
  cloning the existing DOM template — so the design never changes.

If the API is unreachable (e.g. the file is opened directly without the Flask
server), the page keeps its hard-coded fallback text. The site still works as a
plain static page.

## Contact form → Telegram

Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (env vars). Submissions are
stored in the `contact_messages` table and forwarded to your Telegram chat.
Without those vars the form still validates and stores messages; it just
doesn't send the Telegram notification.

> Note: this is the server-side path. The static front-end form
> (`LEAD_ENDPOINT` in `scripts/app.js`) can instead point at the standalone
> Cloudflare Worker in `server/`. Pick one. When the site is served by this
> Flask app, set `LEAD_ENDPOINT = '/api/contact'` to use the built-in handler.

## cPanel deployment

1. Upload the whole project folder.
2. cPanel → **Setup Python App** → create an app in this directory.
3. Startup file: `passenger_wsgi.py` (entry point `application`), or `app.py`.
4. In the app virtualenv: `pip install -r requirements.txt`.
5. Set environment variables: `SECRET_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, `CMS_ALLOWED_ORIGINS`, `TELEGRAM_BOT_TOKEN`,
   `TELEGRAM_CHAT_ID`.
6. Ensure write permission for `database.db` and `uploads/`.
7. Restart the app.

No Node or Docker required on the host.
