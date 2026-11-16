"use client";

import { BackendErrorState } from "@/components/backend/backend-ui";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="backend-content">
      <BackendErrorState
        title="Halaman gagal dimuat"
        description="Terjadi kendala saat memuat halaman ini. Coba muat ulang."
        action={
          <Button type="button" variant="outline" size="sm" onClick={reset}>
            <RefreshCwIcon className="size-4" />
            Coba lagi
          </Button>
        }
      />
    </div>
  );
}
