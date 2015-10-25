/**
 * 3d-images.js
 * Add data attribute data-type="3d-sbs" to any image on the page
 * and load this file. It'll be awesome.
 */

var threeDimensionalImage = (function() {

  var settings = {
    flip_eyes: false
  };

  function threeDimensionalImage(image) {
    // Get interlaced images
    var normal_canvas  = this.interlaced_canvas_for_image(image,  settings.flip_eyes);
    var flipped_canvas = this.interlaced_canvas_for_image(image, !settings.flip_eyes);

    // Add the scroll event listener for this image
    window.addEventListener("scroll", (function(_this) {
      return function() {
        return _this.show_the_right_eye(normal_canvas, flipped_canvas);
      };
    })(this));

    // Replace image with our canvases
    image.style.display = 'none';
    this.show_the_right_eye(normal_canvas, flipped_canvas);
    image.parentElement.insertBefore(normal_canvas, image);
    image.parentElement.insertBefore(flipped_canvas, image);
  };

  /**
   * Create an interlaced image on a canvas from this side by side image
   */
  threeDimensionalImage.prototype.interlaced_canvas_for_image = function(image, flip_eyes) {
    // Determine image size (on the page and as a file)
    var new_width    = image.width;
    var new_height   = image.height * 2;
    var image_width  = image.naturalWidth / 2;
    var image_height = image.naturalHeight;

    // Create canvas for interlaced image
    var canvas = document.createElement("canvas");
    canvas.width = new_width;
    canvas.height = new_height;

    // Draw the first eye
    var context = canvas.getContext("2d");
    context.drawImage(image, (flip_eyes ? image_width : 0), 0, image_width, image_height, 0, 0, new_width, new_height);

    // Draw the second eye
    var one_pixel_height = image_height / new_height;
    var top_offset = 0;
    for(var i = 0; i < new_height; i += 2) {
      context.drawImage(image, (flip_eyes ? 0 : image_width), top_offset, image_width, one_pixel_height, 0, i, new_width, 1);
      top_offset += 2 * one_pixel_height;
    }

    return canvas;
  };

  /**
   * Show either the normal or the flipped version, depending on
   * scroll position
   */
  threeDimensionalImage.prototype.show_the_right_eye = function(canvas_a, canvas_b) {
    if ( document.body.scrollTop % 2 == 0 ) {
      canvas_a.style.display = 'none';
      canvas_b.style.display = 'initial';
    } else {
      canvas_a.style.display = 'initial';
      canvas_b.style.display = 'none';
    }
  };

  return threeDimensionalImage;
})();

window.addEventListener("load", function(event) {

  // Let's get started!
  var images = document.querySelectorAll("img[data-type='3d-sbs']");

  Array.prototype.forEach.call(images, function(el, i){
    new threeDimensionalImage(el);
  });

});
