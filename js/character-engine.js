// character-engine.js

const character = async () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('npc') || 'character-data';
  const res = await fetch(`https://raw.githubusercontent.com/SGGregory76/HUSTLE/main/data/${name}.json`);
  const data = await res.json();

  // Set image background
  document.querySelector('.front').style.background = `url('${data.image}') center center / cover no-repeat`;

  // Set stats
  for (let key in data.stats) {
    const el = document.getElementById(key);
    if (el) el.textContent = data.stats[key];
  }

  // Set abilities
  document.getElementById('charName').textContent = `${data.name} – ${data.title}`;
  document.getElementById('passive').textContent = data.abilities.passive;
  document.getElementById('active').textContent = data.abilities.active;
  document.getElementById('unlock').textContent = data.abilities.unlock;
};

function flipCard() {
  document.getElementById('characterCard').classList.toggle('flipped');
}

function logStat(stat) {
  alert(`${stat.toUpperCase()} clicked`);
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

window.addEventListener('DOMContentLoaded', character);
