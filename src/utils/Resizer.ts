import {CssUtils} from "@/utils/CssUtils";


class Resizer {

  constructor() {
  }
  var tool = this;
  this.cursorStyle = document.createElement('style');
  document.head.appendChild(this.cursorStyle);
  this.imgHolder = self.dom.paintCrpRect;
  this.params = {
    alias: {
      width: 'ow',
      height: 'oh',
      top: 'oy',
      left: 'ox'
    }
restoreOrd(name, padd) {
      logger.debug("restore ord {} {}", name, padd)();
      var alias = this.params.alias[name];
      this.params[name] = this.params.lastCoord[alias] + (padd ? this.params.lastCoord[padd] : 0)  ;
      this.imgHolder.style[name] = this.params[name]* self.zoom + 'px';
    }
setOrd(name, v, ampl, padding) {
      logger.debug("setOrd ord {} {} {} {}", name, v, ampl, padding)();
      ampl = ampl || 1;
      padding = padding || 0;
      var alias = this.params.alias[name];
      this.imgHolder.style[name] = ampl * ((this.params.lastCoord[alias] + padding) * self.zoom)+ v + 'px';
      this.params[name] = ampl * this.params.lastCoord[alias] + v / self.zoom + padding;
    }
rotate() {
      var w = this.imgHolder.style.width;
      this.imgHolder.style.width = this.imgHolder.style.height;
      this.imgHolder.style.height = w;
      w = this.params.width;
      this.params.width = this.params.height;
      this.params.height = w;
    }
  };
  setMode (m) {
    this.mode = m;
  };
  setData (t, l, w, h) {
    this.params.top = t / self.zoom;
    this.params.left = l / self.zoom;
    this.params.width = w;
    this.params.height = h;
    this.imgHolder.style.left = l - 1 + 'px';
    this.imgHolder.style.top = t - 1 + 'px';
    this.imgHolder.style.width = w * self.zoom + 2 + 'px';
    this.imgHolder.style.height = h * self.zoom + +2 + 'px';
  };
  _setCursor (cursor) {
    this.cursorStyle.textContent = cursor ? (".paintPastedImg, .paint-crp-rect, .painter {cursor: " + cursor + " !important}") : "";
  };
  onZoomChange () {
    this.imgHolder.style.width = this.params.width * self.zoom + 2 + 'px';
    this.imgHolder.style.height = this.params.height * self.zoom + 2 + 'px';
    this.imgHolder.style.top = this.params.top * self.zoom - 1 + 'px';
    this.imgHolder.style.left = this.params.left * self.zoom - 1 + 'px';
  };
  show () {
    CssUtils.showElement(this.imgHolder);
    logger.debug("Adding mouseUp doc listener")();
    document.addEventListener('mouseup', this.docMouseUp);
    document.addEventListener('touchend', this.docMouseUp);
  };
  hide() {
    this._setCursor(null);
    CssUtils.hideElement(this.imgHolder);
    logger.debug("Removing mouseUp doc listener")();
    this.docMouseUp();
    document.removeEventListener('mouseup', this.docMouseUp);
    document.removeEventListener('touchend', this.docMouseUp);
  };
  trackMouseMove(e, mode) {
    logger.debug("Resizer mousedown")();
    this.mode = mode || e.target.getAttribute('pos');
    self.dom.canvasWrapper.addEventListener('mousemove', this.handleMouseMove);
    self.dom.canvasWrapper.addEventListener('touchmove', this.handleMouseMove);
    this.setParamsFromEvent(e);
    this._setCursor(this.cursors[this.mode]);
  };
  this.imgHolder.onmousedown = this.trackMouseMove;
  this.imgHolder.ontouchstart = this.trackMouseMove;
  setParamsFromEvent(e) {
    var pxy =self.helper.getPageXY(e);
    this.params.lastCoord = {
      x: pxy.pageX,
      y: pxy.pageY,
      ox: this.params.left, // origin x
      oy: this.params.top, // origin y
      ow: this.params.width, // origin width
      oh: this.params.height, // origin height
      op: this.params.width / this.params.height // origin proportion
    };
    // ( lastCoord.op * x)^2 + x^2 = z;
    this.params.lastCoord.nl = Math.pow(this.params.lastCoord.op, 2) + 1;
  };
  docMouseUp (e) {
    //logger.debug("Resizer mouseup")();
    self.dom.canvasWrapper.removeEventListener('mousemove', this.handleMouseMove);
    self.dom.canvasWrapper.removeEventListener('touchmove', this.handleMouseMove);
  };
  this.cursors = {
    m: 'move',
    b: 's-resize',
    t: 's-resize',
    l: 'e-resize',
    r: 'e-resize',
    tl: 'se-resize',
    br: 'se-resize',
    bl: 'ne-resize',
    tr: 'ne-resize'
  };
  this.handlers = {
    m (x, y) {
      this.params.setOrd('top', y);
      this.params.setOrd('left', x);
    }
b (x, y) {
      if (y / self.zoom < -this.params.lastCoord.oh) {
        this.params.setOrd('height', -y, -1);
        this.params.setOrd('top', y, null, this.params.lastCoord.oh);
      } else {
        this.params.setOrd('height', y);
        this.params.restoreOrd('top');
      }
    }
t (x, y) {
      if (y / self.zoom > this.params.lastCoord.oh) {
        this.params.setOrd('height', y, -1);
        this.params.restoreOrd('top', 'oh');
      } else {
        this.params.setOrd('top', y);
        this.params.setOrd('height', -y);
      }
    }
l (x, y) {
      if (x / self.zoom  > this.params.lastCoord.ow) {
        this.params.setOrd('width', x, -1);
        this.params.restoreOrd('left', 'ow');
      } else {
        this.params.setOrd('left', x);
        this.params.setOrd('width', -x);
      }
    }
r (x, y) {
      if (x / self.zoom  < -this.params.lastCoord.ow) {
        this.params.setOrd('width', -x, -1);
        this.params.setOrd('left', x, null, this.params.lastCoord.ow);
      } else {
        this.params.restoreOrd('left');
        this.params.setOrd('width', x);
      }
    }
  };
  calcProportion (x, y) {
    var d = {
      tl: {dx: 1, dy: 1},
      tr: {dx: 1, dy: -1},
      bl: {dx: -1, dy: 1},
      br: {dx: 1, dy: 1}
    }[this.mode];
    var dx = x > 0 ? 1 : -1;
    var dy = y > 0 ? 1 : -1;
    var nl = x * x * dx * d.dx + y * y * dy * d.dy;
    var dnl = nl > 0 ? 1 : -1;
    var v = dnl * Math.sqrt(Math.abs(nl) / this.params.lastCoord.nl);
    y = v * d.dy;
    x = v * this.params.lastCoord.op * d.dx;
    return {x: x, y: y};
  };
  handleMouseMove (e) {
    //logger.debug('handleMouseMove {}', e)();
    var pxy =self.helper.getPageXY(e);
    var x = pxy.pageX - this.params.lastCoord.x;
    var y = pxy.pageY - this.params.lastCoord.y;
    if (e.shiftKey && this.mode.length === 2) {
      var __ret = this.calcProportion(x, y);
      x = __ret.x;
      y = __ret.y;
    }
    logger.debug('handleMouseMove ({}, {})', x, y)();
    this.handlers[this.mode.charAt(0)](x, y);
    if (this.mode.length === 2) {
      this.handlers[this.mode.charAt(1)](x, y);
    }
  }
}
