// stats-init.js — Loads playerStats from localStorage
function loadPlayerStats() {
  const stats = JSON.parse(localStorage.getItem("playerStats")) || {};
  const keys = ["atk", "def", "hp", "energy", "xp", "rp", "cash", "heat", "lvl"];
  keys.forEach(k => {
    const el = document.getElementById(k);
    if (el && stats[k] !== undefined) el.textContent = stats[k];
  });
}

document.addEventListener("DOMContentLoaded", loadPlayerStats);
