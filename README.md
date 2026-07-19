# Payment Tracking System

## Why this exists

Most portfolio projects skip the hard part of payments: the lifecycle. This project is the business proof of the portfolio. It shows a real understanding of the constraints of a payment system: state transitions, error handling, refunds and receipts, not just a CRUD list with a status column.

Every state change is validated server-side and automatically logged to the shared Audit Log System, so the payment history and the audit trail never drift apart.

## Features

- Payment list with status: `pending`, `processing`, `success`, `failed`, `refunded`
- Lifecycle state machine:

```text
CREATED -> PROCESSING -> SUCCESS
                      -> FAILED
                      -> REFUNDED
```

- Detailed timeline per payment with a timestamp for every step
- Receipt linking: attach a receipt to a payment
- Full refund flow with a required reason and status update
- Every status change fires an event in the Audit Log System

## Tech stack

- Next.js (App Router)
- Supabase
- Tailwind CSS + Shadcn UI
- next-themes (dark/light mode)
- cuelume (interaction sounds)
- pnpm

## Screenshots / Demo GIF

Coming soon.

## How to reuse

1. Clone the repo and install dependencies: `pnpm install`
2. Add your Supabase credentials to `.env.local` (see `.env.example`)
3. Run `supabase/schema.sql` against your database, then `supabase/seed.sql` to backfill demo history for any existing payments
4. Run `pnpm dev` and use the "New payment" form to create a payment, then advance it through its lifecycle from its detail page

## Architecture

- `lib/payments/state-machine.ts` declares the only allowed transitions (`pending -> processing -> success | failed`, `success -> refunded`) and `lib/payments/transition.ts` is the single place a payment's status actually changes: it re-validates the transition, updates `payments` with an optimistic-concurrency guard (`.eq("status", from)`), and inserts a `payment_events` row
- `lib/payments/actions/` are the server actions (`create-payment`, `advance-payment`, `refund-payment`, `link-receipt`), each wrapped with `withAuditLog` so every transition also lands in the shared `audit_logs` table
- `lib/audit/` is a local port of the `logEvent`/`withAuditLog`/sanitization pattern from Audit Log System, since these are separate GitHub repos with no shared package
- `supabase/schema.sql` recreates the shared `payments` table idempotently (originally created by AI Admin Assistant) and adds the two tables this repo owns: `payment_events` (the per-transition timeline) and `receipts` (1:1 receipt linking)
- `lib/i18n/` holds `en.json`/`fr.json` dictionaries, including translated status labels not yet present anywhere else in the ecosystem
- `app/page.tsx` lists payments with a status filter and the "new payment" form; `app/payments/[id]/page.tsx` is the detail view with the timeline, receipt panel and the action relevant to the current status
