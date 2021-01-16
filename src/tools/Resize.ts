import {Appliable} from "@/utils/Appliable";
import {Tool} from "@/types/model";

class Resize extends Appliable implements Tool  {
  var tool = this;
  keyActivator = {
    code: 'KeyW',
    icon: 'icon-resize',
    title: 'Change dimensions (Shift+W)'
  };
  this.container = self.dom.paintResizeTools;
  this.width = this.container.querySelector('[placeholder=width]');
  this.height = this.container.querySelector('[placeholder=height]');
  lessThan4(e) {
    if (this.value.length > 4) {
      this.value = this.value.slice(0, 4);
    }
  };
  onlyNumber(e) {
    var charCode = e.which || e.keyCode;
    return  charCode > 47 && charCode < 58;
  };
  this.width.onkeypress = this.onlyNumber;
  this.width.oninput = this.lessThan4;
  this.height.oninput = this.lessThan4;
  this.height.onkeypress = this.onlyNumber;
  onApply() {
    var data = self.buffer.startAction();
    self.helper.setDimensions(this.width.value, this.height.value);
    self.ctx.putImageData(data, 0, 0);
    self.buffer.finishAction();
    self.setMode('pen')
  };
  getCursor() {
    return null;
  };
  onActivate() {
    CssUtils.showElement(this.container);
    this.width.value = self.dom.canvas.width;
    this.height.value = self.dom.canvas.height;
  };
  onDeactivate() {
    CssUtils.hideElement(this.container);
  };
}



export  {Resize}
