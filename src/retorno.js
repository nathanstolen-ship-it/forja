/**
 * Retorno após pausa — protocolo de readaptação do FORJA.
 *
 * Tudo aqui é derivado do histórico salvo; nada novo é gravado. A pausa é o maior
 * intervalo recente sem treinar e o progresso na rampa é o número de treinos feitos
 * depois dela. Assim o protocolo continua certo depois de editar datas, importar
 * backup ou reabrir sessões antigas.
 *
 * Racional das faixas:
 * - até ~3 semanas parado quase não há perda de força/massa;
 * - de 3 a 6 semanas a força começa a cair e a tolerância a volume diminui;
 * - de 6 a 12 semanas a perda é real, mas a memória muscular faz a recuperação ser
 *   bem mais rápida que o ganho original. Tendões e articulações se readaptam mais
 *   devagar que o músculo, então volume e esforço sobem aos poucos (o maior risco
 *   na volta é dor muscular extrema/lesão, não carga baixa demais);
 * - 3 meses ou mais: recomeço do ciclo.
 */

// A partir de quantos dias sem treinar o app entra em modo de retorno.
export const RETURN_GAP_DAYS = 10;

// Cada etapa da rampa é um treino:
//   load = fração da carga de antes da pausa
//   sets = "two" (2 séries) | "minus1" (1 a menos que o plano) | "full" (as do plano)
//   rir  = alvo de esforço (repetições que sobram no fim da série)
// restart = fase onde recomeçar, a partir da fase em que você parou.
//   Fase sem entrada = segue na semana em que está.
export const COMEBACK_TIERS = [
  {
    id: "curta", min: RETURN_GAP_DAYS, label: "Pausa curta",
    why: "Até umas 3 semanas parado quase não se perde força nem massa. Um treino um pouco mais leve basta pra reabituar.",
    freq: null,
    restart: {},
    stages: [
      { load: 0.9, sets: "full", rir: "RIR 3" },
    ],
  },
  {
    id: "moderada", min: 21, label: "Pausa moderada",
    why: "Entre 3 e 6 semanas a força começa a cair e o corpo desacostuma do volume. Três treinos de rampa evitam aquela dor muscular de travar.",
    freq: null,
    restart: { p1: "p1", p2: "p2", p3: "p3" }, // repete a fase desde o início
    stages: [
      { load: 0.8, sets: "minus1", rir: "RIR 3–4" },
      { load: 0.9, sets: "full", rir: "RIR 3" },
      { load: 0.95, sets: "full", rir: "RIR 2–3" },
    ],
  },
  {
    id: "longa", min: 42, label: "Pausa longa",
    why: "Com 6 a 12 semanas parado, força e massa caem de verdade. A boa notícia: a memória muscular recupera em poucas semanas o que levou meses pra construir. O cuidado: tendões e articulações se readaptam mais devagar que o músculo, e voltar direto de onde parou é o jeito mais fácil de se machucar ou ficar dias travado.",
    freq: "3x/semana nas 2 primeiras semanas, com 1 dia de descanso entre os treinos.",
    restart: { p1: "p1", p2: "p1", p3: "p2", dl: "p3", p4: "p3" }, // uma fase abaixo
    stages: [
      { load: 0.65, sets: "two", rir: "RIR 4" },
      { load: 0.7, sets: "two", rir: "RIR 4" },
      { load: 0.8, sets: "minus1", rir: "RIR 3" },
      { load: 0.85, sets: "full", rir: "RIR 3" },
      { load: 0.9, sets: "full", rir: "RIR 2–3" },
      { load: 0.95, sets: "full", rir: "RIR 2" },
    ],
    fromReadaptation: {
      why: "Você parou ainda na Readaptação, com poucas semanas de treino. Nessa fase o ganho é mais de técnica e coordenação, que se perde pouco, e as cargas já eram longe da falha. Como a própria Fase 1 já é uma readaptação (máquinas, RIR 3–4, sem falha), a rampa é curta: só os primeiros treinos mais leves, pra evitar dor muscular forte. Se nas 2 primeiras semanas estiver tudo confortável, pode avançar a semana.",
      freq: "3x/semana, com 1 dia de descanso entre os treinos.",
      stages: [
        { load: 0.8, sets: "two", rir: "RIR 4" },
        { load: 0.9, sets: "full", rir: "RIR 3–4" },
        { load: 1, sets: "full", rir: "RIR 3–4" },
      ],
    },
  },
  {
    id: "muitoLonga", min: 90, label: "Pausa muito longa",
    why: "Depois de 3 meses ou mais, trate como recomeço: volte à Readaptação. Com memória muscular as primeiras semanas passam rápido — se estiver tudo leve, avance a semana antes do previsto.",
    freq: "3x/semana, com 1 dia de descanso entre os treinos.",
    restart: { p1: "p1", p2: "p1", p3: "p1", dl: "p1", p4: "p1" },
    stages: [
      { load: 0.5, sets: "two", rir: "RIR 4–5" },
      { load: 0.6, sets: "two", rir: "RIR 4" },
      { load: 0.7, sets: "minus1", rir: "RIR 3–4" },
      { load: 0.75, sets: "minus1", rir: "RIR 3" },
      { load: 0.8, sets: "full", rir: "RIR 3" },
      { load: 0.85, sets: "full", rir: "RIR 3" },
    ],
    fromReadaptation: {
      why: "Você parou ainda na Readaptação e ficou 3 meses ou mais sem treinar — trate como recomeço. Como a própria Fase 1 já é uma readaptação (máquinas, RIR 3–4, sem falha), a rampa é curta: só os primeiros treinos mais leves, pra evitar dor muscular forte.",
      freq: "3x/semana, com 1 dia de descanso entre os treinos.",
      stages: [
        { load: 0.7, sets: "two", rir: "RIR 4" },
        { load: 0.8, sets: "full", rir: "RIR 3–4" },
        { load: 0.9, sets: "full", rir: "RIR 3–4" },
      ],
    },
  },
];

// Quem parou ainda na Fase 1 (Readaptação) tinha pouco tempo de treino e cargas longe da falha.
// A Fase 1 já é uma readaptação, então empilhar nela a rampa longa deixaria os treinos leves
// demais por tempo demais: nesse caso vale a rampa curta da faixa (`fromReadaptation`).
export const rampFor = (tier, anchorPhaseId) =>
  anchorPhaseId === "p1" && tier.fromReadaptation ? { ...tier, ...tier.fromReadaptation } : tier;

const MAX_STAGES = Math.max(...COMEBACK_TIERS.map((t) => t.stages.length));

export const SETS_LABEL = { two: "2 séries", minus1: "1 série a menos", full: "séries do plano" };

export const tierForGap = (days) => {
  let tier = null;
  for (const t of COMEBACK_TIERS) if (days >= t.min) tier = t;
  return tier;
};

// Dia do calendário local como inteiro: a diferença entre dois dias não depende de fuso nem de horário.
export const dayNumber = (dateish) => {
  const d = new Date(dateish);
  return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
};

// Conta como treino: sessão antiga (sem séries salvas) ou com pelo menos 1 exercício realizado.
export const isTrainedSession = (s) =>
  !Array.isArray(s.entries) || s.entries.some((e) => e.completed !== false);

// Procura a pausa mais recente cuja rampa ainda não terminou.
// Retorna null quando não há pausa relevante ou quando a rampa já foi cumprida.
// phaseOf(sessão) = id da fase em que ela foi feita (define a rampa — ver rampFor).
//   gapDays    — tamanho da pausa
//   tier       — faixa da pausa, já com a rampa que vale pra fase em que você parou
//   done/total — treinos já feitos na rampa / tamanho da rampa
//   stage      — etapa do próximo treino
//   lastBefore — último treino antes da pausa (âncora da semana e das cargas de referência)
//   before     — treinos até a pausa, em ordem cronológica
export function findComeback(sessions, now = new Date(), phaseOf = (s) => s.phaseId) {
  const asc = (sessions || []).filter(isTrainedSession).sort((a, b) => new Date(a.date) - new Date(b.date));
  const today = dayNumber(now);
  for (let i = asc.length - 1; i >= 0; i--) {
    const done = asc.length - 1 - i; // treinos feitos depois desta pausa
    if (done >= MAX_STAGES) break;   // pausa mais antiga que isso: qualquer rampa já acabou
    const next = i === asc.length - 1 ? today : dayNumber(asc[i + 1].date);
    const gapDays = next - dayNumber(asc[i].date);
    const base = tierForGap(gapDays);
    const tier = base && rampFor(base, phaseOf(asc[i]));
    // Pausa curta já cumprida no meio de uma rampa maior: a rampa maior continua valendo.
    if (!tier || done >= tier.stages.length) continue;
    return {
      gapDays, tier, done, total: tier.stages.length, stage: tier.stages[done],
      lastBefore: asc[i], before: asc.slice(0, i + 1),
    };
  }
  return null;
}

export const setsForStage = (planSets, mode) => {
  if (mode === "two") return Math.min(planSets, 2);
  if (mode === "minus1") return Math.max(Math.min(planSets, 2), planSets - 1);
  return planSets;
};

// Arredonda para baixo no incremento da máquina (ex.: 39 kg com incremento 2,5 → 37,5).
export const floorToInc = (kg, inc) => {
  const step = inc > 0 ? inc : 0.5;
  const v = Math.floor(kg / step + 1e-6) * step;
  return v > 0 ? +v.toFixed(2) : Math.round(kg * 2) / 2;
};

// Carga inicial de uma etapa da rampa.
//   refWeight    — carga de antes da pausa
//   recentWeight — carga já feita dentro da rampa (se houver)
// Nunca sugere menos do que você já fez na rampa, e não sobe mais que ~15% de um treino
// pro outro — se você escolheu carga abaixo da sugerida, a rampa parte dela.
export function comebackWeight({ refWeight, recentWeight, load, inc }) {
  if (!refWeight) return recentWeight || 0;
  let target = floorToInc(refWeight * load, inc);
  if (recentWeight) {
    const cap = recentWeight + Math.max(inc, floorToInc(recentWeight * 0.15, inc));
    target = Math.max(recentWeight, Math.min(target, cap));
  }
  return target;
}

// Tempo inicial (exercícios por tempo, ex.: prancha), em múltiplos de 5s.
export function comebackSeconds({ refSecs, recentSecs, load }) {
  const target = refSecs ? Math.max(15, Math.round((refSecs * load) / 5) * 5) : 30;
  return recentSecs ? Math.max(recentSecs, target) : target;
}
