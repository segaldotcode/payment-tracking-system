import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Payment } from "@/lib/payments/types";

interface PaymentListProps {
  payments: Payment[];
  dict: Dictionary;
  locale: Locale;
}

export function PaymentList({ payments, dict, locale }: PaymentListProps) {
  if (payments.length === 0) {
    return <p className="text-sm text-muted-foreground">{dict.list.empty}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{dict.list.status}</TableHead>
          <TableHead>{dict.list.amount}</TableHead>
          <TableHead>{dict.list.user}</TableHead>
          <TableHead>{dict.list.created}</TableHead>
          <TableHead className="text-right">{dict.list.action}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              <StatusBadge status={payment.status} dict={dict} />
            </TableCell>
            <TableCell className="font-mono">
              {formatCurrency(payment.amount, payment.currency, locale)}
            </TableCell>
            <TableCell className="text-muted-foreground">{payment.userEmail ?? "-"}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDateTime(payment.createdAt, locale)}
            </TableCell>
            <TableCell className="text-right">
              <Link
                href={`/payments/${payment.id}?lang=${locale}`}
                className="text-sm text-primary underline-offset-4 hover:underline"
                data-cuelume-hover
              >
                {dict.list.viewDetails}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
