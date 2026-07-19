import { createClient } from "@/lib/supabase/server";
import { assertTransitionAllowed } from "./state-machine";
import type { PaymentStatus } from "./types";

interface ApplyTransitionInput {
  paymentId: string;
  from: PaymentStatus;
  to: PaymentStatus;
  reason?: string | null;
  extraColumns?: Record<string, unknown>;
}

// Single place where a payment's status actually changes. Validates the
// transition against the state machine, then updates the row and records the
// step in payment_events. The `.eq("status", from)` guard means the update
// silently matches zero rows if another request already moved the payment
// past `from`, which we treat as a conflict rather than applying anyway.
export async function applyTransition({
  paymentId,
  from,
  to,
  reason,
  extraColumns,
}: ApplyTransitionInput): Promise<void> {
  assertTransitionAllowed(from, to);

  const supabase = await createClient();

  const { data, error: updateError } = await supabase
    .from("payments")
    .update({ status: to, updated_at: new Date().toISOString(), ...extraColumns })
    .eq("id", paymentId)
    .eq("status", from)
    .select("id")
    .maybeSingle();

  if (updateError) {
    throw new Error(`Failed to update payment: ${updateError.message}`);
  }
  if (!data) {
    throw new Error(`Payment ${paymentId} is no longer in status "${from}". Refresh and try again.`);
  }

  const { error: eventError } = await supabase.from("payment_events").insert({
    payment_id: paymentId,
    from_status: from,
    to_status: to,
    reason: reason ?? null,
  });

  if (eventError) {
    throw new Error(`Failed to record payment event: ${eventError.message}`);
  }
}
