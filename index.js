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

let gameIntervalId;

function startGame() {
    // Prevent multiple game loops from starting
    if (isGameRunning) return;

    // Set game state to running
    isGameRunning = true;

    // Reset and update the score
    score = 0;
    scoreElement.textContent = score;

    // Initialize the game
    initializeGame();

    // Start the game loop
    gameIntervalId = setInterval(gameLoop, snakeSpeed);
}

function endGame() {
    // Set game state to not running
    isGameRunning = false;

    // Clear the game loop interval
    clearInterval(gameIntervalId);

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


// Event listeners
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('end-game').addEventListener('click', endGame);
document.addEventListener('keydown', handleKeyboardInput);
