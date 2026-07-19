import type { PaymentStatus } from "./types";

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "processing",
  "success",
  "failed",
  "refunded",
];

// The only transitions a payment is allowed to go through. Validated here,
// server-side, on every mutation: the client never gets to set an arbitrary
// status directly.
export const ALLOWED_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["processing"],
  processing: ["success", "failed"],
  success: ["refunded"],
  failed: [],
  refunded: [],
};

export class InvalidTransitionError extends Error {
  constructor(from: PaymentStatus, to: PaymentStatus) {
    super(`Cannot transition a payment from "${from}" to "${to}".`);
    this.name = "InvalidTransitionError";
  }
}

export function assertTransitionAllowed(from: PaymentStatus, to: PaymentStatus): void {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new InvalidTransitionError(from, to);
  }
}
