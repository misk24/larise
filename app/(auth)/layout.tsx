import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#eeebe0",
  width: "device-width",
  initialScale: 1,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-card">
      <main className="flex flex-1 items-center justify-center px-6">
        {children}
      </main>
    </div>
  );
}
