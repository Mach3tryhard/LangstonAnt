//javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
var pixels = [];

function ColorPixel(pozx,pozy){
    let pixel = {};
    pixel.x = pozx;
    pixel.y = pozy;

    pixel.getpixel = document.createElement("div");
    pixel.getpixel.style.width = 1 + 'px';
    pixel.getpixel.style.height = 1 + 'px';
    pixel.getpixel.style.borderRadius = '100%';
    pixel.getpixel.style.position = 'absolute';
    pixel.getpixel.style.background = 'black';

    pixel.getpixel.style.left = pixel.x + 'px';
    pixel.getpixel.style.top = pixel.y + 'px';

    document.body.appendChild(pixel.getpixel);
    return pixel;
}

function CreateAnt(pozx,pozy){
    let ant = {};
    ant.x = pozx;
    ant.y = pozy;

    ant.getpixel = document.createElement("div");
    ant.getpixel.style.width = 1 + 'px';
    ant.getpixel.style.height = 1 + 'px';
    ant.getpixel.style.borderRadius = '100%';
    ant.getpixel.style.position = 'absolute';
    ant.getpixel.style.background = 'red';
    ant.getpixel.style.zIndex = 1;

    document.body.appendChild(ant.getpixel);
    return ant;
}

function UpdateMove(ant)
{
    ant.getpixel.style.left = ant.x+'px';
    ant.getpixel.style.top = ant.y+'px';
}

function RemovePixel(ind){
    document.body.removeChild(pixels[ind].getpixel);

    pixels.splice(ind, 1);
}

var ant = CreateAnt(185,90);

var dir = 3;
var step = 0;
function update(){
    step+=1;
    var isWhite=true;
    var rmpind =-1;
    for(var i=0;i<pixels.length;i++){
        if(pixels[i].x == ant.x && pixels[i].y == ant.y){
            isWhite=false;
            rmpind=i;
        }
    }
    console.log(step);
    if (isWhite) {
        pixels.push(ColorPixel(ant.x,ant.y));
        dir = (dir + 1) % 4;
    } else {
        RemovePixel(rmpind);
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
    UpdateMove(ant);
}

setInterval(update,1);