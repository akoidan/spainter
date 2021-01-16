import {Tool} from "@/types/model";
import {Appliable} from "@/utils/Appliable";

class Eraser extends Appliable implements Tool {

  public keyActivator = {
    code: 'KeyD',
    icon: 'icon-eraser',
    title: 'Eraser (Shift+D)'
  };
  onZoomChange () {
    self.helper.setCursor(this.getCursor());
  };
  getCursor () {
    return self.helper.buildCursor('#aaaaaa', ' stroke="black" stroke-width="2"', self.ctx.lineWidth);
  };
  onChangeRadius (e) {
    self.helper.setCursor(this.getCursor());
  };
  onActivate () {
    this.tmpAlpha = self.ctx.globalAlpha;
    self.ctx.globalAlpha = 1;
    self.ctx.globalCompositeOperation = "destination-out";
  };
  onDeactivate () {
    self.ctx.globalAlpha = this.tmpAlpha;
    self.ctx.globalCompositeOperation = "source-over";
  };
  onMouseDown (e) {
    var coord = self.helper.getXY(e);
    self.ctx.moveTo(coord.x, coord.y);
    self.ctx.beginPath();
    this.onMouseMove(e, coord)
  };
  onMouseMove (e, coord) {
    self.ctx.lineTo(coord.x, coord.y);
    self.ctx.stroke();
  };
  onMouseUp () {
    self.ctx.closePath();
  };
}

export {Eraser}
