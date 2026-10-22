// Ícones de traço próprios (U11): decorativos, o texto ao lado descreve a ação
type Props = { size?: number; className?: string };

function Svg({ size = 22, className, children, strokeWidth = 1.8 }: Props & { children: React.ReactNode; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const SunIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
  </Svg>
);
export const MoonIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </Svg>
);
export const HeartIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </Svg>
);
export const LeafIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" />
    <path d="M5 19l7-7" />
  </Svg>
);
export const PathIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M4 6h10a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h10" />
  </Svg>
);
export const BackIcon = (p: Props) => (
  <Svg {...p} strokeWidth={2}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);
export const ChevronIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
);
export const CheckIcon = (p: Props) => (
  <Svg {...p} strokeWidth={2.2}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);
export const PlayIcon = ({ size = 20 }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l10.5-6.5z" />
  </svg>
);
export const PhoneIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
  </Svg>
);
export const SupportIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M12 19s-6.5-3.9-6.5-8.8A3.6 3.6 0 0 1 12 8a3.6 3.6 0 0 1 6.5 2.2C18.5 15.1 12 19 12 19z" />
    <path d="M3 15c1.5 2 4 4 6 4.5M21 15c-1.5 2-4 4-6 4.5" />
  </Svg>
);
export const BreathIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7" />
  </Svg>
);
export const DropIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M12 3.5c3 3.6 5 6.4 5 9a5 5 0 0 1-10 0c0-2.6 2-5.4 5-9z" />
  </Svg>
);
export const WindowIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="5" y="4" width="14" height="16" rx="2" />
    <path d="M12 4v16M5 12h14" />
  </Svg>
);
export const StretchIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="4.5" r="2" />
    <path d="M5 8l7 2 7-2M12 10v5l-3 5M12 15l3 5" />
  </Svg>
);
export const DotsIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="12" cy="12" r="2.5" />
    <circle cx="18" cy="12" r="2.5" />
  </Svg>
);
