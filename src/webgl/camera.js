/**
 * @module Lights, Camera
 * @submodule Camera
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Sets camera position
 * @method camera
 * @param  {Number} x  camera position value on x axis
 * @param  {Number} y  camera position value on y axis
 * @param  {Number} z  camera position value on z axis
 * @return {p5}        the p5 object
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw(){
 *  //move the camera away from the plane by a sin wave
 *  camera(0, 0, sin(frameCount * 0.01) * 100);
 *  plane(120, 120);
 * }
 * </code>
 * </div>
 *
 * @alt
 * blue square shrinks in size grows to fill canvas. disappears then loops.
 *
 */
p5.prototype.camera = function(){
  var eyeX, eyeY, eyeZ;
  var centerX, centerY, centerZ;
  var upX, upY, upZ;
  if (arguments.length === 0) {
    eyeX = this._renderer.cam.defX;
    eyeY = this._renderer.cam.defY;
    eyeZ = this._renderer.cam.defZ;
    centerX = this._renderer.cam.defX;
    centerY = this._renderer.cam.defY;
    centerZ = 0;
    upX = 0;
    upY = 1;
    upZ = 0;
  } else {
    eyeX = arguments[0];
    eyeY = arguments[1];
    eyeZ = arguments[2];
    centerX = arguments[3];
    centerY = arguments[4];
    centerZ = arguments[5];
    upX = arguments[6];
    upY = arguments[7];
    upZ = arguments[8];
  }

  this._renderer.cam.x = eyeX;
  this._renderer.cam.y = eyeY;
  this._renderer.cam.z = eyeZ;

  // calculate camera Z vector
  var z0 = eyeX - centerX;
  var z1 = eyeY - centerY;
  var z2 = eyeZ - centerZ;

  this._renderer.cam.eyeDist = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  if (this._renderer.cam.eyeDist !== 0) {
    z0 /= this._renderer.cam.eyeDist;
    z1 /= this._renderer.cam.eyeDist;
    z2 /= this._renderer.cam.eyeDist;
  }

  // calculate camera Y vector
  var y0 = upX;
  var y1 = upY;
  var y2 = upZ;

  // computer x vector as y cross z
  var x0 =  y1 * z2 - y2 * z1;
  var x1 = -y0 * z2 + y2 * z0;
  var x2 =  y0 * z1 - y1 * z0;

  // recomputer y = z cross x
  y0 =  z1 * x2 - z2 * x1;
  y1 = -z0 * x2 + z2 * x0;
  y2 =  z0 * x1 - z1 * x0;

  // cross product gives area of parallelogram, which is < 1.0 for
  // non-perpendicular unit-length vectors; so normalize x, y here:
  var xmag = Math.sqrt (x0 * x0 + x1 * x1 + x2 * x2);
  if (xmag !== 0) {
    x0 /= xmag;
    x1 /= xmag;
    x2 /= xmag;
  }

  var ymag = Math.sqrt (y0 * y0 + y1 * y1 + y2 * y2);
  if (ymag !== 0) {
    y0 /= ymag;
    y1 /= ymag;
    y2 /= ymag;
  }

  // this._renderer.uMVMatrix.set(x0, x1, x2, 0,
  //                              y0, y1, y2, 0,
  //                              z0, z1, z2, 0,
  //                               0,  0,  0, 1);

  this._renderer.uMVMatrix.set(x0, y0, z0, 0,
                               x1, y1, z1, 0,
                               x2, y2, z2, 0,
                                0,  0,  0, 1);

  var tx = -eyeX;
  var ty = -eyeY;
  var tz = -eyeZ;

  //what it manipulates is the model view matrix
  this._renderer.uMVMatrix.translate([tx, ty, tz]);
  this._renderer.cameraMatrix.set(this._renderer.uMVMatrix);
};

/**
 * Sets perspective camera
 * @method  perspective
 * @param  {Number} fovy   camera frustum vertical field of view,
 *                         from bottom to top of view, in degrees
 * @param  {Number} aspect camera frustum aspect ratio
 * @param  {Number} near   frustum near plane length
 * @param  {Number} far    frustum far plane length
 * @return {p5}            the p5 object
 * @example
 * <div>
 * <code>
 * //drag mouse to toggle the world!
 * //you will see there's a vanish point
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 *   var fov = 60 / 180 * PI;
 *   var cameraZ = (height/2.0) / tan(fov/2.0);
 *   perspective(60 / 180 * PI, width/height, cameraZ * 0.1, cameraZ * 10);
 * }
 * function draw(){
 *  background(200);
 *  orbitControl();
 *  for(var i = -1; i < 2; i++){
 *     for(var j = -2; j < 3; j++){
 *       push();
 *       translate(i*160, 0, j*160);
 *       box(40, 40, 40);
 *       pop();
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * colored 3d boxes toggleable with mouse position
 *
 */
p5.prototype.perspective = function(fovy,aspect,near,far) {
  fovy = fovy || (60 / 180 * this.PI);
  aspect = aspect || (this.width/this.height);
  near = near || ((this.height/2.0) / this.tan(fovy/2.0) * 0.1);
  far = far || ((this.height/2.0) / this.tan(fovy/2.0) * 10);
  this._renderer.uPMatrix = p5.Matrix.identity();
  this._renderer.uPMatrix.perspective(fovy,aspect,near,far);
  this._renderer._curCamera = 'custom';
};

/**
 * Setup ortho camera
 * @method  ortho
 * @param  {Number} left   camera frustum left plane
 * @param  {Number} right  camera frustum right plane
 * @param  {Number} bottom camera frustum bottom plane
 * @param  {Number} top    camera frustum top plane
 * @param  {Number} near   camera frustum near plane
 * @param  {Number} far    camera frustum far plane
 * @return {p5}            the p5 object
 * @example
 * <div>
 * <code>
 * //drag mouse to toggle the world!
 * //there's no vanish point
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 *   ortho(-width/2, width/2, height/2, -height/2, 0, 500);
 * }
 * function draw(){
 *  background(200);
 *  orbitControl();
 *  for(var i = -1; i < 2; i++){
 *     for(var j = -2; j < 3; j++){
 *       push();
 *       translate(i*160, 0, j*160);
 *       box(40, 40, 40);
 *       pop();
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * 3 3d boxes, reveal several more boxes on 3d plane when mouse used to toggle
 *
 */
p5.prototype.ortho = function(left,right,bottom,top,near,far) {
  left = left || (-this.width/2);
  right = right || (this.width/2);
  bottom = bottom || (-this.height/2);
  top = top || (this.height/2);
  near = near || 0;
  far = far || Math.max(this.width, this.height);
  this._renderer.uPMatrix = p5.Matrix.identity();
  this._renderer.uPMatrix.ortho(left,right,bottom,top,near,far);
  this._renderer._curCamera = 'custom';
};

module.exports = p5;
