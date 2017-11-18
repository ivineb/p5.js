var im1, im2;

function preload() {
  im1 = loadImage('../../assets/UV_Grid_Sm.jpg');
  im2 = loadImage('../../assets/cat.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(255);

  translate(-width / 3, 0);
  texture(im1);
  sphere(70);

  push();
  translate(width / 3, 0);
  texture(im2);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  box(70);
  pop();

  translate(2 * width / 3, 0);
  rotateX(-frameCount * 0.01);
  box(70); // should be textured by im1, x-axis rotation only
}