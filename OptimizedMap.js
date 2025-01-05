javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
const canvas = document.createElement("canvas");
canvas.width = 1900;
canvas.height = 900;
document.body.appendChild(canvas);

const gui = new GUI();
const obj = { 
    GridSize: 1,
    Speed: 250,
    SpeedMultiplier:1,
    ADN:"LLRR",
    Play:false,
    Iteration:0,
};

const fisier3 = gui.addFolder('Settings');
fisier3.add(obj,'Play');
fisier3.add(obj,'ADN').onChange(() => {
  extdir = obj.ADN;
});
fisier3.add(obj,'GridSize',1,10,1);
fisier3.add(obj,'Speed',1,250,1);
fisier3.add(obj,'SpeedMultiplier',1,100000,1);
const IterationDisplay = fisier3.add(obj,'Iteration');

const ctx = canvas.getContext("2d");

const gridWidth = canvas.width / obj.GridSize;
const gridHeight = canvas.height / obj.GridSize;
const state = new Uint8Array(gridWidth * gridHeight);

const colors = ["#000000", "#ffffff", "#1e99e1", "#f641b2","red","blue","green","yellow","orange","brown","teal","aqua","Cornsilk","olive","magenta","pink"];
var extdir = obj.ADN;

const ant = { x: 950, y: 460, dir: 3 };

let step = 0;

function UpdateDisplayIteration(afisStep){
  IterationDisplay.setValue(afisStep);
  IterationDisplay.updateDisplay();
}

function update() {
  step += 1;

  const col = ant.x / obj.GridSize;
  const row = ant.y / obj.GridSize;
  const index = row * gridWidth + col;
  if(step>1000000000  && step%1000000==0)
    UpdateDisplayIteration(step/1000000000+"B");
  else
  if(step>1000000  && step%1000==0)
    UpdateDisplayIteration(step/1000000+"M");
  else
  if(step>1000 && step%1000==0)
    UpdateDisplayIteration(step/1000+"K");
  else
  if(step>0 && step<1000)
    UpdateDisplayIteration(step);

  const CurrentColor = state[index];
  const nextColor = (CurrentColor + 1) % extdir.length;
  state[index] = nextColor;

  ctx.fillStyle = colors[nextColor];
  ctx.fillRect(ant.x, ant.y, obj.GridSize, obj.GridSize);

  if (extdir[CurrentColor] === "L") {
    ant.dir = (ant.dir + 1) % 4;
  } else if (extdir[CurrentColor] === "R") {
    ant.dir = (ant.dir + 3) % 4;
  }

  switch (ant.dir) {
    case 0: ant.x += obj.GridSize; break;
    case 1: ant.y += obj.GridSize; break;
    case 2: ant.x -= obj.GridSize; break;
    case 3: ant.y -= obj.GridSize; break;
  }

  //setTimeout(update, 0);
}

function MaiMultPeMilisecunda(){
  for(var i=1;i<=obj.SpeedMultiplier;i++){
    if(obj.Play==true){
      update();
    }
  }
  setTimeout(MaiMultPeMilisecunda, 1000/obj.Speed);
}
MaiMultPeMilisecunda();
