"use server";

import { revalidatePath } from "next/cache";
import { withAuditLog } from "@/lib/audit/with-audit-log";
import { getRequestContext } from "@/lib/actions/request-context";
import { applyTransition } from "../transition";
import type { PaymentStatus } from "../types";

type AdvanceTarget = "processing" | "success" | "failed";

const ACTION_BY_TARGET: Record<AdvanceTarget, string> = {
  processing: "PAYMENT_PROCESSING",
  success: "PAYMENT_SUCCEEDED",
  failed: "PAYMENT_FAILED",
};

interface AdvanceInput {
  paymentId: string;
  from: PaymentStatus;
  to: AdvanceTarget;
  reason: string | null;
}

async function advance(input: AdvanceInput): Promise<void> {
  await applyTransition({
    paymentId: input.paymentId,
    from: input.from,
    to: input.to,
    reason: input.reason,
    extraColumns: input.to === "failed" ? { failure_reason: input.reason } : undefined,
  });
}

export async function advancePayment(formData: FormData): Promise<void> {
  const paymentId = String(formData.get("paymentId") ?? "");
  const from = String(formData.get("from") ?? "") as PaymentStatus;
  const to = String(formData.get("to") ?? "") as AdvanceTarget;
  const rawReason = formData.get("reason");
  const reason = rawReason ? String(rawReason).trim() || null : null;

  if (!paymentId || !from || !(to in ACTION_BY_TARGET)) {
    throw new Error("Missing or invalid payment transition parameters.");
  }
  if (to === "failed" && !reason) {
    throw new Error("A failure reason is required to mark a payment as failed.");
  }

  const ctx = await getRequestContext();
  const runAdvance = withAuditLog({ action: ACTION_BY_TARGET[to], ...ctx }, advance);
  await runAdvance({ paymentId, from, to, reason });

  revalidatePath("/");
  revalidatePath(`/payments/${paymentId}`);
}
