import { createClient } from "@/lib/supabase/server";
import type { Payment, PaymentEvent, PaymentStatus, Persona, Receipt } from "./types";

const SELECT_COLUMNS =
  "id, user_id, amount, currency, status, failure_reason, refund_reason, refund_amount, created_at, updated_at, users(email)";

interface PaymentRow {
  id: string;
  user_id: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  failure_reason: string | null;
  refund_reason: string | null;
  refund_amount: string | null;
  created_at: string;
  updated_at: string;
  users: { email: string } | null;
}

function mapRow(row: PaymentRow): Payment {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.users?.email ?? null,
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status,
    failureReason: row.failure_reason,
    refundReason: row.refund_reason,
    refundAmount: row.refund_amount === null ? null : Number(row.refund_amount),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface PaymentFilters {
  status?: PaymentStatus;
}

export async function listPayments(filters: PaymentFilters = {}): Promise<Payment[]> {
  const supabase = await createClient();
  let query = supabase.from("payments").select(SELECT_COLUMNS).order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as unknown as PaymentRow[]).map(mapRow);
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return mapRow(data as unknown as PaymentRow);
}

interface PaymentEventRow {
  id: string;
  payment_id: string;
  from_status: PaymentStatus | null;
  to_status: PaymentStatus;
  reason: string | null;
  created_at: string;
}

export async function listPaymentEvents(paymentId: string): Promise<PaymentEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_events")
    .select("id, payment_id, from_status, to_status, reason, created_at")
    .eq("payment_id", paymentId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return (data as PaymentEventRow[]).map((row) => ({
    id: row.id,
    paymentId: row.payment_id,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    reason: row.reason,
    createdAt: row.created_at,
  }));
}

interface ReceiptRow {
  id: string;
  payment_id: string;
  reference: string;
  issued_at: string;
  created_at: string;
}

export async function getReceiptByPaymentId(paymentId: string): Promise<Receipt | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("receipts")
    .select("id, payment_id, reference, issued_at, created_at")
    .eq("payment_id", paymentId)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as ReceiptRow;
  return {
    id: row.id,
    paymentId: row.payment_id,
    reference: row.reference,
    issuedAt: row.issued_at,
    createdAt: row.created_at,
  };
}

export async function listPersonas(): Promise<Persona[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, persona_key, email")
    .order("persona_key");

  if (error || !data) return [];

  return data.map((row) => ({ id: row.id, personaKey: row.persona_key, email: row.email }));
}
