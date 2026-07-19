"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { withAuditLog } from "@/lib/audit/with-audit-log";
import { getRequestContext } from "@/lib/actions/request-context";

interface CreatePaymentInput {
  userId: string;
  amount: number;
  currency: string;
}

async function insertPayment(input: CreatePaymentInput): Promise<{ id: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .insert({
      user_id: input.userId,
      amount: input.amount,
      currency: input.currency,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create payment: ${error?.message}`);
  }

  const { error: eventError } = await supabase.from("payment_events").insert({
    payment_id: data.id,
    from_status: null,
    to_status: "pending",
  });

  if (eventError) {
    throw new Error(`Failed to record payment event: ${eventError.message}`);
  }

  return { id: data.id };
}

export async function createPayment(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId") ?? "");
  const amount = Number(formData.get("amount"));
  const currency = String(formData.get("currency") ?? "USD");

  if (!userId || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("A persona and a positive amount are required to create a payment.");
  }

  const ctx = await getRequestContext();
  const runCreate = withAuditLog({ action: "PAYMENT_CREATED", userId, ...ctx }, insertPayment);
  await runCreate({ userId, amount, currency });

  revalidatePath("/");
}
