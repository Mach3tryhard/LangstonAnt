const canvas = document.createElement("canvas");
canvas.width = 1900;
canvas.height = 900;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

// Initialize state grid
const gridWidth = canvas.width / 5;
const gridHeight = canvas.height / 5;
const state = new Uint8Array(gridWidth * gridHeight);

// Colors and directions
const colors = ["#000000", "#ffffff", "#1e99e1", "#f641b2"];
const extdir = "LLRR";

// Create an ant
const ant = { x: 950, y: 460, dir: 3 };

let step = 0;

function update() {
  step += 1;

  // Calculate grid index
  const col = ant.x / 5;
  const row = ant.y / 5;
  const index = row * gridWidth + col;

  console.log(step);

  // Get and update the current color cycle
  const CurrentColor = state[index];
  const nextColor = (CurrentColor + 1) % colors.length;
  state[index] = nextColor;

  // Update canvas
  ctx.fillStyle = colors[nextColor];
  ctx.fillRect(ant.x, ant.y, 5, 5);

  // Adjust ant's direction
  if (extdir[CurrentColor] === "L") {
    ant.dir = (ant.dir + 1) % 4;
  } else if (extdir[CurrentColor] === "R") {
    ant.dir = (ant.dir + 3) % 4;
  }

  // Move the ant
  switch (ant.dir) {
    case 0: ant.x += 5; break; // right
    case 1: ant.y += 5; break; // down
    case 2: ant.x -= 5; break; // left
    case 3: ant.y -= 5; break; // up
  }

  setTimeout(update, 0);
}

update();
