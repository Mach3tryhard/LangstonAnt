const canvas = document.createElement("canvas");
canvas.width = 1900;
canvas.height = 900;
document.body.appendChild(canvas);

var pixels = [];
var step = 0;

const map = new Map();
map.set('#000000', 0);
map.set('#ffffff', 1);
map.set('#1e99e1', 2);
map.set('#f641b2', 3);

var colors = ["#000000","#ffffff","#1e99e1","#f641b2"];
var extdir = "LLRR";
const ctx = canvas.getContext("2d");

function ColorPixel(pozx, pozy, cycle){
    let pixel = {};
    pixel.x = pozx;
    pixel.y = pozy;
    pixel.cycle = cycle;

    ctx.fillStyle = colors[cycle];
    ctx.fillRect(pozx, pozy, 5, 5);

    return pixel;
}

function getPixelColorHex(ctx, x, y) {
	const pixelData = ctx.getImageData(x, y, 1, 1).data;

	const r = pixelData[0].toString(16).padStart(2, "0");
	const g = pixelData[1].toString(16).padStart(2, "0");
	const b = pixelData[2].toString(16).padStart(2, "0");

	return `#${r}${g}${b}`;
}


function CreateAnt(pozx, pozy){
    let ant = {};
    ant.x = pozx;
    ant.y = pozy;
    ant.dir = 3;

    return ant;
}

function RemovePixel(ind){
    pixels.splice(ind, 1);
}

var ant = CreateAnt(950, 460);

function update(){
    step += 1;
    var CurrentColor;

    var FindColor = getPixelColorHex(ctx,ant.x,ant.y);
    CurrentColor= map.get(FindColor);

    console.log(step);
    ctx.fillStyle = colors[(CurrentColor+1)%extdir.length];
    ctx.fillRect(ant.x, ant.y, 5, 5);
    if (extdir[CurrentColor] == "L") ant.dir = (ant.dir + 1) % 4;
    if (extdir[CurrentColor] == "R") ant.dir = (ant.dir + 3) % 4;

    switch (ant.dir) {
        case 0:
        ant.x+=5;
        break;
        case 1:
        ant.y+=5;
        break;
        case 2:
        ant.x-=5;
        break;
        case 3:
        ant.y-=5;
        break;
    }
    setTimeout(update, 0);
}

update();
