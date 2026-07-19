import { Badge } from "@/components/ui/badge";
import { translateStatus, type Dictionary } from "@/lib/i18n";
import type { PaymentStatus } from "@/lib/payments/types";

const VARIANT_BY_STATUS: Record<PaymentStatus, "outline" | "secondary" | "default" | "destructive" | "ghost"> = {
  pending: "outline",
  processing: "secondary",
  success: "default",
  failed: "destructive",
  refunded: "ghost",
};

export function StatusBadge({ status, dict }: { status: PaymentStatus; dict: Dictionary }) {
  return <Badge variant={VARIANT_BY_STATUS[status]}>{translateStatus(status, dict)}</Badge>;
}
