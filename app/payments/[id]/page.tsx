import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { StatusBadge } from "@/components/payments/status-badge";
import { PaymentTimeline } from "@/components/payments/payment-timeline";
import { ReceiptPanel } from "@/components/payments/receipt-panel";
import { PaymentActions } from "@/components/payments/payment-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPaymentById, getReceiptByPaymentId, listPaymentEvents } from "@/lib/payments/queries";
import { formatCurrency } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n";

interface PaymentDetailProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function PaymentDetail({ params, searchParams }: PaymentDetailProps) {
  const { id } = await params;
  const { lang } = await searchParams;
  const locale: Locale = lang === "fr" ? "fr" : "en";
  const dict = getDictionary(locale);

  const payment = await getPaymentById(id);
  if (!payment) {
    notFound();
  }

  const [events, receipt] = await Promise.all([
    listPaymentEvents(payment.id),
    getReceiptByPaymentId(payment.id),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <Button
          variant="ghost"
          nativeButton={false}
          data-cuelume-hover
          render={<Link href={`/?lang=${locale}`} />}
        >
          <ChevronLeft />
          {dict.detail.back}
        </Button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle locale={locale} />
        </div>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <StatusBadge status={payment.status} dict={dict} />
            <CardTitle className="font-mono text-lg">
              {formatCurrency(payment.amount, payment.currency, locale)}
            </CardTitle>
          </div>
          <PaymentActions payment={payment} dict={dict} />
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {payment.userEmail ?? "-"}
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">{dict.detail.receiptHeading}</h2>
        <ReceiptPanel payment={payment} receipt={receipt} dict={dict} locale={locale} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">{dict.detail.timelineHeading}</h2>
        <PaymentTimeline events={events} dict={dict} locale={locale} />
      </section>
    </div>
  );
}
