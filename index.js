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

    // Initialize the snake
    snake = [
        { x: initialSnakePosition.x, y: initialSnakePosition.y },
        { x: initialSnakePosition.x, y: initialSnakePosition.y + 1 },
        { x: initialSnakePosition.x, y: initialSnakePosition.y + 2 },
    ];
    snakeDirection = { ...initialSnakeDirection };
    snakeSpeed = initialSnakeSpeed;

    // Place the catchable point
    placeCatchablePoint();
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

function startGame() { /* ... */ }
function endGame() { /* ... */ }
function handleKeyboardInput(e) { /* ... */ }
function gameLoop() { /* ... */ }

// Event listeners
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('end-game').addEventListener('click', endGame);
document.addEventListener('keydown', handleKeyboardInput);
