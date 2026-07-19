"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_STATUSES } from "@/lib/payments/state-machine";
import { translateStatus, type Dictionary } from "@/lib/i18n";

const ALL = "__all__";

export function FilterBar({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateStatus(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL) {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
  }

  const currentStatus = searchParams.get("status") ?? ALL;

  return (
    <Select value={currentStatus} onValueChange={updateStatus}>
      <SelectTrigger className="w-48" data-cuelume-press data-cuelume-release>
        <SelectValue placeholder={dict.filters.allStatuses}>
          {(value: string | null) =>
            !value || value === ALL
              ? dict.filters.allStatuses
              : translateStatus(value as (typeof PAYMENT_STATUSES)[number], dict)
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL} data-cuelume-toggle>
          {dict.filters.allStatuses}
        </SelectItem>
        {PAYMENT_STATUSES.map((status) => (
          <SelectItem key={status} value={status} data-cuelume-toggle>
            {translateStatus(status, dict)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
