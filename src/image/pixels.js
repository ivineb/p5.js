/**
 * @module Image
 * @submodule Pixels
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var Filters = require('filters');
  require('p5.Color');

  /**
   * Array containing the values for all the pixels in the display window.
   * These values are numbers. This array is the size (include an appropriate
   * factor for pixelDensity) of the display window x4,
   * representing the R, G, B, A values in order for each pixel, moving from 
   * left to right across each row, then down each column. Retina and other
   * high denisty displays will have more pixels[] (by a factor of
   * pixelDensity^2).
   * For example, if the image is 100x100 pixels, there will be 40,000. On a
   * retina display, there will be 160,000. The first four values
   * (indices 0-3) in the array will be the R, G, B, A values of the pixel at 
   * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
   * values of the pixel at (1, 0). More generally, to set values for a pixel
   * at (x, y): 
   * <code><pre>var d = pixelDensity;
   * for (var i = 0; i < d; i++) {
   *   for (var j = 0; j < d; j++) {
   *     // loop over
   *     idx = 4*((y * d + j) * width * d + (x * d + i));
   *     pixels[idx] = r;
   *     pixels[idx+1] = g;
   *     pixels[idx+2] = b;
   *     pixels[idx+3] = a;
   *   }
   * }
   * </pre></code>
   * While the above method is complex, it is flexible enough to work with
   * any pixelDensity. Note that set() will automatically take care of
   * setting all the appropriate values in pixels[] for a given (x, y) at
   * any pixelDensity, but the performance may not be as fast when lots of
   * modifications are made to the pixel array.
   * <br><br>
   * Before accessing this array, the data must loaded with the loadPixels()
   * function. After the array data has been modified, the updatePixels()
   * function must be run to update the changes.
   *
   * @property pixels[]   
   * @example
   * <div>
   * <code>
   * var pink = color(255, 102, 204);
   * loadPixels();
   * var d = pixelDensity;
   * var halfImage = 4 * (width * d) * (height/2 * d);
   * for (var i = 0; i < halfImage; i+=4) {
   *   pixels[i] = red(pink);
   *   pixels[i+1] = green(pink);
   *   pixels[i+2] = blue(pink);
   *   pixels[i+3] = alpha(pink);
   * }
   * updatePixels();
   * </code>
   * </div>
   */
  p5.prototype.pixels = [];

  /**
   * Copies a region of pixels from one image to another, using a specified
   * blend mode to do the operation.<br><br>
   * Available blend modes are: BLEND | DARKEST | LIGHTEST | DIFFERENCE | 
   * MULTIPLY| EXCLUSION | SCREEN | REPLACE | OVERLAY | HARD_LIGHT | 
   * SOFT_LIGHT | DODGE | BURN | ADD | NORMAL
   *
   * 
   * @method blend
   * @param  {p5.Image|undefined} srcImage source image
   * @param  {Integer} sx X coordinate of the source's upper left corner
   * @param  {Integer} sy Y coordinate of the source's upper left corner
   * @param  {Integer} sw source image width
   * @param  {Integer} sh source image height
   * @param  {Integer} dx X coordinate of the destination's upper left corner
   * @param  {Integer} dy Y coordinate of the destination's upper left corner
   * @param  {Integer} dw destination image width
   * @param  {Integer} dh destination image height
   * @param  {Integer} blendMode the blend mode
   *
   * @example
   * <div><code>
   * var img0;
   * var img1;
   *
   * function preload() {
   *   img0 = loadImage("assets/rockies.jpg");
   *   img1 = loadImage("assets/bricks_third.jpg");
   * }
   * 
   * function setup() {
   *   background(img0);
   *   image(img1, 0, 0);
   *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, LIGHTEST);
   * }
   * </code></div>
   * <div><code>
   * var img0;
   * var img1;
   *
   * function preload() {
   *   img0 = loadImage("assets/rockies.jpg");
   *   img1 = loadImage("assets/bricks_third.jpg");
   * }
   * 
   * function setup() {
   *   background(img0);
   *   image(img1, 0, 0);
   *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, DARKEST);
   * }
   * </code></div>
   * <div><code>
   * var img0;
   * var img1;
   *
   * function preload() {
   *   img0 = loadImage("assets/rockies.jpg");
   *   img1 = loadImage("assets/bricks_third.jpg");
   * }
   * 
   * function setup() {
   *   background(img0);
   *   image(img1, 0, 0);
   *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, ADD);
   * }
   * </code></div>
   */
  p5.prototype.blend = function() {
    var currBlend = this.drawingContext.globalCompositeOperation;
    var blendMode = arguments[arguments.length - 1];
    var copyArgs = Array.prototype.slice.call(
      arguments,
      0,
      arguments.length - 1
    );

    this.drawingContext.globalCompositeOperation = blendMode;
    this.copy.apply(this, copyArgs);
    this.drawingContext.globalCompositeOperation = currBlend;
  };

  /**
   * Copies a region of the canvas to another region of the canvas  
   * and copies a region of pixels from an image used as the srcImg parameter
   * into the canvas srcImage is specified this is used as the source. If
   * the source and destination regions aren't the same size, it will
   * automatically resize source pixels to fit the specified
   * target region.
   *
   * @method copy
   * @param  {p5.Image|undefined} srcImage source image
   * @param  {Integer} sx X coordinate of the source's upper left corner
   * @param  {Integer} sy Y coordinate of the source's upper left corner
   * @param  {Integer} sw source image width
   * @param  {Integer} sh source image height
   * @param  {Integer} dx X coordinate of the destination's upper left corner
   * @param  {Integer} dy Y coordinate of the destination's upper left corner
   * @param  {Integer} dw destination image width
   * @param  {Integer} dh destination image height
   */
  p5.prototype.copy = function() {
    var srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
    if(arguments.length === 9){
      srcImage = arguments[0];
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else if(arguments.length === 8){
      sx = arguments[0];
      sy = arguments[1];
      sw = arguments[2];
      sh = arguments[3];
      dx = arguments[4];
      dy = arguments[5];
      dw = arguments[6];
      dh = arguments[7];

      srcImage = this;
    } else {
      throw new Error('Signature not supported');
    }

    /// use s scale factor to deal with pixel density
    var s = srcImage.canvas.width / srcImage.width;
    this.drawingContext.drawImage(srcImage.canvas,
      s*sx, s*sy, s*sw, s*sh, dx, dy, dw, dh
    );
  };

  /**
   * Applies a filter to the canvas
   * 
   * @method filter
   * @param  {String}           operation one of threshold, gray, invert,
   *                                      posterize and opaque. see filters.js
   *                                      for docs on each available filter
   * @param  {Number|undefined} value
   */
  p5.prototype.filter = function(operation, value) {
    Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
  };

  /**
   * Returns an array of [R,G,B,A] values for any pixel or grabs a section of
   * an image. If no parameters are specified, the entire image is returned. 
   * Use the x and y parameters to get the value of one pixel. Get a section of
   * the display window by specifying additional w and h parameters. When 
   * getting an image, the x and y parameters define the coordinates for the 
   * upper-left corner of the image, regardless of the current imageMode().
   *
   * If the pixel requested is outside of the image window, [0,0,0,255] is 
   * returned. To get the numbers scaled according to the current color ranges
   * and taking into account colorMode, use getColor instead of get.
   *
   * Getting the color of a single pixel with get(x, y) is easy, but not as fast
   * as grabbing the data directly from pixels[]. The equivalent statement to
   * get(x, y) using pixels[] with pixel density d is 
   * [pixels[(y*width*d+x)*d],
   * pixels[(y*width*d+x)*d+1], 
   * pixels[(y*width*d+x)*d+2],
   * pixels[(y*width*d+x)*d+3] ].
   * See the reference for pixels[] for more information.
   *
   * @method get
   * @param  {Number}         [x] x-coordinate of the pixel
   * @param  {Number}         [y] y-coordinate of the pixel
   * @param  {Number}         [w] width
   * @param  {Number}         [h] height
   * @return {Array|p5.Image}     values of pixel at x,y in array format
   *                              [R, G, B, A] or p5.Image
   * @example
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   * function setup() {
   *   image(img, 0, 0);
   *   var c = get();
   *   image(c, width/2, 0);
   * }
   * </code>
   * </div>
   * 
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   * function setup() {
   *   image(img, 0, 0);
   *   var c = get(50, 90);
   *   fill(c);
   *   noStroke();
   *   rect(25, 25, 50, 50);
   * }
   * </code>
   * </div>
   */
  p5.prototype.get = function(x, y, w, h){
    if (x === undefined && y === undefined &&
        w === undefined && h === undefined){
      x = 0;
      y = 0;
      w = this.width;
      h = this.height;
    } else if (w === undefined && h === undefined) {
      w = 1;
      h = 1;
    }

    if(x > this.width || y > this.height || x < 0 || y < 0){
      return [0, 0, 0, 255];
    }

    if (w === 1 && h === 1){
      var imageData = this.drawingContext.getImageData(x, y, w, h);
      var data = imageData.data;
      var pixels = [];
      
      for (var i = 0; i < data.length; i += 4) {
        pixels.push(data[i], data[i+1], data[i+2], data[i+3]);
      }
      
      return pixels;
    } else {
      var sx = x * this.pixelDensity;
      var sy = y * this.pixelDensity;
      //auto constrain the width and height to
      //dimensions of the source image
      var dw = Math.min(w, this.width);
      var dh = Math.min(h, this.height);
      var sw = dw * this.pixelDensity;
      var sh = dh * this.pixelDensity;

      var region = new p5.Image(dw, dh);
      region.canvas.getContext('2d').drawImage(this.canvas, sx, sy, sw, sh,
        0, 0, dw, dh);

      return region;
    }
  };

  /**
   * Loads the pixel data for the display window into the pixels[] array. This
   * function must always be called before reading from or writing to pixels[].
   *
   * @method loadPixels   
   * @example
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   * 
   * function setup() {
   *   image(img, 0, 0);
   *   var d = pixelDensity;
   *   var halfImage = 4 * (img.width * d) * (img.height/2 * d);
   *   loadPixels();
   *   for (var i = 0; i < halfImage; i++) {
   *     pixels[i+halfImage] = pixels[i];
   *   }
   *   updatePixels();
   * }
   * </code>
   * </div>
   */
  p5.prototype.loadPixels = function() {
    var width = this.width * this.pixelDensity;
    var height = this.height * this.pixelDensity;
    var imageData = this.drawingContext.getImageData(
      0,
      0,
      width,
      height);
    this._setProperty('imageData', imageData);
    this._setProperty('pixels', imageData.data);
  };

  /**
   * <p>Changes the color of any pixel, or writes an image directly to the 
   * display window.</p>
   * <p>The x and y parameters specify the pixel to change and the c parameter
   * specifies the color value. This can be a p5.COlor object, or [R, G, B, A]
   * pixel array. It can also be a single grayscale value.
   * When setting an image, the x and y parameters define the coordinates for
   * the upper-left corner of the image, regardless of the current imageMode().
   * </p>
   * <p>Setting the color of a single pixel with set(x, y) is easy, but not as
   * fast as putting the data directly into pixels[]. Setting the pixels[]
   * values directly may be complicated when working with a retina display,
   * but will perform better when lots of pixels need to be set directly on
   * every loop.</p>
   * <p>See the reference for pixels[] for more information.</p>
   *
   * @method set
   * @param {Number}              x x-coordinate of the pixel
   * @param {Number}              y y-coordinate of the pixel
   * @param {Number|Array|Object} c insert a grayscale value | a pixel array |
   *                                a p5.Color object | a p5.Image to copy   
   * @example
   * <div>
   * <code>
   * var black = color(0);
   * set(30, 20, black);
   * set(85, 20, black);
   * set(85, 75, black);
   * set(30, 75, black);
   * updatePixels();
   * </code>
   * </div> 
   *
   * <div>
   * <code>
   * for (var i = 30; i < width-15; i++) {
   *   for (var j = 20; j < height-25; j++) {
   *     var c = color(204-j, 153-i, 0);
   *     set(i, j, c);
   *   }
   * }
   * updatePixels();
   * </code>
   * </div> 
   *
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   *
   * function setup() {
   *   set(0, 0, img);
   *   updatePixels();
   *   line(0, 0, width, height);
   *   line(0, height, width, 0);
   * }
   * </code>
   * </div>
   */
  p5.prototype.set = function (x, y, imgOrCol) {
    if (imgOrCol instanceof p5.Image) {
      this.drawingContext.save();
      this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
      this.drawingContext.scale(this.pixelDensity, this.pixelDensity);
      this.drawingContext.drawImage(imgOrCol.canvas, x, y);
      this.loadPixels.call(this);
      this.drawingContext.restore();
    } else {
      var r = 0, g = 0, b = 0, a = 0;
      var idx = 4*((y * this.pixelDensity) * (this.width * this.pixelDensity) +
        (x * this.pixelDensity));
      if (!this.imageData) {
        this.loadPixels.call(this);
      }
      if (typeof imgOrCol === 'number') {
        if (idx < this.pixels.length) {
          r = imgOrCol;
          g = imgOrCol;
          b = imgOrCol;
          a = 255;
          //this.updatePixels.call(this);
        }
      }
      else if (imgOrCol instanceof Array) {
        if (imgOrCol.length < 4) {
          throw new Error('pixel array must be of the form [R, G, B, A]');
        }
        if (idx < this.pixels.length) {
          r = imgOrCol[0];
          g = imgOrCol[1];
          b = imgOrCol[2];
          a = imgOrCol[3];
          //this.updatePixels.call(this);
        }
      } else if (imgOrCol instanceof p5.Color) {
        if (idx < this.pixels.length) {
          r = imgOrCol.rgba[0];
          g = imgOrCol.rgba[1];
          b = imgOrCol.rgba[2];
          a = imgOrCol.rgba[3];
          //this.updatePixels.call(this);
        }
      }
      // loop over pixelDensity * pixelDensity
      for (var i = 0; i < this.pixelDensity; i++) {
        for (var j = 0; j < this.pixelDensity; j++) {
          // loop over
          idx = 4*((y * this.pixelDensity + j) * this.width *
            this.pixelDensity + (x * this.pixelDensity + i));
          this.pixels[idx] = r;
          this.pixels[idx+1] = g;
          this.pixels[idx+2] = b;
          this.pixels[idx+3] = a;
        }
      }
    }
  };
  /**
   * Updates the display window with the data in the pixels[] array.
   * Use in conjunction with loadPixels(). If you're only reading pixels from
   * the array, there's no need to call updatePixels() — updating is only
   * necessary to apply changes. updatePixels() should be called anytime the 
   * pixels array is manipulated or set() is called.
   *
   * @method updatePixels  
   * @param  {Number} [x]    x-coordinate of the upper-left corner of region 
   *                         to update
   * @param  {Number} [y]    y-coordinate of the upper-left corner of region 
   *                         to update
   * @param  {Number} [w]    width of region to update
   * @param  {Number} [w]    height of region to update
   * @example
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   * 
   * function setup() {
   *   image(img, 0, 0);
   *   var halfImage = 4 * (img.width * pixelDensity) *
   *     (img.height * pixelDensity/2);
   *   loadPixels();
   *   for (var i = 0; i < halfImage; i++) {
   *     pixels[i+halfImage] = pixels[i];
   *   }
   *   updatePixels();
   * }
   * </code>
   * </div>
   */
  p5.prototype.updatePixels = function (x, y, w, h) {
    if (x === undefined &&
      y === undefined &&
      w === undefined &&
      h === undefined) {
      x = 0;
      y = 0;
      w = this.width * this.pixelDensity;
      h = this.height * this.pixelDensity;
    }
    this.drawingContext.putImageData(this.imageData, x, y, 0, 0, w, h);
  };

  return p5;

});
