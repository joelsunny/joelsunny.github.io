var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;
var dpr = window.devicePixelRatio;
canvas.width = size * dpr;
canvas.height = size * dpr;
context.scale(dpr, dpr);
context.lineWidth = 2;

var randomDisplacement = 5;
var rotateMultiplier = 10;
var offset = 10;
var squareSize = 50;

function draw(width, height) {

  var gradient = context.createLinearGradient(-width/2, -height/2, width, height);

  // Add three color stops
  gradient.addColorStop(0, `rgb(
      ${Math.random()*255},
        ${Math.random()*255},
        ${Math.random()*255})`);

  gradient.addColorStop(.5, `rgb(
      ${Math.random()*255},
        ${Math.random()*255},
        ${0})`);

  gradient.addColorStop(1, `rgb(
      ${Math.random()*255},
        ${Math.random()*255},
        ${0})`);
     gradient.addColorStop(1, `rgb(
      ${Math.random()*255},
        ${Math.random()*255},
         ${Math.random()*255})`);

          gradient.addColorStop(1, `rgb(
      ${Math.random()*255},
        ${Math.random()*255},
        ${0})`);
          gradient.addColorStop(1, `rgb(
      ${Math.random()*255},
        ${Math.random()*255},
        ${0})`);

  context.fillStyle = gradient;

  context.beginPath();
  context.fillRect(-width/2, -height/2, width, height);
  context.stroke(); 
}

for(var i = squareSize; i <= size - squareSize; i += squareSize) {
  for(var j = squareSize; j <= size - squareSize; j+= squareSize) {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    var rotateAmt = j / size * Math.PI / 180 * plusOrMinus * Math.random() * rotateMultiplier;

    plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    var translateAmt = j / size * plusOrMinus * Math.random() * randomDisplacement;
      
    context.save();
    context.translate(i + translateAmt + offset, j + offset);
    context.rotate(rotateAmt);
    draw(squareSize, squareSize);
    context.restore();
  }
}
