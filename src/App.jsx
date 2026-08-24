import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dumbbell, Play, Check, Plus, Minus, Timer as TimerIcon, TrendingUp,
  ChevronLeft, History as HistoryIcon, ClipboardList, Flame, RotateCcw,
  X, Award, Save, Pencil, Info, Download, Upload, CalendarDays
} from "lucide-react";
import { EXERCICIOS_INFO, ATRIBUICAO_MIDIA } from "./data/exercicios.js";

/* ============================ PLANO (16 semanas) ============================ */
// type: "load" (carga×reps) | "time" (segundos) — inc = menor incremento de carga
const PHASES = [
  {
    id: "p1", name: "Readaptação", label: "Fase 1", weeks: [1, 4],
    rir: "RIR 3–4", freq: "3x/sem", split: "Full Body A/B",
    note: "Técnica impecável, articulações, hábito. Sem falha. Descida controlada de 2–3s.",
    workouts: [
      {
        id: "p1a", name: "Full Body A", tag: "Empurrar + Quadríceps",
        ex: [
          { id: "legpress", name: "Leg press 45°", sets: 3, min: 10, max: 12, inc: 5, note: "Amplitude confortável, sem travar joelho" },
          { id: "extensora", name: "Cadeira extensora", sets: 3, min: 12, max: 15, inc: 5, note: "Segurar 1s no topo" },
          { id: "supinomaq", name: "Supino máquina", sets: 3, min: 10, max: 12, inc: 2.5, note: "Escápulas retraídas" },
          { id: "desenvmaq", name: "Desenvolvimento máquina", sets: 3, min: 10, max: 12, inc: 2.5, note: "Sem forçar o ombro" },
          { id: "tricepspolia", name: "Tríceps polia", sets: 3, min: 12, max: 15, inc: 2.5, note: "Cotovelo fixo" },
          { id: "panturrilha", name: "Panturrilha no leg press", sets: 3, min: 12, max: 15, inc: 5, note: "Pausa embaixo" },
          { id: "prancha", name: "Prancha", sets: 3, type: "time", note: "Progredir tempo" },
        ],
      },
      {
        id: "p1b", name: "Full Body B", tag: "Puxar + Posterior",
        ex: [
          { id: "flexora", name: "Cadeira flexora", sets: 3, min: 10, max: 12, inc: 5, note: "Descida lenta" },
          { id: "agachsmith", name: "Agachamento Smith", sets: 3, min: 10, max: 12, inc: 5, note: "Profundidade que a mobilidade permitir" },
          { id: "puxada", name: "Puxada frontal", sets: 3, min: 10, max: 12, inc: 2.5, note: "Puxar com cotovelo, peito alto" },
          { id: "remadamaq", name: "Remada máquina", sets: 3, min: 10, max: 12, inc: 2.5, note: "Sem balançar o tronco" },
          { id: "rosca", name: "Rosca direta", sets: 3, min: 10, max: 12, inc: 2.5, note: "Sem roubar" },
          { id: "elevlateral", name: "Elevação lateral", sets: 3, min: 12, max: 15, inc: 1, note: "Carga leve, até a linha do ombro" },
          { id: "abdomaq", name: "Abdominal máquina", sets: 3, min: 12, max: 15, inc: 2.5, note: "Expirar na contração" },
        ],
      },
    ],
  },
  {
    id: "p2", name: "Base", label: "Fase 2", weeks: [5, 8],
    rir: "RIR 2–3", freq: "3–4x/sem", split: "Upper / Lower",
    note: "Entram os pesos livres com carga conservadora. Progressão de carga começa aqui.",
    workouts: [
      {
        id: "p2u", name: "Upper", tag: "Superiores",
        ex: [
          { id: "supinohalt", name: "Supino reto halteres", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "puxada", name: "Puxada frontal", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "desenvhalt", name: "Desenvolvimento halteres", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "remadacurv", name: "Remada curvada", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "elevlateral", name: "Elevação lateral", sets: 3, min: 12, max: 15, inc: 1 },
          { id: "rosca", name: "Rosca direta", sets: 3, min: 10, max: 12, inc: 2.5 },
          { id: "tricepscorda", name: "Tríceps corda", sets: 3, min: 10, max: 12, inc: 2.5 },
        ],
      },
      {
        id: "p2l", name: "Lower", tag: "Inferiores",
        ex: [
          { id: "agach", name: "Agachamento", sets: 3, min: 8, max: 12, inc: 5 },
          { id: "legpress", name: "Leg press 45°", sets: 3, min: 10, max: 12, inc: 5 },
          { id: "flexora", name: "Cadeira flexora", sets: 3, min: 10, max: 12, inc: 5 },
          { id: "stiff", name: "Stiff com halteres", sets: 3, min: 10, max: 12, inc: 2.5, note: "Foco em técnica" },
          { id: "extensora", name: "Cadeira extensora", sets: 3, min: 12, max: 15, inc: 5 },
          { id: "panturrilhaP", name: "Panturrilha em pé", sets: 3, min: 12, max: 15, inc: 5 },
          { id: "prancha", name: "Prancha", sets: 3, type: "time" },
        ],
      },
    ],
  },
  {
    id: "p3", name: "Hipertrofia I", label: "Fase 3", weeks: [9, 12],
    rir: "RIR 1–2", freq: "4x/sem", split: "Upper / Lower",
    note: "Sobrecarga plena. Última série dos isoladores pode ir a RIR 0–1. 4ª série nos prioritários.",
    workouts: [
      {
        id: "p3ua", name: "Upper · Empurrar", tag: "Ênfase peito/ombro",
        ex: [
          { id: "supinobarra", name: "Supino reto barra", sets: 4, min: 6, max: 10, inc: 2.5 },
          { id: "supinoinc", name: "Supino inclinado halteres", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "desenvhalt", name: "Desenvolvimento halteres", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "crossover", name: "Crossover (crucifixo polia)", sets: 3, min: 12, max: 15, inc: 2.5 },
          { id: "elevlateral", name: "Elevação lateral", sets: 4, min: 12, max: 15, inc: 1 },
          { id: "tricepstesta", name: "Tríceps testa", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "tricepscorda", name: "Tríceps corda", sets: 3, min: 12, max: 15, inc: 2.5 },
        ],
      },
      {
        id: "p3ub", name: "Upper · Puxar", tag: "Ênfase costas",
        ex: [
          { id: "puxada", name: "Puxada frontal", sets: 4, min: 8, max: 12, inc: 2.5 },
          { id: "remadacurv", name: "Remada curvada", sets: 4, min: 8, max: 12, inc: 2.5 },
          { id: "remadabaixa", name: "Remada baixa polia", sets: 3, min: 10, max: 12, inc: 2.5 },
          { id: "facepull", name: "Face pull", sets: 3, min: 12, max: 15, inc: 2.5 },
          { id: "rosca", name: "Rosca direta", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "roscamartelo", name: "Rosca martelo", sets: 3, min: 10, max: 12, inc: 2.5 },
        ],
      },
      {
        id: "p3l", name: "Lower", tag: "Pernas",
        ex: [
          { id: "agach", name: "Agachamento", sets: 4, min: 6, max: 10, inc: 5 },
          { id: "legpress", name: "Leg press 45°", sets: 3, min: 10, max: 12, inc: 5 },
          { id: "hipthrust", name: "Elevação pélvica (hip thrust)", sets: 3, min: 8, max: 12, inc: 5 },
          { id: "flexora", name: "Cadeira flexora", sets: 3, min: 10, max: 12, inc: 5 },
          { id: "extensora", name: "Cadeira extensora", sets: 3, min: 12, max: 15, inc: 5 },
          { id: "panturrilhaP", name: "Panturrilha em pé", sets: 4, min: 12, max: 15, inc: 5 },
        ],
      },
    ],
  },
  {
    id: "dl", name: "Deload", label: "Semana 13", weeks: [13, 13],
    rir: "RIR 4–5", freq: "3x/sem", split: "Full Body leve",
    note: "Metade das séries, ~60% da carga habitual. Recuperar e consolidar. Nada perto da falha.",
    workouts: [
      {
        id: "dla", name: "Full Body leve", tag: "Recuperação",
        ex: [
          { id: "legpress", name: "Leg press 45°", sets: 2, min: 10, max: 12, inc: 5, note: "~60% da carga" },
          { id: "supinomaq", name: "Supino máquina", sets: 2, min: 10, max: 12, inc: 2.5, note: "~60% da carga" },
          { id: "puxada", name: "Puxada frontal", sets: 2, min: 10, max: 12, inc: 2.5, note: "~60% da carga" },
          { id: "desenvmaq", name: "Desenvolvimento máquina", sets: 2, min: 10, max: 12, inc: 2.5, note: "~60% da carga" },
          { id: "flexora", name: "Cadeira flexora", sets: 2, min: 10, max: 12, inc: 5, note: "~60% da carga" },
        ],
      },
    ],
  },
  {
    id: "p4", name: "Hipertrofia II", label: "Fase 4", weeks: [14, 99],
    rir: "RIR 1–2", freq: "5–6x/sem", split: "ABC (Push/Pull/Legs)",
    note: "Volume alto. Ciclos de 4–6 semanas + deload. Especialize o grupo que quiser destacar.",
    workouts: [
      {
        id: "p4a", name: "A · Push", tag: "Peito, ombro, tríceps",
        ex: [
          { id: "supinobarra", name: "Supino reto barra", sets: 4, min: 6, max: 10, inc: 2.5 },
          { id: "supinoinc", name: "Supino inclinado halteres", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "crossover", name: "Crossover", sets: 3, min: 12, max: 15, inc: 2.5 },
          { id: "desenvhalt", name: "Desenvolvimento halteres", sets: 4, min: 8, max: 12, inc: 2.5 },
          { id: "elevlateral", name: "Elevação lateral", sets: 4, min: 12, max: 15, inc: 1 },
          { id: "tricepstesta", name: "Tríceps testa", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "tricepscorda", name: "Tríceps corda", sets: 3, min: 12, max: 15, inc: 2.5 },
        ],
      },
      {
        id: "p4b", name: "B · Pull", tag: "Costas, bíceps, post. ombro",
        ex: [
          { id: "barrafixa", name: "Barra fixa / puxada", sets: 4, min: 6, max: 12, inc: 2.5 },
          { id: "remadacurv", name: "Remada curvada", sets: 4, min: 8, max: 12, inc: 2.5 },
          { id: "remadabaixa", name: "Remada baixa polia", sets: 3, min: 10, max: 12, inc: 2.5 },
          { id: "facepull", name: "Face pull", sets: 3, min: 12, max: 15, inc: 2.5 },
          { id: "rosca", name: "Rosca direta", sets: 3, min: 8, max: 12, inc: 2.5 },
          { id: "roscamartelo", name: "Rosca martelo", sets: 3, min: 10, max: 12, inc: 2.5 },
        ],
      },
      {
        id: "p4c", name: "C · Legs", tag: "Pernas completas",
        ex: [
          { id: "agach", name: "Agachamento", sets: 4, min: 6, max: 10, inc: 5 },
          { id: "legpress", name: "Leg press 45°", sets: 3, min: 10, max: 12, inc: 5 },
          { id: "flexora", name: "Cadeira flexora", sets: 4, min: 10, max: 12, inc: 5 },
          { id: "stiff", name: "Stiff / hip thrust", sets: 3, min: 8, max: 12, inc: 5 },
          { id: "extensora", name: "Cadeira extensora", sets: 3, min: 12, max: 15, inc: 5 },
          { id: "panturrilhaP", name: "Panturrilha em pé", sets: 4, min: 12, max: 15, inc: 5 },
        ],
      },
    ],
  },
];

const phaseForWeek = (w) => PHASES.find((p) => w >= p.weeks[0] && w <= p.weeks[1]) || PHASES[PHASES.length - 1];
const findWorkout = (id) => {
  for (const p of PHASES) { const w = p.workouts.find((w) => w.id === id); if (w) return w; }
  return null;
};

/* ============================ RETORNO APÓS PAUSA ============================ */
// A partir de quantos dias sem treinar mostramos o aviso de retorno.
const RETURN_GAP_DAYS = 10;
const daysSince = (dateStr) => Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
// Redução sugerida na carga inicial, conforme o tamanho da pausa.
const returnFactor = (days) => {
  if (days >= 28) return 0.75;
  if (days >= 14) return 0.85;
  return 0.9;
};

/* ============================ DATA DO TREINO ============================ */
// O treino é salvo com a data escolhida no registro — por padrão o dia em que ele
// começou, não o dia em que você lembrou de finalizar. Resolve o caso de deixar a
// sessão aberta e só clicar em "Finalizar" dias depois.
// "ymd" = string local no formato YYYY-MM-DD (a mesma que o <input type="date"> usa).
const toYmd = (dateish) => {
  const d = new Date(dateish);
  if (isNaN(d)) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const todayYmd = () => toYmd(new Date());
// Converte de volta para ISO. Se o dia escolhido for o mesmo da referência (início do
// treino), preserva o horário original; se foi alterado, marca meio-dia local — assim a
// data exibida nunca "vira" para o dia anterior por causa do fuso.
const ymdToIso = (ymd, refIso) => {
  const ref = refIso ? new Date(refIso) : new Date();
  if (!isNaN(ref) && toYmd(ref) === ymd) return ref.toISOString();
  const [y, m, d] = String(ymd).split("-").map(Number);
  if (!y || !m || !d) return new Date().toISOString();
  return new Date(y, m - 1, d, 12, 0, 0, 0).toISOString();
};
const ymdToBR = (ymd) => {
  const [y, m, d] = String(ymd).split("-");
  return y && m && d ? `${d}/${m}/${y}` : "";
};
// Reconstrói o "melhor registro" de cada exercício a partir das sessões que têm séries salvas.
// Só treinos NOVOS marcados como não realizados (completed === false) são ignorados como
// referência. Sessões antigas (sem o campo completed) contam exatamente como antes — a regra
// não mexe retroativamente no histórico já registrado.
function recomputePerf(sessions, base = {}) {
  const perf = { ...base };
  const asc = sessions.filter((s) => Array.isArray(s.entries)).sort((a, b) => new Date(a.date) - new Date(b.date));
  for (const s of asc) {
    const w = findWorkout(s.workoutId); if (!w) continue;
    s.entries.forEach((e) => {
      const ex = w.ex.find((x) => x.id === e.exId); if (!ex) return;
      if (e.completed === false) return; // treino novo não realizado; histórico antigo não é afetado
      const reps = e.sets.map((st) => +st.reps || 0);
      const weight = ex.type === "time" ? 0 : (e.sets[0]?.weight || 0);
      const top = ex.type === "time" ? false : reps.length > 0 && reps.every((r) => r >= ex.max);
      perf[e.exId] = { weight, reps, top, date: s.date };
    });
  }
  return perf;
}

/* ============================ PERSISTÊNCIA ============================ */
const KEY_STATE = "forja:state";     // { week }
const KEY_LOG = "forja:log";         // { sessions: [], perf: {exId:{weight,reps[],top,date}}, incs: {exId:kg} }
const KEY_ACTIVE = "forja:active";   // rascunho do treino em andamento — { workoutId, entries, editingId, week }

// Persistência via localStorage (por dispositivo/navegador). Mantidas como
// funções async para não alterar o resto do app.
async function loadKey(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
async function saveKey(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* quota/privado: ignora */ }
}

/* ============================ COMPONENTES ============================ */
function ExInfoSheet({ exId, exName, onClose }) {
  const info = EXERCICIOS_INFO[exId];
  if (!info) return null;
  return (
    <div className="sheetOverlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheetHead">
          <div>
            <div className="sheetTitle">{exName}</div>
            <div className="sheetSub">{info.equipamento}</div>
          </div>
          <button className="sheetClose" onClick={onClose} aria-label="Fechar"><X size={18} /></button>
        </div>

        <div className="sheetMuscles">
          <span className="musclePill musclePillMain">{info.alvo}</span>
          {info.secundarios.map((m) => <span key={m} className="musclePill">{m}</span>)}
        </div>

        {info.gif && (
          <div className="sheetMedia">
            <img src={info.gif} alt={`Demonstração: ${exName}`} loading="lazy" width="180" height="180" />
            <span className="sheetCredit">{ATRIBUICAO_MIDIA}</span>
          </div>
        )}

        <div className="sheetLabel">Execução</div>
        <ol className="sheetSteps">
          {info.passos.map((p, i) => <li key={i}>{p}</li>)}
        </ol>

        {info.dica && (
          <div className="sheetTip"><Flame size={14} /> {info.dica}</div>
        )}
      </div>
    </div>
  );
}

function Stepper({ value, onChange, step = 2.5, min = 0, suffix }) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)));
  const inc = () => onChange(+(value + step).toFixed(2));
  return (
    <div className="stepper">
      <button className="stepBtn" onClick={dec} aria-label="Diminuir"><Minus size={16} /></button>
      <div className="stepVal">
        <input
          className="stepInput"
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : +e.target.value)}
        />
        {suffix && <span className="stepSuffix">{suffix}</span>}
      </div>
      <button className="stepBtn" onClick={inc} aria-label="Aumentar"><Plus size={16} /></button>
    </div>
  );
}

function RestTimer({ onClose }) {
  const presets = [60, 90, 120, 180];
  const [remaining, setRemaining] = useState(90);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(ref.current); setRunning(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="restBar">
      <div className="restTime" style={{ color: remaining === 0 ? "var(--ember)" : "var(--text)" }}>
        {mm}:{ss}
      </div>
      <div className="restPresets">
        {presets.map((p) => (
          <button key={p} className="chip" onClick={() => { setRemaining(p); setRunning(true); }}>{p}s</button>
        ))}
      </div>
      <button className="restToggle" onClick={() => setRunning((r) => !r)}>
        {running ? "Pausar" : "Iniciar"}
      </button>
      <button className="restClose" onClick={onClose} aria-label="Fechar"><X size={16} /></button>
    </div>
  );
}

/* ============================ APP ============================ */
export default function App() {
  const [view, setView] = useState("home");
  const [week, setWeek] = useState(1);
  const [log, setLog] = useState({ sessions: [], perf: {}, incs: {} });
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null); // { workout, entries }
  const [showTimer, setShowTimer] = useState(false);
  const [prToast, setPrToast] = useState(null);
  const [infoEx, setInfoEx] = useState(null); // { id, name } — painel de execução
  const [applyReturnReduction, setApplyReturnReduction] = useState(true);
  const [incEditId, setIncEditId] = useState(null); // exId com editor de incremento aberto
  const [draftRestored, setDraftRestored] = useState(false);
  const fileRef = useRef(null); // input de arquivo (escondido) para importar backup

  useEffect(() => {
    (async () => {
      const s = await loadKey(KEY_STATE, { week: 1 });
      const l = await loadKey(KEY_LOG, { sessions: [], perf: {}, incs: {} });
      if (!l.incs) l.incs = {};
      // Migração: garante que toda sessão tenha um id para poder ser reaberta/editada.
      let changed = false;
      l.sessions = (l.sessions || []).map((sess, i) => {
        if (sess.id) return sess;
        changed = true;
        return { ...sess, id: Date.now().toString(36) + i + Math.random().toString(36).slice(2, 5) };
      });
      if (changed) saveKey(KEY_LOG, l);
      setWeek(s.week || 1);
      setLog(l);

      // Recupera rascunho de treino em andamento, se o app foi fechado no meio do registro.
      const draft = await loadKey(KEY_ACTIVE, null);
      if (draft && draft.workoutId) {
        const workout = findWorkout(draft.workoutId);
        if (workout && Array.isArray(draft.entries)) {
          setActive({
            workout,
            entries: draft.entries,
            editingId: draft.editingId || null,
            week: draft.week || s.week || 1,
            startedAt: draft.startedAt || null,
            // Rascunho antigo (sem startedAt) cai para hoje — não dá para adivinhar o dia.
            date: draft.date || (draft.startedAt ? toYmd(draft.startedAt) : todayYmd()),
          });
          setDraftRestored(true);
          setView("session");
        } else {
          saveKey(KEY_ACTIVE, null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const changeWeek = (w) => { setWeek(w); saveKey(KEY_STATE, { week: w }); };

  const phase = phaseForWeek(week);
  const today = todayYmd();

  // Retorno após pausa: calculado a partir da data da última sessão salva.
  // Não altera nem lê nada além disso — histórico e recordes ficam intactos.
  const lastSession = log.sessions[0] || null;
  const gapDays = lastSession ? daysSince(lastSession.date) : null;
  const isReturning = gapDays !== null && gapDays >= RETURN_GAP_DAYS;
  const activeFactor = isReturning && applyReturnReduction ? returnFactor(gapDays) : 1;

  // Incremento real de carga da máquina/exercício: usa o que a pessoa ajustou manualmente
  // (guardado por dispositivo) ou cai pro incremento padrão do plano.
  const getInc = (ex) => (log.incs && log.incs[ex.id] != null ? log.incs[ex.id] : (ex.inc || 2.5));
  const setIncFor = (exId, value) => {
    setLog((l) => {
      const next = { ...l, incs: { ...(l.incs || {}), [exId]: value } };
      saveKey(KEY_LOG, next);
      return next;
    });
  };

  /* ---- rascunho: salva o treino em andamento a cada alteração, pra sobreviver ao fechar o app ---- */
  useEffect(() => {
    if (loading) return;
    if (!active) { saveKey(KEY_ACTIVE, null); return; }
    saveKey(KEY_ACTIVE, {
      workoutId: active.workout.id, entries: active.entries, editingId: active.editingId,
      week: active.week, startedAt: active.startedAt, date: active.date,
    });
  }, [active, loading]);

  /* ---- iniciar treino ---- */
  const startWorkout = (workout) => {
    const entries = workout.ex.map((ex) => {
      const last = log.perf[ex.id];
      const nSets = ex.sets;
      const baseWeight = last ? last.weight : 0;
      // Em modo de retorno, não sugerimos subir carga — só reduzimos a base.
      const suggestUp = activeFactor === 1 && last && last.top; // bateu topo em todas → sobe carga
      const reducedBase = activeFactor < 1 ? Math.round(baseWeight * activeFactor * 2) / 2 : baseWeight;
      const startWeight = suggestUp ? +(baseWeight + getInc(ex)).toFixed(2) : reducedBase;
      return {
        exId: ex.id,
        sets: Array.from({ length: nSets }, () => ({
          weight: ex.type === "time" ? 0 : startWeight,
          reps: ex.type === "time" ? (last ? last.reps[0] || 30 : 30) : ex.min,
          done: false,
        })),
      };
    });
    setDraftRestored(false);
    const startedAt = new Date().toISOString();
    setActive({ workout, entries, editingId: null, week, returnAdjusted: activeFactor < 1, startedAt, date: toYmd(startedAt) });
    setView("session");
  };

  /* ---- reabrir sessão salva para editar ---- */
  const reopenSession = (session) => {
    const workout = findWorkout(session.workoutId);
    if (!workout) { window.alert("Não encontrei esse treino no plano atual — talvez a divisão tenha mudado."); return; }
    let entries;
    if (Array.isArray(session.entries)) {
      entries = session.entries.map((e) => ({ exId: e.exId, sets: e.sets.map((s) => ({ ...s })) }));
    } else {
      // Sessão antiga (sem séries salvas): remonta a partir do template + último registro para você corrigir.
      entries = workout.ex.map((ex) => {
        const p = log.perf[ex.id];
        return {
          exId: ex.id,
          sets: Array.from({ length: ex.sets }, () => ({
            weight: ex.type === "time" ? 0 : (p ? p.weight : 0),
            reps: ex.type === "time" ? (p ? p.reps[0] || 30 : 30) : (p ? (p.reps[0] || ex.min) : ex.min),
            done: true,
          })),
        };
      });
    }
    setDraftRestored(false);
    setActive({ workout, entries, editingId: session.id, week: session.week || week, startedAt: session.date, date: toYmd(session.date) });
    setView("session");
  };

  // Data do treino: editável no registro e na edição de uma sessão salva. Nunca no futuro.
  const setSessionDate = (ymd) => {
    if (!ymd) return;
    const max = todayYmd();
    setActive((a) => (a ? { ...a, date: ymd > max ? max : ymd } : a));
  };

  const updateSet = (exIdx, setIdx, field, val) => {
    setActive((a) => {
      const entries = a.entries.map((e, i) => {
        if (i !== exIdx) return e;
        const sets = e.sets.map((s, j) => (j === setIdx ? { ...s, [field]: val } : s));
        return { ...e, sets };
      });
      return { ...a, entries };
    });
  };

  const toggleDone = (exIdx, setIdx) => {
    setActive((a) => {
      const entries = a.entries.map((e, i) => {
        if (i !== exIdx) return e;
        const sets = e.sets.map((s, j) => (j === setIdx ? { ...s, done: !s.done } : s));
        return { ...e, sets };
      });
      return { ...a, entries };
    });
    setShowTimer(true);
  };

  const finishWorkout = () => {
    const editing = !!active.editingId;
    const { workout, entries } = active;
    const wk = active.week || week;
    const dateYmd = active.date || todayYmd();
    const dateIso = ymdToIso(dateYmd, active.startedAt);
    const backdated = dateYmd !== todayYmd();

    // Exercícios sem nenhuma série marcada ficam registrados como não realizados no treino.
    // (Quem fez pelo menos 1 série conta como realizado, mesmo que não tenha completado todas.)
    const notPerformedNames = entries
      .filter((e) => !e.sets.some((s) => s.done))
      .map((e) => workout.ex.find((x) => x.id === e.exId)?.name)
      .filter(Boolean);

    const baseMsg = notPerformedNames.length > 0
      ? `Sem nenhuma série marcada: ${notPerformedNames.join(", ")}. Vão constar como não realizados no treino. Finalizar mesmo assim?`
      : (editing ? "Salvar as alterações neste treino?" : "Finalizar e salvar este treino?");
    // Deixa a data explícita na confirmação sempre que não for hoje, pra não passar batido.
    const confirmMsg = backdated ? `${baseMsg}\n\nSerá registrado em ${ymdToBR(dateYmd)}.` : baseMsg;
    if (!window.confirm(confirmMsg)) return;

    // Recordes: compara com o registro atual ANTES de recalcular.
    let prs = 0;
    entries.forEach((e) => {
      const ex = workout.ex.find((x) => x.id === e.exId);
      if (!ex || ex.type === "time" || !e.sets.some((s) => s.done)) return;
      const reps = e.sets.map((s) => +s.reps || 0);
      const weight = e.sets[0]?.weight || 0;
      const prev = log.perf[ex.id];
      if (prev && (weight > prev.weight || (weight === prev.weight && reps.reduce((a, b) => a + b, 0) > prev.reps.reduce((a, b) => a + b, 0)))) prs++;
    });

    const volume = entries.reduce((tot, e) => {
      const ex = workout.ex.find((x) => x.id === e.exId);
      if (!ex || ex.type === "time") return tot;
      return tot + e.sets.reduce((s, set) => s + (+set.weight || 0) * (+set.reps || 0), 0);
    }, 0);

    const cleanEntries = entries.map((e) => ({
      exId: e.exId,
      completed: e.sets.some((s) => s.done),
      sets: e.sets.map((s) => ({ weight: +s.weight || 0, reps: +s.reps || 0, done: !!s.done })),
    }));

    let sessions;
    if (editing) {
      sessions = log.sessions.map((s) =>
        s.id === active.editingId
          ? { ...s, date: dateIso, entries: cleanEntries, volume: Math.round(volume), workoutName: workout.name, week: wk }
          : s
      );
    } else {
      const session = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        date: dateIso,
        week: wk, phaseId: phaseForWeek(wk).id, workoutId: workout.id, workoutName: workout.name,
        volume: Math.round(volume), entries: cleanEntries,
      };
      sessions = [session, ...log.sessions];
    }
    // Com data editável a sessão nem sempre é a mais recente — reordena para o histórico,
    // o "último treino" e o cálculo de retorno após pausa continuarem corretos.
    sessions = sessions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 200);

    const perf = recomputePerf(sessions, log.perf);
    const next = { ...log, sessions, perf };
    setLog(next);
    saveKey(KEY_LOG, next);
    saveKey(KEY_ACTIVE, null);
    setActive(null);
    setShowTimer(false);
    setDraftRestored(false);
    setView(editing ? "history" : "home");
    if (!editing && prs > 0) { setPrToast(`${prs} recorde${prs > 1 ? "s" : ""} nesse treino 🔥`); setTimeout(() => setPrToast(null), 3500); }
  };

  // Nomes dos exercícios não marcados como concluídos numa sessão salva.
  const skippedInSession = (s) => {
    if (!Array.isArray(s.entries)) return [];
    const w = findWorkout(s.workoutId);
    if (!w) return [];
    return s.entries
      .filter((e) => e.completed === false)
      .map((e) => w.ex.find((x) => x.id === e.exId)?.name)
      .filter(Boolean);
  };

  const resetAll = async () => {
    if (!window.confirm("Apagar todo o histórico e recomeçar? Isso não pode ser desfeito.")) return;
    const empty = { sessions: [], perf: {}, incs: log.incs || {} };
    setLog(empty); await saveKey(KEY_LOG, empty);
    changeWeek(1);
  };

  /* ---- backup: exporta tudo pra um arquivo .json que você guarda onde quiser ---- */
  const exportBackup = () => {
    const payload = { app: "forja", version: 1, exportedAt: new Date().toISOString(), state: { week }, log };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `forja-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  /* ---- restaura de um backup, fundindo com o histórico atual (sem duplicar sessões) ---- */
  const importBackup = async (file) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const incoming = data.log && Array.isArray(data.log.sessions) ? data.log
        : (Array.isArray(data.sessions) ? data : null);
      if (!incoming) { window.alert("Arquivo de backup inválido — não encontrei os treinos."); return; }

      // Funde por id: mantém os treinos atuais e adiciona os do backup, sem repetir.
      const byId = new Map();
      (log.sessions || []).forEach((s) => { if (s && s.id) byId.set(s.id, s); });
      incoming.sessions.forEach((s) => { if (s && s.id) byId.set(s.id, s); });
      const sessions = [...byId.values()]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 200);

      const incs = { ...(log.incs || {}), ...(incoming.incs || {}) };
      const perf = recomputePerf(sessions, { ...(log.perf || {}), ...(incoming.perf || {}) });
      const next = { sessions, perf, incs };
      setLog(next); await saveKey(KEY_LOG, next);
      if (data.state && data.state.week) changeWeek(data.state.week);
      window.alert(`Backup importado. Total: ${sessions.length} treino${sessions.length > 1 ? "s" : ""}.`);
    } catch {
      window.alert("Não consegui ler esse arquivo. Confira se é um backup do FORJA (.json).");
    }
  };

  if (loading) return <div className="loadScreen"><Dumbbell className="spin" size={28} /><span>Carregando…</span></div>;

  return (
    <div className="app">
      <style>{CSS}</style>

      {/* ---------- TOPO ---------- */}
      <header className="topbar">
        <div className="brand">
          <span className="brandMark">◈</span>
          <span className="brandName">FORJA</span>
        </div>
        <nav className="nav">
          <button className={view === "home" ? "navOn" : ""} onClick={() => setView("home")}><Dumbbell size={18} /></button>
          <button className={view === "history" ? "navOn" : ""} onClick={() => setView("history")}><HistoryIcon size={18} /></button>
          <button className={view === "plan" ? "navOn" : ""} onClick={() => setView("plan")}><ClipboardList size={18} /></button>
        </nav>
      </header>

      {/* ---------- HOME ---------- */}
      {view === "home" && (
        <main className="wrap">
          <div className="weekRail">
            {PHASES.map((p) => {
              const isNow = week >= p.weeks[0] && week <= p.weeks[1];
              return (
                <div key={p.id} className={"railNode" + (isNow ? " railOn" : "")}>
                  <span className="railLabel">{p.label}</span>
                  <span className="railWeeks">{p.weeks[1] === 99 ? `sem ${p.weeks[0]}+` : `sem ${p.weeks[0]}–${p.weeks[1]}`}</span>
                </div>
              );
            })}
          </div>

          <section className="hero">
            <div className="heroTag">{phase.label} · {phase.split}</div>
            <h1 className="heroTitle">{phase.name}</h1>
            <div className="heroMeta">
              <span className="metaPill">{phase.freq}</span>
              <span className="metaPill">{phase.rir}</span>
            </div>
            <p className="heroNote">{phase.note}</p>

            <div className="weekPicker">
              <span className="weekPickerLabel">Semana atual</span>
              <div className="weekControls">
                <button className="wBtn" onClick={() => changeWeek(Math.max(1, week - 1))}><Minus size={16} /></button>
                <span className="weekNum">{week}</span>
                <button className="wBtn" onClick={() => changeWeek(Math.min(20, week + 1))}><Plus size={16} /></button>
              </div>
            </div>
          </section>

          {isReturning && (
            <div className="returnBanner">
              <div className="returnBannerHead"><RotateCcw size={16} /> Retorno após {gapDays} dias sem treinar</div>
              <p className="returnBannerText">
                {gapDays >= 28
                  ? "Pausa longa — vale considerar repetir a semana atual antes de avançar."
                  : gapDays >= 14
                  ? "Pausa moderada — vá com calma nas primeiras sessões."
                  : "Pausa curta — nada grave, só reduza um pouco pra reabituar."}{" "}
                Sugestão aplicada: cargas iniciais ~{Math.round((1 - returnFactor(gapDays)) * 100)}% mais leves que seu último registro.
              </p>
              <label className="returnToggle">
                <input
                  type="checkbox"
                  checked={applyReturnReduction}
                  onChange={(e) => setApplyReturnReduction(e.target.checked)}
                />
                Aplicar redução automática na carga inicial dos treinos
              </label>
            </div>
          )}

          <div className="sectionLabel">Treinos da fase</div>
          <div className="workoutGrid">
            {phase.workouts.map((w) => (
              <button key={w.id} className="workoutCard" onClick={() => startWorkout(w)}>
                <div className="wcTop">
                  <span className="wcName">{w.name}</span>
                  <Play size={18} className="wcPlay" />
                </div>
                <span className="wcTag">{w.tag}</span>
                <span className="wcCount">{w.ex.length} exercícios</span>
              </button>
            ))}
          </div>

          {log.sessions[0] && (
            <>
              <div className="sectionLabel">Último treino</div>
              <div className="lastCard">
                <div>
                  <div className="lastName">{log.sessions[0].workoutName}</div>
                  <div className="lastDate">{new Date(log.sessions[0].date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} · sem {log.sessions[0].week}</div>
                </div>
                <div className="lastVol"><TrendingUp size={14} /> {log.sessions[0].volume.toLocaleString("pt-BR")} kg·rep</div>
              </div>
            </>
          )}
        </main>
      )}

      {/* ---------- SESSÃO (LOGGER) ---------- */}
      {view === "session" && active && (
        <main className="wrap sessionWrap">
          <div className="sessionHead">
            <button className="backBtn" onClick={() => { if (window.confirm("Sair sem salvar as alterações?")) { const e = active.editingId; setActive(null); saveKey(KEY_ACTIVE, null); setDraftRestored(false); setView(e ? "history" : "home"); setShowTimer(false); } }}>
              <ChevronLeft size={18} /> Sair
            </button>
            <div className="sessionTitle">
              {active.editingId && <span className="editBadge">editando</span>}
              {draftRestored && <span className="editBadge">rascunho recuperado</span>}
              {active.workout.name}
            </div>
            <button className="timerBtn" onClick={() => setShowTimer((s) => !s)}><TimerIcon size={18} /></button>
          </div>

          <div className={"dateRow" + (active.date && active.date !== today ? " dateRowPast" : "")}>
            <label className="dateLabel" htmlFor="sessionDate"><CalendarDays size={14} /> Data do treino</label>
            <input
              id="sessionDate"
              className="dateInput"
              type="date"
              value={active.date || today}
              max={today}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>
          {active.date && active.date !== today && (
            <div className="dateWarn">
              Vai ser salvo em <b>{ymdToBR(active.date)}</b>, não hoje.
              <button className="dateTodayBtn" onClick={() => setSessionDate(today)}>usar hoje</button>
            </div>
          )}

          {active.returnAdjusted && (
            <div className="returnNote">
              <RotateCcw size={13} /> Cargas iniciais reduzidas (retorno após pausa) — ajuste se sentir fácil ou difícil demais.
            </div>
          )}

          <div className="exList">
            {active.workout.ex.map((ex, i) => {
              const last = log.perf[ex.id];
              const suggestUp = last && last.top;
              return (
                <div key={ex.id + i} className="exCard">
                  <div className="exHead">
                    <div>
                      <div className="exName">{ex.name}</div>
                      <div className="exTarget">
                        {ex.type === "time" ? `${ex.sets} × tempo` : `${ex.sets} × ${ex.min}–${ex.max} reps`}
                        {ex.note ? ` · ${ex.note}` : ""}
                      </div>
                    </div>
                    {EXERCICIOS_INFO[ex.id] && (
                      <button className="infoBtn" onClick={() => setInfoEx({ id: ex.id, name: ex.name })} aria-label={`Como executar ${ex.name}`}>
                        <Info size={16} />
                      </button>
                    )}
                  </div>

                  {last && (
                    <div className={"exHint" + (suggestUp ? " exHintUp" : "")}>
                      {suggestUp ? (
                        <><Award size={13} /> Bateu o topo — sugestão: subir para {(last.weight + getInc(ex)).toFixed(getInc(ex) < 1 ? 0 : 1)} kg</>
                      ) : ex.type === "time" ? (
                        <>Última: {last.reps.join("/")}s — busque superar</>
                      ) : (
                        <>Última: {last.weight} kg · {last.reps.join("/")} reps — busque {ex.sets}×{ex.max}</>
                      )}
                    </div>
                  )}

                  {ex.type !== "time" && (
                    <div className="incRow">
                      <button className="incBtn" onClick={() => setIncEditId(incEditId === ex.id ? null : ex.id)}>
                        <Pencil size={11} /> incremento dessa máquina: {getInc(ex)} kg
                      </button>
                      {incEditId === ex.id && (
                        <div className="incEditor">
                          <span className="incEditorLabel">Qual o próximo peso disponível nessa máquina?</span>
                          <Stepper value={getInc(ex)} onChange={(v) => setIncFor(ex.id, v)} step={0.5} min={0.5} suffix="kg" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="setRows">
                    {active.entries[i].sets.map((s, j) => (
                      <div key={j} className={"setRow" + (s.done ? " setDone" : "")}>
                        <span className="setNum">{j + 1}</span>
                        {ex.type === "time" ? (
                          <div className="setFieldWide">
                            <Stepper value={s.reps} onChange={(v) => updateSet(i, j, "reps", v)} step={5} min={0} suffix="s" />
                          </div>
                        ) : (
                          <>
                            <div className="setField">
                              <label>kg</label>
                              <Stepper value={s.weight} onChange={(v) => updateSet(i, j, "weight", v)} step={getInc(ex)} min={0} />
                            </div>
                            <div className="setField">
                              <label>reps</label>
                              <Stepper value={s.reps} onChange={(v) => updateSet(i, j, "reps", v)} step={1} min={0} />
                            </div>
                          </>
                        )}
                        <button className={"doneBtn" + (s.done ? " doneOn" : "")} onClick={() => toggleDone(i, j)} aria-label="Marcar série">
                          <Check size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="finishBtn" onClick={finishWorkout}>
            <Save size={18} /> {active.editingId ? "Salvar alterações" : "Finalizar treino"}
          </button>

          {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
        </main>
      )}

      {/* ---------- HISTÓRICO ---------- */}
      {view === "history" && (
        <main className="wrap">
          <h1 className="pageTitle">Histórico</h1>

          {/* input escondido usado pelo "Importar backup" */}
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={(e) => { importBackup(e.target.files[0]); e.target.value = ""; }}
          />

          {log.sessions.length === 0 ? (
            <>
              <div className="empty">
                <Flame size={26} />
                <p>Nenhum treino ainda. Comece pela Fase 1 e cada série registrada aparece aqui.</p>
              </div>
              <div className="backupRow">
                <button className="backupBtn" onClick={() => fileRef.current?.click()}><Upload size={15} /> Importar backup</button>
              </div>
            </>
          ) : (
            <>
              <div className="statRow">
                <div className="statBox"><span className="statNum">{log.sessions.length}</span><span className="statLbl">treinos</span></div>
                <div className="statBox"><span className="statNum">{Object.keys(log.perf).length}</span><span className="statLbl">exercícios ativos</span></div>
                <div className="statBox"><span className="statNum">{Math.round(log.sessions.reduce((a, s) => a + s.volume, 0) / 1000)}k</span><span className="statLbl">volume total</span></div>
              </div>

              {log.sessions.length > 1 && <VolumeChart sessions={log.sessions} />}

              <div className="sectionLabel">Sessões</div>
              <div className="histHint">Toque em uma sessão para reabrir e editar as séries ou a data</div>
              <div className="histList">
                {log.sessions.map((s, i) => {
                  const skipped = skippedInSession(s);
                  return (
                    <button key={s.id || i} className="histRow" onClick={() => reopenSession(s)}>
                      <div className="histLeft">
                        <div className="histName">{s.workoutName}</div>
                        <div className="histMeta">{new Date(s.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" })} · sem {s.week}</div>
                        {skipped.length > 0 && (
                          <div className="histSkipped">{skipped.length} não realizado{skipped.length > 1 ? "s" : ""}: {skipped.join(", ")}</div>
                        )}
                      </div>
                      <div className="histRight">
                        <span className="histVol">{s.volume.toLocaleString("pt-BR")} <span>kg·rep</span></span>
                        <Pencil size={13} className="histEdit" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="sectionLabel">Backup dos dados</div>
              <div className="histHint">O histórico fica salvo só neste aparelho. Exporte um arquivo pra não perder ao trocar de celular ou limpar o navegador — e importe pra restaurar.</div>
              <div className="backupRow">
                <button className="backupBtn" onClick={exportBackup}><Download size={15} /> Exportar backup</button>
                <button className="backupBtn" onClick={() => fileRef.current?.click()}><Upload size={15} /> Importar backup</button>
              </div>

              <button className="dangerBtn" onClick={resetAll}><RotateCcw size={15} /> Zerar histórico</button>
            </>
          )}
        </main>
      )}

      {/* ---------- PLANO ---------- */}
      {view === "plan" && (
        <main className="wrap">
          <h1 className="pageTitle">O plano completo</h1>
          <p className="planIntro">16 semanas em 4 fases. Progressão por <b>dupla progressão</b>: suba reps dentro da faixa; ao bater o topo em todas as séries, aumente a carga.</p>
          {PHASES.map((p) => (
            <div key={p.id} className="planPhase">
              <div className="planPhaseHead">
                <div>
                  <span className="planPhaseLabel">{p.label} · {p.weeks[1] === 99 ? `sem ${p.weeks[0]}+` : `sem ${p.weeks[0]}–${p.weeks[1]}`}</span>
                  <h2 className="planPhaseName">{p.name}</h2>
                </div>
                <div className="planPhasePills">
                  <span className="metaPill">{p.freq}</span>
                  <span className="metaPill">{p.rir}</span>
                </div>
              </div>
              <p className="planPhaseNote">{p.note}</p>
              {p.workouts.map((w) => (
                <div key={w.id} className="planWorkout">
                  <div className="planWorkoutName">{w.name} <span>· {w.tag}</span></div>
                  <div className="planExList">
                    {w.ex.map((ex) => (
                      <div key={ex.id} className="planExRow">
                        {EXERCICIOS_INFO[ex.id] ? (
                          <button className="planExName planExLink" onClick={() => setInfoEx({ id: ex.id, name: ex.name })}>
                            {ex.name} <Info size={12} />
                          </button>
                        ) : (
                          <span className="planExName">{ex.name}</span>
                        )}
                        <span className="planExScheme">{ex.type === "time" ? `${ex.sets} × tempo` : `${ex.sets} × ${ex.min}–${ex.max}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="pillars">
            <div className="sectionLabel">Fora da academia</div>
            <ul>
              <li><b>Proteína</b> 1,6–2,2 g/kg/dia, dividida em 3–5 refeições.</li>
              <li><b>Sono</b> 7–9h — o primeiro fator a checar quando a progressão trava.</li>
              <li><b>Creatina</b> 3–5 g/dia, contínuo, qualquer horário.</li>
              <li><b>Superávit leve</b> +200–300 kcal/dia se o foco é ganhar massa.</li>
            </ul>
          </div>
        </main>
      )}

      {prToast && <div className="prToast"><Award size={16} /> {prToast}</div>}
      {infoEx && <ExInfoSheet exId={infoEx.id} exName={infoEx.name} onClose={() => setInfoEx(null)} />}
    </div>
  );
}

/* ---------- mini gráfico de volume (SVG) ---------- */
function VolumeChart({ sessions }) {
  const data = [...sessions].slice(0, 12).reverse();
  const max = Math.max(...data.map((s) => s.volume), 1);
  const W = 320, H = 90, pad = 4;
  const bw = (W - pad * 2) / data.length;
  return (
    <div className="chartCard">
      <div className="chartTitle">Volume por sessão (últimas {data.length})</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" preserveAspectRatio="none">
        {data.map((s, i) => {
          const h = (s.volume / max) * (H - 12);
          return (
            <rect key={i} x={pad + i * bw + 2} y={H - h} width={bw - 4} height={h} rx="2" className="bar" />
          );
        })}
      </svg>
    </div>
  );
}

/* ============================ ESTILO ============================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

/* ---------- painel de execução (info) ---------- */
.infoBtn{flex:0 0 auto;width:32px;height:32px;border:1px solid var(--line);background:var(--surface2);
  color:var(--steel);border-radius:9px;display:grid;place-items:center;cursor:pointer;transition:.15s;}
.infoBtn:hover{color:var(--text);border-color:var(--steel);}
.planExLink{display:inline-flex;align-items:center;gap:5px;background:none;border:none;padding:0;
  color:var(--text);font:inherit;cursor:pointer;text-align:left;}
.planExLink svg{color:var(--steel);opacity:.7;}
.planExLink:hover{color:var(--steel);}
.sheetOverlay{position:fixed;inset:0;z-index:60;background:rgba(10,12,16,.6);backdrop-filter:blur(3px);
  display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .15s ease;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.sheet{width:100%;max-width:560px;max-height:82vh;overflow-y:auto;background:var(--surface);
  border:1px solid var(--line);border-bottom:none;border-radius:20px 20px 0 0;padding:20px 18px 26px;
  box-shadow:var(--shadow);animation:slideUp .2s ease;}
@keyframes slideUp{from{transform:translateY(24px);opacity:.6}to{transform:translateY(0);opacity:1}}
.sheetHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px;}
.sheetTitle{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;letter-spacing:.02em;}
.sheetSub{color:var(--muted);font-size:13px;margin-top:2px;}
.sheetClose{flex:0 0 auto;width:34px;height:34px;border:1px solid var(--line);background:var(--surface2);
  color:var(--muted);border-radius:10px;display:grid;place-items:center;cursor:pointer;}
.sheetMuscles{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
.sheetMedia{display:flex;flex-direction:column;align-items:center;gap:6px;margin-bottom:16px;}
.sheetMedia img{width:180px;height:180px;border-radius:14px;border:1px solid var(--line);background:#fff;}
.sheetCredit{font-size:10px;color:var(--muted);letter-spacing:.03em;}
.musclePill{font-size:12px;padding:4px 10px;border-radius:999px;border:1px solid var(--line);
  background:var(--surface2);color:var(--muted);}
.musclePillMain{border-color:var(--steel);color:var(--steel);background:rgba(110,147,184,.10);font-weight:600;}
.sheetLabel{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
.sheetSteps{margin:0 0 16px;padding-left:20px;display:flex;flex-direction:column;gap:8px;}
.sheetSteps li{font-size:14px;line-height:1.5;color:var(--text);}
.sheetSteps li::marker{color:var(--steel);font-weight:600;}
.sheetTip{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.5;color:var(--ember);
  background:rgba(230,169,70,.08);border:1px solid rgba(230,169,70,.25);border-radius:12px;padding:10px 12px;}
.sheetTip svg{flex:0 0 auto;margin-top:2px;}

:root{
  --ink:#101318; --surface:#191D25; --surface2:#20252F; --line:#2C3240;
  --text:#E8E7E2; --muted:#8B93A1; --steel:#6E93B8; --ember:#E6A946; --good:#63B98A;
  --shadow:0 8px 30px rgba(0,0,0,.35);
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
.app{min-height:100vh;background:
  radial-gradient(1200px 500px at 100% -10%, rgba(110,147,184,.10), transparent 60%),
  radial-gradient(900px 400px at -10% 110%, rgba(230,169,70,.07), transparent 55%),
  var(--ink);
  color:var(--text);font-family:'Inter',system-ui,sans-serif;padding-bottom:40px;}
.loadScreen{min-height:100vh;background:var(--ink);color:var(--muted);display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;font-family:'Inter',sans-serif;}
.spin{animation:sp 1.1s linear infinite;color:var(--steel);} @keyframes sp{to{transform:rotate(360deg)}}

.topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;
  padding:14px 18px;background:rgba(16,19,24,.82);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}
.brand{display:flex;align-items:center;gap:9px;}
.brandMark{color:var(--ember);font-size:18px;}
.brandName{font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:.22em;font-size:20px;}
.nav{display:flex;gap:6px;}
.nav button{width:40px;height:40px;border:1px solid var(--line);background:var(--surface);color:var(--muted);border-radius:11px;display:grid;place-items:center;cursor:pointer;transition:.15s;}
.nav button:hover{color:var(--text);border-color:var(--steel);}
.nav .navOn{color:var(--ink);background:var(--steel);border-color:var(--steel);}

.wrap{max-width:560px;margin:0 auto;padding:18px 16px 0;}

/* rail */
.weekRail{display:flex;gap:6px;margin-bottom:18px;overflow-x:auto;padding-bottom:2px;}
.railNode{flex:1;min-width:66px;display:flex;flex-direction:column;gap:2px;padding:8px 9px;border-radius:10px;
  background:var(--surface);border:1px solid var(--line);}
.railNode.railOn{border-color:var(--ember);background:linear-gradient(180deg,rgba(230,169,70,.14),var(--surface));}
.railLabel{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;letter-spacing:.04em;text-transform:uppercase;}
.railOn .railLabel{color:var(--ember);}
.railWeeks{font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;}

/* hero */
.hero{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:20px;box-shadow:var(--shadow);margin-bottom:22px;}
.heroTag{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.05em;color:var(--steel);text-transform:uppercase;margin-bottom:6px;}
.heroTitle{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:40px;line-height:.95;letter-spacing:.01em;margin:0 0 12px;}
.heroMeta{display:flex;gap:8px;margin-bottom:12px;}
.metaPill{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text);background:var(--surface2);border:1px solid var(--line);padding:4px 9px;border-radius:20px;}
.heroNote{color:var(--muted);font-size:13.5px;line-height:1.5;margin:0 0 16px;}
.weekPicker{display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid var(--line);}
.weekPickerLabel{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;}
.weekControls{display:flex;align-items:center;gap:12px;}
.wBtn{width:34px;height:34px;border-radius:9px;border:1px solid var(--line);background:var(--surface2);color:var(--text);display:grid;place-items:center;cursor:pointer;}
.wBtn:active{transform:scale(.94);}
.weekNum{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:26px;min-width:26px;text-align:center;color:var(--ember);}

.sectionLabel{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 10px 2px;}

/* retorno após pausa */
.returnBanner{background:rgba(230,169,70,.08);border:1px solid rgba(230,169,70,.35);border-radius:14px;padding:14px 16px;margin-bottom:22px;}
.returnBannerHead{display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px;color:var(--ember);margin-bottom:6px;}
.returnBannerText{font-size:12.5px;color:var(--muted);line-height:1.5;margin:0 0 10px;}
.returnToggle{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text);cursor:pointer;}
.returnToggle input{accent-color:var(--ember);width:15px;height:15px;cursor:pointer;}
.returnNote{display:flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--ember);background:rgba(230,169,70,.08);border:1px solid rgba(230,169,70,.3);border-radius:10px;padding:8px 11px;margin:-2px 0 14px;}

/* workout cards */
.workoutGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px;}
.workoutCard{text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:15px;cursor:pointer;transition:.16s;display:flex;flex-direction:column;gap:6px;color:var(--text);}
.workoutCard:hover{border-color:var(--steel);transform:translateY(-2px);}
.wcTop{display:flex;align-items:center;justify-content:space-between;}
.wcName{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:19px;letter-spacing:.02em;}
.wcPlay{color:var(--ember);}
.wcTag{font-size:12px;color:var(--muted);}
.wcCount{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--steel);margin-top:2px;}

.lastCard{display:flex;align-items:center;justify-content:space-between;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-bottom:8px;}
.lastName{font-weight:600;font-size:15px;}
.lastDate{font-size:12px;color:var(--muted);margin-top:2px;font-family:'JetBrains Mono',monospace;}
.lastVol{display:flex;align-items:center;gap:5px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--good);}

/* session */
.sessionWrap{padding-bottom:120px;}
.sessionHead{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.dateRow{display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:9px 12px;margin-bottom:12px;}
.dateRow.dateRowPast{border-color:rgba(230,169,70,.45);background:rgba(230,169,70,.06);}
.dateLabel{display:flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);}
.dateRowPast .dateLabel{color:var(--ember);}
.dateInput{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text);background:var(--surface2);border:1px solid var(--line);border-radius:8px;padding:6px 9px;}
.dateInput::-webkit-calendar-picker-indicator{filter:invert(.7);cursor:pointer;}
.dateWarn{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:12px;color:var(--ember);margin:-4px 0 14px 2px;}
.dateTodayBtn{font-family:'JetBrains Mono',monospace;font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);background:transparent;border:1px solid var(--line);border-radius:6px;padding:3px 8px;cursor:pointer;}
.dateTodayBtn:active{transform:scale(.96);}
.backBtn{display:flex;align-items:center;gap:2px;background:none;border:none;color:var(--muted);font-size:14px;cursor:pointer;padding:6px 8px 6px 0;}
.sessionTitle{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;letter-spacing:.02em;}
.timerBtn{width:40px;height:40px;border-radius:11px;border:1px solid var(--line);background:var(--surface);color:var(--steel);display:grid;place-items:center;cursor:pointer;}

.exList{display:flex;flex-direction:column;gap:14px;}
.exCard{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:15px;}
.exHead{margin-bottom:8px;}
.exName{font-weight:600;font-size:16px;}
.exTarget{font-size:12px;color:var(--muted);margin-top:3px;line-height:1.4;}
.exHint{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);background:var(--surface2);border:1px solid var(--line);border-radius:9px;padding:7px 10px;margin-bottom:11px;display:flex;align-items:center;gap:6px;}
.exHint.exHintUp{color:var(--ember);border-color:rgba(230,169,70,.4);background:rgba(230,169,70,.08);}

.incRow{margin-bottom:11px;}
.incBtn{display:flex;align-items:center;gap:6px;background:none;border:none;color:var(--muted);
  font-family:'JetBrains Mono',monospace;font-size:10.5px;padding:0;cursor:pointer;}
.incBtn:hover{color:var(--steel);}
.incEditor{display:flex;flex-direction:column;gap:6px;margin-top:8px;padding:10px;border-radius:10px;
  background:var(--surface2);border:1px solid var(--line);}
.incEditorLabel{font-size:11.5px;color:var(--muted);line-height:1.4;}

.setRows{display:flex;flex-direction:column;gap:8px;}
.setRow{display:flex;align-items:flex-end;gap:10px;padding:8px;border-radius:11px;background:var(--surface2);border:1px solid transparent;transition:.15s;}
.setRow.setDone{border-color:rgba(99,185,138,.4);background:rgba(99,185,138,.07);}
.setNum{font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--steel);width:16px;text-align:center;padding-bottom:9px;font-size:13px;}
.setField{display:flex;flex-direction:column;gap:3px;flex:1;}
.setFieldWide{flex:1;}
.setField label{font-size:9.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);padding-left:2px;}

.stepper{display:flex;align-items:center;gap:4px;background:var(--ink);border:1px solid var(--line);border-radius:9px;padding:3px;}
.stepBtn{width:30px;height:30px;border-radius:7px;border:none;background:var(--surface);color:var(--text);display:grid;place-items:center;cursor:pointer;flex-shrink:0;}
.stepBtn:active{background:var(--steel);color:var(--ink);}
.stepVal{flex:1;display:flex;align-items:center;justify-content:center;gap:2px;min-width:0;}
.stepInput{width:100%;min-width:0;background:none;border:none;color:var(--text);text-align:center;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:15px;outline:none;-moz-appearance:textfield;}
.stepInput::-webkit-outer-spin-button,.stepInput::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
.stepSuffix{font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;}

.doneBtn{width:38px;height:38px;border-radius:9px;border:1px solid var(--line);background:var(--surface);color:var(--muted);display:grid;place-items:center;cursor:pointer;flex-shrink:0;transition:.15s;}
.doneBtn.doneOn{background:var(--good);border-color:var(--good);color:var(--ink);}

.finishBtn{position:fixed;left:50%;transform:translateX(-50%);bottom:22px;z-index:15;display:flex;align-items:center;gap:8px;
  background:var(--ember);color:var(--ink);border:none;border-radius:13px;padding:14px 30px;font-weight:700;font-size:15px;cursor:pointer;box-shadow:0 8px 24px rgba(230,169,70,.35);font-family:'Inter',sans-serif;}
.finishBtn:active{transform:translateX(-50%) scale(.97);}

/* rest timer */
.restBar{position:fixed;left:50%;transform:translateX(-50%);bottom:82px;z-index:16;display:flex;align-items:center;gap:10px;
  background:var(--surface2);border:1px solid var(--line);border-radius:14px;padding:9px 12px;box-shadow:var(--shadow);}
.restTime{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:19px;min-width:56px;}
.restPresets{display:flex;gap:4px;}
.chip{font-family:'JetBrains Mono',monospace;font-size:11px;background:var(--surface);border:1px solid var(--line);color:var(--text);border-radius:7px;padding:5px 7px;cursor:pointer;}
.chip:active{background:var(--steel);color:var(--ink);}
.restToggle{background:var(--steel);color:var(--ink);border:none;border-radius:8px;padding:6px 12px;font-weight:600;font-size:12px;cursor:pointer;}
.restClose{background:none;border:none;color:var(--muted);cursor:pointer;display:grid;place-items:center;}

/* history */
.pageTitle{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:34px;margin:4px 0 18px;letter-spacing:.02em;}
.empty{text-align:center;color:var(--muted);padding:50px 20px;display:flex;flex-direction:column;align-items:center;gap:12px;}
.empty svg{color:var(--ember);}
.statRow{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px;}
.statBox{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:14px 8px;text-align:center;}
.statNum{display:block;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:28px;color:var(--ember);line-height:1;}
.statLbl{font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:5px;display:block;}

.chartCard{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px;margin-bottom:20px;}
.chartTitle{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);margin-bottom:10px;}
.chart{width:100%;height:90px;}
.bar{fill:var(--steel);opacity:.85;}
.bar:last-child{fill:var(--ember);opacity:1;}

.histList{display:flex;flex-direction:column;gap:8px;margin-bottom:22px;}
.histRow{display:flex;align-items:center;justify-content:space-between;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;width:100%;text-align:left;cursor:pointer;color:var(--text);font-family:'Inter',sans-serif;transition:.14s;}
.histRow:hover{border-color:var(--steel);}
.histRow:active{transform:scale(.99);}
.histRight{display:flex;align-items:center;gap:11px;}
.histEdit{color:var(--muted);flex-shrink:0;}
.histHint{font-size:11.5px;color:var(--muted);font-style:italic;margin:-4px 0 10px 2px;}
.editBadge{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:9.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--ember);border:1px solid rgba(230,169,70,.4);background:rgba(230,169,70,.08);border-radius:6px;padding:2px 6px;margin-right:9px;vertical-align:middle;}
.histName{font-weight:600;font-size:14px;}
.histMeta{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);margin-top:2px;}
.histSkipped{font-size:11px;color:var(--ember);margin-top:5px;line-height:1.4;}
.histVol{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--good);font-weight:700;}
.histVol span{color:var(--muted);font-weight:500;font-size:10px;}

.backupRow{display:flex;gap:9px;margin:2px 0 18px;flex-wrap:wrap;}
.backupBtn{flex:1;min-width:140px;display:flex;align-items:center;justify-content:center;gap:7px;background:var(--surface);
  border:1px solid var(--line);color:var(--text);border-radius:11px;padding:11px 14px;font-size:13px;cursor:pointer;
  font-family:'Inter',sans-serif;transition:.14s;}
.backupBtn:hover{border-color:var(--steel);color:var(--steel);}
.backupBtn svg{color:var(--steel);}

.dangerBtn{display:flex;align-items:center;gap:6px;margin:6px auto 30px;background:none;border:1px solid var(--line);color:var(--muted);border-radius:10px;padding:9px 14px;font-size:12.5px;cursor:pointer;}
.dangerBtn:hover{color:#E08585;border-color:#5c3535;}

/* plan */
.planIntro{color:var(--muted);font-size:13.5px;line-height:1.55;margin:0 0 22px;}
.planIntro b{color:var(--text);}
.planPhase{margin-bottom:26px;}
.planPhaseHead{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px;}
.planPhaseLabel{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--steel);text-transform:uppercase;letter-spacing:.05em;}
.planPhaseName{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:26px;margin:2px 0 0;}
.planPhasePills{display:flex;flex-direction:column;gap:5px;align-items:flex-end;flex-shrink:0;}
.planPhaseNote{color:var(--muted);font-size:12.5px;line-height:1.5;margin:0 0 14px;}
.planWorkout{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:13px 15px;margin-bottom:9px;}
.planWorkoutName{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:18px;margin-bottom:9px;}
.planWorkoutName span{color:var(--muted);font-family:'Inter',sans-serif;font-weight:400;font-size:12px;}
.planExList{display:flex;flex-direction:column;gap:6px;}
.planExRow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px solid rgba(44,50,64,.5);}
.planExRow:last-child{border-bottom:none;}
.planExName{font-size:13.5px;}
.planExScheme{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--steel);flex-shrink:0;}

.pillars{margin-top:8px;}
.pillars ul{list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:8px;}
.pillars li{background:var(--surface);border:1px solid var(--line);border-radius:11px;padding:11px 14px;font-size:13px;color:var(--muted);}
.pillars li b{color:var(--ember);font-weight:600;}

/* pr toast */
.prToast{position:fixed;left:50%;transform:translateX(-50%);top:70px;z-index:30;display:flex;align-items:center;gap:8px;
  background:var(--ember);color:var(--ink);font-weight:700;padding:11px 18px;border-radius:12px;box-shadow:0 8px 24px rgba(230,169,70,.4);font-size:14px;animation:pop .3s ease;}
@keyframes pop{from{opacity:0;transform:translate(-50%,-8px);}to{opacity:1;transform:translate(-50%,0);}}

@media (max-width:380px){ .heroTitle{font-size:34px;} .workoutGrid{grid-template-columns:1fr;} }
@media (prefers-reduced-motion:reduce){ *{animation:none!important;transition:none!important;} }
`;
