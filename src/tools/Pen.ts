import {Appliable} from "@/utils/Appliable";
import {Tool} from "@/types/model";

class Pen extends Appliable implements Tool {
var tool = this;
  keyActivator = {
    code: 'KeyB',
    icon: 'icon-brush-1',
    title: 'Brush (Shift+B)'
  };
  onChangeColor (e) {
    self.helper.setCursor(this.getCursor());
  };
  onZoomChange (e) {
    self.helper.setCursor(this.getCursor());
  };
  onChangeRadius (e) {
    self.helper.setCursor(this.getCursor());
  };
  onChangeOpacity (e) {
    self.helper.setCursor(this.getCursor());
  };
  getCursor () {
    return self.helper.buildCursor(self.ctx.strokeStyle, '', self.ctx.lineWidth);
  };
  onActivate () {
    self.ctx.lineJoin = 'round';
    self.ctx.lineCap = 'round';
  };
  onMouseDown (e) {
    var coord = self.helper.getXY(e);
    self.ctx.moveTo(coord.x, coord.y);
    this.points = [];
    self.tmp.saveState();
    this.onMouseMove(e, coord)
  };
  onMouseMove (e, coord) {
    // logger.debug("mouse move,  points {}", JSON.stringify(this.points))();
    self.tmp.restoreState();
    this.points.push(coord);
    self.ctx.beginPath();
    self.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (var i = 0; i < this.points.length; i++) {
      self.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    self.ctx.stroke();
  };
  onMouseUp (e) {
    self.ctx.closePath();
    this.points = [];
  };
}



export  {Pen}
