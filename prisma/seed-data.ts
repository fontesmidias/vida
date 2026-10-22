// Conteúdo fictício de demonstração (C2). Tom: C1 — acolhedor, sem diagnóstico, terapia ou cura.
// C4: gênero neutro nos textos; slugs são identificadores internos e não aparecem na tela.
// D15: sem emoji (ícones desenhados pela interface). U8: reflexão em uma frase + uma linha.

export const NEUTRAL_FAMILY = "neutro";

// D17: tipos de prática guiada que a interface sabe conduzir
export const PRACTICE_KINDS = ["breath", "heart", "tiny", "three"] as const;
export type PracticeKind = (typeof PRACTICE_KINDS)[number];

// D11: 8 estados em 4 famílias
export const moods = [
  { slug: "ansioso", label: "Com ansiedade", family: "agitado", sortOrder: 1 },
  { slug: "irritado", label: "Com irritação", family: "agitado", sortOrder: 2 },
  { slug: "cansado", label: "Com cansaço", family: "baixa_energia", sortOrder: 3 },
  { slug: "desanimado", label: "Sem ânimo", family: "baixa_energia", sortOrder: 4 },
  { slug: "triste", label: "Triste", family: "pesado", sortOrder: 5 },
  { slug: "sobrecarregado", label: "Com sobrecarga", family: "pesado", sortOrder: 6 },
  { slug: "em-paz", label: "Em paz", family: "sereno", sortOrder: 7 },
  { slug: "grato", label: "Com gratidão", family: "sereno", sortOrder: 8 },
];

// R3: uma entrada por família + neutro (sem check-in no dia)
export const dailyContents: {
  family: string;
  reflectionTitle: string;
  reflectionBody: string;
  practiceTitle: string;
  practiceBody: string;
  practiceMinutes: number;
  practiceKind: PracticeKind;
}[] = [
  {
    family: "agitado",
    reflectionTitle: "Nem tudo precisa ser resolvido agora.",
    reflectionBody: "Um passo de cada vez já é cuidado.",
    practiceTitle: "Respiração 4-6",
    practiceBody: "Inspire contando até 4 e solte o ar contando até 6, acompanhando o círculo.",
    practiceMinutes: 3,
    practiceKind: "breath",
  },
  {
    family: "baixa_energia",
    reflectionTitle: "Descansar também é seguir em frente.",
    reflectionBody: "O passo possível hoje pode ser menor. Tudo bem.",
    practiceTitle: "Uma coisa pequena",
    practiceBody: "Escolha uma única coisa simples para fazer agora e volte quando terminar.",
    practiceMinutes: 2,
    practiceKind: "tiny",
  },
  {
    family: "pesado",
    reflectionTitle: "Você não precisa carregar tudo sem apoio.",
    reflectionBody: "Dar nome ao que sente já abre espaço.",
    practiceTitle: "Mão no peito",
    practiceBody: "Mão sobre o peito, respiração lenta e uma frase gentil a cada expiração.",
    practiceMinutes: 1,
    practiceKind: "heart",
  },
  {
    family: "sereno",
    reflectionTitle: "Guardar o que faz bem.",
    reflectionBody: "Repare no que trouxe essa calma.",
    practiceTitle: "Três coisas boas",
    practiceBody: "Pense em três coisas boas de hoje, uma de cada vez.",
    practiceMinutes: 2,
    practiceKind: "three",
  },
  {
    family: NEUTRAL_FAMILY,
    reflectionTitle: "Um momento para você.",
    reflectionBody: "Pare um instante e perceba como está.",
    practiceTitle: "Pausa de um minuto",
    practiceBody: "Solte os ombros e respire com calma, acompanhando o círculo.",
    practiceMinutes: 1,
    practiceKind: "breath",
  },
];

export const plans = [
  {
    slug: "respirar-com-calma",
    title: "Respirar com calma",
    description: "5 dias de respirações curtas para desacelerar. Conteúdo de demonstração.",
    days: [
      { dayNumber: 1, title: "Perceber a respiração", body: "Observe o ar entrando e saindo por um minuto. Só repare." },
      { dayNumber: 2, title: "Expirar mais devagar", body: "Inspire contando até 4. Solte contando até 6. Cinco vezes." },
      { dayNumber: 3, title: "Respiração no corpo", body: "Mão na barriga. Sinta subir e descer." },
      { dayNumber: 4, title: "Pausa entre tarefas", body: "Entre uma atividade e outra, três respirações lentas." },
      { dayNumber: 5, title: "Seu jeito de respirar", body: "Escolha a prática de que mais gostou e faça por dois minutos." },
    ],
  },
  {
    slug: "gentileza-consigo",
    title: "Gentileza consigo",
    description: "7 dias com menos cobrança e mais cuidado. Conteúdo de demonstração.",
    days: [
      { dayNumber: 1, title: "Como você fala com você", body: "Repare no tom dos seus pensamentos hoje. Sem julgar." },
      { dayNumber: 2, title: "Como falaria com alguém querido", body: "Pense em algo que cobrou de si. O que diria a uma pessoa querida?" },
      { dayNumber: 3, title: "Uma pausa merecida", body: "Cinco minutos para algo de que você gosta." },
      { dayNumber: 4, title: "Reconhecer o esforço", body: "Lembre uma coisa que você fez hoje, por menor que seja." },
      { dayNumber: 5, title: "Limites com carinho", body: "Um pequeno \"não\" que proteja seu tempo ou sua energia." },
      { dayNumber: 6, title: "Cuidar do corpo", body: "Alongar, beber água ou dormir um pouco mais cedo." },
      { dayNumber: 7, title: "Olhar para o caminho", body: "O que destes dias você quer levar adiante?" },
    ],
  },
];
