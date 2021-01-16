import {Appliable} from "@/utils/Appliable";
import {Tool} from "@/types/model";

class Rect extends Appliable implements Tool  {
  var tool = this;
  keyActivator = {
    code: 'KeyQ',
    icon: 'icon-rect',
    title: 'Rectangle (Shift+Q)'
  };
  getCursor () {
    return 'crosshair';
  };
  onChangeRadius (e) { };
  onChangeColor (e) { };
  onChangeOpacity (e) { };
  onChangeColorFill (e) { };
  onChangeFillOpacity (e) { };
  onMouseDown (e) {
    self.tmp.saveState();
    this.startCoord = self.helper.getXY(e);
    this.onMouseMove(e, this.startCoord)
  };
  calcProportCoord(currCord) {
    if (currCord.w < currCord.h) {
      currCord.h = currCord.w;
    } else {
      currCord.w = currCord.h;
    }
  };
  onMouseMove (e, endCoord) {
    var dim = {
      w: endCoord.x - this.startCoord.x,
      h: endCoord.y - this.startCoord.y,
    };
    if (e.shiftKey) {
      this.calcProportCoord(dim);
    }
    self.ctx.beginPath();
    self.tmp.restoreState();
    self.ctx.rect(this.startCoord.x, this.startCoord.y, dim.w, dim.h);
    self.ctx.globalAlpha = self.instruments.opacityFill.inputValue;
    self.ctx.fill();
    self.ctx.globalAlpha = self.instruments.opacity.inputValue;
    self.ctx.stroke();
  };
}



export  {Rect}
