var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;
var h = window.innerHeight;
var dpr = window.devicePixelRatio;
canvas.width = size*dpr;
canvas.height = h*dpr;
context.scale(dpr, dpr);
context.lineJoin = 'bevel';

var line, dot,
    odd = false, 
    lines = [],
    gap = size / 12,
    vgap = h/8;

for(var y = vgap/2; y <= h; y+= vgap) {
  odd = !odd;
  line = [];
  for(var x = gap / 4; x <= size; x+= gap) {
    dot = {x: x + (odd ? gap/2 : 0), y: y};
    line.push({
      x: x + (Math.random()*.8 - .4) * gap  + (odd ? gap/2 : 0),
      y: y + (Math.random()*.8 - .4) * gap
    });
    context.fill();
  }
  lines.push(line);
}

function drawTriangle(pointA, pointB, pointC) {
  context.beginPath();
  context.moveTo(pointA.x, pointA.y);
  context.lineTo(pointB.x, pointB.y);
  context.lineTo(pointC.x, pointC.y);
  context.lineTo(pointA.x, pointA.y);
  context.closePath();
  context.strokeStyle = 'rgba(125, 125, 125, 0.6)';
  var gray = (10 + Math.floor(Math.random()*5)).toString(16);
  var r = (Math.floor(Math.random()*4)).toString(16);
  var g = (Math.floor(Math.random()*10)).toString(16);
  var b = (Math.floor(Math.random()*16)).toString(16);
  var a = (Math.floor(Math.random()*6)).toString(16)
  context.fillStyle = '#' + gray + gray + gray; 
  context.fill();
  
  context.stroke();
}

var dotLine;
odd = true;

for(var y = 0; y < lines.length - 1; y++) {
  odd = !odd;
  dotLine = [];
  for(var i = 0; i < lines[y].length; i++) {
    dotLine.push(odd ? lines[y][i]   : lines[y+1][i]);
    dotLine.push(odd ? lines[y+1][i] : lines[y][i]);
  }
  for(var i = 0; i < dotLine.length - 2; i++) {
    drawTriangle(dotLine[i], dotLine[i+1], dotLine[i+2]);
  }
}

