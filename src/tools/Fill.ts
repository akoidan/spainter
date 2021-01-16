import {floodFill} from "@/utils/floodFill";
import {Tool} from "@/types/model";
import FLOOD_FILL_CURSOR from '@/assets/floodfill.svg';
import {Appliable} from "@/utils/Appliable";

class Fill extends Appliable implements Tool {

  keyActivator = {
    code: 'KeyF',
    icon: 'icon-fill',
    title: 'Flood Fill (Shift+F)'
  };

  bufferHandler = true;
  buildCursor() {
    var rawString = format(FLOOD_FILL_CURSOR, self.ctx.fillStyle);
    return format('url(data:image/svg+xml;base64,{}) {} {}, auto')(btoa(rawString), 39, 86);
  }
  getCursor() {
    return this.buildCursor();
  }
  onChangeColorFill(e) {
    self.helper.setCursor(this.buildCursor());
  }
  getRGBA () {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(self.ctx.fillStyle);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b =parseInt(result[3], 16);
    var a =(self.instruments.opacityFill.inputValue || 0) * 255;
    if (!result) {
      throw Error("Invalid color");
    }
    //https://stackoverflow.com/a/14963574/3872976
    //return a << 24 | (b << 16) | (g << 8) | r; this doesn't work because it's signed int, we need unsinged
    return new Uint32Array(new Uint8Array([r,g,b,a]).buffer)[0];
  }
  onMouseDown (e) {
    if (!((self.dom.canvas.width * self.dom.canvas.height) < 4000001)) {
      alert("Can't flood fill, because your browser is unable to process canvas size " + self.dom.canvas.width + "x" + self.dom.canvas.height+ ", which is more than 4kk pixels.");
    } else {
      var floodFillIcon = $('.' + this.keyActivator.icon);
      if (CssUtils.hasClass(floodFillIcon, 'disabled')) {
        return
      }
      var xy = self.helper.getXY(e);
      var image = self.buffer.startAction();
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray#Browser_compatibility
      var processData = new Uint32Array(image.data.slice(0).buffer); // clone data,so we won't modify history

      CssUtils.addClass(floodFillIcon, 'disabled');
      floodFill(processData, xy.x, xy.y, this.getRGBA(), image.width, image.height, function() {
        CssUtils.removeClass(floodFillIcon, 'disabled');
        var resultingImg = new ImageData(new Uint8ClampedArray(processData.buffer), image.width, image.height);
        self.ctx.putImageData(resultingImg, 0, 0);
        self.buffer.finishAction(resultingImg);
      });
    }
  }
}

export {Fill}
