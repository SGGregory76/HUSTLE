// prologue-engine.js — with localStorage stat saving
let prologueState = {
  step: 0,
  progress: "intro",
  data: {},
  results: {
    xp: 0, rp: 0, cash: 0, heat: 0, item: []
  },
  tries: 3,
  stashTarget: null,
  stashGrid: []
};

async function loadPrologue() {
  const res = await fetch("../data/prologue-data.json");
  prologueState.data = await res.json();
  showIntro();
}

function showIntro() {
  const { text, button } = prologueState.data.intro;
  renderBox(text, `<button onclick="startQuestions()">${button}</button>`);
}

function startQuestions() {
  prologueState.progress = "questions";
  showQuestion();
}

function showQuestion() {
  const q = prologueState.data.questions[prologueState.step];
  if (!q) return showStash();
  const buttons = q.options.map((opt, i) => `
    <button onclick="chooseOption(${i})">${opt.label}</button>`).join("<br>");
  renderBox(q.text, buttons);
}

function chooseOption(i) {
  const q = prologueState.data.questions[prologueState.step];
  const effects = q.options[i].effects;
  applyEffects(effects);
  prologueState.step++;
  showQuestion();
}

function applyEffects(e) {
  if (!e) return;
  for (const key in e) {
    if (key === "item") prologueState.results.item.push(e[key]);
    else {
      prologueState.results[key] = (prologueState.results[key] || 0) + e[key];
      updateCharacterCardStat(key, prologueState.results[key]);
    }
  }
  saveStatsToStorage();
}

function updateCharacterCardStat(stat, value) {
  const el = document.getElementById(stat);
  if (el) el.textContent = value;
  if (stat === "xp") {
    const level = Math.floor(value / 20) + 1;
    updateCharacterCardStat("lvl", level);
  }
}

function saveStatsToStorage() {
  let stored = localStorage.getItem("playerStats");
  let stats = stored ? JSON.parse(stored) : {};
  for (const key in prologueState.results) {
    if (key === "item") continue;
    stats[key] = (stats[key] || 0) + prologueState.results[key];
  }
  stats["lvl"] = Math.floor((stats["xp"] || 0) / 20) + 1;
  localStorage.setItem("playerStats", JSON.stringify(stats));
}

function showStash() {
  prologueState.progress = "stash";
  const gridSize = prologueState.data.stash.rows * prologueState.data.stash.cols;
  prologueState.stashTarget = Math.floor(Math.random() * gridSize);
  renderStashGrid();
}

function renderStashGrid() {
  const { rows, cols, text } = prologueState.data.stash;
  let grid = "";
  let cell = 0;
  for (let r = 0; r < rows; r++) {
    grid += '<div style="display:flex">';
    for (let c = 0; c < cols; c++) {
      grid += `<button onclick="clickStash(${cell})" id="stash-${cell}" style="flex:1;height:40px;margin:2px">?</button>`;
      cell++;
    }
    grid += '</div>';
  }
  renderBox(text + `<p>Tries left: ${prologueState.tries}</p>`, grid);
}

function clickStash(index) {
  if (index === prologueState.stashTarget) {
    document.getElementById(`stash-${index}`).textContent = "✔️";
    applyEffects(prologueState.data.stash.reward);
    setTimeout(showCombat, 1000);
  } else {
    document.getElementById(`stash-${index}`).textContent = "❌";
    prologueState.tries--;
    if (prologueState.tries <= 0) setTimeout(showCombat, 1000);
    else renderStashGrid();
  }
}

function showCombat() {
  prologueState.progress = "combat";
  prologueState.enemyHP = prologueState.data.combat.enemy.hp;
  prologueState.playerHP = prologueState.data.combat.playerStart.hp;
  prologueState.energy = prologueState.data.combat.playerStart.energy;
  updateCharacterCardStat("hp", prologueState.playerHP);
  updateCharacterCardStat("energy", prologueState.energy);
  renderCombat();
}

function renderCombat() {
  const html = `
    <p>Enemy: ${prologueState.data.combat.enemy.name}</p>
    <p>HP: ${prologueState.enemyHP}</p>
    <p>Your HP: ${prologueState.playerHP} | ⚡ Energy: ${prologueState.energy}</p>
    <button onclick="attackEnemy()">Attack</button>`;
  renderBox("Combat Encounter", html);
}

function attackEnemy() {
  if (prologueState.energy <= 0) return alert("Too tired to attack.");
  const dmg = 3;
  prologueState.enemyHP -= dmg;
  prologueState.energy--;
  updateCharacterCardStat("energy", prologueState.energy);
  if (prologueState.enemyHP <= 0) {
    applyEffects(prologueState.data.combat.enemy.reward);
    return showPrologueEnd();
  }
  prologueState.playerHP -= prologueState.data.combat.enemy.atk;
  updateCharacterCardStat("hp", prologueState.playerHP);
  if (prologueState.playerHP <= 0) return renderBox("You lost the fight.", `<button onclick='showPrologueEnd()'>Continue</button>`);
  renderCombat();
}

function showPrologueEnd() {
  applyEffects(prologueState.data.end.rewards);
  renderBox(prologueState.data.end.text, `<button onclick='finishPrologue()'>Finish</button>`);
}

function finishPrologue() {
  localStorage.setItem("prologue_complete", "true");
  window.location.href = "../character/character-index.html";
}

function renderBox(text, controls) {
  document.getElementById("prologueBox").innerHTML = `<div class='question-box'><p>${text}</p>${controls}</div>`;
}

document.addEventListener("DOMContentLoaded", loadPrologue);
