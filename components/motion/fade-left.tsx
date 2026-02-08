"use client";

import { motion } from "framer-motion";
import { offsets, timings } from "./presets";
import { MotionBaseProps } from "./type";

type Props = MotionBaseProps & {
  x?: number;
};

export function FadeLeft({
  children,
  className,
  x = offsets.lg,
  duration = timings.slow,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 1 }}
      transition={{ duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
