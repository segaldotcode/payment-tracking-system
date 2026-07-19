"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { refundPayment } from "@/lib/payments/actions/refund-payment";
import type { Dictionary } from "@/lib/i18n";
import type { Payment } from "@/lib/payments/types";

export function RefundDialog({ payment, dict }: { payment: Payment; dict: Dictionary }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" data-cuelume-press data-cuelume-release />}>
        {dict.actions.refund}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.actions.refund}</DialogTitle>
        </DialogHeader>
        <form action={refundPayment} className="flex flex-col gap-3">
          <input type="hidden" name="paymentId" value={payment.id} />

          <div className="flex flex-col gap-1">
            <Label htmlFor="reason">{dict.actions.refundReasonLabel}</Label>
            <Textarea id="reason" name="reason" required />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="refundAmount">{dict.actions.refundAmountLabel}</Label>
            <Input
              id="refundAmount"
              name="refundAmount"
              type="number"
              min="0.01"
              step="0.01"
              max={payment.amount}
              placeholder={String(payment.amount)}
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="ghost" />}>
              {dict.actions.cancel}
            </DialogClose>
            <Button type="submit" data-cuelume-press data-cuelume-release>
              {dict.actions.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
