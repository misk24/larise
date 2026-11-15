import { Container } from "@/components/landing/ui/container";
import { cn } from "@/lib/utils";

// Layout slot per card: one tall ink card, one wide card, two small ones.
const features = [
  { title: "Cerita yang personal", description: "Sapa setiap tamu dengan nama, lalu ceritakan perjalanan kalian lewat profil, galeri, dan kisah cinta.", items: ["Nama tamu personal", "Profil dan kisah cinta", "Galeri foto"], slot: "md:row-span-2 bg-ink text-ivory", dark: true },
  { title: "Detail acara", description: "Bantu tamu menemukan informasi acara dan memberi kabar kehadiran tanpa harus bertanya berulang kali.", items: ["Jadwal dan lokasi", "Google Maps", "RSVP dan ucapan"], slot: "md:col-span-2 bg-ivory" },
  { title: "Suasana pilihan kalian", description: "Lengkapi undangan dengan elemen visual dan audio yang sesuai dengan suasana kalian.", items: ["Musik latar", "Video dan foto", "Kutipan pilihan"], slot: "bg-ivory" },
  { title: "Mudah dibagikan", description: "Undangan berbasis web yang praktis dibuka dari ponsel dan mudah diteruskan kepada orang terdekat.", items: ["Satu tautan undangan", "Tampilan responsif", "Informasi terpusat"], slot: "bg-ivory" },
];

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title" className="bg-paper-deep py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 id="features-title" className="frontend-display max-w-xl text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] tracking-[-0.05em] text-balance">
            Semua yang perlu, tanpa berlebihan.
          </h2>
          <p className="max-w-sm text-sm leading-7 text-ink-soft sm:text-base">
            Dari informasi acara sampai sentuhan personal, semua detail penting ada dalam satu undangan.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {features.map((feature) => (
            <article key={feature.title} className={cn("flex min-h-64 flex-col justify-between p-7 sm:p-9", feature.slot)}>
              <div>
                <h3 className={cn("frontend-display tracking-tight", feature.dark ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl")}>{feature.title}</h3>
                <p className={cn("mt-3 max-w-md text-sm leading-6 sm:text-base sm:leading-7", feature.dark ? "text-white/70" : "text-ink-soft")}>{feature.description}</p>
              </div>
              <ul className={cn("mt-8 space-y-1.5 text-sm", feature.dark ? "text-gold-soft" : "text-gold-deep")}>
                {feature.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
