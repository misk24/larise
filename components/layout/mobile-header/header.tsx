import { MENU_ITEMS } from "@/constants/menu";
import { useGsapToggleStagger } from "@/hooks/use-gsap";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface MobileHeaderProps { isOpen: boolean, onClose: () => void }

export default function MobileHeader({ isOpen, onClose }: MobileHeaderProps) {
  const mobileRef = useRef<HTMLDivElement>(null);
  const skipCloseAnimRef = useRef(false);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => { if (isOpen) setVisible(true); }, [isOpen]);
  useGsapToggleStagger(mobileRef, "[data-mobile-menu]", isOpen, visible, skipCloseAnimRef, () => setVisible(false));

  if (!visible) return null;

  return (
    <div ref={mobileRef} className="fixed inset-0 z-50 h-screen flex items-center justify-center text-muted bg-foreground/95 backdrop-blur-sm">
      <button onClick={onClose} className="absolute top-5 right-6 hover:text-accent transition-colors focus:outline-none" aria-label="Close Menu">
        <X />
      </button>
      
      <nav className="text-center">
        <ul className="space-y-12">
          {MENU_ITEMS.map((list, index) => (
            <li data-mobile-menu key={index} className="font-heading text-3xl hover:text-accent transition-colors">
              <Link href={list.href} onClick={() => { skipCloseAnimRef.current = true; onClose(); }}>
                {list.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}