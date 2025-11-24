const balls = document.querySelectorAll(".ball");
const log = document.getElementById("log");
const startBtn = document.getElementById("startBtn");
let selectedTeam = null;

let health = { H: 3, D: 3, S: 3, C: 3 };

balls.forEach(ball => {
  ball.addEventListener("click", () => {
    balls.forEach(b => b.classList.remove("selected"));
    const team = ball.dataset.team;
    selectedTeam = team;
    balls.forEach(b => {
      if (b.dataset.team === team) {
        b.classList.add("selected");
      }
    });
    startBtn.disabled = false;
    log.innerHTML = `<p>You chose Team ${team.toUpperCase()}.</p>`;
  });
});

startBtn.addEventListener("click", () => {
  if (!selectedTeam) return;
  health = { H: 3, D: 3, S: 3, C: 3 }; 
  const opponentTeam = selectedTeam === "red" ? "black" : "red";
  log.innerHTML += `<p>Battle begins: Team ${selectedTeam.toUpperCase()} vs Team ${opponentTeam.toUpperCase()}!</p>`;
  fight(selectedTeam, opponentTeam);
});

function fight(teamA, teamB) {
  const fightersA = Array.from(document.querySelectorAll(`[data-team="${teamA}"]`));
  const fightersB = Array.from(document.querySelectorAll(`[data-team="${teamB}"]`));

  const fightInterval = setInterval(() => {
    const aliveA = fightersA.filter(f => health[f.id] > 0);
    const aliveB = fightersB.filter(f => health[f.id] > 0);

    if (aliveA.length === 0 || aliveB.length === 0) {
      clearInterval(fightInterval);
      const winner = aliveA.length > 0 ? teamA : teamB;
      log.innerHTML += `<p>🏆 Winner: Team ${winner.toUpperCase()}!</p>`;
      return;
    }

    const fighterA = aliveA[Math.floor(Math.random() * aliveA.length)];
    const fighterB = aliveB[Math.floor(Math.random() * aliveB.length)];

    const attacker = Math.random() < 0.5 ? fighterA : fighterB;
    const defender = attacker === fighterA ? fighterB : fighterA;

    animateAttack(attacker, defender, () => {
      health[defender.id]--;
      if (health[defender.id] <= 0) {
        log.innerHTML += `<p>💥 ${attacker.id} knocked out ${defender.id}!</p>`;
      } else {
        log.innerHTML += `<p>${attacker.id} hits ${defender.id}! (${defender.id} has ${health[defender.id]} HP left)</p>`;
      }
      log.scrollTop = log.scrollHeight;
    });
  }, 2000);
}

function animateAttack(attacker, defender, callback) {
  const attackerRect = attacker.getBoundingClientRect();
  const defenderRect = defender.getBoundingClientRect();

  const offsetX = defenderRect.left - attackerRect.left;
  const offsetY = defenderRect.top - attackerRect.top;

  attacker.style.zIndex = "1000";
  attacker.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  setTimeout(() => {
    attacker.style.transform = `translate(0, 0)`;
    setTimeout(() => {
      attacker.style.zIndex = "1";
      if (callback) callback();
    }, 500);
  }, 1000);
}
