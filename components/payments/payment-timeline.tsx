import { formatDateTime } from "@/lib/utils";
import { formatTransition, type Dictionary, type Locale } from "@/lib/i18n";
import type { PaymentEvent } from "@/lib/payments/types";

interface PaymentTimelineProps {
  events: PaymentEvent[];
  dict: Dictionary;
  locale: Locale;
}

export function PaymentTimeline({ events, dict, locale }: PaymentTimelineProps) {
  return (
    <ol className="flex flex-col gap-4">
      {events.map((event) => (
        <li key={event.id} className="flex flex-col gap-0.5 border-l-2 border-border pl-4">
          <span className="text-sm font-medium">
            {formatTransition(event.fromStatus, event.toStatus, dict)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(event.createdAt, locale)}
          </span>
          {event.reason && <span className="text-sm text-muted-foreground">{event.reason}</span>}
        </li>
      ))}
    </ol>
  );
}
