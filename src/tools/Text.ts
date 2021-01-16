import {Appliable} from "@/utils/Appliable";
import {Tool} from "@/types/model";

class Text extends Appliable implements Tool  {


  constructor(props) {
    super(props);

    this.span = self.dom.paintTextSpan;
    //prevent self.events.contKeyPress
    span.addEventListener('keypress', function (e) {
      if (e.keyCode !== 13 || e.shiftKey) {
        e.stopPropagation(); //proxy onapply
      }
    });
  }

  keyActivator = {
    code: 'KeyT',
    icon: 'icon-text',
    title: 'Text (Shift+T)'
  };


  bufferHandler = true;
  onChangeFont (e) {
    this.span.style.fontFamily = e.target.value;
  };
  onActivate () { // TODO this looks bad
    this.disableApply();
    this.onChangeFont({target: {value: self.ctx.fontFamily}});
    this.onChangeRadius({target: {value: self.ctx.lineWidth}});
    this.onChangeFillOpacity({target: {value: self.instruments.opacityFill.inputValue * 100}});
    this.onChangeColorFill({target: {value: self.ctx.fillStyle}});
    this.span.innerHTML = '';
  };
  onDeactivate () {
    if (this.lastCoord) {
      this.onApply();
    }
    CssUtils.hideElement(this.span);
  };
  onApply () {
    self.buffer.startAction();
    self.ctx.font = (5 + self.ctx.lineWidth) + "px "+ self.ctx.fontFamily;
    self.ctx.globalAlpha = self.instruments.opacityFill.inputValue;
    var width = 5 + self.ctx.lineWidth; //todo lineheight causes so many issues
    var lineheight = parseInt(width * 1.25);
    var linediff = parseInt(width * 0.01);
    var lines = this.span.textContent.split('\n');
    for (var i = 0; i < lines.length; i++) {
      self.ctx.fillText(lines[i], this.lastCoord.x, width + i * lineheight + this.lastCoord.y - linediff);
    }
    self.ctx.globalAlpha = self.instruments.opacity.inputValue;
    self.buffer.finishAction();
    self.setMode('pen');
  };
  onZoomChange () {
    this.span.style.fontSize = (self.zoom * (self.ctx.lineWidth + 5)) + 'px';
    this.span.style.top = (this.originOffest.y * self.zoom  / this.originOffest.z) + 'px';
    this.span.style.left = (this.originOffest.x * self.zoom  / this.originOffest.z) + 'px';
  };
  getCursor () {
    return 'text';
  };
  onChangeRadius (e) {
    this.span.style.fontSize = (self.zoom * (5 + parseInt(e.target.value))) + 'px';
  };
  onChangeFillOpacity (e) {
    this.span.style.opacity = e.target.value / 100
  };
  onChangeColorFill (e) {
    this.span.style.color = e.target.value;
  };
  onMouseDown (e) {
    CssUtils.showElement(this.span);
    this.originOffest = {
      x: e.offsetX,
      y: e.offsetY,
      z: self.zoom
    };
    this.enableApply();
    this.span.style.top = this.originOffest.y +'px';
    this.span.style.left = this.originOffest.x +'px';
    this.lastCoord = self.helper.getXY(e);
    setTimeout(function (e) {
      this.span.focus()
    });
  };
}

export  {Text}
