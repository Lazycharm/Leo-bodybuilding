export default function SectionHeader({ title = "", subtitle = "", align = "center", className = "" }) {
  return (
    <div className={`mb-10 md:mb-12 ${align === "left" ? "text-left" : "text-center"} ${className}`}>
      {title && (
        <h2 className="font-heading text-3xl md:text-4xl font-black tracking-tight text-foreground">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
