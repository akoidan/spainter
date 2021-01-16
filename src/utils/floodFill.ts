/** Flood fill algorithm based on gman stackoverflow answer
 * https://stackoverflow.com/a/56221940/3872976
 */
function getPixel(x, y, width, height, data) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return -1;
  } else {
    return data[y * width + x];
  }
}


function doWhile(pixelsToCheck, width, height, data, targetColor, fillColor, cb) {
  var tickCount = 1;
  while (pixelsToCheck.length > 0) {
    if (tickCount % 5000 === 0) { // do not block event loop
      // do not block event loop
      setTimeout(doWhile, 0, pixelsToCheck, width, height, data, targetColor, fillColor, cb);
      return;
    }
    var y = pixelsToCheck.pop();
    var x = pixelsToCheck.pop();
    var currentColor = getPixel(x, y, width, height, data);
    if (currentColor === targetColor) {
      tickCount++;
      data[y * width + x] = fillColor;
      pixelsToCheck.push(x + 1, y);
      pixelsToCheck.push(x - 1, y);
      pixelsToCheck.push(x, y + 1);
      pixelsToCheck.push(x, y - 1);
    }
  }
  cb();
}

function floodFill(data, x, y, fillColor, width, height, cb) {

  // get the color we're filling
  var targetColor = getPixel(x,y, width,height, data);

  // check we are actually filling a different color
  if (targetColor !== fillColor) {
    doWhile([x, y], width, height, data, targetColor, fillColor, cb);
  } else {
    cb()
  }
}
export {floodFill}
