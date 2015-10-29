/**
 * Replace a side-by-side 3D image on the page with a combined 3D version,
 * either using anaglyph (red-cyan) or interlaced rows.
 *
 * Usage:
 *   image = new threeDimensionalImage(document.querySelector("img#my-3d-image"));
 *
 * To undo:
 *   image.dismiss();
 */

var threeDimensionalImage = (function() {

  var settings = {
    method:     'interlaced',
    flip_eyes:  false
  };

  function threeDimensionalImage(image) {

    this.image       = image;
    this.width       = image.width;
    this.height      = image.height * 2;
    this.real_width  = image.naturalWidth / 2;
    this.real_height = image.naturalHeight;

    switch(settings.method) {
      case 'anaglyph':
        this.create_anaglyph_image();
        break;
      case 'interlaced':
        this.create_interlaced_image();
        break;
    }

  };

  /**
   * Create an anaglyph image to replace the input image
   */
  threeDimensionalImage.prototype.create_anaglyph_image = function() {

    // Create anaglyph image using CSS
    this.normal_canvas = document.createElement("div");
    this.apply_style(this.normal_canvas, {
      'position':              'relative',
      'width':                 this.width,
      'height':                this.height,
      'z-index':               1,
      'background':            'url("'+this.image.getAttribute('src')+'"), cyan',
      'background-blend-mode': 'lighten',
      'background-size':       'cover'
    });

    this.flipped_canvas = document.createElement("div");
    this.apply_style(this.flipped_canvas, {
      'margin':                '0px',
      'position':              'absolute',
      'width':                 this.width,
      'height':                this.height,
      'z-index':               2,
      'background':            'url("'+this.image.getAttribute('src')+'"), red',
      'background-blend-mode': 'lighten',
      'background-size':       'cover',
      'background-position':   'right',
      'mix-blend-mode':        'darken',
    });

    this.normal_canvas.appendChild(this.flipped_canvas);
    this.normal_canvas.className = "threeDimensionalImage";

    // Replace image with anaglyph image
    this.image.style.display = 'none';
    this.image.parentElement.insertBefore(this.normal_canvas, this.image);

  };

  /**
   * Apply multiple styles at once to an element
   */
  threeDimensionalImage.prototype.apply_style = function(element, style) {
    for (var property in style)
      element.style[property] = style[property];
  };

  /**
   * Create an interlaced representation to replace the input image
   */
  threeDimensionalImage.prototype.create_interlaced_image = function() {

    // Get interlaced images
    this.normal_canvas  = this.interlaced_canvas_for_image(this.image,  settings.flip_eyes);
    this.flipped_canvas = this.interlaced_canvas_for_image(this.image, !settings.flip_eyes);

    // Add the scroll event listener for this image
    window.addEventListener("scroll", (function(_this) {
      return function() {
        return _this.show_the_right_eye();
      };
    })(this));

    // Replace image with our canvases
    this.image.style.display = 'none';
    this.show_the_right_eye();
    this.image.parentElement.insertBefore(this.normal_canvas,  this.image);
    this.image.parentElement.insertBefore(this.flipped_canvas, this.image);

  };

  /**
   * Create an interlaced image on a canvas from this side by side image
   */
  threeDimensionalImage.prototype.interlaced_canvas_for_image = function(image, flip_eyes) {

    // Create canvas for interlaced image
    var canvas       = document.createElement("canvas");
    canvas.className = "threeDimensionalImage";
    canvas.width     = this.width;
    canvas.height    = this.height;

    // Draw the first eye
    var context = canvas.getContext("2d");
    context.drawImage(image, (flip_eyes ? this.real_width : 0), 0, this.real_width, this.real_height, 0, 0, this.width, this.height);

    // Draw the second eye
    var one_pixel_height = this.real_height / this.height;
    var top_offset = 0;
    for(var i = 0; i < this.height; i += 2) {
      context.drawImage(image, (flip_eyes ? 0 : this.real_width), top_offset, this.real_width, one_pixel_height, 0, i, this.width, 1);
      top_offset += 2 * one_pixel_height;
    }

    return canvas;
  };

  /**
   * Show either the normal or the flipped version, depending on
   * scroll position. TODO: This needs to take the image position
   * on the page into account :/
   */
  threeDimensionalImage.prototype.show_the_right_eye = function() {
    if ( document.body.scrollTop % 2 == 0 ) {
      this.normal_canvas.style.display = 'none';
      this.flipped_canvas.style.display = 'initial';
    } else {
      this.normal_canvas.style.display = 'initial';
      this.flipped_canvas.style.display = 'none';
    }
  };

  /**
   * Undo all the 3D madness, and return to the original image
   */
  threeDimensionalImage.prototype.dismiss = function() {
    this.normal_canvas.parentElement.removeChild(this.normal_canvas);
    this.flipped_canvas.parentElement.removeChild(this.flipped_canvas);
    this.image.style.display = 'initial';
  };

  return threeDimensionalImage;
})();
