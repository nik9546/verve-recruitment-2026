# VERVE Recruitment Portal 2026 — Build Plan

A premium, cinematic recruitment site for VERVE (St. Xavier's College, Ranchi) with dark navy + gold glassmorphism, subtle 3D, scroll-triggered motion, and a native application form storing submissions in Lovable Cloud.

## Stack note
This project runs on **TanStack Start + Vite + Tailwind v4** (not Next.js). All requested capabilities work the same: Tailwind, Framer Motion, React Three Fiber, and Lovable Cloud (Supabase under the hood) for storing form submissions. No external Google Forms.

## Design system (src/styles.css)
- Palette (oklch): deep black `#05070d`, navy `#0a1428`, navy-2 `#0f1e3d`, white, gold `#d4af37` + gold-glow `#f4d77a`.
- Glassmorphism tokens: `--glass-bg`, `--glass-border`, `--glass-blur`, gradient tokens, gold-glow shadow, radial navy gradient.
- Typography: Space Grotesk (display) + Inter (body), tight tracking on headings.
- Motion utilities: fade-up, reveal-on-scroll, hover-lift, gold-shimmer.

## Sections (single landing route `/` with internal nav)
1. **Hero** — full-screen, animated navy/gold gradient, floating 3D media cluster (camera, mic, globe), headline "VERVE Recruitment Portal 2026", subheadline, tagline, CTAs (Apply Now → form, Explore Opportunities → departments), 4 animated stat counters.
2. **About VERVE** — copy + interactive 3D digital globe (R3F) with orbiting nodes.
3. **Why Join VERVE** — 9 glass benefit cards with hover tilt.
4. **Departments & Opportunities** — 12 glass cards with icon, description, hover glow.
5. **Leadership & Head Policy** — animated vertical roadmap (Member → Executive), criteria chips.
6. **Certification & Recognition** — 4 premium tiered cards (White/Silver/Gold/Diamond) with metallic gradients.
7. **Goals of VERVE** — split layout with iconified checklist.
8. **Objectives of VERVE** — bento grid of objectives.
9. **Membership Policies** — glass cards.
10. **Recruitment Process** — animated 6-step timeline (scroll-triggered).
11. **Application Form** — native multi-step form (see below).
12. **Success Modal** — confetti + glow on submission.
13. **Footer** — VERVE branding, college, tagline, subtle gold divider.

## Navigation
- Desktop: sticky glass nav with smooth-scroll anchors + gold Apply Now CTA.
- Mobile: animated hamburger → full-screen glass overlay menu.

## 3D (React Three Fiber, performance-tuned)
- Hero: floating low-poly camera/mic/play-button shapes, mouse-parallax, subtle bloom.
- About: wireframe globe with arcs.
- Mobile: reduced DPR + fewer meshes via `useMediaQuery`; lazy-load Canvas with Suspense; pause when offscreen.

## Application form (Section 11)
Single-screen, sectioned with progress indicator.
- Personal: Full Name, Roll Number, Department/Course, Semester, Phone, Email (zod validation).
- **Department selection**: 12 large interactive cards, exactly 3 required. Live counter "Selected: X / 3". After 3 selected, others go disabled+dimmed; deselect re-enables. Selected cards get gold glow + 3D tilt.
- **Smart Insight card**: animated recommendation derived from selected mix (Creative Media / Communication & Leadership / Digital Content / Strategy & Ops) — appears once 3 are chosen.
- Motivation (textarea, min length).
- Availability (radio: 2–4, 4–6, 6–8, 8+ hrs).
- Commitment (Yes/No, must be Yes to submit).
- Submit disabled until all valid; inline elegant error messages via react-hook-form + zod.

## Backend (Lovable Cloud)
Enable Lovable Cloud, then a migration creates:
- `public.verve_applications` (id, created_at, full_name, roll_number, course, semester, phone, email unique, departments text[] length=3, motivation, availability, commitment bool, insight text).
- GRANTs + RLS: allow `anon` INSERT only (public form), no SELECT for anon; service_role full access for admin review later.
- Server function `submitApplication` (createServerFn) validates with zod and inserts via `supabaseAdmin` (since anon insert is fine, we can also do client-side insert — we'll use server fn for validation + uniqueness handling).

## Responsiveness & performance
- Mobile-first Tailwind; container queries where useful; no horizontal overflow.
- Lazy-load R3F Canvas + Framer features; `prefers-reduced-motion` respected.
- Image-free hero (3D + gradients) keeps payload small.
- SEO `<head>` with title/description/OG; semantic landmarks; alt text on any imagery.

## Files to add/change
- `src/styles.css` — palette + glass/gradient tokens, fonts.
- `src/routes/index.tsx` — replace placeholder, compose sections.
- `src/routes/__root.tsx` — fonts, meta.
- `src/components/verve/` — `Nav.tsx`, `Hero.tsx`, `About.tsx`, `WhyJoin.tsx`, `Departments.tsx`, `Leadership.tsx`, `Certification.tsx`, `Goals.tsx`, `Objectives.tsx`, `Policies.tsx`, `Process.tsx`, `ApplicationForm.tsx`, `SuccessModal.tsx`, `Footer.tsx`, `GlassCard.tsx`, `SectionHeading.tsx`, `StatCounter.tsx`.
- `src/components/verve/three/` — `HeroScene.tsx`, `Globe.tsx`, lazy wrappers.
- `src/lib/verve/departments.ts` — department data + insight logic.
- `src/lib/verve/application.functions.ts` — `submitApplication` server fn + zod schema.
- Migration: create table, grants, RLS policies.
- Deps to install: `framer-motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `react-hook-form`, `@hookform/resolvers`, `zod`, `canvas-confetti`, `lucide-react` (likely present).

## Out of scope (can be follow-ups)
- Admin dashboard to review submissions.
- Email notifications on submission.
- Auth/login (form is public).

Ready to build on approval.