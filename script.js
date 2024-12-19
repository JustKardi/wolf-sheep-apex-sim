// Set up the canvas
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Define grid size and number of cells
const gridSize = 20;
const numRows = 30;
const numCols = 30;
canvas.width = numCols * gridSize;
canvas.height = numRows * gridSize;

// Entity arrays
let sheepArray = [];
let wolfArray = [];
let grassArray = [];
let apexPredatorArray = [];

// Create Sheep
function createSheep() {
    return {
        x: Math.floor(Math.random() * numCols),
        y: Math.floor(Math.random() * numRows),
        hungerTimer: 0,
        reproductionTimer: 0
    };
}

// Create Wolf
function createWolf() {
    return {
        x: Math.floor(Math.random() * numCols),
        y: Math.floor(Math.random() * numRows),
        hungerTimer: 0,
        reproductionTimer: 0,
        sheepEaten: 0
    };
}

// Create Apex Predator (Brown)
function createApexPredator() {
    return {
        x: Math.floor(Math.random() * numCols),
        y: Math.floor(Math.random() * numRows),
        hungerTimer: 0,
        reproductionTimer: 0,
        sheepEaten: 0
    };
}

// Create Grass
function createGrass() {
    return {
        x: Math.floor(Math.random() * numCols),
        y: Math.floor(Math.random() * numRows),
        exists: true
    };
}

// Update Sheep
function updateSheep() {
    sheepArray.forEach((sheep, index) => {
        sheep.hungerTimer++;
        sheep.reproductionTimer++;

        // Move sheep randomly
        sheep.x = (sheep.x + Math.floor(Math.random() * 3) - 1 + numCols) % numCols;
        sheep.y = (sheep.y + Math.floor(Math.random() * 3) - 1 + numRows) % numRows;

        // Check for grass
        const grassIndex = grassArray.findIndex(g => g.x === sheep.x && g.y === sheep.y && g.exists);
        if (grassIndex !== -1) {
            grassArray[grassIndex].exists = false;
            sheep.hungerTimer = 0;
        }

        // Starve
        if (sheep.hungerTimer > 10 * 60) {
            sheepArray.splice(index, 1);
        }

        // Reproduce (every 3 seconds)
        if (sheep.reproductionTimer > 1 * 60) {
            sheepArray.push(createSheep());
            sheep.reproductionTimer = 0;
        }
    });
}

// Update Wolves
function updateWolves() {
    wolfArray.forEach((wolf, index) => {
        wolf.hungerTimer++;
        wolf.reproductionTimer++;

        // Move wolves randomly
        wolf.x = (wolf.x + Math.floor(Math.random() * 3) - 1 + numCols) % numCols;
        wolf.y = (wolf.y + Math.floor(Math.random() * 3) - 1 + numRows) % numRows;

        // Check for sheep
        const sheepIndex = sheepArray.findIndex(sheep => sheep.x === wolf.x && sheep.y === wolf.y);
        if (sheepIndex !== -1) {
            sheepArray.splice(sheepIndex, 1);
            wolf.hungerTimer = 0;
            wolf.sheepEaten++;

            // Reproduce after eating 3 sheep
            if (wolf.sheepEaten >= 10) {
                wolfArray.push(createWolf());
                wolf.sheepEaten = 0;
            }
        }

        // Starve (Wolves die after 10 seconds without eating)
        if (wolf.hungerTimer > 5 * 60) {
            wolfArray.splice(index, 1);
        }
    });
}

// Update Apex Predators
// Update Apex Predators
function updateApexPredators() {
    apexPredatorArray.forEach((predator, index) => {
        predator.hungerTimer++;
        predator.reproductionTimer++;

        // Move apex predators randomly
        predator.x = (predator.x + Math.floor(Math.random() * 3) - 1 + numCols) % numCols;
        predator.y = (predator.y + Math.floor(Math.random() * 3) - 1 + numRows) % numRows;

        // Check for wolves
        const wolfIndex = wolfArray.findIndex(wolf => wolf.x === predator.x && wolf.y === predator.y);
        if (wolfIndex !== -1) {
            wolfArray.splice(wolfIndex, 1);
            predator.hungerTimer = 0;
            predator.sheepEaten++; // Rename this to `wolvesEaten` for clarity if preferred

            // Reproduce after eating 5 wolves
            if (predator.sheepEaten >= 12) {
                apexPredatorArray.push(createApexPredator());
                predator.sheepEaten = 0;
            }
        }

        // Starve (Apex predator dies after 15 seconds without eating)
        if (predator.hungerTimer > 10 * 60) {
            apexPredatorArray.splice(index, 1);
        }
    });
}


// Grow Grass
function growGrass() {
    grassArray.forEach(grass => {
        if (!grass.exists && Math.random() < 0.02) { // 5% chance to regrow grass
            grass.exists = true;
        }
    });
}

// Draw Sheep
function drawSheep() {
    ctx.fillStyle = 'blue';
    sheepArray.forEach(sheep => {
        ctx.fillRect(sheep.x * gridSize, sheep.y * gridSize, gridSize, gridSize);
    });
}

// Draw Wolves
function drawWolves() {
    ctx.fillStyle = 'red';
    wolfArray.forEach(wolf => {
        ctx.fillRect(wolf.x * gridSize, wolf.y * gridSize, gridSize, gridSize);
    });
}

// Draw Apex Predators (Brown)
function drawApexPredators() {
    ctx.fillStyle = 'cyan';
    apexPredatorArray.forEach(predator => {
        ctx.fillRect(predator.x * gridSize, predator.y * gridSize, gridSize, gridSize); // Normal size
    });
}

// Draw Grass
function drawGrass() {
    ctx.fillStyle = 'green';
    grassArray.forEach(grass => {
        if (grass.exists) {
            ctx.fillRect(grass.x * gridSize, grass.y * gridSize, gridSize, gridSize);
        }
    });
}

// Initialize Entities
function initializeEntities() {
    // Add sheep
    for (let i = 0; i < 20; i++) {
        sheepArray.push(createSheep());
    }

    // Add wolves
    for (let i = 0; i < 10; i++) {
        wolfArray.push(createWolf());
    }

    // Add apex predators
    for (let i = 0; i < 2; i++) { // Only 2 apex predators
        apexPredatorArray.push(createApexPredator());
    }

    // Add grass
    for (let i = 0; i < numCols * numRows / 4; i++) { // Grass spread across the grid
        grassArray.push(createGrass());
    }
}

// Update Simulation
function updateEntities() {
    updateSheep();
    updateWolves();
    updateApexPredators(); // Update Apex Predators
    growGrass(); // Grow grass periodically
}

// Draw Simulation
function drawEntities() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for the next frame
    drawGrass();
    drawSheep();
    drawWolves();
    drawApexPredators(); // Draw apex predators
}

// Main Game Loop
function gameLoop() {
    updateEntities();
    drawEntities();
    requestAnimationFrame(gameLoop); // Call the game loop repeatedly
}

// Start Simulation
initializeEntities();
gameLoop();

