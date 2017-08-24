/**
 * @module Lights, Camera
 * @submodule Lights
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Creates an ambient light with a color
 *
 * @method ambientLight
 * @param  {Number}        v1      red or hue value relative to
 *                                 the current color range
 * @param  {Number}        v2      green or saturation value
 *                                 relative to the current color range
 * @param  {Number}        v3      blue or brightness value
 *                                 relative to the current color range
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method ambientLight
 * @param  {String}        value   a color string
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method ambientLight
 * @param  {Number[]}      values  an array containing the red,green,blue &
 *                                 and alpha components of the color
 * @chainable
 */

/**
 * @method ambientLight
 * @param  {p5.Color}      color   the ambient light color
 * @param  {Number}        [alpha]
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw(){
 *   background(0);
 *   ambientLight(150);
 *   ambientMaterial(250);
 *   sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * nothing displayed
 *
 */
p5.prototype.ambientLight = function(v1, v2, v3, a){
  var renderer = this._renderer;
  var shaderProgram = renderer._getShader(
    'lightVert', 'lightTextureFrag');

  renderer._useShader(shaderProgram);

  var color = this._renderer._pInst.color.apply(
    this._renderer._pInst, arguments);

  //@todo this is a bit icky. array uniforms have
  //to be multiples of the type 3(rgb) in this case.
  //a preallocated Float32Array(24) that we copy into
  //would be better
  var colors = new Float32Array(color._array.slice(0,3));
  renderer._setUniform('uAmbientColor[0]', colors);

  //in case there's no material color for the geometry
  renderer._setUniform('uMaterialColor', [1,1,1,1]);

  renderer.ambientLightCount++;
  renderer._setUniform('uAmbientLightCount', renderer.ambientLightCount);
  renderer._setUniform('uUseLighting', true);
  return this;
};

/**
 * Creates a directional light with a color and a direction
 * @method  directionalLight
 * @param  {Number|Array|String|p5.Color} v1   gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}          [v2] optional: green or saturation value
 * @param  {Number}          [v3] optional: blue or brightness value
 * @param  {Number}          [a]  optional: opacity
 * @param  {Number|p5.Vector} x   x axis direction or a p5.Vector
 * @param  {Number}          [y]  optional: y axis direction
 * @param  {Number}          [z]  optional: z axis direction
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw(){
 *   background(0);
 *   //move your mouse to change light direction
 *   var dirX = (mouseX / width - 0.5) *2;
 *   var dirY = (mouseY / height - 0.5) *(-2);
 *   directionalLight(250, 250, 250, dirX, dirY, 0.25);
 *   ambientMaterial(250);
 *   sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * light source on canvas changeable with mouse position
 *
 */
p5.prototype.directionalLight = function(v1, v2, v3, a, x, y, z) {
  var renderer = this._renderer;

  var shaderProgram = renderer._getShader(
    'lightVert', 'lightTextureFrag');

  renderer._useShader(shaderProgram);

  //@TODO: check parameters number
  var color = renderer._pInst.color.apply(
    renderer._pInst, [v1, v2, v3]);

  var colors = new Float32Array(color._array.slice(0,3));
  renderer._setUniform('uDirectionalColor[0]', colors);

  var _x, _y, _z;

  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  if(typeof args[args.length-1] === 'number'){
    _x = args[args.length-3];
    _y = args[args.length-2];
    _z = args[args.length-1];

  }else{
    try{
      _x = args[args.length-1].x;
      _y = args[args.length-1].y;
      _z = args[args.length-1].z;
    }
    catch(error){
      throw error;
    }
  }

  //in case there's no material color for the geometry
  renderer._setUniform('uMaterialColor', [1,1,1,1]);
  renderer._setUniform('uLightingDirection[0]', [_x, _y, _z]);
  renderer.directionalLightCount ++;
  renderer._setUniform('uDirectionalLightCount',
    renderer.directionalLightCount);
  renderer._setUniform('uUseLighting', true);

  return this;
};

/**
 * Creates a point light with a color and a light position
 * @method  pointLight
 * @param  {Number|Array|String|p5.Color} v1   gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}          [v2] optional: green or saturation value
 * @param  {Number}          [v3] optional: blue or brightness value
 * @param  {Number}          [a]  optional: opacity
 * @param  {Number|p5.Vector} x   x axis position or a p5.Vector
 * @param  {Number}          [y]  optional: y axis position
 * @param  {Number}          [z]  optional: z axis position
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw(){
 *   background(0);
 *   //move your mouse to change light position
 *   var locY = (mouseY / height - 0.5) *(-2);
 *   var locX = (mouseX / width - 0.5) *2;
 *   //to set the light position,
 *   //think of the world's coordinate as:
 *   // -1,1 -------- 1,1
 *   //   |            |
 *   //   |            |
 *   //   |            |
 *   // -1,-1---------1,-1
 *   pointLight(250, 250, 250, locX, locY, 0);
 *   ambientMaterial(250);
 *   sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * spot light on canvas changes position with mouse
 *
 */
p5.prototype.pointLight = function(v1, v2, v3, a, x, y, z) {
  var renderer = this._renderer;
  var shaderProgram = this._renderer._getShader(
    'lightVert', 'lightTextureFrag');

  renderer._useShader(shaderProgram);

  //@TODO: check parameters number
  var color = this._renderer._pInst.color.apply(
    this._renderer._pInst, [v1, v2, v3]);

  var colors = new Float32Array(color._array.slice(0,3));
  renderer._setUniform('uPointLightColor[0]', colors);

  var _x, _y, _z;

  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  if(typeof args[args.length-1] === 'number'){
    _x = args[args.length-3];
    _y = args[args.length-2];
    _z = args[args.length-1];

  }else{
    try{
      _x = args[args.length-1].x;
      _y = args[args.length-1].y;
      _z = args[args.length-1].z;
    }
    catch(error){
      throw error;
    }
  }

  //in case there's no material color for the geometry
  renderer._setUniform('uMaterialColor', [1,1,1,1]);
  renderer._setUniform('uPointLightLocation[0]', [_x, _y, _z]);
  this._renderer.pointLightCount++;
  renderer._setUniform('uPointLightCount',
    renderer.pointLightCount);
  renderer._setUniform('uUseLighting', true);
  return this;
};

module.exports = p5;
