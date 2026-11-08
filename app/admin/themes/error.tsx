"use client";
import { AdminRouteError } from "@/components/admin/table-states";
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="backend-content">
      <AdminRouteError reset={reset} />
    </div>
  );
}
