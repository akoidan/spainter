import {Appliable} from "@/utils/Appliable";
import {Tool} from "@/types/model";

class Move extends Appliable implements Tool {
  var tool = this;
  keyActivator = {
    code: 'KeyM',
    icon: 'icon-move',
    title: 'Move (Shift+M)'
  };
  getCursor () {
    return 'move';
  };
  onMouseDown (e) {
    var pxy = self.helper.getPageXY(e);
    this.lastCoord = {x: pxy.pageX, y: pxy.pageY};
  };
  onMouseMove (e) {
    var pxy = self.helper.getPageXY(e);
    var x = this.lastCoord.x - pxy.pageX;
    var y = this.lastCoord.y - pxy.pageY;
    logger.debug("Moving to: {{}, {}}", x, y)();
    self.dom.canvasWrapper.scrollTop += y;
    self.dom.canvasWrapper.scrollLeft += x;
    this.lastCoord = {x: pxy.pageX, y: pxy.pageY};
    // logger.debug('X,Y: {{}, {}}', self.dom.canvasWrapper.scrollLeft, self.dom.canvasWrapper.scrollTop )();
  };
  onMouseUp (coord) {
    this.lastCoord = null;
  };
}



export  {Move}
