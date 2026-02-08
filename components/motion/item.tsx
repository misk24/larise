"use client";

import { motion } from "framer-motion";
import { offsets, timings } from "./presets";
import { MotionBaseProps } from "./type";

type Props = MotionBaseProps & {
  y?: number;
};

export function Item({
  children,
  y = offsets.lg,
  duration = timings.slow,
}: Props) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
