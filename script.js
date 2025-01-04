const canvas = document.createElement("canvas");
canvas.width = 1920;
canvas.height = 1000;
document.body.appendChild(canvas);

var pixels = [];
var colors = [
  "red",
  "white",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "blue",
  "fuchsia",
  "aqua",
  "lime",
  "maroon",
  "navy",
  "olive",
  "silver",
  "teal",
];
var extdir = "RL";
const ctx = canvas.getContext("2d");
function ColorPixel(pozx, pozy, cycle) {
  let pixel = {};
  pixel.x = pozx;
  pixel.y = pozy;
  pixel.cycle = cycle;

  ctx.fillStyle = colors[cycle];
  ctx.fillRect(pozx, pozy, 1, 1);

  return pixel;
}

function CreateAnt(pozx, pozy) {
  let ant = {};
  ant.x = pozx;
  ant.y = pozy;

  return ant;
}

function RemovePixel(ind) {
  pixels.splice(ind, 1);
}

var ant = CreateAnt(185, 90);

var dir = 3;
var step = 0;

function update() {
  step += 1;
  var CurrentColor = -1;
  var rmpind = -1;
  for (var i = 0; i < pixels.length; i++) {
    if (pixels[i].x == ant.x && pixels[i].y == ant.y) {
      CurrentColor = pixels[i].cycle;
      rmpind = i;
    }
  }
  console.log(step);
  if (CurrentColor == -1) {
    pixels.push(ColorPixel(ant.x, ant.y, 1));
    if (extdir[0] == "L") dir = (dir + 1) % 4;
    if (extdir[0] == "R") dir = (dir + 3) % 4;
  } else if (extdir[CurrentColor] == "L") {
    pixels[rmpind].cycle += 1;
    if (pixels[rmpind].cycle > extdir.length - 1) {
      ctx.fillStyle = "black";
      ctx.fillRect(pixels[rmpind].x, pixels[rmpind].y, 1, 1);
      RemovePixel(rmpind);
    } else {
      ctx.fillStyle = colors[pixels[rmpind].cycle];
      ctx.fillRect(pixels[rmpind].x, pixels[rmpind].y, 1, 1);
    }
    dir = (dir + 1) % 4;
  } else if (extdir[CurrentColor] == "R") {
    pixels[rmpind].cycle += 1;
    if (pixels[rmpind].cycle > extdir.length - 1) {
      ctx.fillStyle = "black";
      ctx.fillRect(pixels[rmpind].x, pixels[rmpind].y, 1, 1);
      RemovePixel(rmpind);
    } else {
      ctx.fillStyle = colors[pixels[rmpind].cycle];
      ctx.fillRect(pixels[rmpind].x, pixels[rmpind].y, 1, 1);
    }
    dir = (dir + 3) % 4;
  }
  switch (dir) {
    case 0:
      ant.x++;
      break;
    case 1:
      ant.y++;
      break;
    case 2:
      ant.x--;
      break;
    case 3:
      ant.y--;
      break;
  }
  setTimeout(update, 0);
}
update();
