document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO JOGO ---
    const gameWorld = document.getElementById('game-world');
    const loadingScreen = document.getElementById('loading-screen');

    // --- ESTADO DO JOGO ---
    const gameState = {
        player: {
            element: null,
            x: 400,
            y: 400,
            targetX: 400,
            targetY: 400,
            isWalking: false,
            isWaving: false,
        },
        puffle: {
            element: null,
            x: 350,
            y: 400,
        },
        currentRoom: 'town',
    };

    // --- CONFIGURAÇÕES DO JOGO ---
    const PLAYER_SPEED = 3;
    const PUFFLE_FOLLOW_DISTANCE = 80;

    // --- DEFINIÇÃO DOS CENÁRIOS ---
    const rooms = {
        town: {
            name: "Town Center",
            background: "url('https://i.imgur.com/gO0kBNQ.png')",
            portals: [
                { x: 750, y: 350, width: 150, height: 250, to: 'plaza' }
            ]
        },
        plaza: {
            name: "Plaza",
            background: "url('https://i.imgur.com/T0DB1t2.png')",
            portals: [
                { x: 0, y: 300, width: 100, height: 300, to: 'town' }
            ]
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
        
        // Limpa portais antigos
        document.querySelectorAll('.portal').forEach(p => p.remove());

        // Carrega novo fundo
        gameWorld.style.backgroundImage = room.background;

        // Cria novos portais
        room.portals.forEach(p => {
            const portalEl = document.createElement('div');
            portalEl.className = 'portal';
            portalEl.style.left = `${p.x}px`;
            portalEl.style.top = `${p.y}px`;
            portalEl.style.width = `${p.width}px`;
            portalEl.style.height = `${p.height}px`;
            portalEl.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que o clique no portal mova o pinguim
                // Posiciona o pinguim no "outro lado" do novo cenário
                if (p.to === 'plaza') {
                    gameState.player.x = 50;
                    gameState.player.y = 450;
                } else if (p.to === 'town') {
                    gameState.player.x = 750;
                    gameState.player.y = 450;
                }
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

        // Movimento do Jogador
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

            // Virar o pinguim
            if (dx < 0) player.element.classList.add('facing-left');
            else player.element.classList.remove('facing-left');
            
        } else if (player.isWalking) {
            player.isWalking = false;
            player.element.classList.remove('is-walking');
        }
        
        updatePlayerElement();

        // Movimento do Puffle
        const puffleDx = player.x - puffle.x;
        const puffleDy = player.y - puffle.y;
        const puffleDist = Math.sqrt(puffleDx*puffleDx + puffleDy*puffleDy);
        
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
        }, 800); // Duração da animação CSS
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
        snowball.style.transform = 'scale(0.5)';
        gameWorld.appendChild(snowball);
        
        // Forçar o browser a aplicar o estado inicial antes de animar
        requestAnimationFrame(() => {
            snowball.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(1)`;
            snowball.style.opacity = '0';
        });

        setTimeout(() => {
            snowball.remove();
        }, 500); // Duração da transição CSS
    }
    
    function handleChat() {
        const message = prompt("O que queres dizer?");
        if (!message) return;

        const chatBubble = gameState.player.element.querySelector('.chat-bubble');
        chatBubble.textContent = message;
        chatBubble.classList.add('visible');
        
        setTimeout(() => {
            chatBubble.classList.remove('visible');
        }, 4000);
    }

    function handleChangeColor(color) {
        document.documentElement.style.setProperty('--penguin-body-color', color);
    }


    // --- INICIALIZAÇÃO ---
    function init() {
        // Esconde o ecrã de carregamento
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1500);

        createPlayer();
        createPuffle();
        changeRoom(gameState.currentRoom);
        
        // Event Listeners
        gameWorld.addEventListener('click', (e) => {
            const worldRect = gameWorld.getBoundingClientRect();
            gameState.player.targetX = e.clientX - worldRect.left - (gameState.player.element.offsetWidth / 2);
            gameState.player.targetY = e.clientY - worldRect.top - (gameState.player.element.offsetHeight / 2);
        });

        // UI Buttons
        document.getElementById('wave-button').addEventListener('click', handleWave);
        document.getElementById('snowball-button').addEventListener('click', (e) => {
             alert("Agora clica em algum lugar no mundo para atirar a bola de neve!");
             gameWorld.addEventListener('click', handleThrowSnowball, { once: true });
        });
        document.getElementById('chat-button').addEventListener('click', handleChat);

        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'w') handleWave();
            if (e.key.toLowerCase() === 'c') handleChat();
            if (e.key.toLowerCase() === 't') document.getElementById('snowball-button').click();
        });
        
        // Color Picker
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                handleChangeColor(swatch.dataset.color);
            });
        });

        gameLoop();
    }

    init();
});
