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
  GridSize: 1,
  Speed: 250,
  SpeedMultiplier: 1,
  ADN: "LLRR",
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
const fisier3 = gui.addFolder("Settings");
fisier3.add(obj, "Play");
fisier3.add(obj, "ADN").onChange(() => {
  extdir = obj.ADN;
  gridSizeControl.disable(value);
  adnControl.disable(value);
  colorControls.forEach((control) => control.disable(value));
});
fisier3.add(obj, "GridSize", 1, 10, 1);
fisier3.add(obj, "Speed", 1, 250, 1);
fisier3.add(obj, "SpeedMultiplier", 1, 100000, 1);
const IterationDisplay = fisier3.add(obj, "Iteration");

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
  console.log("Updated Synced Vector:", colors);
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
const state = new Uint8Array(gridWidth * gridHeight);

var extdir = obj.ADN;

const ant = { x: window.innerWidth / 2, y: window.innerHeight / 2, dir: 3 };

let step = 0;

function UpdateDisplayIteration(afisStep) {
  IterationDisplay.setValue(afisStep);
  IterationDisplay.updateDisplay();
}

function update() {
  step += 1;

  const col = Math.floor(ant.x / obj.GridSize);
  const row = Math.floor(ant.y / obj.GridSize);
  const index = row * gridWidth + col;

  if (step > 1000000000 && step % 1000000 == 0)
    UpdateDisplayIteration(step / 1000000000 + "B");
  else if (step > 1000000 && step % 1000 == 0)
    UpdateDisplayIteration(step / 1000000 + "M");
  else if (step > 1000 && step % 1000 == 0)
    UpdateDisplayIteration(step / 1000 + "K");
  else if (step > 0 && step <= 1000) UpdateDisplayIteration(step);

  const CurrentColor = state[index];
  const nextColor = (CurrentColor + 1) % extdir.length;
  state[index] = nextColor;
  const [r, g, b] = colors[nextColor].map((v) => Math.round(v * 255));
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

  ctx.fillRect(ant.x, ant.y, obj.GridSize, obj.GridSize);

  if (extdir[CurrentColor] === "L") {
    ant.dir = (ant.dir + 1) % 4;
  } else if (extdir[CurrentColor] === "R") {
    ant.dir = (ant.dir + 3) % 4;
  } else if (extdir[CurrentColor] === "U") {
    ant.dir = (ant.dir + 2) % 4;
  } else if (extdir[CurrentColor] === "N") {
    ant.dir = (ant.dir + 0) % 4;
  }

  switch (ant.dir) {
    case 0:
      ant.x += obj.GridSize;
      break;
    case 1:
      ant.y += obj.GridSize;
      break;
    case 2:
      ant.x -= obj.GridSize;
      break;
    case 3:
      ant.y -= obj.GridSize;
      break;
  }
}

function MaiMultPeMilisecunda() {
  for (var i = 1; i <= obj.SpeedMultiplier; i++) {
    if (obj.Play == true) {
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
