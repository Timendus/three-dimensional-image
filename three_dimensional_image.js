/**
 * threeDimensionalImage class, usage:
 * image = new threeDimensionalImage(document.querySelector("img#my-3d-image"));
 */

var threeDimensionalImage = (function() {

  var settings = {
    flip_eyes: false
  };

  function threeDimensionalImage(image) {

    this.image       = image;
    this.width       = image.width;
    this.height      = image.height * 2;
    this.real_width  = image.naturalWidth / 2;
    this.real_height = image.naturalHeight;

    // Get interlaced images
    this.normal_canvas  = this.interlaced_canvas_for_image(image,  settings.flip_eyes);
    this.flipped_canvas = this.interlaced_canvas_for_image(image, !settings.flip_eyes);

    // Add the scroll event listener for this image
    window.addEventListener("scroll", (function(_this) {
      return function() {
        return _this.show_the_right_eye();
      };
    })(this));

    // Replace image with our canvases
    image.style.display = 'none';
    this.show_the_right_eye();
    image.parentElement.insertBefore(this.normal_canvas, image);
    image.parentElement.insertBefore(this.flipped_canvas, image);
  };

  /**
   * Create an interlaced image on a canvas from this side by side image
   */
  threeDimensionalImage.prototype.interlaced_canvas_for_image = function(image, flip_eyes) {

    // Create canvas for interlaced image
    var canvas    = document.createElement("canvas");
    canvas.width  = this.width;
    canvas.height = this.height;

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
   * scroll position. This needs to take the image position into account :/
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
