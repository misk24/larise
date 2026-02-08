"use client";

import { motion } from "framer-motion";
import { timings } from "./presets";
import { MotionBaseProps } from "./type";

type Props = MotionBaseProps & {
  from?: number;
};

export function Scale({
  children,
  className,
  from = 0.95,
  duration = timings.slow,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: from }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
