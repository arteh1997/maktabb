# Maktabb — Product Brief

_Last updated: March 2026 | Lead: Taha Khalifa | Target: 31 March 2026_

---

## Core Problem

UK maktabs educate 100,000–250,000 Muslim children every week, yet virtually all of them run on WhatsApp groups, paper registers, and Excel spreadsheets. This creates:

1. **No visibility for parents** — they don't know what surah their child is on, whether they've been marked absent, or how they're progressing
2. **No audit trail for teachers** — attendance is informal, Quran progress is tracked in notebooks
3. **UK GDPR risk** — student data shared on WhatsApp group chats is a legal liability
4. **High admin burden** — administrators spend hours manually chasing fees, sending updates, and generating reports

Existing solutions either address institutional management (e-maktab, iMaktab) without modern UX or content delivery, or they offer content (Bayyinah TV, SeekersGuidance) without any institutional layer. **No platform does both.**

Maktabb solves the institutional problem first, then layers on curriculum tools — positioning it as the operating system for UK maktabs.

---

## Target Audience

**Primary customer (pays):** Maktab administrator or lead teacher
**Primary user (daily use):** Class teachers
**Secondary user:** Parents (read-only visibility)
**Children:** Are tracked, not users (under-16s do not create accounts)

**Initial beachhead:** UK Salafi maktabs that use the Safar curriculum — a well-defined community with a shared curriculum, active networks, and no digital tools.

---

## MVP Features (4-week scope — by 31 March 2026)

The MVP is the minimum needed for a maktab to switch away from WhatsApp + Excel and not go back.

### Must have:
- [ ] **School onboarding** — admin creates school account, adds classes and teachers
- [ ] **Student roster** — add/edit/archive students with basic profile (name, DOB, parent contact)
- [ ] **Daily attendance** — teacher marks present/absent per class; timestamped
- [ ] **Quran progress tracking** — record current surah/juz/page per student (sabaq, sabqi, manzil fields for Hifz students)
- [ ] **Parent notification** — email or SMS to parent when child is marked absent
- [ ] **Teacher login** — role-based access (teacher sees only their class; admin sees all)
- [ ] **Basic dashboard** — admin sees at-a-glance: total students, today's attendance, recent activity
- [ ] **GDPR-compliant data storage** — EU region, Privacy Notice, parental consent on enrolment

### Nice to have (include if time allows):
- Bulk student import (CSV)
- Simple progress report PDF export per student
- Parent-facing read-only portal (view their child's attendance and progress)

---

## v1 Features (3-month scope — by end of June 2026)

Building on the MVP, v1 turns Maktabb into a complete institutional platform:

- **Full parent portal** — web + PWA; parents log in to see their child's progress, attendance history, messages
- **Fee management** — record fee payments, mark as paid/unpaid, send payment reminders; optional Stripe integration for online collection
- **Class timetable** — define when each class meets, auto-generate attendance sheets
- **Progress reports** — generate formal termly progress reports (PDF) per student
- **Admin dashboard v2** — charts for attendance trends, subject progress, outstanding fees
- **Multi-class enrolment** — students can be in multiple classes (Quran + Islamic Studies)
- **Homework assignments** — teacher sets homework, student/parent sees it in the portal
- **Announcements** — school-wide or class-specific announcements via in-app + email
- **Certificate generation** — issue certificates for Quran completion milestones (Hifz, Khatam)

---

## Explicitly NOT in v1

- Live video streaming or virtual classes
- Native iOS/Android app (PWA suffices)
- AI-generated lesson plans or content recommendations
- Course marketplace or content library
- Student-to-teacher messaging (too complex; use announcements instead)
- Third-party LMS integration (Google Classroom, etc.)
- Multi-language UI (Arabic, Urdu) — defer post-v1
- Self-service billing portal (manual invoices sufficient in v1)
- Full Ofsted-compliant reporting (not required for supplementary schools)

---

## Core Screens (5–7 key pages)

1. **Login / Onboarding** — email + password login; first-time school setup wizard (school name, classes, first teacher)
2. **Admin Dashboard** — school overview: student count, today's attendance summary, outstanding fees, recent activity feed
3. **Class View** — teacher's view of their class; attendance marking, student list with current progress, quick add homework
4. **Student Profile** — full record for one student: attendance history, Quran progress timeline, fee status, parent contact, notes
5. **Parent Portal** — parent's read-only view of their child's profile (attendance, progress, messages from school)
6. **Reports** — generate and download progress reports per student or per class; attendance reports; fee outstanding list
7. **School Settings / Admin** — manage teachers, classes, school year dates, notification preferences, subscription billing

---

## Data Model

```
School
  ├── id, name, address, timezone, subscription_tier, created_at
  └── Multi-tenancy: all data scoped by school_id

Teacher (User)
  ├── id, school_id, name, email, role (admin | teacher), auth_user_id
  └── Linked to Supabase Auth

Class
  ├── id, school_id, name, teacher_id, year_group, meeting_days

Student
  ├── id, school_id, name, date_of_birth, gender, enrolled_at, archived_at
  └── Linked to one primary class (many-to-many possible via ClassEnrolment)

ClassEnrolment
  ├── id, student_id, class_id, enrolled_at, left_at

Parent
  ├── id, student_id, name, email, phone, consent_given_at

AttendanceRecord
  ├── id, student_id, class_id, date, status (present | absent | late | excused), marked_by

QuranProgress
  ├── id, student_id, date, sabaq (current memorisation), sabqi (yesterday's revision), manzil (full review), notes, recorded_by

SubjectProgress
  ├── id, student_id, class_id, subject (Islamic Studies | Arabic | etc.), current_level, notes, updated_at

FeeRecord
  ├── id, student_id, amount, due_date, paid_date, payment_method, stripe_payment_intent_id?

Homework
  ├── id, class_id, set_by, title, description, due_date, created_at

Announcement
  ├── id, school_id, class_id (nullable = school-wide), title, body, created_by, created_at

Report (generated)
  ├── id, student_id, term, generated_by, pdf_url, created_at
```

---

## Integrations

| Service | Purpose | MVP? |
|---|---|---|
| **Supabase** | Database, Auth, Storage, Realtime | Yes |
| **Resend** | Transactional email (absence notifications, reports) | Yes |
| **Twilio** | SMS notifications for parent absence alerts | Yes (optional in MVP) |
| **Stripe** | Fee collection, school subscriptions | v1 |
| **Vercel** | Hosting + preview deployments | Yes |
| **Mux** | Video hosting for course content | Post-v1 |
| **PostHog** | Product analytics (school-level only, no child profiling) | v1 |

---

## Success Metrics for MVP

- At least 2 UK maktabs onboarded and using Maktabb daily before March 31
- Teachers are marking attendance digitally (replacing paper registers)
- At least 1 parent receiving absence notifications via email/SMS
- Zero UK GDPR complaints
