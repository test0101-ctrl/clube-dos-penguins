document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player-penguin');
    const puffle = document.getElementById('puffle');
    const world = document.getElementById('game-world');
    const iceShop = document.getElementById('ice-shop');

    // Posição inicial do pinguim e do puffle
    let playerPos = { x: 350, y: 250 };
    let pufflePos = { x: 300, y: 300 };

    const speed = 10; // Velocidade de movimento do pinguim
    const worldBounds = {
        width: world.offsetWidth,
        height: world.offsetHeight
    };
    const playerSize = {
        width: player.offsetWidth,
        height: player.offsetHeight
    };

    // Função para atualizar a posição do pinguim no ecrã
    function updatePlayerPosition() {
        player.style.left = playerPos.x + 'px';
        player.style.top = playerPos.y + 'px';
    }

    // Função para atualizar a posição do puffle (ele segue o pinguim)
    function updatePufflePosition() {
        // O puffle move-se em direção à posição do pinguim
        const dx = playerPos.x - pufflePos.x;
        const dy = playerPos.y - pufflePos.y;
        
        // Apenas se move se estiver a uma certa distância
        if (Math.sqrt(dx*dx + dy*dy) > 60) {
            pufflePos.x += dx * 0.1;
            pufflePos.y += dy * 0.1;
        }

        puffle.style.left = pufflePos.x + 'px';
        puffle.style.top = pufflePos.y + 'px';
    }

    // Ouve as teclas a serem pressionadas
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                playerPos.y = Math.max(0, playerPos.y - speed);
                break;
            case 'ArrowDown':
                playerPos.y = Math.min(worldBounds.height - playerSize.height, playerPos.y + speed);
                break;
            case 'ArrowLeft':
                playerPos.x = Math.max(0, playerPos.x - speed);
                player.classList.add('facing-left'); // Vira para a esquerda
                break;
            case 'ArrowRight':
                playerPos.x = Math.min(worldBounds.width - playerSize.width, playerPos.x + speed);
                player.classList.remove('facing-left'); // Vira para a direita
                break;
        }
        updatePlayerPosition();
    });

    // Mensagem fofa ao clicar na loja
    iceShop.addEventListener('click', () => {
        alert("Olá! Bem-vinda ao Club Fofo! Aqui não se vende nada, mas há muito amor para ti :)");
    });
    
    // Game Loop - para o puffle seguir continuamente
    function gameLoop() {
        updatePufflePosition();
        requestAnimationFrame(gameLoop); // Chama a função no próximo "frame"
    }

    // Inicia tudo
    updatePlayerPosition();
    gameLoop();
});
