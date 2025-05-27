// character-engine.js — reads data/character-data.json for player info

async function loadPlayerCard() {
  try {
    const res = await fetch("../data/character-data.json");
    const data = await res.json();

    // Set stat values
    const stats = data.stats;
    for (const stat in stats) {
      const el = document.getElementById(stat);
      if (el) el.textContent = stats[stat];
    }

    // Set name if applicable
    const nameEl = document.querySelector(".card-face.back h2");
    if (nameEl) nameEl.textContent = data.name || "Player";

    // Set abilities
    if (data.abilities) {
      document.getElementById("passive").textContent = data.abilities.passive;
      document.getElementById("active").textContent = data.abilities.active;
      document.getElementById("unlock").textContent = data.abilities.unlock;
    }
  } catch (err) {
    console.error("Error loading character-data.json:", err);
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
  el.textContent = val + 1;
}

window.addEventListener("DOMContentLoaded", loadPlayerCard);
