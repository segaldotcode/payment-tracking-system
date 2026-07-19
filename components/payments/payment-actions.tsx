"use client";

import { advancePayment } from "@/lib/payments/actions/advance-payment";
import { Button } from "@/components/ui/button";
import { FailDialog } from "./fail-dialog";
import { RefundDialog } from "./refund-dialog";
import type { Dictionary } from "@/lib/i18n";
import type { Payment } from "@/lib/payments/types";

export function PaymentActions({ payment, dict }: { payment: Payment; dict: Dictionary }) {
  if (payment.status === "pending") {
    return (
      <form action={advancePayment}>
        <input type="hidden" name="paymentId" value={payment.id} />
        <input type="hidden" name="from" value="pending" />
        <input type="hidden" name="to" value="processing" />
        <Button type="submit" data-cuelume-press data-cuelume-release>
          {dict.actions.markProcessing}
        </Button>
      </form>
    );
  }

  if (payment.status === "processing") {
    return (
      <div className="flex flex-wrap gap-2">
        <form action={advancePayment}>
          <input type="hidden" name="paymentId" value={payment.id} />
          <input type="hidden" name="from" value="processing" />
          <input type="hidden" name="to" value="success" />
          <Button type="submit" data-cuelume-press data-cuelume-release>
            {dict.actions.markSucceeded}
          </Button>
        </form>
        <FailDialog payment={payment} dict={dict} />
      </div>
    );
  }

  if (payment.status === "success") {
    return <RefundDialog payment={payment} dict={dict} />;
  }

  return null;
}
