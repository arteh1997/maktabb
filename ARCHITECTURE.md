# Maktabb — Architecture

_Last updated: March 2026_

---

## Tech Stack Recommendation

### Framework: Next.js 14 (App Router)
**Why:** Taha is already working with Next.js (same stack as Qaos). App Router gives server components for fast data fetching, route-based layouts for admin vs. teacher vs. parent views, and excellent Vercel integration with zero config. React Server Components reduce client JS bundle for parent portal pages.

### Database & Backend: Supabase
**Why:** Postgres with Row-Level Security (RLS) is the right foundation for multi-tenant data isolation. Supabase Auth eliminates custom auth code. Supabase Storage handles file uploads (report PDFs, certificates). Supabase Realtime enables live attendance updates (teacher marks attendance, admin sees it instantly). Same stack as Qaos means Taha has the tooling set up.

### Hosting: Vercel
**Why:** Zero-ops deploys, preview URLs per PR, automatic HTTPS, Edge Functions for lightweight API routes, global CDN for fast parent portal loads. Works seamlessly with Next.js.

### Auth: Supabase Auth
- Email + password for teachers and admins
- Magic link for parents (no password to forget; parents just tap a link from email)
- JWT-based sessions managed by Supabase
- Role stored in `teachers.role` column, enforced server-side

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL CDN                           │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │            Next.js 14 (App Router)                   │  │
│   │                                                      │  │
│   │  /app/(admin)/     → Admin dashboard, settings       │  │
│   │  /app/(teacher)/   → Class view, attendance          │  │
│   │  /app/(parent)/    → Parent portal (read-only)       │  │
│   │  /app/api/         → API routes (webhooks, reports)  │  │
│   │                                                      │  │
│   │  Server Components fetch directly from Supabase      │  │
│   │  Client Components use Supabase client (realtime)    │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │                      │
              ▼                      ▼
┌─────────────────────┐   ┌──────────────────────────────┐
│   SUPABASE (EU)     │   │    THIRD-PARTY SERVICES       │
│                     │   │                              │
│  ┌───────────────┐  │   │  Resend (email)              │
│  │   Postgres    │  │   │  Twilio (SMS)                │
│  │   + RLS       │  │   │  Stripe (payments)           │
│  └───────────────┘  │   │  PostHog (analytics)         │
│  ┌───────────────┐  │   │                              │
│  │     Auth      │  │   └──────────────────────────────┘
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │   Storage     │  │
│  │  (PDFs/files) │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │   Realtime    │  │
│  └───────────────┘  │
└─────────────────────┘
```

### Key Architectural Decisions

**Server Components for data fetching:** All admin and teacher pages use React Server Components. They query Supabase directly on the server, reducing round-trips and keeping sensitive data server-side.

**Supabase RLS for multi-tenancy:** Every table has a `school_id` column. RLS policies enforce that users can only read/write rows belonging to their school. This is enforced at the database level — even a bug in application code cannot leak cross-school data.

**API routes for side effects:** Sending emails (Resend), SMS (Twilio), and Stripe webhooks go through Next.js API routes, not directly from the client. This keeps API keys server-side.

**PDF generation:** Termly reports generated server-side using `@react-pdf/renderer` or `puppeteer` (lean toward react-pdf for simpler deployments). PDFs stored in Supabase Storage; signed URLs sent to parents.

---

## Multi-Tenancy Design

Each school is completely isolated:

```sql
-- Every data table has school_id
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id),
  name text NOT NULL,
  ...
);

-- RLS policy ensures users only see their school's data
CREATE POLICY "school_isolation" ON students
  FOR ALL USING (
    school_id = (
      SELECT school_id FROM teachers
      WHERE auth_user_id = auth.uid()
    )
  );
```

Admins see all data within their school. Teachers see only their assigned classes. Parents see only their child's data. All enforced via Supabase RLS — no application-level filtering needed.

---

## Data Model (Schema Summary)

```sql
schools (id, name, address, postcode, subscription_tier, stripe_customer_id, created_at)
teachers (id, school_id, auth_user_id, name, email, role, created_at)
classes (id, school_id, name, teacher_id, year_group, meeting_days, academic_year)
students (id, school_id, name, date_of_birth, gender, enrolled_at, archived_at)
class_enrolments (id, student_id, class_id, enrolled_at, left_at)
parents (id, student_id, name, email, phone, consent_given_at, magic_link_token)
attendance_records (id, student_id, class_id, date, status, marked_by, created_at)
quran_progress (id, student_id, class_id, date, sabaq, sabqi, manzil, notes, recorded_by)
subject_progress (id, student_id, class_id, subject, current_level, notes, updated_at)
fee_records (id, student_id, school_id, amount_pence, due_date, paid_date, stripe_payment_intent_id)
homework (id, class_id, set_by, title, description, due_date, created_at)
announcements (id, school_id, class_id, title, body, created_by, created_at, sent_at)
reports (id, student_id, term, academic_year, generated_by, storage_path, created_at)
```

---

## Third-Party Services

| Service | Role | Notes |
|---|---|---|
| **Supabase** | DB, Auth, Storage, Realtime | EU region (Frankfurt) for UK GDPR compliance |
| **Vercel** | Hosting, CI/CD, Edge Functions | Free tier sufficient for MVP; Pro for custom domain + team |
| **Resend** | Transactional email | Absence alerts, magic links for parents, report delivery. Free up to 3,000 emails/month |
| **Twilio** | SMS | Absence notifications to parents. Pay-per-SMS (~£0.04/message UK). Optional — skip in MVP if budget-conscious |
| **Stripe** | School subscriptions + optional parent fee collection | Stripe Billing for recurring school subscriptions; one-time charges for parent fees |
| **PostHog** | Analytics | School-level aggregates only (no individual child tracking). Self-hosted or PostHog Cloud EU |
| **Mux** | Video | Post-v1 only — for curriculum video content. Defer entirely |

---

## Mobile Strategy

**PWA (Progressive Web App) — not a native app.**

Reasoning:
- Teachers mark attendance on a phone in class — PWA covers this with "Add to Home Screen"
- Parents check progress occasionally — web is fine
- No App Store review delays for MVP
- Supabase Realtime works in PWA
- Native app deferred to post-v1 if user research shows it's needed

PWA setup: `next-pwa` or manual `manifest.json` + service worker. Offline support for attendance marking (queue marks locally, sync when online) — this is a v1 enhancement, not MVP.

---

## Infrastructure & Deployment

```
Local dev  →  GitHub PR  →  Vercel Preview  →  Vercel Production
                               (auto-deploy)     (manual promote)
```

- **Environments:** `development` (local Supabase), `preview` (shared Supabase staging), `production` (Supabase prod)
- **Secrets:** Vercel environment variables (never committed to repo)
- **Database migrations:** Supabase CLI (`supabase db push` / migration files in `supabase/migrations/`)
- **CI:** Vercel runs Next.js build on every PR — if build fails, PR is blocked

---

## Security Considerations

- Supabase RLS enforces data isolation at DB level (not just app logic)
- Parental magic links expire after 24 hours and are single-use
- Children (under 13) are tracked as records, not users — no child accounts
- All API keys server-side only (never exposed to client)
- HTTPS everywhere (Vercel enforces)
- Supabase EU region for UK GDPR compliance
- Rate limiting on auth endpoints via Supabase built-in limits
- PDF reports served via short-lived signed Supabase Storage URLs

---

## Development Conventions (for Taha)

- **Language:** TypeScript throughout
- **Styling:** Tailwind CSS (consistent with Qaos)
- **Component library:** shadcn/ui (headless, accessible, copy-paste components)
- **State management:** Zustand for client state (if needed); React Server Components for data
- **Forms:** React Hook Form + Zod validation
- **Database types:** Supabase type generation (`supabase gen types typescript`)
- **Linting:** ESLint + Prettier (same config as Qaos)
