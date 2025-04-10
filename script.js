const clients = [
  { name: "João", monthly: 5 },
  { name: "Maria", monthly: 15 },
  { name: "Carlos", monthly: 50 },
  { name: "Ana", monthly: 25 }
];

const goalAmount = 500;

function getRankClass(value) {
  if (value >= 50) return 'gold';
  if (value >= 20) return 'silver';
  return 'bronze';
}

function getRankLabel(value) {
  if (value >= 50) return 'Gold';
  if (value >= 20) return 'Silver';
  return 'Bronze';
}

const clientsContainer = document.getElementById("clients");
let total = 0;

clients.forEach(client => {
  total += client.monthly;
  const div = document.createElement("div");
  div.className = "client";
  div.innerHTML = `
    <span>${client.name}</span>
    <span class="rank ${getRankClass(client.monthly)}">${getRankLabel(client.monthly)}</span>
  `;
  clientsContainer.appendChild(div);
});

const percent = Math.min((total / goalAmount) * 100, 100);
document.getElementById("progress").style.width = percent + "%";
document.getElementById("progress").textContent = Math.floor(percent) + "%";
document.getElementById("goal-info").textContent = `€${total} de €${goalAmount}`;
