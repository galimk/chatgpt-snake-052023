// Global variables and constants
const gridSize = 20;
const gridDimensions = { rows: 20, columns: 20 };
const cellSize = gridSize / gridDimensions.rows;
const initialSnakePosition = { x: Math.floor(gridDimensions.columns / 2), y: Math.floor(gridDimensions.rows / 2) };
const initialSnakeDirection = { x: 0, y: -1 };
const initialSnakeSpeed = 100; // In milliseconds
const initialCatchablePointPosition = { x: Math.floor(Math.random() * gridDimensions.columns), y: Math.floor(Math.random() * gridDimensions.rows) };

let snake = [];
let snakeDirection = { ...initialSnakeDirection };
let snakeSpeed = initialSnakeSpeed;
let catchablePoint = { ...initialCatchablePointPosition };
let isGameRunning = false;
let score = 0;

const gridElement = document.getElementById("grid");
const scoreElement = document.getElementById("score");


function initializeGame() {
    // Create the grid
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${gridDimensions.columns}, ${cellSize}rem)`;
    for (let i = 0; i < gridDimensions.rows * gridDimensions.columns; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        gridElement.appendChild(cell);
    }
}

function placeCatchablePoint() {
    while (true) {
        const x = Math.floor(Math.random() * gridDimensions.columns);
        const y = Math.floor(Math.random() * gridDimensions.rows);
        const isCellOccupiedBySnake = snake.some((snakePart) => snakePart.x === x && snakePart.y === y);

        if (!isCellOccupiedBySnake) {
            catchablePoint = { x, y };
            break;
        }
    }
}

let gameInterval;

function startGame() {
    if (gameInterval) {
        return;
    }

    // Set the initial position of the snake and catchable point
    snake = [{ x: Math.floor(gridDimensions.columns / 2), y: Math.floor(gridDimensions.rows / 2) }];
    placeCatchablePoint();
    render();

    // Set the initial direction and speed
    snakeDirection = { x: 1, y: 0 };
    snakeSpeed = initialSnakeSpeed;

    // Start the game loop
    gameInterval = setInterval(gameLoop, 1000 / snakeSpeed);
}

function endGame() {
    // Set game state to not running
    isGameRunning = false;

    // Clear the game loop interval
    clearInterval(gameInterval);

    // Display a message to the user
    alert(`Game Over! Your final score is: ${score}`);
}

function handleKeyboardInput(e) {
    if (!isGameRunning) return;

    switch (e.key) {
        case 'ArrowUp':
            if (snakeDirection.y !== 1) {
                snakeDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (snakeDirection.y !== -1) {
                snakeDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (snakeDirection.x !== 1) {
                snakeDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (snakeDirection.x !== -1) {
                snakeDirection = { x: 1, y: 0 };
            }
            break;
    }
}

function gameLoop() {
    // Calculate the new head position
    const newHeadPosition = {
        x: snake[0].x + snakeDirection.x,
        y: snake[0].y + snakeDirection.y,
    };

    // Check for collisions (walls or snake's body)
    if (
        newHeadPosition.x < 0 ||
        newHeadPosition.x >= gridDimensions.columns ||
        newHeadPosition.y < 0 ||
        newHeadPosition.y >= gridDimensions.rows ||
        snake.some((snakePart) => snakePart.x === newHeadPosition.x && snakePart.y === newHeadPosition.y)
    ) {
        endGame();
        return;
    }

    // Add the new head position to the snake array
    snake.unshift(newHeadPosition);

    // Check if the snake has caught the catchable point
    if (newHeadPosition.x === catchablePoint.x && newHeadPosition.y === catchablePoint.y) {
        // Increment the score and update the UI
        score++;
        scoreElement.textContent = score;

        // Place a new catchable point
        placeCatchablePoint();

        // Increase the snake's speed if desired (optional)
    } else {
        // Remove the tail position
        snake.pop();
    }
}

function getCell(x, y) {
    const index = y * gridDimensions.columns + x;
    return gridElement.children[index];
}

function render() {
    // Clear the grid
    gridElement.querySelectorAll('.cell').forEach((cell) => {
        cell.classList.remove('snake', 'catchable-point');
    });

    // Render the snake
    snake.forEach((segment) => {
        const snakeCell = getCell(segment.x, segment.y);
        snakeCell.classList.add('snake');
    });

    // Render the catchable point
    const catchablePointCell = getCell(catchablePoint.x, catchablePoint.y);
    catchablePointCell.classList.add('catchable-point');
}

// Initialize the game
initializeGame();

// Event listeners
const startGameBtn = document.getElementById('start-game-btn');
const endGameBtn = document.getElementById('end-game-btn');

startGameBtn.addEventListener('click', startGame);
endGameBtn.addEventListener('click', endGame);
document.addEventListener('keydown', handleKeyboardInput);
