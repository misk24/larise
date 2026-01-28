"use client";

import { Logo } from "@/components/logo";
import { navLinks } from "@/constants/frontend";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { copy, location, socialLinks } from "./constant";

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8"
        >
          <Link href="/">
            <Logo variant="footer" />
          </Link>
          <div>
            <h4 className="mb-4">Links</h4>
            <ul className="space-y-4 opacity-90">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="size-4" />
                      <span className="text-sm">{link.label}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4">Contacts</h4>
            <ul className="space-y-4 opacity-90">
              {socialLinks.map((social, index) => (
                <li key={index}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-accent transition-colors"
                  >
                    <Icon
                      icon={`simple-icons:${social.icon}`}
                      className="size-3.5"
                    />
                    <span className="text-sm">{social.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span className="text-sm">{location}</span>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="border-t border-background/20 pt-8 text-center opacity-90"
        >
          <span className="text-sm">
            &copy; {new Date().getFullYear()} {copy}
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
