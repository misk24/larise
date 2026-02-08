import { motion } from "framer-motion";
import { staggers } from "./presets";
import { MotionBaseProps } from "./type";

type Props = MotionBaseProps & {
  stagger?: number;
  delay?: number;
};

export function Stagger({
  children,
  className,
  stagger = staggers.normal,
  delay = 0,
}: Props) {
  return (
    <motion.div
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      whileInView="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}
