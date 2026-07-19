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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { advancePayment } from "@/lib/payments/actions/advance-payment";
import type { Dictionary } from "@/lib/i18n";
import type { Payment } from "@/lib/payments/types";

export function FailDialog({ payment, dict }: { payment: Payment; dict: Dictionary }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" data-cuelume-press data-cuelume-release />}>
        {dict.actions.markFailed}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.actions.markFailed}</DialogTitle>
        </DialogHeader>
        <form action={advancePayment} className="flex flex-col gap-3">
          <input type="hidden" name="paymentId" value={payment.id} />
          <input type="hidden" name="from" value={payment.status} />
          <input type="hidden" name="to" value="failed" />

          <div className="flex flex-col gap-1">
            <Label htmlFor="reason">{dict.actions.failureReasonLabel}</Label>
            <Textarea id="reason" name="reason" required />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="ghost" />}>
              {dict.actions.cancel}
            </DialogClose>
            <Button type="submit" variant="destructive" data-cuelume-press data-cuelume-release>
              {dict.actions.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
