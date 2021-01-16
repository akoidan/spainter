import {Appliable} from "@/utils/Appliable";
import {Tool} from "@/types/model";

class Line extends Appliable implements Tool  {
  var tool = this;
  keyActivator = {
    code: 'KeyL',
    icon: 'icon-line',
    title: 'Line (Shift+L)'
  };
  getCursor () {
    return 'crosshair';
  };
  onChangeColor (e) { };
  onChangeRadius (e) { };
  onChangeOpacity (e) { };
  onMouseDown (e) {
    self.tmp.saveState();
    this.startCoord = self.helper.getXY(e);
    this.onMouseMove(e, this.startCoord);
  };
  calcProportCoord(currCord) {
    var deg = Math.atan((this.startCoord.x - currCord.x) / (currCord.y - this.startCoord.y)) * 8 / Math.PI;
    if (Math.abs(deg) < 1) { // < 45/2
      currCord.x = this.startCoord.x;
    } else if (Math.abs(deg) > 3) { // > 45 + 45/2
      currCord.y = this.startCoord.y;
    } else {
      var base = (Math.abs(currCord.x - this.startCoord.x) + Math.abs(currCord.y - this.startCoord.y, 2)) / 2;
      currCord.x = this.startCoord.x + base * (this.startCoord.x < currCord.x ? 1 : -1);
      currCord.y = this.startCoord.y + base * (this.startCoord.y < currCord.y ? 1 : -1);
    }
  };
  onMouseMove (e, currCord) {
    self.tmp.restoreState();
    self.ctx.beginPath();
    if (e.shiftKey) {
      this.calcProportCoord(currCord);
    }
    self.ctx.moveTo(this.startCoord.x, this.startCoord.y);
    self.ctx.lineTo(currCord.x, currCord.y);
    self.ctx.stroke();
  };
  onMouseUp (e) {
    self.ctx.closePath();
  };
}



export  {Line}
