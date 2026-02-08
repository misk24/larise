"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

type StatCounterProps = {
  value: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
};

export function StatCounter({
  value,
  decimals = 0,
  duration = 1.8,
  suffix = "",
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const count = useMotionValue(0);
  const formatted = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration, ease: "easeOut" });
    } else {
      count.set(0);
    }
  }, [inView, value, duration, count]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.h3 className="mb-2">{formatted}</motion.h3>
      {suffix}
    </span>
  );
}
