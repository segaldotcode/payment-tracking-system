export const AUDIT_ACTIONS = [
  "PAYMENT_CREATED",
  "PAYMENT_PROCESSING",
  "PAYMENT_SUCCEEDED",
  "PAYMENT_FAILED",
  "PAYMENT_REFUNDED",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface LogEventInput {
  userId?: string | null;
  action: AuditAction | (string & {});
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}
