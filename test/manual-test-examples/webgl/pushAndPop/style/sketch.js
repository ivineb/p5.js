
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(255);

  translate(-width / 3, 0);
  sphere(70);

  push();
  translate(width / 3, 0);
  stroke(255, 0, 255);
  fill(0, 255, 255);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  box(70);
  pop();

  translate(2 * width / 3, 0);
  sphere(70);
}