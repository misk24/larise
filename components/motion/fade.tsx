"use client";

import { motion } from "framer-motion";
import { timings } from "./presets";
import { MotionBaseProps } from "./type";

export function Fade({
  children,
  className,
  duration = timings.slow,
}: MotionBaseProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
