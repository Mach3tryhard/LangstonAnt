(function () {
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
  ZoomLevel: 5,
  Speed: 60,
  SpeedMultiplier: 1,
  ADN: "L2NNL1L2L1",
  Play: false,
  Iteration: 0,
  LangstonAnt: function () {
    window.location.href = "langstonant.html";
  },
  Turmite: function () {
    window.location.href = "turmite.html";
  },
  HexagonalAnt: function () {
    window.location.href = "hexant.html";
  },
};

const directions = [
  { q: 1, r: 0 }, 
  { q: 0, r: 1 },
  { q: -1, r: 1 },
  { q: -1, r: 0 }, 
  { q: 0, r: -1 }, 
  { q: 1, r: -1 }, 
];

function parseADN(adn) {
  const commands = [];
  for (let i = 0; i < adn.length; i++) {
    const char = adn[i];
    if (char === 'L' || char === 'R') {
      if (i + 1 < adn.length && ['1', '2'].includes(adn[i + 1])) {
        commands.push(char + adn[i + 1]);
        i++;
      } else {
        commands.push(char);
      }
    } else {
      commands.push(char);
    }
  }
  return commands;
}

let extdir = parseADN(obj.ADN);
const state = new Map();
const ant = { q: 0, r: 0, dir: 0 };

const fisier6 = gui.addFolder("Type");
fisier6.add(obj, "LangstonAnt");
fisier6.add(obj, "Turmite");
fisier6.add(obj, "HexagonalAnt");
const fisier3 = gui.addFolder("Settings");
fisier3.add(obj, "Play");
fisier3.add(obj, "ADN").onChange(() => {
  extdir = parseADN(obj.ADN);
});
const gridSizeControl = fisier3.add(obj, "ZoomLevel", 1, 20).onChange(() => redrawGrid());
fisier3.add(obj, "Speed", 1, 120, 1);
fisier3.add(obj, "SpeedMultiplier", 1, 1000, 1);
const IterationDisplay = fisier3.add(obj, "Iteration");

const colorFolder = gui.addFolder("Color Vector");
let colorVector = [
  [0.902, 0.098, 0.294], [0.961, 0.510, 0.192],
  [1.000, 0.882, 0.098], [0.749, 0.937, 0.271],
  [0.235, 0.706, 0.294], [0.259, 0.831, 0.957],
  [0.263, 0.388, 0.847], [0.569, 0.118, 0.706],
  [0.941, 0.196, 0.902], [0.663, 0.663, 0.663],
  [1.000, 1.000, 1.000], [0.502, 0.000, 0.000],
  [0.604, 0.388, 0.141], [0.502, 0.502, 0.000],
  [0.275, 0.600, 0.565], [0.000, 0.000, 0.459]
];

let colors = structuredClone(colorVector);
function updateSyncedVector() {
  colors = structuredClone(colorVector);
}
colorVector.forEach((_, index) => {
  colorFolder.addColor(colorVector, index)
    .name(`Color ${index + 1}`)
    .onChange(updateSyncedVector);
});
colorFolder.open();
updateSyncedVector();

const ctx = canvas.getContext("2d");

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let offsetX = 0;
let offsetY = 0;

canvas.style.cursor = 'grab';
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    offsetX += dx;
    offsetY += dy;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    redrawGrid();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
});

/*function axialToPixel(q, r) {
  const size = obj.ZoomLevel;
  return {
    x: offsetX + canvas.width/2 + size * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r),
    y: offsetY + canvas.height/2 + size * 1.5 * r
  };
}*/

const viewFolder = gui.addFolder("View");
viewFolder.add({resetView: () => {
  offsetX = 0;
  offsetY = 0;
  redrawGrid();
}}, 'resetView').name("Reset View");

function redrawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  state.forEach((colorIndex, key) => {
    const [q, r] = key.split(',').map(Number);
    const {x, y} = axialToPixel(q, r);
    if (x > -obj.ZoomLevel*2 && x < canvas.width + obj.ZoomLevel*2 && 
        y > -obj.ZoomLevel*2 && y < canvas.height + obj.ZoomLevel*2) {
      drawHexOnContext(tempCtx, q, r, colorIndex);
    }
  });
  
  drawHexOnContext(tempCtx, ant.q, ant.r, state.get(`${ant.q},${ant.r}`) || 0);
  ctx.drawImage(tempCanvas, 0, 0);
}

function axialToPixel(q, r) {
  const size = obj.ZoomLevel;
  const hexWidth = size * Math.sqrt(3);
  const hexHeight = size * 1.5;
  
  return {
    x: offsetX + canvas.width/2 + hexWidth * (q + r/2),
    y: offsetY + canvas.height/2 + hexHeight * r
  };
}

function drawHexOnContext(context, q, r, colorIndex) {
  const size = obj.ZoomLevel;
  const {x, y} = axialToPixel(q, r);
  
  const [rVal, gVal, bVal] = colorVector[colorIndex % colorVector.length];
  const color = `rgb(${Math.round(rVal * 255)},${Math.round(gVal * 255)},${Math.round(bVal * 255)})`;

  context.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3 + Math.PI/6;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.fillStyle = color;
  context.fill();
}

/*function drawHexOnContext(context, q, r, colorIndex) {
  const safeIndex = colorIndex % colorVector.length;
  const [rVal, gVal, bVal] = colorVector[safeIndex];
  const color = `rgb(${Math.round(rVal * 255)},${Math.round(gVal * 255)},${Math.round(bVal * 255)})`;
  
  const {x, y} = axialToPixel(q, r);
  context.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    const px = x + obj.ZoomLevel * Math.cos(angle);
    const py = y + obj.ZoomLevel * Math.sin(angle);
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.fillStyle = color;
  context.fill();
}*/

function drawHex(q, r, colorIndex) {
  drawHexOnContext(ctx, q, r, colorIndex);
}

const commandDeltas = {
  'L1': 1, 'L2': 2, 'N': 0,
  'U': 3, 'R1': 5, 'R2': 4
};

drawHex(ant.q, ant.r, 0);
state.set(`${ant.q},${ant.r}`, 0);

function update() {
  const key = `${ant.q},${ant.r}`;
  const currentColor = state.get(key) || 0;
  
  const commandIndex = currentColor % extdir.length;
  const command = extdir[commandIndex] || 'N';
  const delta = commandDeltas[command] || 0;

  const nextColor = (currentColor + 1) % extdir.length;
  state.set(key, nextColor);
  drawHex(ant.q, ant.r, nextColor);

  ant.dir = (ant.dir + delta) % 6;
  const dir = directions[ant.dir];
  ant.q += dir.q;
  ant.r += dir.r;

  obj.Iteration++;
  IterationDisplay.updateDisplay();
}

function animate() {
  if (obj.Play) {
    for (let i = 0; i < obj.SpeedMultiplier; i++) update();
  }
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawGrid();
});