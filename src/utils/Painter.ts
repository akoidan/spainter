
import {Tmp} from "@/utils/Tmp";


import {Logger} from "lines-logger";
import baseHtml from  '@/assets/base.html'
import {DomElements, InstrumentName, PainterConf} from "@/types/model";
import {Instrument} from "@/instruments/Instrument";
import {Color} from "@/instruments/Color";
import {Opacity} from "@/instruments/Opacity";
import {ColorFill} from "@/instruments/ColorFill";
import {OpacityFill} from "@/instruments/OpactiyFill";
import {Width} from "@/instruments/Width";
import {Font} from "@/instruments/Font";
import {Apply} from "@/instruments/Apply";
import {CssUtils} from "@/utils/CssUtils";
import {Tools} from "@/tools";


const reverseExponentialMap = {'0': '0', '1': 5, '2': 13, '3': 18, '4': 21, '5': 24, '6': 27, '7': 29, '8': 30, '9': 32, '10': 34, '11': 35, '12': 36, '13': 37, '14': 38, '15': 39, '16': 40, '17': 41, '18': 42, '19': 43, '21': 44, '22': 45, '24': 46, '26': 47, '28': 48, '30': 49, '32': 50, '34': 51, '36': 52, '39': 53, '42': 54, '45': 55, '48': 56, '51': 57, '55': 58, '59': 59, '63': 60, '68': 61, '72': 62, '78': 63, '83': 64, '89': 65, '100': 66};
// Fn(x) = Math.round(Math.exp((Math.log(1000)/100) * x
const exponentialMap = {'0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 2, '7': 2, '8': 2, '9': 2, '10': 2, '11': 2, '12': 2, '13': 2, '14': 3, '15': 3, '16': 3, '17': 3, '18': 3, '19': 4, '20': 4, '21': 4, '22': 5, '23': 5, '24': 5, '25': 6, '26': 6, '27': 6, '28': 7, '29': 7, '30': 8, '31': 9, '32': 9, '33': 10, '34': 10, '35': 11, '36': 12, '37': 13, '38': 14, '39': 15, '40': 16, '41': 17, '42': 18, '43': 19, '44': 21, '45': 22, '46': 24, '47': 26, '48': 28, '49': 30, '50': 32, '51': 34, '52': 36, '53': 39, '54': 42, '55': 45, '56': 48, '57': 51, '58': 55, '59': 59, '60': 63, '61': 68, '62': 72, '63': 78, '64': 83, '65': 89, '66': 100}


// tools
// buffer, reziser, ctx, helper, setDimensions, setMode, tmp, getXY, setCursor, zoom, buffer


class Painter {
  private containerPaitner: HTMLElement;
  private conf: PainterConf;
  public logger: Logger;
  private mouseWheelEventName: string;
  private tmpCanvasContext: CanvasRenderingContext2D;
  private dom: DomElements;
  private ctx: CanvasRenderingContext2D;
  private cssUtils: CssUtils;

  private instruments: Record< InstrumentName, Instrument>;

  private zoom: number = 1;
  private ZOOM_SCALE: number= 1.1;
  private PICKED_TOOL_CLASS: string = 'active-icon';
  private tmp: Tmp;
  private tools: Tools;

  constructor(container: HTMLElement, conf?: PainterConf) {
    this.containerPaitner = container;
    if (!conf) {
      this.conf = {};
    } else {
      this.conf = conf;
    }

    if (this.conf.logger) {
      this.logger = this.conf.logger;
    } else {
      // @ts-ignore
      this.logger = {
        debug () {
          return function () {
          };
        }
      }
    }
    this.tools = new Tools(this);
    this.containerPaitner.innerHTML = baseHtml;

    this.mouseWheelEventName = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
    this.tmpCanvasContext = document.createElement('canvas').getContext('2d')!;

    this.dom = {
      container: this.containerPaitner,
      canvas: this.$('canvas'),
      bottomTools: this.$('.bottomTools'),
      paintDimensions: this.$('.paintDimensions'),
      paintXY: this.$('.paintXY'),
      trimImage :  this.$('.trimImage'),
      header: document.createElement('div'),
      canvasResize: this.$('.canvasResize'),
      canvasWrapper: this.$('.canvasWrapper'),
      painterTools: this.$('.painterTools'),
      paintPastedImg: this.$('.paintPastedImg'),
      paintSend: this.$('.paintSend'),
      paintCrpRect: this.$('.paint-crp-rect'),
      paintTextSpan:  this.$('.paintTextSpan'),
      paintResizeTools: this.$('.paintResizeTools'),

    };
    this.tmp = new Tmp(this);


    Object.keys(this.init).forEach(function (k) {
      this.init[k]()
    });


  }


  initInstruments () {


    let instruments: Record<InstrumentName, {new(): Instrument}> = {'color': Color, 'opacity': Opacity, 'colorFill': ColorFill, 'opacityFill': OpacityFill, 'width': Width, 'font': Font,'apply': Apply}
    Object.keys(instruments).forEach( (k: InstrumentName) => {
      const instr = new instruments[k(this.ctx)];;
      this.instruments[k] = instr;

      instr.holder = document.createElement('div')
      instr.holder.title = instr.title;
      instr.holder.className = instr.holderClass;
      if (instr.hiddenByDefault) {
        this.cssUtils.hideElement(instr.holder)
      }
      if (instr.text) {
        var span = document.createElement('span');
        span.innerText = instr.text;
        instr.holder.appendChild(span);
      }
      instr.value =  instr.inputFactory();
      instr.holder.appendChild(instr.value);
      this.dom.bottomTools.appendChild(instr.holder);
      instr.value.addEventListener(instr.trigger || 'input',  (e) => {
        if (instr.range && instr.value.value.length > 2 && e.target.value != 100) { // != isntead !== in case it's a string
          instr.value.value = e.target.value.slice(0, 2)
        }
        instr.ctxSetter && instr.ctxSetter(e.target.value);
        var handler = this.tools[this.mode][instr.handler];
        handler && handler(e);
        if (instr.range) {
          instr.range.value =  reverseExponentialMap[instr.value.value];
        }
      });
      if (instr.range) {
        instr.value.addEventListener('keypress', function (e) {
          var charCode = e.which || e.keyCode;
          return charCode > 47 && charCode < 58;
        });
        if (conf.rangeFactory) {
          instr.range = conf.rangeFactory();
        } else {
          instr.range = document.createElement('input');
          instr.range.type = 'range';
        }
        instr.range.max = 66;
        var div = document.createElement('div');
        div.appendChild(instr.range);
        instr.holder.appendChild(div);
        instr.range.addEventListener('input', function (e) {
          // exponential growth
          var value = exponentialMap[instr.range.value];
          instr.value.value = value;
          instr.ctxSetter(value);
          var handler = this.tools[this.mode][instr.handler];
          handler && handler(e);
        });
      }
    });
  }


  this.dropImg = function (files, e, getter) {
    if (files) {
      for (var i = 0; i < files.length; i++) {
        if (files[i].type.indexOf('image') >= 0) {
          logger.debug("Pasting images")();
          this.setMode('img');
          this.tools.img.readAndPasteCanvas(getter(files[i]));
          e.preventDefault(e);
          return;
        }
      }
    }
  };

  this.setMode = function (mode) {
    var oldMode = this.tools[this.mode];
    this.mode = mode;
    if (oldMode) {
      oldMode.onDeactivate && oldMode.onDeactivate();
      CssUtils.removeClass(oldMode.icon, this.PICKED_TOOL_CLASS);
    }
    var newMode = this.tools[this.mode];
    newMode.onActivate && newMode.onActivate();
    newMode.getCursor && this..setCursor(newMode.getCursor());
    newMode.icon && CssUtils.addClass(newMode.icon, this.PICKED_TOOL_CLASS);
    Object.keys(this.instruments).forEach(function (k) {
      var instr = this.instruments[k];
      if (oldMode && oldMode[instr.handler]) {
        CssUtils.hideElement(instr.holder);
      }
      if (newMode[instr.handler]) {
        CssUtils.showElement(instr.holder);
      }
    });
  };

  this.show = function () {
    document.body.addEventListener('mouseup', this.events.onmouseup, false);
    document.body.addEventListener('touchend', this.events.onmouseup, false);
  };
  this.hide = function () {
    document.body.removeEventListener('mouseup', this.events.onmouseup, false);
    document.body.removeEventListener('touchend', this.events.onmouseup, false);
  };

  setUIText(text) {
    this.dom.paintXY.textContent = text + ' ' + Math.round(this.zoom * 100) + '%';
  }

  openCanvas (e) {
    this.show();
    this.buffer.clear();
    this.init.setContext();
    this.setMode('pen');
  }
  getPageXY(e) {
    return {
      pageX: e.pageX || e.touches[0].pageX,
      pageY: e.pageY || e.touches[0].pageY,
    }
  }
  pasteToTextArea () {
    if (this.dom.trimImage.checked) {
      var trimImage = this..trimImage();
      if (trimImage) {
        trimImage.toBlob(conf.onBlobPaste);
        this.hide();
      } else {
        logger.debug("image is empty")();
      }
    } else {
      this.dom.canvas.toBlob(conf.onBlobPaste);
      this.hide();
    }
  }
  drawImage() {
    var savedA = this.ctx.globalAlpha;
    this.ctx.globalAlpha = 1;
    this.ctx.drawImage.apply(this.ctx, arguments);
    this.ctx.globalAlpha = savedA;
  }
  setCursor(text) {
    this.dom.canvas.style.cursor = text;
  }
  buildCursor (fill, stroke, width) {
    width = width * this.zoom / 2
    if (width < 3) {
      width = 3;
    } else if (width > 126) {
      width = 126;
    }
    var svg = formatPos('<svg xmlns="http://www.w3.org/2000/svg" height="128" width="128"><circle cx="64" cy="64" r="{0}" fill="{1}"{2}/></svg>')(width, fill, stroke);
    return format('url(data:image/svg+xml;base64,{}) {} {}, auto')(btoa(svg), 64, 64);
  }
  isNumberKey (evt) {
    var charCode = evt.which || evt.keyCode;
    return charCode > 47 && charCode < 58;
  }
  trimImage () { // TODO this looks bad
    var pixels = this.ctx.getImageData(0, 0, this.dom.canvas.width, this.dom.canvas.height),
        l = pixels.data.length,
        i,
        bound = {
          top: null,
          left: null,
          right: null,
          bottom: null
        },
        x, y;
    for (i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        x = (i / 4) % this.dom.canvas.width;
        y = ~~((i / 4) / this.dom.canvas.width);
        if (bound.top === null) {
          bound.top = y;
        }
        if (bound.left === null) {
          bound.left = x;
        } else if (x < bound.left) {
          bound.left = x;
        }
        if (bound.right === null) {
          bound.right = x;
        } else if (bound.right < x) {
          bound.right = x;
        }
        if (bound.bottom === null) {
          bound.bottom = y;
        } else if (bound.bottom < y) {
          bound.bottom = y;
        }
      }
    }
    var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left;
    if (trimWidth && trimHeight) {
      var trimmed = this.ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
      tmpCanvasContext.canvas.width = trimWidth;
      tmpCanvasContext.canvas.height = trimHeight;
      tmpCanvasContext.putImageData(trimmed, 0, 0);
      return tmpCanvasContext.canvas;
    } else {
      return false;
    }
  }
  setZoom (isIncrease) {
    if (isIncrease) {
      this.zoom *= this.ZOOM_SCALE;
    } else {
      this.zoom /= this.ZOOM_SCALE;
    }
    this..setUIText(this.dom.paintXY.textContent.split(' ')[0]);
    if (this.tools[this.mode].onZoomChange) {
      this.tools[this.mode].onZoomChange(this.zoom);
    }
  }
  applyZoom() {
    this.dom.canvas.style.width = this.dom.canvas.width * this.zoom + 'px';
    this.dom.canvas.style.height = this.dom.canvas.height * this.zoom + 'px';
  }
  getScaledOrdinate (ordinateName, clientOrdinateName, value) {
    var clientOrdinate = this.dom.canvas[clientOrdinateName];
    var ordinate = this.dom.canvas[ordinateName];
    return ordinate == clientOrdinate ? value : Math.round(ordinate * value / clientOrdinate); // apply page zoom
  }
  getOffset (el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return {offsetTop: _y, offsetLeft: _x};
  }
  setOffset(e) {
    if (!e.offsetX && e.touches) {
      var offset = this..getOffset(this.dom.canvas);
      var pxy = this..getPageXY(e);
      e.offsetX = Math.round(pxy.pageX- offset.offsetLeft);
      e.offsetY = Math.round(pxy.pageY- offset.offsetTop);
    }
  }
  getXY (e) {
    var newVar = {
      x: this..getScaledOrdinate('width', 'clientWidth', e.offsetX),
      y: this..getScaledOrdinate('height', 'clientHeight', e.offsetY)
    };
    return newVar
  }
  setDimensions(w, h) {
    var state = this.buffer.getState();
    w = parseInt(w);
    h = parseInt(h);
    this.dom.canvas.width = w;
    this.dom.canvas.height = h;
    this.buffer.restoreState(state);
    this.dom.paintDimensions.textContent = w+ 'x' + h;
  }


  $(selector: string): HTMLElement {
    var el = this.containerPaitner.querySelector(selector);
    if (!el) {
      throw Error(`${selector} Not found`);
    }
    return el as HTMLElement;
  }


}

export {Painter}
