import { Button } from "@/components/ui/button"
import { navLinks } from "@/constants/navigation"
import { useGsapToggleStagger } from "@/hooks/use-gsap"
import { X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { loginButton } from "./constant"

interface MobileHeaderProps { 
  isOpen: boolean, 
  onClose: () => void,
}

export default function MobileHeader({ 
  isOpen, 
  onClose, 
}: MobileHeaderProps) {
  const mobileRef = useRef<HTMLDivElement>(null)
  const skipCloseAnimRef = useRef(false)
  const [visible, setVisible] = useState(isOpen)

  useEffect(() => { 
    if (isOpen) setVisible(true) 
  }, [isOpen])

  useGsapToggleStagger(
    mobileRef, 
    "[data-mobile-menu]", 
    isOpen, 
    visible, 
    skipCloseAnimRef, 
    () => setVisible(false),
  )

  if (!visible) return null

  return (
    <div 
      ref={mobileRef} 
      className="fixed inset-0 z-50 h-screen text-muted bg-foreground/95 backdrop-blur-sm"
    >
      <button 
        onClick={onClose} 
        className="absolute top-6 right-8 hover:text-accent transition-colors focus:outline-none" 
        aria-label="Close Menu"
      >
        <X className="w-4 h-4" />
      </button>
      
      <nav className="mt-24 px-6">
        <ul className="space-y-12">
          {navLinks.map((link) => (
            <li 
              data-mobile-menu 
              key={link.href} 
              className="font-heading text-3xl hover:text-accent transition-colors"
            >
              <Link 
                href={link.href} 
                onClick={() => { 
                  skipCloseAnimRef.current = true 
                  onClose() 
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Button 
        data-mobile-menu 
        variant="link" 
        className="mt-30 px-6 font-heading text-3xl text-muted hover:text-accent bg-transparent transition-colors" 
        asChild
      >
        <Link href={loginButton.href}>
          {loginButton.label}
        </Link>
      </Button>
    </div>
  )
}