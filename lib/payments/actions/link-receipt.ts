"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPaymentById } from "../queries";

function generateReceiptReference(): string {
  return `RCPT${randomUUID().split("-")[0].toUpperCase()}`;
}

export async function linkReceipt(formData: FormData): Promise<void> {
  const paymentId = String(formData.get("paymentId") ?? "");

  if (!paymentId) {
    throw new Error("A payment is required to link a receipt.");
  }

  const payment = await getPaymentById(paymentId);
  if (!payment || payment.status !== "success") {
    throw new Error("A receipt can only be linked to a successful payment.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("receipts")
    .insert({ payment_id: paymentId, reference: generateReceiptReference() });

  if (error) {
    throw new Error(`Failed to link receipt: ${error.message}`);
  }

  revalidatePath(`/payments/${paymentId}`);
}
