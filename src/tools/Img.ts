import {Appliable} from "@/utils/Appliable";
import {Tool} from "@/types/model";

class Img extends Appliable implements Tool {
  keyActivator = {
    icon: 'icon-picture spainterHidden',
    title: 'Pasting image'
  };
  this.img = self.dom.paintPastedImg;
  this.bufferHandler = true;
  this.imgObj = null;
  readAndPasteCanvas (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      this.imgObj = new Image();
      var b64 = event.target.result;
      this.imgObj.onload = function () {
        this.img.src = b64;
        self.resizer.setData(
            self.dom.canvasWrapper.scrollTop,
            self.dom.canvasWrapper.scrollLeft,
            this.imgObj.width,
            this.imgObj.height
        );
      };
      this.imgObj.src = b64;
    };
  };
  getCursor () {
    return null;
  };
  onApply (event) {
    var data = self.buffer.startAction();
    var params = self.resizer.params;
    var nw = params.left + params.width;
    var nh = params.top + params.height;
    if (nw > self.dom.canvas.width || nh > self.dom.canvas.height) {
      self.helper.setDimensions(
          Math.max(nw, self.dom.canvas.width),
          Math.max(nh, self.dom.canvas.height)
      );
      self.ctx.putImageData(data, 0, 0);
    }
    self.helper.drawImage(this.imgObj,
        0, 0, this.imgObj.width, this.imgObj.height,
        params.left, params.top, params.width, params.height);
    self.buffer.finishAction();
    self.setMode('pen');
  };
  this.onZoomChange = self.resizer.onZoomChange;
  onActivate(e) {
    self.resizer.show();
    CssUtils.showElement(this.img);
  };
  onDeactivate() {
    this.onApply();
    self.resizer.hide();
    CssUtils.hideElement(this.img);
  };
}



export  {Img}
