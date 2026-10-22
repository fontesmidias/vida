// Conteúdo fictício de demonstração (C2). Tom: C1 — acolhedor, sem diagnóstico, terapia ou cura.
// C4: gênero neutro nos textos; slugs são identificadores internos e não aparecem na tela.

export const NEUTRAL_FAMILY = "neutro";

// D11: 8 estados em 4 famílias
export const moods = [
  { slug: "ansioso", label: "Com ansiedade", emoji: "😰", family: "agitado", sortOrder: 1 },
  { slug: "irritado", label: "Com irritação", emoji: "😤", family: "agitado", sortOrder: 2 },
  { slug: "cansado", label: "Com cansaço", emoji: "😮‍💨", family: "baixa_energia", sortOrder: 3 },
  { slug: "desanimado", label: "Sem ânimo", emoji: "😔", family: "baixa_energia", sortOrder: 4 },
  { slug: "triste", label: "Triste", emoji: "😢", family: "pesado", sortOrder: 5 },
  { slug: "sobrecarregado", label: "Com sobrecarga", emoji: "😵‍💫", family: "pesado", sortOrder: 6 },
  { slug: "em-paz", label: "Em paz", emoji: "😌", family: "sereno", sortOrder: 7 },
  { slug: "grato", label: "Com gratidão", emoji: "🙏", family: "sereno", sortOrder: 8 },
];

// R3: uma entrada por família + neutro (sem check-in no dia)
export const dailyContents = [
  {
    family: "agitado",
    reflectionTitle: "Nem tudo precisa ser resolvido agora",
    reflectionBody:
      "Quando a cabeça acelera, tudo parece urgente ao mesmo tempo. Vale lembrar que dá para dar um passo de cada vez. Perceber essa agitação já é um jeito de cuidar de si.",
    practiceTitle: "Respiração 4-6",
    practiceBody:
      "Inspire pelo nariz contando até 4 e solte o ar devagar contando até 6. Repita por alguns ciclos, no seu ritmo. Se ficar desconfortável, volte a respirar normalmente.",
    practiceMinutes: 3,
  },
  {
    family: "baixa_energia",
    reflectionTitle: "Descansar também é seguir em frente",
    reflectionBody:
      "Há dias em que a energia não acompanha a lista de tarefas. Isso não diz nada sobre o seu valor. Às vezes, o passo possível hoje é menor, e tudo bem.",
    practiceTitle: "Uma coisa pequena",
    practiceBody:
      "Escolha uma única tarefa bem simples, como beber um copo de água ou abrir a janela. Faça só ela e repare em como foi.",
    practiceMinutes: 2,
  },
  {
    family: "pesado",
    reflectionTitle: "Você não precisa carregar tudo sem apoio",
    reflectionBody:
      "Alguns dias pesam mais. Dar nome ao que você sente ajuda a abrir espaço para ele. Se fizer sentido, conversar com alguém de confiança pode deixar a carga mais leve.",
    practiceTitle: "Mão no peito",
    practiceBody:
      "Coloque uma das mãos sobre o peito e respire devagar. A cada expiração, diga para você algo gentil, como: \"Estou fazendo o que posso\".",
    practiceMinutes: 3,
  },
  {
    family: "sereno",
    reflectionTitle: "Guardar o que faz bem",
    reflectionBody:
      "Momentos de calma também merecem atenção. Reparar no que contribuiu para este estado ajuda você a reconhecer o caminho de volta em outros dias.",
    practiceTitle: "Três coisas boas",
    practiceBody:
      "Pense em três coisas, mesmo pequenas, que fizeram bem a você hoje. Fique um instante com cada uma delas.",
    practiceMinutes: 3,
  },
  {
    family: NEUTRAL_FAMILY,
    reflectionTitle: "Um momento para você",
    reflectionBody:
      "Antes de seguir com o dia, que tal parar um instante e perceber como você está? Não existe resposta certa.",
    practiceTitle: "Pausa de um minuto",
    practiceBody:
      "Solte os ombros, apoie os pés no chão e respire fundo três vezes. Depois, se quiser, faça seu check-in.",
    practiceMinutes: 1,
  },
];

export const plans = [
  {
    slug: "respirar-com-calma",
    title: "Respirar com calma",
    description: "Cinco dias de práticas curtas de respiração para desacelerar. Conteúdo de demonstração.",
    days: [
      { dayNumber: 1, title: "Perceber a respiração", body: "Sem mudar nada, observe o ar entrando e saindo por um minuto. Só repare." },
      { dayNumber: 2, title: "Expirar mais devagar", body: "Inspire contando até 4 e expire contando até 6. Repita cinco vezes." },
      { dayNumber: 3, title: "Respiração no corpo", body: "Coloque uma mão na barriga e sinta-a subir e descer enquanto respira." },
      { dayNumber: 4, title: "Pausa entre tarefas", body: "Entre uma atividade e outra hoje, faça três respirações lentas antes de começar a próxima." },
      { dayNumber: 5, title: "Seu jeito de respirar", body: "Escolha a prática de que mais gostou nesta semana e faça-a por dois minutos." },
    ],
  },
  {
    slug: "gentileza-consigo",
    title: "Gentileza consigo",
    description: "Sete dias para olhar para si com mais cuidado e menos cobrança. Conteúdo de demonstração.",
    days: [
      { dayNumber: 1, title: "Como você fala com você", body: "Repare hoje no tom dos seus pensamentos sobre si. Só observe, sem julgar." },
      { dayNumber: 2, title: "Como falaria com alguém querido", body: "Pense em algo que cobrou de si recentemente. O que diria a uma pessoa querida numa situação parecida?" },
      { dayNumber: 3, title: "Uma pausa merecida", body: "Reserve cinco minutos para algo de que você gosta, sem precisar justificar." },
      { dayNumber: 4, title: "Reconhecer o esforço", body: "Anote mentalmente uma coisa que você fez hoje, por menor que seja." },
      { dayNumber: 5, title: "Limites com carinho", body: "Pense em um pequeno \"não\" que proteja o seu tempo ou a sua energia." },
      { dayNumber: 6, title: "Cuidar do corpo", body: "Faça um gesto simples de cuidado: alongar, beber água ou dormir um pouco mais cedo." },
      { dayNumber: 7, title: "Olhar para o caminho", body: "Relembre os últimos dias. O que você quer levar adiante?" },
    ],
  },
];
