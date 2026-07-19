"use server";

import { revalidatePath } from "next/cache";
import { withAuditLog } from "@/lib/audit/with-audit-log";
import { getRequestContext } from "@/lib/actions/request-context";
import { applyTransition } from "../transition";

interface RefundInput {
  paymentId: string;
  reason: string;
  refundAmount: number | null;
}

async function refund(input: RefundInput): Promise<void> {
  await applyTransition({
    paymentId: input.paymentId,
    from: "success",
    to: "refunded",
    reason: input.reason,
    extraColumns: { refund_reason: input.reason, refund_amount: input.refundAmount },
  });
}

export async function refundPayment(formData: FormData): Promise<void> {
  const paymentId = String(formData.get("paymentId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const rawAmount = formData.get("refundAmount");
  const refundAmount = rawAmount && String(rawAmount).trim() ? Number(rawAmount) : null;

  if (!paymentId || !reason) {
    throw new Error("A payment and a refund reason are required.");
  }
  if (refundAmount !== null && (!Number.isFinite(refundAmount) || refundAmount <= 0)) {
    throw new Error("Refund amount must be a positive number.");
  }

  const ctx = await getRequestContext();
  const runRefund = withAuditLog({ action: "PAYMENT_REFUNDED", ...ctx }, refund);
  await runRefund({ paymentId, reason, refundAmount });

  revalidatePath("/");
  revalidatePath(`/payments/${paymentId}`);
}
