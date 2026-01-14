import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useOverlay(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const pathname = usePathname();
  
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Scroll Lock
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // ESC Key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  return {isOpen, open, close, toggle};
}