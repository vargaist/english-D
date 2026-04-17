# Guesthouse — internal owner/operator app

A practical multi-property management tool for small hospitality businesses.
Built for a single owner first, with architecture ready for channel sync
(Airbnb / Booking.com iCal), staff roles, invoices, and tax exports later.

---

## 1. Product thinking

**Restated.** One internal system where the owner of several guesthouses sees
every property and room, enters or imports bookings, tracks expenses, manages
recurring operational tasks (cleaning, linen, minibar), and sees real profit
— not just revenue — per booking, room, property, and month.

**MVP — build now**

- Multi-property + multi-room catalog
- Manual bookings with overlap protection and multi-room support
- Expense tracking with category, property/room/booking attribution
- Operational tasks auto-suggested per booking
- Owner dashboard (today's arrivals/departures, occupancy, monthly P&L, alerts)
- Reports: monthly P&L, by property, booking-level profitability
- Calendar view (30-day room grid)
- Seeded demo data and Docker setup

**Later — architecture ready, not implemented**

- Airbnb / Booking.com iCal import + two-way sync
- Direct booking widget / public page
- Staff accounts + role-based permissions
- Invoice PDF generation, receipt uploads
- Recurring expense automation
- Notifications (email / Telegram)
- Mobile PWA
- Multi-language UI + Romanian tax exports (D394, e-Factura, etc.)

---

## 2. System architecture

- **Backend:** Django 5 + DRF. Admin site gets you power-user CRUD for free,
  which matters for an owner tool. REST API powers the frontend and will later
  feed mobile / integrations.
- **Frontend:** Next.js (pages router) + SWR. Clean admin-style UI, no heavy UI
  framework. Mobile-friendly CSS, desktop-first.
- **DB:** PostgreSQL. SQLite fallback via `USE_SQLITE=1` for quick local runs.
- **Auth:** session auth + Django admin now. Token/JWT plug-in later when
  staff accounts are added.
- **Container:** Docker Compose with `db`, `backend`, `frontend`.

**Why this stack.** Django gives you the admin, ORM, migrations, auth, and
permission groundwork on day one — exactly what an owner tool needs. DRF gives
a clean REST contract for the frontend and future integrations. Next.js keeps
frontend rendering flexible for SSR/PWA later without forcing it now.

### Key entities

```
Property 1─* Room
Property 1─* Booking 1─* BookingRoom *─1 Room      (a booking covers >=1 room)
Property 1─* Expense   *─? Room   *─? Booking       (expense attribution)
Property 1─* Task      *─? Room   *─? Booking
Booking  1─* PaymentRecord                          (payouts/installments)
BookingSource → Booking
ExpenseCategory → Expense
```

Overlap rule lives on `BookingRoom.clean()`: check-out is exclusive
(industry standard — a 10→12 stay does not block a 12→14 stay).

Booking profit (estimate):
`gross_value − commission − SUM(linked expenses in direct-cost categories)`.

---

## 3. Database schema

See `backend/core/models.py`. Every model inherits `created_at/updated_at`.

| Model            | Purpose                                                              |
|------------------|----------------------------------------------------------------------|
| Property         | House/location. Holds default cleaning/linen cost and currency.      |
| Room             | Bookable unit. Belongs to one Property.                              |
| BookingSource    | Reference table (Airbnb/Direct/...). Default commission %.           |
| ExpenseCategory  | Reference table. Flag `is_direct_booking_cost` controls profit calc. |
| Booking          | Reservation. Gross, commission, payout, payment status.              |
| BookingRoom      | Link table → overlap protection.                                     |
| Expense          | Attributed to property, optionally room/booking. Recurrence.         |
| Task             | Operational workflow. Auto-suggested on booking create.              |
| PaymentRecord    | Payout installments against a booking.                               |

---

## 4. UX / pages

| Page          | Purpose                                                                    |
|---------------|----------------------------------------------------------------------------|
| `/`           | Owner dashboard: today's arrivals/departures, occupancy, P&L, alerts.      |
| `/properties` | List properties, rooms count, status.                                      |
| `/rooms`      | Flat list across properties with type/capacity.                            |
| `/bookings`   | Booking list with profit estimate and payment status.                      |
| `/calendar`   | 30-day room × day availability grid.                                       |
| `/expenses`   | Expense list filterable by property/category.                              |
| `/tasks`      | Pending/in-progress/completed tasks. Quick-toggle completion.              |
| `/reports`    | Monthly P&L, by-property P&L, booking-level profitability.                 |
| `/settings`   | Placeholder — deep config via Django admin for MVP.                        |

---

## 5. API design

Base: `/api/`

| Endpoint                                   | Description                        |
|--------------------------------------------|------------------------------------|
| `GET/POST /properties/`                    | CRUD properties                    |
| `GET/POST /rooms/`                         | CRUD rooms (filter by property)    |
| `GET/POST /booking-sources/`               | CRUD booking sources               |
| `GET/POST /expense-categories/`            | CRUD expense categories            |
| `GET/POST /bookings/`                      | CRUD bookings. `?start=&end=` window, `?property=`, `?source=` |
| `POST   /bookings/` with `room_ids:[...]`  | Create booking attached to rooms (overlap-validated). |
| `GET/POST /expenses/`                      | CRUD expenses (filter by prop/room/booking/category) |
| `GET/POST /tasks/`                         | CRUD tasks                         |
| `GET/POST /payments/`                      | CRUD payment records               |
| `GET /dashboard/`                          | Owner dashboard summary            |
| `GET /reports/monthly/?months=12`          | Monthly P&L time series            |
| `GET /reports/by-property/`                | Property-level P&L                 |
| `GET /reports/booking-profitability/`      | Per-booking profit breakdown       |

Ordering, search, and filtering are enabled via `django-filter` +
`rest_framework.filters`.

---

## 6. Implementation — folder structure

```
guesthouse/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── guesthouse/           # project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py / asgi.py
│   └── core/                 # domain app
│       ├── models.py         # Property, Room, Booking, BookingRoom, Expense,
│       │                     # Task, BookingSource, ExpenseCategory, PaymentRecord
│       ├── serializers.py
│       ├── views.py          # viewsets + dashboard + reports
│       ├── urls.py
│       ├── admin.py
│       └── management/commands/seed_demo.py
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── Dockerfile
│   ├── lib/api.js
│   ├── styles/globals.css
│   ├── components/Layout.js
│   └── pages/
│       ├── index.js          # dashboard
│       ├── properties.js
│       ├── rooms.js
│       ├── bookings.js
│       ├── calendar.js
│       ├── expenses.js
│       ├── tasks.js
│       ├── reports.js
│       └── settings.js
└── docker-compose.yml
```

---

## 7. Demo data

`python manage.py seed_demo --wipe` creates:

- **Riverside House (3BR)** — 3 rooms (Double, Twin, Family).
- **Old Town House (8BR)** — 8 rooms (mix of Double and Family).
- Booking sources (Airbnb, Booking.com, Direct, Phone, Other) with default commissions.
- Expense categories incl. `is_direct_booking_cost` flags for cleaning/linen/minibar.
- Realistic bookings across the last 90 days + next 30 days.
- Auto-linked cleaning and linen expenses on completed stays.
- Monthly gas + electricity bills for both houses for the last 3 months.

Seed is deterministic (`Random(42)`), so results are reproducible.

---

## 8. Run instructions

### With Docker (recommended)

```bash
cd guesthouse
docker compose up --build
# in another terminal, after services are up:
docker compose exec backend python manage.py seed_demo --wipe
docker compose exec backend python manage.py createsuperuser
```

- Frontend: http://localhost:3000
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

### Without Docker (quick local, SQLite)

```bash
cd guesthouse/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
USE_SQLITE=1 python manage.py migrate
USE_SQLITE=1 python manage.py seed_demo --wipe
USE_SQLITE=1 python manage.py runserver

# separately:
cd guesthouse/frontend
npm install
npm run dev
```

---

## 9. Next 10 implementation tasks (in order)

1. **Auth pass.** Lock `DEFAULT_PERMISSION_CLASSES` to `IsAuthenticated`, wire
   the Next.js app through a simple login page hitting Django session auth.
2. **Booking form + edit modal** on `/bookings` — the single biggest missing
   piece. Include room multi-select with live overlap check.
3. **Expense form + edit modal** on `/expenses`, including attachment upload.
4. **Task quick-create** from a booking detail drawer.
5. **Booking detail page** with full profitability breakdown, linked tasks,
   linked expenses, and payment records.
6. **Recurring expenses automation** — a management command + admin button to
   materialize monthly utilities from templates.
7. **iCal import endpoint** (`POST /bookings/import-ical/`) — parse Airbnb/
   Booking feeds into Booking rows marked `external_ref=` + source.
8. **iCal export feed** per property/room (so you can sync back out).
9. **Role-based accounts** — add `Staff` model with per-property assignment;
   gate task editing to assigned staff.
10. **Invoice PDF + Romanian export** — start with a plain PDF per booking,
    then add D394/e-Factura mapping.

---

## What remains unfinished

This scaffold is a working MVP shell. The CRUD API, dashboard, reports, and
seed data are complete end-to-end. The frontend currently lists and reads data
but **create/edit forms are not yet wired** (buttons are marked `TODO`); use
the Django admin at `/admin/` to create records while forms are built. iCal
sync, auth hardening, file uploads, notifications, and invoice generation are
intentionally out of scope for this first commit — see the 10-task list above.
