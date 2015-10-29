# 3D images in Javascript
A Javascript implementation for showing anaglyph and interlaced 3D images from side-by-side source images.

Create a 3D image from a specific image:
```javascript
image = new threeDimensionalImage(document.querySelector("img#my-3d-image"));
```

3D-ify all image elements with attribute `data-type='3d-sbs'`:
```javascript
var images = document.querySelectorAll("img[data-type='3d-sbs']");
Array.prototype.forEach.call(images, function(el, i){
  new threeDimensionalImage(el);
});
```

To undo:
```javascript
image.dismiss();
```
