# Maktabb — Market Research

_Last updated: March 2026_

---

## 1. Existing Competitors

### 1a. Course/Content Platforms (global Islamic education)

| Platform | Offering | Pricing | What they do well | What they lack |
|---|---|---|---|---|
| **Bayyinah TV** | Quran tafsir, Arabic language (Nouman Ali Khan) | $11/month; $1,000 lifetime | High production quality, structured Arabic curriculum, regional pricing ($4.50/mo in some markets) | No institutional tools, no student tracking, no parent portal, no UK-specific or Salafi content |
| **SeekersGuidance** | Traditional Islamic knowledge (fiqh, aqeedah, seerah), structured 5-level curriculum | **Free** (donation-supported) | Genuine scholarship, broad curriculum, live + on-demand, youth curriculum track | No institution management, no attendance, no fee collection, not UK-focused |
| **Qalam Institute** | Community-focused age-specific Quran, character, fiqh classes | Community/donation model | Age-appropriate content, character focus | Not a software platform; no API or SaaS offering |
| **Al-Maghrib Institute** | On-demand + live Islamic sciences, reaching hundreds of thousands globally | Per-course fees | Scale, quality | No institutional layer, no school accounts, no children's tracking |
| **Safar Publications** | Printed Islamic curriculum, textbooks (Safar series widely used in UK maktabs) | Books (free delivery on orders £250+) | Widely adopted curriculum in UK Salafi maktabs | Paper-only; no digital platform |

**Key insight:** None of these platforms serve the institutional needs of a maktab (attendance, student rosters, parent communication, fee collection). They are content-first, not institution-first.

---

### 1b. Maktab Management Tools (UK-specific)

| Platform | Offering | Pricing | What they do well | What they lack |
|---|---|---|---|---|
| **e-maktab** ([e-maktab.co.uk](https://e-maktab.co.uk)) | Student records, attendance, fee collection via direct debit, parent updates | Unclear (freemium/tiered) | Direct debit integration, UK-specific, established user base | Dated UX, limited Quran-specific tracking, no content delivery |
| **MaktabMate** ([maktabmate.co.uk](https://maktabmate.co.uk)) | Quran memorisation tracking (sabaq, sabqi, manzil), attendance, 30-day free trial | Tiered (exact prices not published) | Hifz-specific tracking, maktab-appropriate terminology | No parent portal depth, no content delivery, basic reporting |
| **iMaktab** ([imaktab.co.uk](https://imaktab.co.uk)) | Attendance, fee management, parent comms, homework, timetable, remote admin | Not published | Broad feature set, remote administration | Unknown reliability/scale, limited public documentation |
| **Ilmify** ([ilmify.app](https://ilmify.app)) | Hifz tracking, student admissions, fee collection, parent comms, mobile app | Industry range ~£50–150/month | GDPR-compliant, mobile-first, Islamic school-specific, iOS/Android apps | Relatively new, Hifz-heavy rather than broader curriculum |
| **IBEams** ([ibeuk.org](https://www.ibeuk.org)) | Advanced madrasah management, office administration | Not published | Enterprise-level, handles complex admin | Heavy/complex, not modern UX |
| **MadrasaSIMS** | Quran memorisation + madrasa management | SaaS | Quranic studies focus | Less UK-specific |

**Key insight:** The UK maktab management market is fragmented. Existing tools are either too narrow (Hifz-only), too legacy (dated tech), or lack proper parent-facing experiences. None combine curriculum delivery with institutional management in a modern, mobile-first product.

---

## 2. Gap Analysis

### The Core Gap
No single platform currently combines:
1. **Institutional management** (student rosters, attendance, fee collection) tailored to UK maktabs
2. **Curriculum-aligned content** (structured lesson delivery, progress tracking tied to the Safar/other curricula)
3. **Modern parent-facing portal** (real-time visibility, push notifications, mobile-first)
4. **Salafi/traditionalist curriculum compatibility** (the Safar curriculum is dominant in UK Salafi maktabs but has no digital platform equivalent)

### UK-Specific Gaps
- Many UK maktabs still operate via **WhatsApp groups and Excel spreadsheets** — a UK GDPR compliance risk
- No dominant platform has achieved market leadership; the space is still up for grabs
- **~2,000+ maktabs** educating an estimated **100,000–250,000 children weekly** across the UK (source: supplementary school research, ilmify blog)
- Safar curriculum (from Safar Publications) is print-only — no digital companion exists

### Salafi Curriculum Gap
The Safar curriculum series is widely used in UK Salafi maktabs but exists only in print. A digital platform that maps lesson tracking to the Safar books would be immediately adoptable by this segment with near-zero curriculum design effort.

---

## 3. Target Audience

### Primary: UK Maktab Administrators & Teachers
- Run supplementary Islamic schools attached to mosques or community centres
- Operate evenings/weekends, typically small teams (1–3 administrators, 5–20 teachers)
- Current tools: WhatsApp, Excel, Google Sheets, paper registers
- Pain: No reliable attendance records, parent communication is ad hoc, fee collection is manual (cash/bank transfer)
- Decision maker: Mosque committee or lead teacher/ustadh
- Willingness to pay: £30–60/month if it saves admin time

### Secondary: Parents of maktab children (ages 5–15)
- Want visibility into their child's Quran progress
- Currently receive sporadic WhatsApp messages from teachers
- Want: Progress reports, attendance records, what surah/juz their child is on, notifications when absent

### Tertiary: Home-educating Muslim families
- Supplementary market — could use a lighter version of the platform
- Not the primary focus for MVP

### Out of scope (for now): Adults seeking Islamic knowledge (SeekersGuidance territory)

---

## 4. Pricing Research

### What competitors charge (software)
- Industry range for maktab management software: **£50–150/month** per institution (ilmify blog reference)
- e-maktab: Unclear, likely £20–50/month tier
- MaktabMate: Undisclosed, with 30-day free trial
- Bayyinah TV (individual): $11/month ≈ £9/month

### What maktabs charge parents
- Typical UK maktab fees: **£20–40/month per child** (Sutton Coldfield Muslim Association example)
- Some maktabs charge £5–10/week

### Recommended Maktabb pricing
Given the market and willingness to pay:
- **Starter:** £29/month — up to 50 students, 3 teachers
- **Growth:** £59/month — up to 150 students, 10 teachers
- **Institution:** £99/month — unlimited students, unlimited teachers, premium support
- Annual discount: 2 months free (e.g., £290/year Starter)

A maktab with 100 students charging parents £25/month generates £2,500/month — the software cost at £59/month is a trivial 2.4% overhead. Price sensitivity is low.

---

## 5. UK Regulations

### ICO Children's Code (Age Appropriate Design Code)
- Applies to **Information Society Services (ISS)** — online platforms likely accessed by under-18s
- **Does not directly apply to schools**, but **does apply to edtech software providers** used by schools
- Maktabb, as the software provider, is in scope
- Key requirements: data minimisation, privacy by default, no profiling of children for commercial purposes, no nudge techniques, high privacy settings as default, age-appropriate content
- Source: [ICO Children's Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/)

### UK GDPR
- Student data (name, attendance, progress) is personal data — requires lawful basis for processing
- Maktabs storing student data on WhatsApp are technically in breach of UK GDPR (identified by ilmify blog)
- Maktabb must: maintain a Record of Processing Activities (RoPA), have a Privacy Notice, enable data deletion requests
- Data (Use and Access) Act 2025 (in force June 2025): new edtech-specific code being developed by ICO

### Ofsted
- Supplementary schools (maktabs) are **not required to register with Ofsted** unless they provide 18+ hours/week of full-time education
- Most maktabs run 1–2 hours/day, 5 days/week — below the threshold
- Ofsted is not a compliance concern for typical maktabs

### Practical implications for Maktabb
1. No tracking of individual behaviour for advertising purposes
2. Parental consent required before creating child profiles
3. Data must be stored in UK/EU (Supabase EU region)
4. Clear data retention policy (e.g., delete student records 1 year after they leave)
5. Cookie consent if any analytics are used

---

## Sources

- [Bayyinah TV Pricing](https://bayyinah.com/lifetime/)
- [SeekersGuidance Free Courses](https://seekersguidance.org/articles/general-artices/free-online-courses/)
- [e-maktab](https://e-maktab.co.uk)
- [MaktabMate](https://maktabmate.co.uk)
- [iMaktab](https://imaktab.co.uk)
- [Ilmify App](https://ilmify.app)
- [Ilmify: Moving from WhatsApp to Proper Management Software](https://ilmify.app/blog/moving-from-whatsapp-excel-school-management-software/)
- [Ilmify: UK Supplementary School Management Guide](https://ilmify.app/blog/supplementary-school-management-uk/)
- [ICO Children's Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/)
- [Safar Publications](https://safarpublications.org)
