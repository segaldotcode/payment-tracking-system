"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPaymentById } from "../queries";

export async function linkReceipt(formData: FormData): Promise<void> {
  const paymentId = String(formData.get("paymentId") ?? "");
  const reference = String(formData.get("reference") ?? "").trim();

  if (!paymentId || !reference) {
    throw new Error("A payment and a receipt reference are required.");
  }

  const payment = await getPaymentById(paymentId);
  if (!payment || payment.status !== "success") {
    throw new Error("A receipt can only be linked to a successful payment.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("receipts").insert({ payment_id: paymentId, reference });

  if (error) {
    throw new Error(`Failed to link receipt: ${error.message}`);
  }

  revalidatePath(`/payments/${paymentId}`);
}
