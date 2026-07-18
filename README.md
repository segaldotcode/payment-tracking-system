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

Coming soon.

## Architecture

Coming soon.
