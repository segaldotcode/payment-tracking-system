import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { NewPaymentForm } from "@/components/payments/new-payment-form";
import { PaymentList } from "@/components/payments/payment-list";
import { FilterBar } from "@/components/payments/filter-bar";
import { listPayments, listPersonas } from "@/lib/payments/queries";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { PaymentStatus } from "@/lib/payments/types";

interface HomeProps {
  searchParams: Promise<{ lang?: string; status?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const locale: Locale = params.lang === "fr" ? "fr" : "en";
  const dict = getDictionary(locale);

  const [payments, personas] = await Promise.all([
    listPayments({ status: params.status as PaymentStatus | undefined }),
    listPersonas(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{dict.title}</h1>
          <p className="text-muted-foreground">{dict.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle locale={locale} />
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">{dict.newPayment.heading}</h2>
        <NewPaymentForm personas={personas} dict={dict} />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-medium">{dict.list.heading}</h2>
          <FilterBar dict={dict} />
        </div>
        <PaymentList payments={payments} dict={dict} locale={locale} />
      </section>
    </div>
  );
}
