import "../../styles/auth-editorial.css";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#f7f4ed",
  width: "device-width",
  initialScale: 1,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-editorial">
      <main className="auth-editorial-main">
        <section className="auth-editorial-story" aria-label="Tentang LARISÉ">
          <div className="auth-editorial-kicker">LARISÉ · Untuk hari istimewa</div>
          <h1 className="auth-editorial-title">
            Cerita indahmu,
            <br />
            dimulai <em>di sini.</em>
          </h1>
          <p className="auth-editorial-copy">
            Setiap detail punya arti. Rangkai undangan pernikahan yang terasa
            personal, elegan, dan sepenuhnya milik kisah kalian.
          </p>
          <div className="auth-editorial-note">Dibuat dengan niat, disimpan sebagai kenangan</div>
        </section>
        <section className="auth-editorial-form" aria-label="Akun LARISÉ">
          {children}
        </section>
      </main>
    </div>
  );
}
