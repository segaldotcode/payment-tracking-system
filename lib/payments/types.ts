export type PaymentStatus = "pending" | "processing" | "success" | "failed" | "refunded";

export interface Payment {
  id: string;
  userId: string | null;
  userEmail: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  failureReason: string | null;
  refundReason: string | null;
  refundAmount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEvent {
  id: string;
  paymentId: string;
  fromStatus: PaymentStatus | null;
  toStatus: PaymentStatus;
  reason: string | null;
  createdAt: string;
}

export interface Receipt {
  id: string;
  paymentId: string;
  reference: string;
  issuedAt: string;
  createdAt: string;
}

export interface Persona {
  id: string;
  personaKey: string;
  email: string;
}
