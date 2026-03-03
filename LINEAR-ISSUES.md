# Maktabb — Linear Issues

_Created: March 2026 | Linear project: [Maktabb](https://linear.app/artehsolutions/project/maktabb-2281a2666115) | Team: Qaos (QOS)_

The Maktabb Linear project has been updated to **Planned** status with full description. 23 issues were created across 8 areas. One existing issue (QOS-17) was retained as-is.

---

## Project

| Field | Value |
|---|---|
| Project ID | `bddc5cca-28ad-4d33-bfc3-6201b0eb4c18` |
| Status | **Planned** |
| Priority | High |
| Lead | Taha Khalifa |
| Target | 31 March 2026 |
| URL | https://linear.app/artehsolutions/project/maktabb-2281a2666115 |

---

## Issues by Area

### Auth & User Management

| ID | Title | Priority |
|---|---|---|
| [QOS-118](https://linear.app/artehsolutions/issue/QOS-118) | Set up Supabase Auth with email/password and parent magic links | High |
| [QOS-119](https://linear.app/artehsolutions/issue/QOS-119) | Role-based access control — admin, teacher, parent with Supabase RLS | High |
| [QOS-120](https://linear.app/artehsolutions/issue/QOS-120) | School onboarding wizard — first-time setup flow | High |

### School & Class Management

| ID | Title | Priority |
|---|---|---|
| [QOS-121](https://linear.app/artehsolutions/issue/QOS-121) | Class management — create, edit, archive classes with teacher assignment | High |

### Student Records & Attendance

| ID | Title | Priority |
|---|---|---|
| [QOS-122](https://linear.app/artehsolutions/issue/QOS-122) | Student roster — add, edit, archive students with parent contact | High |
| [QOS-123](https://linear.app/artehsolutions/issue/QOS-123) | Daily attendance marking — teacher marks present/absent per session | High |
| [QOS-135](https://linear.app/artehsolutions/issue/QOS-135) | Bulk student import via CSV | Medium |

### Teacher Dashboard

| ID | Title | Priority |
|---|---|---|
| [QOS-124](https://linear.app/artehsolutions/issue/QOS-124) | Quran progress recording — sabaq, sabqi, manzil per student | High |
| [QOS-126](https://linear.app/artehsolutions/issue/QOS-126) | Teacher class view — class roster, quick attendance, and progress entry | High |

### Admin Panel

| ID | Title | Priority |
|---|---|---|
| [QOS-125](https://linear.app/artehsolutions/issue/QOS-125) | Admin dashboard — school overview with attendance summary and activity feed | High |

### Parent Portal & Notifications

| ID | Title | Priority |
|---|---|---|
| [QOS-127](https://linear.app/artehsolutions/issue/QOS-127) | Parent absence notification via email (Resend) when student marked absent | High |
| [QOS-128](https://linear.app/artehsolutions/issue/QOS-128) | Parent portal — read-only view of child's attendance and Quran progress | Medium |
| [QOS-129](https://linear.app/artehsolutions/issue/QOS-129) | Progress report generation — termly PDF report per student | Medium |
| [QOS-133](https://linear.app/artehsolutions/issue/QOS-133) | Announcement system — school-wide and class-specific broadcasts | Medium |

### Course & Lesson Delivery

| ID | Title | Priority |
|---|---|---|
| [QOS-132](https://linear.app/artehsolutions/issue/QOS-132) | Homework assignment — teacher sets homework, visible in parent portal | Medium |
| [QOS-134](https://linear.app/artehsolutions/issue/QOS-134) | Certificate generation — Quran completion and Hifz milestone certificates | Medium |

### Payment & Subscriptions

| ID | Title | Priority |
|---|---|---|
| [QOS-130](https://linear.app/artehsolutions/issue/QOS-130) | Fee record management — track payments and mark paid/unpaid per student | Medium |
| [QOS-131](https://linear.app/artehsolutions/issue/QOS-131) | Stripe integration — school subscription billing | Medium |

### Infrastructure & Deployment

| ID | Title | Priority |
|---|---|---|
| [QOS-136](https://linear.app/artehsolutions/issue/QOS-136) | Next.js 14 project scaffold — TypeScript, Tailwind, shadcn/ui, Supabase client | High |
| [QOS-137](https://linear.app/artehsolutions/issue/QOS-137) | Supabase schema, migrations, and RLS policies for multi-tenant isolation | High |
| [QOS-138](https://linear.app/artehsolutions/issue/QOS-138) | Vercel deployment — staging and production environments with CI/CD | High |

### Research Tasks

| ID | Title | Priority |
|---|---|---|
| [QOS-139](https://linear.app/artehsolutions/issue/QOS-139) | Research: Validate pricing model with UK maktab administrators | High |
| [QOS-140](https://linear.app/artehsolutions/issue/QOS-140) | Research: Evaluate domain name and brand for public launch | Medium |

---

## Existing Issues (retained)

| ID | Title | Notes |
|---|---|---|
| [QOS-17](https://linear.app/artehsolutions/issue/QOS-17) | Maktabb — Build MVP (March target) | Original tracking issue; retained as parent context |

---

## Suggested Starting Order (MVP sprint)

For the March 31 target, this is the recommended build order:

1. **QOS-136** — Scaffold the project (nothing else can happen without this)
2. **QOS-137** — Database schema and RLS (foundation for all features)
3. **QOS-138** — Deployment pipeline (staging available from day 1)
4. **QOS-118** → **QOS-119** → **QOS-120** — Auth and onboarding
5. **QOS-121** → **QOS-122** — Classes and students
6. **QOS-123** → **QOS-124** → **QOS-126** — Attendance + Quran progress + teacher view (core daily loop)
7. **QOS-127** — Absence notifications (parents immediately get value)
8. **QOS-125** — Admin dashboard
9. **QOS-139** — Price validation (can happen in parallel from day 1)

Everything else is v1 scope, after MVP validation.
