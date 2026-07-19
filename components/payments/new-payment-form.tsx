"use client";

import { createPayment } from "@/lib/payments/actions/create-payment";
import type { Dictionary } from "@/lib/i18n";
import type { Persona } from "@/lib/payments/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CURRENCIES = ["USD", "EUR", "XOF"];

interface NewPaymentFormProps {
  personas: Persona[];
  dict: Dictionary;
}

export function NewPaymentForm({ personas, dict }: NewPaymentFormProps) {
  if (personas.length === 0) {
    return <p className="text-sm text-muted-foreground">{dict.newPayment.empty}</p>;
  }

  return (
    <form
      action={createPayment}
      className="flex flex-wrap items-end gap-3 rounded-md border p-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="userId" className="text-xs text-muted-foreground">
          {dict.newPayment.personaLabel}
        </label>
        <Select name="userId" defaultValue={personas[0].id}>
          <SelectTrigger id="userId" className="w-52" data-cuelume-press data-cuelume-release>
            <SelectValue>
              {(value: string | null) => personas.find((p) => p.id === value)?.email ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {personas.map((persona) => (
              <SelectItem key={persona.id} value={persona.id} data-cuelume-toggle>
                {persona.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="amount" className="text-xs text-muted-foreground">
          {dict.newPayment.amountLabel}
        </label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          defaultValue="50.00"
          required
          className="w-32"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="currency" className="text-xs text-muted-foreground">
          {dict.newPayment.currencyLabel}
        </label>
        <Select name="currency" defaultValue={CURRENCIES[0]}>
          <SelectTrigger id="currency" className="w-24" data-cuelume-press data-cuelume-release>
            <SelectValue>{(value: string | null) => value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency} value={currency} data-cuelume-toggle>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" data-cuelume-press data-cuelume-release>
        {dict.newPayment.submit}
      </Button>
    </form>
  );
}
