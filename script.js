// Agora cada cliente tem o total doado em vez de valor mensal
const clients = [
  { name: "João", totalDonated: 6 },
  { name: "Maria", totalDonated: 25 },
  { name: "Carlos", totalDonated: 80 },
  { name: "Ana", totalDonated: 150 }
];

const goalAmount = 500;

function getRankClass(value) {
  if (value >= 100) return 'gold';
  if (value >= 25) return 'silver';
  return 'bronze';
}

function getRankLabel(value) {
  if (value >= 100) return 'Gold';
  if (value >= 25) return 'Silver';
  return 'Bronze';
}

const clientsContainer = document.getElementById("clients");
let total = 0;

clients.forEach(client => {
  total += client.totalDonated;
  const div = document.createElement("div");
  div.className = "client";
  div.innerHTML = `
    <span>${client.name}</span>
    <span class="rank ${getRankClass(client.totalDonated)}">${getRankLabel(client.totalDonated)}</span>
  `;
  clientsContainer.appendChild(div);
});

const percent = Math.min((total / goalAmount) * 100, 100);
document.getElementById("progress").style.width = percent + "%";
document.getElementById("progress").textContent = Math.floor(percent) + "%";
document.getElementById("goal-info").textContent = `€${total} de €${goalAmount}`;
