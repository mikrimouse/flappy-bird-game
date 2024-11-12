const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

// Postavke ptice sa boljom fizikom
const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.5,  // Smanjena gravitacija
    lift: -10,     // Smanjena snaga skoka
    velocity: 0,
    maxVelocity: 8 // Ograničenje brzine kako bi se sprečilo skakanje previsoko
};

let pipes = [];
let score = 0;
let gameActive = false;

// Postavljanje igre u početno stanje
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameActive = true;
    document.getElementById("score").innerText = "Score: " + score;
}

// Kreiranje novih cevi
function createPipe() {
    const gap = 150;
    const pipeWidth = 50;
    const pipeY = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
    pipes.push({ x: canvas.width, y: pipeY, width: pipeWidth, gap: gap });
}

// Ažuriranje pozicije cevi
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 3;
    });
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

// Iscrtavanje cevi
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "#000000";
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipe.gap, pipe.width, canvas.height - pipe.y - pipe.gap);
    });
}

// Provera kolizije
function checkCollision() {
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) return true;

    for (const pipe of pipes) {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
            if (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipe.gap) {
                return true;
            }
        }
    }
    return false;
}

// Iscrtavanje ptice
function drawBird() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Ažuriranje pozicije ptice
function updateBird() {
    bird.velocity += bird.gravity;

    // Ograničavanje maksimalne brzine
    if (bird.velocity > bird.maxVelocity) {
        bird.velocity = bird.maxVelocity;
    }

    bird.y += bird.velocity;
}

// Ažuriranje poena
function updateScore() {
    pipes.forEach(pipe => {
        if (pipe.x + pipe.width === bird.x) {
            score++;
            document.getElementById("score").innerText = "Score: " + score;
        }
    });
}

// Glavna petlja igre
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameActive) return;

    updateBird();
    drawBird();

    if (checkCollision()) {
        gameActive = false;
        alert("Game Over! Your score: " + score);
        document.getElementById("startButton").style.display = "block";
        document.getElementById("gameContainer").style.display = "none";
    }

    updatePipes();
    drawPipes();
    updateScore();

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    requestAnimationFrame(gameLoop);
}

// Detektovanje skoka na pritisak tastera
document.addEventListener("keydown", () => {
    if (gameActive) {
        bird.velocity = bird.lift;
    }
});

// Pokretanje igre
document.getElementById("startButton").addEventListener("click", () => {
    resetGame();
    document.getElementById("startButton").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    gameLoop();
});
