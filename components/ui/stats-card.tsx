import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "./card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  format?: "number" | "currency" | "percentage";
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBg,
  format = "number",
}: StatsCardProps) {
  const isPositive = change >= 0;

  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val;
    if (format === "currency") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(val);
    }
    return new Intl.NumberFormat("id-ID").format(val);
  };

  return (
    <Card className="border-border bg-sidebar">
      <CardHeader className="flex items-center">
        <div
          className={`size-8 flex shrink-0 items-center justify-center ${iconBg} rounded-md`}
        >
          <Icon className={`size-5 ${iconColor}`} />
        </div>
        <p className="text-2xl font-medium">{formatValue(value)}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="flex space-x-2">
          <span
            className={cn(
              "text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600",
            )}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
          <span className="text-muted-foreground text-sm">than last week</span>
        </p>
      </CardContent>
    </Card>
  );
}
