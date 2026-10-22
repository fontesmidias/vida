// D15: ícone próprio por estado (expressão desenhada sobre forma orgânica na cor da família).
// Estado novo sem desenho (D6) aparece só com a forma colorida.
const INK = { stroke: "#1F2A27", strokeOpacity: 0.78 } as const;
const eye = (cx: number, cy: number) => <circle cx={cx} cy={cy} r="1.8" fill="#1F2A27" fillOpacity="0.78" stroke="none" />;

const FACES: Record<string, React.ReactNode> = {
  ansioso: (
    <>
      <path d="M14 16L21 13.5M34 16L27 13.5" />
      {eye(18, 21.5)}
      {eye(30, 21.5)}
      <path d="M17 32Q19.5 29.5 22 32T27 32T32 32" />
    </>
  ),
  irritado: (
    <>
      <path d="M14 14L21 17M34 14L27 17" />
      {eye(18, 22)}
      {eye(30, 22)}
      <path d="M19 32L29 32" />
    </>
  ),
  cansado: <path d="M15 22Q18 24.5 21 22M27 22Q30 24.5 33 22M21 32L27 32" />,
  desanimado: (
    <>
      {eye(18, 23)}
      {eye(30, 23)}
      <path d="M19 33Q24 31 29 33" />
    </>
  ),
  triste: (
    <>
      <path d="M14 17L21 14.5M34 17L27 14.5" />
      {eye(18, 22)}
      {eye(30, 22)}
      <path d="M17 34Q24 28 31 34" />
    </>
  ),
  sobrecarregado: (
    <>
      <circle cx="18" cy="21" r="3.2" />
      <circle cx="30" cy="21" r="3.2" />
      <ellipse cx="24" cy="32" rx="3" ry="2.6" />
    </>
  ),
  "em-paz": <path d="M15 22Q18 19.5 21 22M27 22Q30 19.5 33 22M19 30Q24 34 29 30" />,
  grato: (
    <>
      <path d="M15 22Q18 19.5 21 22M27 22Q30 19.5 33 22M17 29Q24 36 31 29" />
      <circle cx="13.5" cy="28" r="2.6" fill="#FFFFFF" fillOpacity="0.4" stroke="none" />
      <circle cx="34.5" cy="28" r="2.6" fill="#FFFFFF" fillOpacity="0.4" stroke="none" />
    </>
  ),
};

export function MoodIcon({ slug, family, size = 48 }: { slug: string; family: string; size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" style={{ flex: "none" }}>
      <path
        d="M24 2.5c11.5 0 21 8.2 21 20.5 0 12.6-8.9 22.5-21.5 22.5C11.2 45.5 3 36 3 23.8 3 11.6 12.4 2.5 24 2.5z"
        fill={`var(--f-${family}, #a8cbb5)`}
      />
      <g fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...INK}>
        {FACES[slug]}
      </g>
    </svg>
  );
}
