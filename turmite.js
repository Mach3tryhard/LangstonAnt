javascript: (function () {
  var script = document.createElement("script");
  script.onload = function () {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "./build/stats.js";
  document.head.appendChild(script);
})();

import GUI from "./build/lilgui.js";

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const gui = new GUI();
const obj = {
  GridSize: 5,
  Speed: 250,
  SpeedMultiplier: 1,
  States: 2,
  ColorsUsed: 2,
  Play: false,
  Iteration: 0,
};

const settings = gui.addFolder("Settings");
settings.add(obj, "Play");
settings.add(obj, "GridSize", 1, 10, 1);
settings.add(obj, "Speed", 1, 250, 1);
settings.add(obj, "SpeedMultiplier", 1, 100000, 1);
settings.add(obj, "States", 1, 16, 1);
settings.add(obj, "ColorsUsed", 1, 16, 1);
const IterationDisplay = settings.add(obj, "Iteration");

const colorFolder = gui.addFolder("Color Vector");

let colorVector = [
  [0.9, 0.1, 0.3],
  [0.96, 0.51, 0.19],
  [1, 0.88, 0.1],
  [0.75, 0.94, 0.27],
  [0.24, 0.71, 0.29],
  [0.26, 0.83, 0.96],
  [0.26, 0.39, 0.85],
  [0.57, 0.12, 0.71],
  [0.94, 0.2, 0.9],
  [0.66, 0.66, 0.66],
  [1, 1, 1],
  [0.5, 0, 0], // maroon
  [0.6, 0.39, 0.14], // brown
  [0.5, 0.5, 0], // olive
  [0.27, 0.6, 0.56], // teal
  [0, 0, 0.46], // navy
];

let colors = structuredClone(colorVector);

function updateSyncedVector() {
  colors = structuredClone(colorVector);
}

colorVector.forEach((_, index) => {
  colorFolder
    .addColor(colorVector, index)
    .name(`Color ${index + 1}`)
    .onChange(updateSyncedVector);
});

colorFolder.open();
updateSyncedVector();

const ctx = canvas.getContext("2d");
const gridWidth = Math.floor(canvas.width / obj.GridSize);
const gridHeight = Math.floor(canvas.height / obj.GridSize);
const state = new Uint16Array(gridWidth * gridHeight);
const ant = { x: 950, y: 460, dir: 0, state: 0 };

let step = 0;

function UpdateDisplayIteration(afisStep) {
  IterationDisplay.setValue(afisStep);
  IterationDisplay.updateDisplay();
}

const predefinedTurnTable = [
  { state: 0, color: 0, newColor: 1, turn: "R", newState: 0 },
  { state: 0, color: 1, newColor: 1, turn: "R", newState: 1 },
  { state: 1, color: 0, newColor: 0, turn: "N", newState: 0 },
  { state: 1, color: 1, newColor: 0, turn: "N", newState: 1 },
];
for (let i = 0; i < gridWidth * gridHeight; i++) {
  state[i] = 0;
}

function update() {
  step += 1;
  const col = Math.floor(ant.x / obj.GridSize);
  const row = Math.floor(ant.y / obj.GridSize);
  const index = row * gridWidth + col;

  // Use the ant's internal state rather than the cell's state for the rule lookup.
  const currentState = ant.state;
  const currentColor = state[index]; // cell stores only a color

  // Find the corresponding rule from the predefinedTurnTable
  const rule = predefinedTurnTable.find(
    (r) => r.state === currentState && r.color === currentColor,
  );

  if (!rule) return; // If no matching rule is found, skip the step

  // Update the cell's color and the ant's internal state separately.
  state[index] = rule.newColor; // store new color in cell
  ant.state = rule.newState; // update ant's internal state

  // Draw the new color.
  const [r, g, b] = colors[rule.newColor].map((v) => Math.round(v * 255));
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(ant.x, ant.y, obj.GridSize, obj.GridSize);

  // Update ant direction based on the rule.
  switch (rule.turn) {
    case "L":
      ant.dir = (ant.dir + 3) % 4; // turn left
      break;
    case "R":
      ant.dir = (ant.dir + 1) % 4; // turn right
      break;
    case "U":
      ant.dir = (ant.dir + 2) % 4; // U-turn (reverse direction)
      break;
    case "N":
      // No turn, keep moving in the same direction
      break;
  }

  // Update the ant's position based on its direction.
  switch (ant.dir) {
    case 0:
      ant.y -= obj.GridSize; // up
      break;
    case 1:
      ant.x += obj.GridSize; // right
      break;
    case 2:
      ant.y += obj.GridSize; // down
      break;
    case 3:
      ant.x -= obj.GridSize; // left
      break;
  }

  // Ensure the ant wraps around the canvas edges.
  ant.x = (ant.x + canvas.width) % canvas.width;
  ant.y = (ant.y + canvas.height) % canvas.height;

  // Update iteration display.
  if (step > 1000000000 && step % 1000000 == 0)
    UpdateDisplayIteration(step / 1000000000 + "B");
  else if (step > 1000000 && step % 1000 == 0)
    UpdateDisplayIteration(step / 1000000 + "M");
  else if (step > 1000 && step % 1000 == 0)
    UpdateDisplayIteration(step / 1000 + "K");
  else if (step > 0 && step < 1000) UpdateDisplayIteration(step);
}

function MaiMultPeMilisecunda() {
  for (let i = 1; i <= obj.SpeedMultiplier; i++) {
    if (obj.Play) {
      update();
    }
  }
  setTimeout(MaiMultPeMilisecunda, 1000 / obj.Speed);
}

MaiMultPeMilisecunda();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
