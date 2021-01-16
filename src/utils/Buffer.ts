import {CssUtils} from "@/utils/CssUtils";

class Buffer {
  var tool = this;
  var undoImages = [];
  var redoImages = [];
  var buStateData = ['lineWidth', 'fillStyle', 'strokeStyle', 'fontFamily', 'font', 'globalAlpha', 'lineJoin', 'lineCap', 'globalCompositeOperation'];
  var current = null;
  getCanvasImage (img) {
    return {
      width: self.dom.canvas.width,
      height: self.dom.canvas.height,
      data: img || self.ctx.getImageData(0, 0, self.dom.canvas.width, self.dom.canvas.height)
    }
  };
  clear () {
    undoImages = [];
    redoImages = [];
    current = null;
  };
  getUndo() {
    return undoImages;
  };
  getRedo() {
    return redoImages;
  };
  dodo(from, to) {
    var restore = from.pop();
    if (restore) {
      to.push(current);
      current = restore;
      if (self.dom.canvas.width != current.width
          || self.dom.canvas.height != current.height) {
        logger.debug("Resizing canvas from {}x{} to {}x{}",
            self.dom.canvas.width, self.dom.canvas.height,
            current.width, current.height
        )();
        self.helper.setDimensions(current.width, current.height)
      }
      self.ctx.putImageData(restore.data, 0, 0);
      this.setIconsState();
    }
  };
  setIconsState() {
    CssUtils.setClassToState($('.icon-redo'), redoImages.length, 'disabled');
    CssUtils.setClassToState($('.icon-undo'), undoImages.length, 'disabled');
  };
  redo () {
    this.dodo(redoImages, undoImages);
  };
  undo () {
    this.dodo(undoImages, redoImages);
  };
  finishAction (img) {
    logger.debug('finish action')();
    if (current) {
      undoImages.push(current);
    }
    redoImages = [];
    this.setIconsState();
    current = this.getCanvasImage(img);
    self.helper.applyZoom();
  };
  getState() {
    var d = {};
    buStateData.forEach(function (e) {
      d[e] = self.ctx[e];
    });
    return d;
  };
  restoreState (state) {
    buStateData.forEach(function (e) {
      self.ctx[e] = state[e];
    });
  };
  setCurrent(newCurrent) {
    current = newCurrent;
  };
  startAction () {
    logger.debug('start action')();
    if (!current) {
      current = this.getCanvasImage();
    }
    return current.data;
  };
}
