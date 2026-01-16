import { Heart, Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 fill-current" />
              <span className="text-2xl font-serif font-semibold">Nikahku</span>
            </Link>
            <p className="text-background/70 max-w-sm mb-6">
              Platform undangan pernikahan digital terpercaya di Indonesia.
              Wujudkan undangan impian Anda dengan mudah dan terjangkau.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@nikahku.id"
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/70 hover:text-background transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2 text-background/70">
              <li>
                <Link
                  href="#template"
                  className="hover:text-background transition-colors"
                >
                  Template
                </Link>
              </li>
              <li>
                <Link
                  href="#fitur"
                  className="hover:text-background transition-colors"
                >
                  Fitur
                </Link>
              </li>
              <li>
                <Link
                  href="#harga"
                  className="hover:text-background transition-colors"
                >
                  Harga
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-background transition-colors"
                >
                  Masuk
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Bantuan</h3>
            <ul className="space-y-2 text-background/70">
              <li>
                <Link
                  href="#"
                  className="hover:text-background transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-background transition-colors"
                >
                  Cara Pemesanan
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-background transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-background transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Nikahku. Dibuat dengan cinta di
            Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
