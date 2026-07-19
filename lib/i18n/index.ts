import en from "@/lib/i18n/en.json";
import fr from "@/lib/i18n/fr.json";
import type { PaymentStatus } from "@/lib/payments/types";

export type Locale = "en" | "fr";

export const dictionaries = { en, fr } satisfies Record<Locale, typeof en>;

export type Dictionary = typeof en;

export function getDictionary(locale: string | undefined): Dictionary {
  return locale === "fr" ? dictionaries.fr : dictionaries.en;
}

export function translateStatus(status: PaymentStatus, dict: Dictionary): string {
  return dict.status[status];
}

export function formatTransition(
  from: PaymentStatus | null,
  to: PaymentStatus,
  dict: Dictionary,
): string {
  if (!from) return dict.event.created;
  return dict.event.transition
    .replace("{from}", translateStatus(from, dict))
    .replace("{to}", translateStatus(to, dict));
}
