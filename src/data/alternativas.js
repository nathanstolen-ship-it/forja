/**
 * Exercícios equivalentes — cada grupo reúne opções que trabalham o mesmo padrão de
 * movimento e o mesmo músculo-alvo, na mesma faixa de reps. Trocar dentro do grupo
 * mantém o estímulo do plano; só muda o equipamento.
 *
 * `inc` = menor incremento de carga típico daquele equipamento.
 * A ordem dentro do grupo é a ordem em que as setas ‹ › percorrem as opções.
 */
export const GRUPOS = [
  { nome: "Supino reto", opcoes: [
    { id: "supinomaq", name: "Supino máquina", inc: 2.5 },
    { id: "supinohalt", name: "Supino reto halteres", inc: 2 },
    { id: "supinobarra", name: "Supino reto barra", inc: 2 },
  ] },
  { nome: "Supino inclinado", opcoes: [
    { id: "supinoinc", name: "Supino inclinado halteres", inc: 2 },
    { id: "supinoincmaq", name: "Supino inclinado máquina", inc: 2.5 },
  ] },
  { nome: "Desenvolvimento", opcoes: [
    { id: "desenvmaq", name: "Desenvolvimento máquina", inc: 2.5 },
    { id: "desenvhalt", name: "Desenvolvimento halteres", inc: 2 },
  ] },
  { nome: "Crucifixo", opcoes: [
    { id: "crossover", name: "Crossover (crucifixo polia)", inc: 2.5 },
    { id: "peckdeck", name: "Peck deck (voador)", inc: 2.5 },
  ] },
  { nome: "Elevação lateral", opcoes: [
    { id: "elevlateral", name: "Elevação lateral halteres", inc: 1 },
    { id: "elevlatpolia", name: "Elevação lateral na polia", inc: 1.25 },
  ] },
  { nome: "Tríceps na polia", opcoes: [
    { id: "tricepspolia", name: "Tríceps polia (barra)", inc: 2.5 },
    { id: "tricepscorda", name: "Tríceps corda", inc: 2.5 },
  ] },
  { nome: "Puxada vertical", opcoes: [
    { id: "puxada", name: "Puxada frontal", inc: 2.5 },
    { id: "barrafixa", name: "Barra fixa", inc: 2.5 },
  ] },
  { nome: "Remada", opcoes: [
    { id: "remadamaq", name: "Remada máquina", inc: 2.5 },
    { id: "remadabaixa", name: "Remada baixa polia", inc: 2.5 },
    { id: "remadacurv", name: "Remada curvada", inc: 2.5 },
  ] },
  { nome: "Posterior de ombro", opcoes: [
    { id: "facepull", name: "Face pull", inc: 2.5 },
    { id: "crucinv", name: "Crucifixo inverso (máquina)", inc: 2.5 },
  ] },
  { nome: "Rosca", opcoes: [
    { id: "rosca", name: "Rosca direta", inc: 2 },
    { id: "roscaalt", name: "Rosca alternada halteres", inc: 2 },
  ] },
  { nome: "Agachamento", opcoes: [
    { id: "agach", name: "Agachamento livre", inc: 5 },
    { id: "agachsmith", name: "Agachamento Smith", inc: 5 },
    { id: "hack", name: "Agachamento hack", inc: 5 },
  ] },
  { nome: "Stiff", opcoes: [
    { id: "stiff", name: "Stiff com halteres", inc: 2 },
    { id: "stiffbarra", name: "Stiff com barra", inc: 2.5 },
  ] },
  { nome: "Panturrilha", opcoes: [
    { id: "panturrilha", name: "Panturrilha no leg press", inc: 5 },
    { id: "panturrilhaP", name: "Panturrilha em pé", inc: 5 },
  ] },
  { nome: "Abdominal", opcoes: [
    { id: "abdomaq", name: "Abdominal máquina", inc: 2.5 },
    { id: "abdpolia", name: "Abdominal na polia", inc: 2.5 },
  ] },
];

/** Grupo de um exercício (pelo id), ou null se ele não tem equivalentes cadastrados. */
const POR_ID = new Map();
GRUPOS.forEach((g) => g.opcoes.forEach((o) => POR_ID.set(o.id, { grupo: g, opcao: o })));

export const grupoDe = (id) => POR_ID.get(id)?.grupo || null;
export const opcaoDe = (id) => POR_ID.get(id)?.opcao || null;
