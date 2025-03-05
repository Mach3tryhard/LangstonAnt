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
  LangstonAnt: function () {
    window.location.href = "langstonant.html";
  },
  MultipleAnts: function () {
    window.location.href = "NAnts.html";
  },
  Turmite: function () {
    window.location.href = "turmite.html";
  },
  HexagonalAnt: function () {
    window.location.href = "hexant.html";
  },
};
const fisier6 = gui.addFolder("Type");
fisier6.add(obj, "LangstonAnt");
fisier6.add(obj, "Turmite");
fisier6.add(obj, "HexagonalAnt");
fisier6.add(obj, "MultipleAnts");
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
  [0.9019607843137255, 0.09803921568627451, 0.29411764705882354],
  [0.9607843137254902, 0.5098039215686274, 0.19215686274509805],
  [1, 0.8823529411764706, 0.09803921568627451],
  [0.7490196078431373, 0.9372549019607843, 0.27058823529411763],
  [0.23529411764705882, 0.7058823529411765, 0.29411764705882354],
  [0.25882352941176473, 0.8313725490196079, 0.9568627450980393],
  [0.2627450980392157, 0.38823529411764707, 0.8470588235294118],
  [0.5686274509803921, 0.11764705882352941, 0.7058823529411765],
  [0.9411764705882353, 0.19607843137254902, 0.9019607843137255],
  [0.6627450980392157, 0.6627450980392157, 0.6627450980392157],
  [1, 1, 1],
  [0.5019607843137255, 0, 0],
  [0.6039215686274509, 0.38823529411764707, 0.1411764705882353],
  [0.5019607843137255, 0.5019607843137255, 0],
  [0.27450980392156865, 0.6, 0.5647058823529412],
  [0, 0, 0.4588235294117647],
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
const ant = {x: Math.floor(window.innerWidth/2), y: Math.floor(window.innerHeight/2), dir: 0, state: 0 };

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

  const currentState = ant.state;
  const currentColor = state[index];

  const rule = predefinedTurnTable.find(
    (r) => r.state === currentState && r.color === currentColor,
  );
  if (!rule) return;

  state[index] = rule.newColor;
  ant.state = rule.newState;

  const [r, g, b] = colors[rule.newColor].map((v) => Math.round(v * 255));
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(ant.x, ant.y, obj.GridSize, obj.GridSize);

  switch (rule.turn) {
    case "L":
      ant.dir = (ant.dir + 3) % 4;
      break;
    case "R":
      ant.dir = (ant.dir + 1) % 4;
      break;
    case "U":
      ant.dir = (ant.dir + 2) % 4;
      break;
    case "N":
      break;
  }

  switch (ant.dir) {
    case 0:
      if (ant.x + obj.GridSize < canvas.width) ant.x += obj.GridSize;
      //else obj.Play = false;
      break;
    case 1:
      if (ant.y + obj.GridSize < canvas.height) ant.y += obj.GridSize;
      //else obj.Play = false;
      break;
    case 2:
      if (ant.x - obj.GridSize >= 0) ant.x -= obj.GridSize;
      //else obj.Play = false;
      break;
    case 3:
      if (ant.y - obj.GridSize >= 0) ant.y -= obj.GridSize;
      //else obj.Play = false;
      break;
  }

  ant.x = (ant.x + canvas.width) % canvas.width;
  ant.y = (ant.y + canvas.height) % canvas.height;

  if (step > 1000000000 && step % 1000000 == 0)
    UpdateDisplayIteration(step / 1000000000 + "B");
  else if (step > 1000000 && step % 1000 == 0)
    UpdateDisplayIteration(step / 1000000 + "M");
  else if (step > 1000 && step % 1000 == 0)
    UpdateDisplayIteration(step / 1000 + "K");
  else if (step > 0 && step <= 1000) UpdateDisplayIteration(step);
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
