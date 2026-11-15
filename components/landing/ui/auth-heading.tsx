export function AuthHeading({ title, description }: { title: string; description?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="frontend-display text-4xl leading-none tracking-[-0.05em] text-balance sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 text-base leading-7 text-ink-soft">{description}</p>}
    </div>
  );
}
