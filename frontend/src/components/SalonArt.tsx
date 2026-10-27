type SalonArtVariant = "hero" | "hair" | "skin" | "nails" | "journal";

const palette = {
  ink: "#000000",
  brand: "#F2C4BF",
  bg: "#F7D9BF",
  cream: "#f3e5d8",
  white: "#ffffff",
};

export default function SalonArt({
  variant = "hero",
  className,
}: {
  variant?: SalonArtVariant;
  className?: string;
}) {
  if (variant === "hair") {
    return (
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <rect width="800" height="600" fill={palette.ink} />
        <circle cx="610" cy="150" r="210" fill={palette.brand} />
        <circle cx="170" cy="470" r="190" fill={palette.bg} />
        <path d="M340 600c0-150 120-270 270-270v270z" fill={palette.cream} />
        <circle cx="300" cy="190" r="86" fill="none" stroke={palette.cream} strokeWidth="16" />
        <path
          transform="translate(470 320)"
          d="M90 0l20 60 60 20-60 20-20 60-20-60-60-20 60-20z"
          fill={palette.white}
        />
      </svg>
    );
  }

  if (variant === "skin") {
    return (
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <rect width="800" height="600" fill={palette.brand} />
        <circle cx="620" cy="320" r="260" fill={palette.ink} />
        <rect x="80" y="120" width="330" height="330" rx="165" fill={palette.cream} />
        <circle cx="245" cy="285" r="86" fill="none" stroke={palette.ink} strokeWidth="16" />
        <circle cx="620" cy="320" r="120" fill={palette.bg} />
        <path
          transform="translate(470 100)"
          d="M70 0l16 46 46 16-46 16-16 46-16-46-46-16 46-16z"
          fill={palette.white}
        />
      </svg>
    );
  }

  if (variant === "nails") {
    return (
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <rect width="800" height="600" fill={palette.cream} />
        <circle cx="650" cy="130" r="180" fill={palette.brand} />
        <circle cx="140" cy="470" r="210" fill={palette.ink} />
        <rect x="300" y="120" width="90" height="260" rx="45" fill={palette.ink} />
        <rect x="420" y="190" width="90" height="260" rx="45" fill={palette.brand} />
        <rect x="540" y="150" width="90" height="260" rx="45" fill={palette.bg} />
        <path
          transform="translate(120 160)"
          d="M80 0l18 52 52 18-52 18-18 52-18-52-52-18 52-18z"
          fill={palette.ink}
        />
      </svg>
    );
  }

  if (variant === "journal") {
    return (
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <rect width="800" height="600" fill={palette.bg} />
        <circle cx="640" cy="140" r="190" fill={palette.ink} />
        <circle cx="160" cy="460" r="200" fill={palette.brand} />
        <path d="M300 600c0-160 130-290 290-290v290z" fill={palette.cream} />
        <circle cx="290" cy="200" r="76" fill="none" stroke={palette.ink} strokeWidth="16" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="1600" height="700" fill={palette.ink} />
      <circle cx="1250" cy="160" r="260" fill={palette.brand} />
      <rect x="120" y="360" width="520" height="520" rx="260" fill={palette.bg} />
      <path d="M700 700c0-220 180-400 400-400v400z" fill={palette.cream} />
      <circle cx="560" cy="200" r="90" fill="none" stroke={palette.cream} strokeWidth="18" />
      <path
        transform="translate(460 300)"
        d="M900 120l40 120 120 40-120 40-40 120-40-120-120-40 120-40z"
        fill={palette.bg}
      />
    </svg>
  );
}
