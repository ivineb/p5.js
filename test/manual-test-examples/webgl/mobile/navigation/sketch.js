var rx = 0;
var ry = 0;
var rz = 0;
var e = 0.1;

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  var fov = PI/3.0;
  var cameraZ = (height/2.0) / tan(fov/2.0);
  perspective(fov, width/height, cameraZ * 0.1, cameraZ * 10);
}

function draw(){
  background(0);
  camera(0, 0, -1, 0, 0, 0, 0, 1, 0);

  rx += (-rotationX * PI / 180 - rx) * e;
  ry += (-rotationY * PI / 180 - ry) * e;
  rz += (rotationZ * PI / 180 - rz) * e;

  rotateX(rx);
  rotateY(ry);
  rotateZ(rz);

  // fill('red');
  // line(0, 0, 0, 100, 0, 0);
  // fill('green')
  // line(0, 0, 0, 0, 100, 0);
  // fill('blue');
  // line(0, 0, 0, 0, 0, 100);

  console.log(rotationX + ", " + rotationY + ", " + rotationZ);
  for(var i = -2; i < 3; i++){
    for(var j = -2; j < 3; j++){
      for(var k = -2; k < 3; k++){
        push();
        translate(i*100, j*100, k*100);
        box(20);
        pop();
      }
    }
  }
}