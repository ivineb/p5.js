var img
var sz = 100;

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  img = loadImage("assets/UV_Grid_Sm.jpg");
}

function draw(){
  background(255);

  randomSeed(1);

  texture(img);
  for (var i = 0  ;  i < 10 ;  i++) {
    push();
    translate(random(-width/2 + sz, width/2 - sz), random(-height/2 + sz, height/2 - sz));
    //fill(random(128, 255), 0, random(128, 255));
    rotateZ(random(0, 2 * PI) + frameCount * 0.1);
    beginShape(TRIANGLES);
    vertex(-sz, -sz, 0, 0, 1);
    vertex(sz, -sz,  0, 1, 1);
    vertex(sz, sz,   0, 1, 0);
    vertex(sz, sz,   0, 1, 0);
    vertex(-sz, sz,  0, 0, 0);
    vertex(-sz, -sz, 0, 0, 1);
    endShape();
    pop();
  }
}