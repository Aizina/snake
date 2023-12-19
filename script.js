document.addEventListener("DOMContentLoaded", () => {
    const gameField = document.getElementById("game-field");
    const scoreValue = document.getElementById("score-value");
    const recordValue = document.getElementById("record-value");
    const restartBtn = document.getElementById("restart-btn");

    const fieldSize = 10;
    let snake, score, record, gameInterval, apple, direction, nextDirection;

    function initializeGame() {
        gameField.innerHTML = '';

        // Инициализация змейки
        snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
        direction = 'right';
        nextDirection = 'right';

        // Инициализация яблока
        generateApple();

        // Счет
        score = 0;
        record = localStorage.getItem("snakeRecord") || 0;
        recordValue.textContent = record;

        // Начало игры
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, 500);
        restartBtn.style.display = "none";
    }

    function draw() {
        gameField.innerHTML = '';
        for (let i = 0; i < fieldSize * fieldSize; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            gameField.appendChild(cell);
        }

        const cells = document.querySelectorAll(".cell");
        snake.forEach(segment => {
            const index = (segment.y - 1) * fieldSize + (segment.x - 1);
            cells[index].classList.add("snake");
        });

        const appleIndex = (apple.y - 1) * fieldSize + (apple.x - 1);
        cells[appleIndex].classList.add("apple");
    }

    function generateApple() {
        apple = {
            x: Math.floor(Math.random() * fieldSize) + 1,
            y: Math.floor(Math.random() * fieldSize) + 1
        };

        // Проверка, чтобы яблоко не появилось на змейке
        if (snake.some(segment => segment.x === apple.x && segment.y === apple.y)) {
            generateApple();
        }
    }

    function updateGame() {
        // Обновление направления
        direction = nextDirection;

        // Расчет новой головы
        const newHead = { ...snake[0] };
        if (direction === "right") newHead.x += 1;
        if (direction === "left") newHead.x -= 1;
        if (direction === "up") newHead.y -= 1;
        if (direction === "down") newHead.y += 1;

        // Проверка на столкновение с границами поля
        if (newHead.x < 1 || newHead.x > fieldSize || newHead.y < 1 || newHead.y > fieldSize) {
            endGame();
            return;
        }

        // Проверка на столкновение с самим собой
        if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            endGame();
            return;
        }

        // Добавление новой головы
        snake.unshift(newHead);

        // Проверка на яблоко
        if (newHead.x === apple.x && newHead.y === apple.y) {
            score++;
            updateScore();
            generateApple();
        } else {
            snake.pop(); // Удаление последнего сегмента змейки
        }

        draw();
    }

    function updateScore() {
        scoreValue.textContent = score;
        if (score > record) {
            record = score;
            localStorage.setItem("snakeRecord", record);
            recordValue.textContent = record;
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        restartBtn.style.display = "block";
    }

    document.addEventListener("keydown", event => {
        const key = event.key;
        if (key === "ArrowUp" && direction !== "down") nextDirection = "up";
        if (key === "ArrowDown" && direction !== "up") nextDirection = "down";
        if (key === "ArrowLeft" && direction !== "right") nextDirection = "left";
        if (key === "ArrowRight" && direction !== "left") nextDirection = "right";
    });

    restartBtn.addEventListener("click", initializeGame);

    initializeGame();
});
