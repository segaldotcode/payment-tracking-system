"use client";

import { linkReceipt } from "@/lib/payments/actions/link-receipt";
import { formatDateTime } from "@/lib/utils";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Payment, Receipt } from "@/lib/payments/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReceiptPanelProps {
  payment: Payment;
  receipt: Receipt | null;
  dict: Dictionary;
  locale: Locale;
}

export function ReceiptPanel({ payment, receipt, dict, locale }: ReceiptPanelProps) {
  if (receipt) {
    return (
      <div className="text-sm">
        <p className="font-mono">{receipt.reference}</p>
        <p className="text-muted-foreground">
          {dict.detail.issuedOn.replace("{date}", formatDateTime(receipt.issuedAt, locale))}
        </p>
      </div>
    );
  }

  if (payment.status !== "success") {
    return <p className="text-sm text-muted-foreground">{dict.detail.receiptEmpty}</p>;
  }

  return (
    <form action={linkReceipt} className="flex items-end gap-2">
      <input type="hidden" name="paymentId" value={payment.id} />
      <div className="flex flex-col gap-1">
        <label htmlFor="reference" className="text-xs text-muted-foreground">
          {dict.detail.receiptReferenceLabel}
        </label>
        <Input id="reference" name="reference" required className="w-48" />
      </div>
      <Button type="submit" variant="outline" data-cuelume-press data-cuelume-release>
        {dict.detail.linkReceipt}
      </Button>
    </form>
  );
}
