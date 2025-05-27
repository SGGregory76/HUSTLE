// character-engine.js — with save state, XP/Level tracking, and dynamic image

let playerData = {};

async function loadPlayerCard() {
  try {
    const saved = localStorage.getItem("playerState");
    if (saved) {
      playerData = JSON.parse(saved);
    } else {
      const res = await fetch("../data/character-data.json");
      playerData = await res.json();
      savePlayerState();
    }

    const stats = playerData.stats;
    for (const stat in stats) {
      const el = document.getElementById(stat);
      if (el) el.textContent = stats[stat];
    }

    const nameEl = document.querySelector(".card-face.back h2");
    if (nameEl) nameEl.textContent = playerData.name || "Player";

    if (playerData.abilities) {
      document.getElementById("passive").textContent = playerData.abilities.passive;
      document.getElementById("active").textContent = playerData.abilities.active;
      document.getElementById("unlock").textContent = playerData.abilities.unlock;
    }

    if (playerData.image) {
      const front = document.querySelector(".card-face.front");
      front.style.backgroundImage = `url('${playerData.image}')`;
    }
  } catch (err) {
    console.error("Error loading player data:", err);
  }
}

function flipCard() {
  document.getElementById("characterCard").classList.toggle("flipped");
}

function logStat(stat) {
  alert(stat.toUpperCase() + " clicked");
}

function useItem(type) {
  const max = { hp: 10, energy: 5 };
  const el = document.getElementById(type);
  let val = parseInt(el.textContent);
  if (val >= max[type]) {
    alert(type.toUpperCase() + " is already full.");
    return;
  }
  val++;
  el.textContent = val;
  playerData.stats[type] = val;
  savePlayerState();
}

function gainXP(amount) {
  playerData.stats.xp += amount;
  const formula = playerData.levelFormula || 10;
  const level = Math.floor(playerData.stats.xp / formula) + 1;
  playerData.stats.lvl = level;
  document.getElementById("xp").textContent = playerData.stats.xp;
  document.getElementById("lvl").textContent = playerData.stats.lvl;
  savePlayerState();
}

function savePlayerState() {
  localStorage.setItem("playerState", JSON.stringify(playerData));
}

function resetPlayerState() {
  localStorage.removeItem("playerState");
  location.reload();
}

window.addEventListener("DOMContentLoaded", loadPlayerCard);
