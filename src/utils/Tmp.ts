import {Painter} from "@/utils/Painter";

class Tmp {

  private tmpCanvas: HTMLCanvasElement;
  private tmpData: CanvasRenderingContext2D;
  private painter: Painter;

  constructor(painter: Painter) {
    this.tmpCanvas = document.createElement('canvas');
    this.tmpData = this.tmpCanvas.getContext('2d')!;
    this.painter = painter;

  }

 saveState() {
    this.tmpCanvas.width = self.dom.canvas.width;
    this.tmpCanvas.height = self.dom.canvas.height;
    this.tmpData.clearRect(0, 0, self.dom.canvas.width, self.dom.canvas.height);
    this.tmpData.drawImage(self.dom.canvas, 0, 0);
    this.painter.logger.debug("Context saved")();
  }

  restoreState() {
    self.ctx.clearRect(0, 0, self.dom.canvas.width, self.dom.canvas.height);
    self.helper.drawImage(this.tmpCanvas, 0, 0);
    //clear in case new image is transparen
  }
}

export {Tmp}
