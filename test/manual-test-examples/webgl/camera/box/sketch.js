function setup(){
  createCanvas(640, 360, WEBGL);
}

function draw(){
  background(0);

  normalMaterial();
  // Change height of the camera with mouseY
  perspective();
  camera(120, mouseY, 500.0, // eyeX, eyeY, eyeZ
         0.0, 0.0, 0.0, // centerX, centerY, centerZ
         0.0, 1.0, 0.0); // upX, upY, upZ
  // console.log(nfs(_renderer.uMVMatrix.mat4[0], 5, 4) + " "
  //             + nfs(_renderer.uMVMatrix.mat4[1] , 5, 4) + " "
  //             + nfs(_renderer.uMVMatrix.mat4[2] , 5, 4) + " "
  //             + nfs(_renderer.uMVMatrix.mat4[3] , 5, 4) + "\n"
  //             + nfs(_renderer.uMVMatrix.mat4[4] , 5, 4) + " "
  //             + nfs(_renderer.uMVMatrix.mat4[5] , 5, 4) + " "
  //             + nfs(_renderer.uMVMatrix.mat4[6] , 5, 4) + " "
  //             + nfs(_renderer.uMVMatrix.mat4[7] , 5, 4) + "\n"
  //             + nfs(_renderer.uMVMatrix.mat4[8] , 5, 4) + " "
  //             + nfs(_renderer.uMVMatrix.mat4[9] , 5, 4) + " "
  //             + nfs(_renderer.uMVMatrix.mat4[10], 5, 4)  + " "
  //             + nfs(_renderer.uMVMatrix.mat4[11], 5, 4)  + "\n"
  //             + nfs(_renderer.uMVMatrix.mat4[12], 5, 4)  + " "
  //             + nfs(_renderer.uMVMatrix.mat4[13], 5, 4)  + " "
  //             + nfs(_renderer.uMVMatrix.mat4[14], 5, 4)  + " "
  //             + nfs(_renderer.uMVMatrix.mat4[15], 5, 4)  + "\n");
  var tx = map(mouseX, 0, width, -width/2, width/2);
  translate(tx, 0);

  noStroke();
  box(90);
  stroke(255);
  line(-100, 0, 0, 100, 0, 0);
  line(0, -100, 0, 0, 100, 0);
  line(0, 0, -100, 0, 0, 100);
}