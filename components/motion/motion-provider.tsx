"use client";

import { MotionConfig } from "framer-motion";
import type React from "react";

// Respect the visitor's "reduce motion" setting for every framer-motion animation.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
