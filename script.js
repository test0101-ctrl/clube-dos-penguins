document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO JOGO ---
    const gameWorld = document.getElementById('game-world');
    const loadingScreen = document.getElementById('loading-screen');

    // --- ESTADO DO JOGO ---
    const gameState = {
        player: {
            element: null,
            x: 400, y: 400,
            targetX: 400, targetY: 400,
            isWalking: false, isWaving: false,
        },
        puffle: {
            element: null, x: 350, y: 400,
        },
        currentRoom: 'town',
    };

    // --- CONFIGURAÇÕES DO JOGO ---
    const PLAYER_SPEED = 3;
    const PUFFLE_FOLLOW_DISTANCE = 90;

    // --- DEFINIÇÃO DOS CENÁRIOS ---
    // ALTERAÇÃO PRINCIPAL AQUI: Substituímos as imagens por gradientes de cor!
    const rooms = {
        town: {
            name: "Praça Fofinha",
            // Um gradiente suave que simula um céu ao amanhecer
            background: "linear-gradient(to bottom, #fdfd96, #ffc09f)",
            portals: [{ x: 750, y: 350, width: 150, height: 250, to: 'plaza' }]
        },
        plaza: {
            name: "Bosque Encantado",
            // Um gradiente calmo que simula um céu azul com tons de lilás
            background: "linear-gradient(to bottom, #a2d2ff, #b19cd9)",
            portals: [{ x: 0, y: 300, width: 100, height: 300, to: 'town' }]
        }
    };

    // --- FUNÇÕES PRINCIPAIS ---

    function createPlayer() {
        const player = document.createElement('div');
        player.className = 'player';
        player.innerHTML = `
            <div class="penguin-body">
                <div class="eye left"></div>
                <div class="eye right"></div>
                <div class="blush left"></div>
                <div class="blush right"></div>
                <div class="beak"></div>
                <div class="arm"></div>
                <div class="chat-bubble"></div>
            </div>
        `;
        gameWorld.appendChild(player);
        gameState.player.element = player;
        updatePlayerElement();
    }

    function createPuffle() {
        const puffle = document.createElement('div');
        puffle.id = 'puffle';
        puffle.innerHTML = `
            <div class="puffle-eye left"></div>
            <div class="puffle-eye right"></div>
        `;
        gameWorld.appendChild(puffle);
        gameState.puffle.element = puffle;
        updatePuffleElement();
    }
    
    function changeRoom(roomId) {
        if (!rooms[roomId]) return;
        gameState.currentRoom = roomId;
        const room = rooms[roomId];
        document.querySelectorAll('.portal').forEach(p => p.remove());
        
        // Esta linha agora vai aplicar o gradiente de cor em vez de uma imagem
        gameWorld.style.background = room.background;

        room.portals.forEach(p => {
            const portalEl = document.createElement('div');
            portalEl.className = 'portal';
            portalEl.style.left = `${p.x}px`;
            portalEl.style.top = `${p.y}px`;
            portalEl.style.width = `${p.width}px`;
            portalEl.style.height = `${p.height}px`;
            portalEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (p.to === 'plaza') { gameState.player.x = 50; gameState.player.y = 450; } 
                else if (p.to === 'town') { gameState.player.x = 750; gameState.player.y = 450; }
                changeRoom(p.to);
            });
            gameWorld.appendChild(portalEl);
        });
        updatePlayerElement();
    }

    // --- FUNÇÕES DE ATUALIZAÇÃO (UPDATE) ---

    function updatePlayerElement() {
        const { element, x, y } = gameState.player;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }
    
    function updatePuffleElement() {
        const { element, x, y } = gameState.puffle;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }

    function gameLoop() {
        const { player, puffle } = gameState;
        const dx = player.targetX - player.x;
        const dy = player.targetY - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > PLAYER_SPEED) {
            if (!player.isWalking) {
                player.isWalking = true;
                player.element.classList.add('is-walking');
            }
            player.x += (dx / distance) * PLAYER_SPEED;
            player.y += (dy / distance) * PLAYER_SPEED;
            if (dx < 0) player.element.classList.add('facing-left');
            else player.element.classList.remove('facing-left');
        } else if (player.isWalking) {
            player.isWalking = false;
            player.element.classList.remove('is-walking');
        }
        updatePlayerElement();

        const puffleDx = player.x - puffle.x;
        const puffleDy = (player.y - 10) - puffle.y;
        const puffleDist = Math.sqrt(puffleDx * puffleDx + puffleDy * puffleDy);
        
        if (puffleDist > PUFFLE_FOLLOW_DISTANCE) {
            puffle.x += puffleDx * 0.05;
            puffle.y += puffleDy * 0.05;
            updatePuffleElement();
        }
        requestAnimationFrame(gameLoop);
    }
    
    // --- FUNÇÕES DE INTERAÇÃO ---

    function handleWave() {
        if (gameState.player.isWaving) return;
        gameState.player.isWaving = true;
        gameState.player.element.classList.add('is-waving');
        setTimeout(() => {
            gameState.player.isWaving = false;
            gameState.player.element.classList.remove('is-waving');
        }, 800);
    }
    
    function handleHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '❤️';
        const playerRect = gameState.player.element.getBoundingClientRect();
        const worldRect = gameWorld.getBoundingClientRect();
        heart.style.left = `${playerRect.left - worldRect.left + 15}px`;
        heart.style.top = `${playerRect.top - worldRect.top}px`;
        gameWorld.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 1500);
    }

    function handleThrowSnowball(e) {
        const playerRect = gameState.player.element.getBoundingClientRect();
        const worldRect = gameWorld.getBoundingClientRect();
        const startX = playerRect.left + (playerRect.width / 2) - worldRect.left;
        const startY = playerRect.top + (playerRect.height / 2) - worldRect.top;
        const endX = e.clientX - worldRect.left;
        const endY = e.clientY - worldRect.top;
        const snowball = document.createElement('div');
        snowball.className = 'snowball';
        snowball.style.left = `${startX}px`;
        snowball.style.top = `${startY}px`;
        gameWorld.appendChild(snowball);
        requestAnimationFrame(() => {
            snowball.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(1.2)`;
            snowball.style.opacity = '0';
        });
        setTimeout(() => { snowball.remove(); }, 500);
    }
    
    function handleChat() {
        const message = prompt("O que queres dizer, meu amor?");
        if (!message) return;
        const chatBubble = gameState.player.element.querySelector('.chat-bubble');
        chatBubble.textContent = message;
        chatBubble.classList.add('visible');
        setTimeout(() => { chatBubble.classList.remove('visible'); }, 4000);
    }

    function handleChangeColor(color) {
        document.documentElement.style.setProperty('--penguin-body-color', color);
    }

    function createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.textContent = '✨';
        effect.style.left = `${x - 12}px`;
        effect.style.top = `${y - 12}px`;
        gameWorld.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }

    // --- INICIALIZAÇÃO ---
    function init() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 2500);

        createPlayer();
        createPuffle();
        changeRoom(gameState.currentRoom);
        
        gameWorld.addEventListener('click', (e) => {
            const worldRect = gameWorld.getBoundingClientRect();
            const clickX = e.clientX - worldRect.left;
            const clickY = e.clientY - worldRect.top;
            gameState.player.targetX = clickX - (gameState.player.element.offsetWidth / 2);
            gameState.player.targetY = clickY - (gameState.player.element.offsetHeight / 2);
            createClickEffect(clickX, clickY);
        });

        document.getElementById('wave-button').addEventListener('click', handleWave);
        document.getElementById('heart-button').addEventListener('click', handleHeart);
        document.getElementById('snowball-button').addEventListener('click', () => {
             alert("Agora clica em algum lugar no mundo para atirar a bola de neve!");
             gameWorld.addEventListener('click', handleThrowSnowball, { once: true });
        });
        document.getElementById('chat-button').addEventListener('click', handleChat);

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'w') handleWave();
            if (e.key.toLowerCase() === 'h') handleHeart();
            if (e.key.toLowerCase() === 'c') handleChat();
            if (e.key.toLowerCase() === 't') document.getElementById('snowball-button').click();
        });
        
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                handleChangeColor(swatch.dataset.color);
            });
        });

        gameLoop();
    }

    init();
});
