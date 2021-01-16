import {Tool} from "@/types/model";
import {Appliable} from "@/utils/Appliable";

class Ellipse extends Appliable implements Tool {

  keyActivator = {
    code: 'KeyE',
    icon: 'icon-ellipse',
    title: 'Eclipse (Shift+E)'
  }
  getCursor () {
    return 'crosshair';
  }

  onMouseDown (e, data) {
    self.tmp.saveState();
    this.startCoord = self.helper.getXY(e);
    this.onMouseMove(e, this.startCoord)
  }
  calcProportCoord(currCord) {
    if (currCord.w < currCord.h) {
      currCord.h = currCord.w;
    } else {
      currCord.w = currCord.h;
    }
  }
  draw (x, y, w, h) {
    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle
    self.ctx.moveTo(x, ym);
    self.ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    self.ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    self.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    self.ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  }
  onMouseMove (e, endCoord) {
    var dim = {
      w: endCoord.x - this.startCoord.x,
      h: endCoord.y - this.startCoord.y
    }
    self.tmp.restoreState();
    self.ctx.beginPath();
    if (e.shiftKey) {
      this.calcProportCoord(dim);
    }
    this.draw(this.startCoord.x, this.startCoord.y, dim.w, dim.h);
    self.ctx.closePath();
    self.ctx.globalAlpha = self.instruments.opacityFill.inputValue;
    self.ctx.fill();
    self.ctx.globalAlpha = self.instruments.opacity.inputValue;
    self.ctx.stroke();
  }
}

export {Ellipse}
