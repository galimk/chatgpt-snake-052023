// Global variables and constants
const gridSize = 30;
const gridDimensions = { rows: 30, columns: 30 };
const cellSize = gridSize / gridDimensions.rows;
const initialSnakePosition = { x: Math.floor(gridDimensions.columns / 2), y: Math.floor(gridDimensions.rows / 2) };
const initialSnakeDirection = { x: 0, y: -1 };
const initialSnakeSpeed = 5; // In milliseconds
const initialCatchablePointPosition = { x: Math.floor(Math.random() * gridDimensions.columns), y: Math.floor(Math.random() * gridDimensions.rows) };
const speedIncrement = 1; // Increase the speed by 1 unit after each catch
const maxSpeed = 15; // The maximum allowed speed
let snake = [];
let snakeDirection = { ...initialSnakeDirection };
let snakeSpeed = initialSnakeSpeed;
let catchablePoint = { ...initialCatchablePointPosition };
let isGameRunning = false;
let score = 0;
const collisionTolerance = 5;
let collisionCount = 0;


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
        clearInterval(gameInterval);
        gameInterval = null;
    }

    // Set the initial position of the snake and catchable point
    const centerX = Math.floor(gridDimensions.columns / 2);
    const centerY = Math.floor(gridDimensions.rows / 2);
    snake = [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY },
    ];
    placeCatchablePoint();
    render();
    resetScore();

    // Set the initial direction and speed
    snakeDirection = { x: 1, y: 0 };
    snakeSpeed = initialSnakeSpeed;

    // Start the game loop
    gameInterval = setInterval(gameLoop, 1000 / snakeSpeed);
}

function endGame() {
    if (!gameInterval) {
        return;
    }

    // Clear the game interval
    clearInterval(gameInterval);
    gameInterval = null;

    // Show the final score
    const scoreElement = document.getElementById('score');
    alert(`Game Over! Your final score is: ${scoreElement.textContent}`);

    // Reset the grid
    snake = [];
    catchablePoint = null;
    render();

    resetScore();

    // Set the initial score
    scoreElement.textContent = '0';
}



function handleKeyboardInput(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (snakeDirection.y === 0) {
                snakeDirection.x = 0;
                snakeDirection.y = -1;
            }
            break;
        case 'ArrowDown':
            if (snakeDirection.y === 0) {
                snakeDirection.x = 0;
                snakeDirection.y = 1;
            }
            break;
        case 'ArrowLeft':
            if (snakeDirection.x === 0) {
                snakeDirection.x = -1;
                snakeDirection.y = 0;
            }
            break;
        case 'ArrowRight':
            if (snakeDirection.x === 0) {
                snakeDirection.x = 1;
                snakeDirection.y = 0;
            }
            break;
    }
}

function gameLoop() {
    clearInterval(gameInterval);

    const newHead = {
        x: snake[0].x + snakeDirection.x,
        y: snake[0].y + snakeDirection.y
    };

    // Check if the snake has collided with itself or the grid boundaries
    if (isSnake(newHead) || isOutOfBounds(newHead)) {
        // Increment the collision count
        collisionCount++;

        // End the game if the collision count exceeds the collision tolerance
        if (collisionCount > collisionTolerance) {
            endGame();
            return;
        }
    } else {
        // Reset the collision count if no collision is detected
        collisionCount = 0;

        // Update the snake's position
        snake.unshift(newHead);

        // Remove the tail if the catchable point was not caught
        if (newHead.x === catchablePoint.x && newHead.y === catchablePoint.y) {
            placeCatchablePoint();
            updateScore();
        } else {
            snake.pop();
        }
    }

    // Render the updated game state
    render();

    // Schedule the next game loop iteration
    gameInterval = setInterval(gameLoop, 1000 / snakeSpeed);
}



function isOutOfBounds(position) {
    return (
        position.x < 0 ||
        position.y < 0 ||
        position.x >= gridSize ||
        position.y >= gridSize
    );
}

function updateScore() {
    // Get the current score from the DOM
    const scoreElement = document.getElementById('score');

    // Update the score
    const currentScore = parseInt(scoreElement.textContent, 10);
    scoreElement.textContent = currentScore + 1;
}


function isSnake(position) {
    return snake.some((segment) => segment.x === position.x && segment.y === position.y);
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
    if (catchablePoint) {
        const catchablePointCell = getCell(catchablePoint.x, catchablePoint.y);
        catchablePointCell.classList.add('catchable-point');
    }
}

function resetScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = '0';
}


// Initialize the game
initializeGame();

// Event listeners
const startGameBtn = document.getElementById('start-game-btn');
const endGameBtn = document.getElementById('end-game-btn');

startGameBtn.addEventListener('click', startGame);
endGameBtn.addEventListener('click', endGame);
document.addEventListener('keydown', handleKeyboardInput);
