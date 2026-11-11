"use client";

import { motion } from "framer-motion";
import { offsets, timings } from "./presets";
import { MotionBaseProps } from "./type";

type Props = MotionBaseProps & {
  y?: number;
};

export function FadeUp({
  children,
  className,
  y = offsets.lg,
  duration = timings.slow,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
