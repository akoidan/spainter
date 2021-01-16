import {Tool} from "@/types/model";
import {Appliable} from "@/utils/Appliable";

class Crop extends Appliable implements Tool {

  keyActivator = {
    code: 'KeyC',
    icon: 'icon-crop',
    title: 'Crop Image (Shift+C)'
  }

  public bufferHandler = true;
  getCursor () {
    return 'crosshair';
  }
  onApply () {
    var params = self.resizer.params;
    if (!params.width || !params.height) {
      logger.debug("Can't crop to {}x{}", params.width, params.height)();
    } else {
      self.buffer.startAction();
      var img = self.ctx.getImageData(params.left, params.top, params.width, params.height);
      self.helper.setDimensions(params.width, params.height);
      self.ctx.putImageData(img, 0, 0);
      self.buffer.finishAction(img);
      self.setMode('pen');
    }
  }
  onActivate() {
    this.disableApply();
  }
  onZoomChange() {
    self.resizer.onZoomChange();
  }
  onDeactivate() {
    self.resizer.hide();
    this.enableApply();
  }
  onMouseDown (e) {
    self.resizer.show();
    this.disableApply();
    self.resizer.setData(e.offsetY, e.offsetX, 0, 0);
    self.resizer.trackMouseMove(e, 'br');
  }
  onMouseUp (e) {
    var params = self.resizer.params;
    if (!params.width || !params.height) {
      self.resizer.hide();
    } else {
      this.onApply();
    }

  }
}

export {Crop}
