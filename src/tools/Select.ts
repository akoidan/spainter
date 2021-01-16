import {Appliable} from "@/utils/Appliable";
import {Tool} from "@/types/model";

class Select extends Appliable implements Tool  {
  var tool = this;
  self.Appliable.call(this);
  keyActivator = {
    code: 'KeyS',
    icon: '' +
        'icon-selection',
    title: 'Select (Shift+S)'
  };
  this.bufferHandler = true;
  this.domImg = self.dom.paintPastedImg;
  getCursor () {
    return 'crosshair';
  };
  onActivate() {
    this.inProgress = false;
    this.mouseUpClicked = false;
  };
  // document.addEventListener('copy', this.onCopy);
  this.onZoomChange = self.resizer.onZoomChange;
  onDeactivate () {
    if (this.inProgress) {
      var params = self.resizer.params;
      logger.debug(
          'Applying image {}, {}x{}, to  {x: {}, y: {}, w: {}, h:{}',
          this.imgInfo.width,
          this.imgInfo.height,
          params.left,
          params.top,
          params.width,
          params.height
      )();
      self.helper.drawImage(this.domImg,
          0, 0, this.imgInfo.width, this.imgInfo.height,
          params.left, params.top, params.width, params.height);
      self.buffer.finishAction();
      this.inProgress = false; // don't restore in onDeactivate
    }
    self.resizer.hide();
    CssUtils.hideElement(this.domImg);
  };
  isSelectionActive() {
    return self.mode === 'select' && this.inProgress && this.mouseUpClicked;
  };
  onMouseDown (e) {
    //logger.debug('select mouseDown')();
    this.onDeactivate();
    this.mouseUpClicked = false;
    self.resizer.show();
    self.resizer.setData(e.offsetY, e.offsetX, 0, 0);
    self.resizer.trackMouseMove(e, 'br');
  };
  onMouseUp (e) {
    if (this.mouseUpClicked) {
      return;
    }
    var params = self.resizer.params;
    if (!params.width || !params.height) {
      self.resizer.hide();
    } else {
      //logger.debug('select mouseUp')();
      this.inProgress = true;
      this.mouseUpClicked = true;
      var imageData = self.ctx.getImageData(params.left, params.top, params.width, params.height);
      tmpCanvasContext.canvas.width = params.width;
      tmpCanvasContext.canvas.height = params.height;
      this.imgInfo = {width: params.width, height: params.height};
      tmpCanvasContext.putImageData(imageData, 0, 0);
      CssUtils.showElement(this.domImg);
      this.domImg.src = tmpCanvasContext.canvas.toDataURL();
      self.buffer.startAction();
      self.ctx.clearRect(params.left, params.top, params.width, params.height);
    }
  };
  rotateInfo() {
    var c = this.imgInfo.width;
    this.imgInfo.width = this.imgInfo.height;
    this.imgInfo.height = c;
    self.resizer.params.rotate();
  };
  getAreaData() {
    return {
      width: this.imgInfo.width,
      height: this.imgInfo.height,
      img: this.domImg
    }
  };
}

export {Select}
