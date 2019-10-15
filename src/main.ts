import baseText from '@/assets/base.html';
import FLOOD_FILL_CURSOR from '@/assets/floodfill.svg';
import {Logger} from 'lines-logger';
import {posix} from "path";


function formatPos(str: string) {
  return function (...args: string[]) {
    return str.replace(/{(\d+)}/g, (match: string, number: number): string => {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  }
}


abstract class Instrument {
  private readonly holder: HTMLElement;
  private readonly value: HTMLInputElement | HTMLSelectElement;


  getValue(): HTMLInputElement | HTMLSelectElement {
    return this.value;
  }

  getHolder(): HTMLElement {
    return this.holder;
  }

  constructor() {
    this.holder = document.createElement('div');
    this.value = this.inputFactory();
    this.holder.title = this.getTitle();
    this.holder.className = this.getHolderClass();
    if (this.isHiddenByDefault) {
      self.cssUtils.hideElement(this.holder)
    }
    if (this.getText()) {
      let span = document.createElement('span');
      span.innerText = this.getText();
      this.holder.appendChild(span);
    }
    this.holder.appendChild(this.value);
    self.dom.bottomTools.appendChild(this.holder);
    this.value.addEventListener(this.getTrigger(), (e: Event) => {
      let value = this.value.value;
      if (this.isRange() && this.value.value.length > 2 && value !== '100') {
        // this.value.value = this.value.slice(0, 2) // TODO
      }
      this.setInputValue();
      let tool: ToolLifeCycle = self.tools[self.mode];
      tool[this.handler](e);
      if (this.range) {
        // this.range.value = this.value.value; TODO
      }
    });
    if (this.range) {

    }
  }

  public setInputValue() {
    this.ctxSetter(this.value.value);
  }

  protected abstract getTitle(): string;

  protected abstract getText(): string;

  protected abstract getHolderClass(): string;

  protected abstract isHiddenByDefault(): boolean;

  protected isRange(): boolean {
    return false;
  }

  protected getTrigger(): string {
    return 'input';
  }


  protected get range(): boolean {
    return false;
  }

  protected readonly abstract handler: keyof ToolLifeCycle;

  protected abstract inputFactory(): HTMLInputElement | HTMLSelectElement;

  protected ctxSetter(v: string): void {

  };

  public getHandler(): keyof ToolLifeCycle {
    return this.handler;
  }
}

export interface InstrumentConstructor<T extends Instrument> {
  new(holder: HTMLElement): T;
}


class ColorInstrument extends Instrument {

  protected readonly handler: keyof ToolLifeCycle = 'onChangeColor';

  protected inputFactory(): HTMLInputElement {
    let input = document.createElement('input');
    input.type = 'color';
    input.value = '#ff0000';
    return input;
  }

  protected ctxSetter(v: string): void {
    self.ctx.strokeStyle = v;
  }

  protected getHolderClass(): string {
    return "paintColor";
  }

  protected getText(): string {
    return "C:";
  }

  protected getTitle(): string {
    return "color";
  }

  protected isHiddenByDefault(): boolean {
    return true;
  }
}


class OpacityInstrument extends Instrument {
  public inputValue: number = 0;
  protected readonly handler: keyof ToolLifeCycle = 'onChangeOpacity';

  protected get range(): boolean {
    return true;
  }

  protected inputFactory(): HTMLInputElement {
    let input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('step', "1");
    input.value = '100';
    return input;
  }

  protected ctxSetter(v: string): void {
    self.ctx.globalAlpha = parseFloat(v) / 100;
    // self.instruments.opacity.inputValue = parseFloat(v) / 100; TODO
  }

  protected getHolderClass(): string {
    return "paintOpacity";
  }

  protected getText(): string {
    return "A:";
  }

  protected getTitle(): string {
    return "Alpha (color transparency)";
  }

  protected isHiddenByDefault(): boolean {
    return true;
  }
}


abstract class Range extends Instrument {

  protected readonly inputRange: HTMLInputElement;

  constructor() {
    super();
    let value: HTMLElement = this.getValue();
    value.addEventListener('keypress', (e: KeyboardEvent) => {
      let charCode = e.which || e.keyCode;
      return charCode > 47 && charCode < 58;
    });
    if (self.conf.rangeFactory) {
      this.inputRange = self.conf.rangeFactory();
    } else {
      this.inputRange = document.createElement('input');
      this.inputRange.type = 'range';
    }
    let div = document.createElement('div');
    div.appendChild(this.inputRange);
    this.getHolder().appendChild(div);
    this.inputRange.addEventListener('input', (e) => {
      this.getValue().value = this.inputRange.value;
      this.ctxSetter((<HTMLInputElement>e.target).value);
      self.tools[self.mode][this.handler](e);
    });
  }

}

class ColorFillInstrument extends Instrument {
  protected readonly handler: keyof ToolLifeCycle = 'onChangeColorFill';

  protected inputFactory(): HTMLInputElement {
    let input = document.createElement('input');
    input.type = 'color';
    input.value = '#0000ff';
    return input;
  }

  protected ctxSetter(v: string): void {
    self.ctx.fillStyle = v;
  }

  protected getHolderClass(): string {
    return "paintColorFill";
  }

  protected getText(): string {
    return "CF:";
  }

  protected getTitle(): string {
    return "Fill color";
  }

  protected isHiddenByDefault(): boolean {
    return true;
  }
}

class OpacityFillInstrument extends Range {
  protected inputValue: number = 0;
  protected readonly holderClass: string = '';
  protected readonly handler: keyof ToolLifeCycle = 'onChangeFillOpacity';
  protected readonly hiddenByDefault: boolean = true;

  protected inputFactory(): HTMLInputElement {
    let input = document.createElement('input');
    input.type = 'text';
    // input.setAttribute('step', 1); TODO
    input.value = '100';
    return input;
  }

  protected ctxSetter(v: string): void {
    // self.instruments.opacityFill.inputValue = v / 100; TODO
  }

  protected getHolderClass(): string {
    return "paintFillOpacity";
  }

  protected getText(): string {
    return "Fill alpha (color transparency)";
  }

  protected getTitle(): string {
    return "AF:";
  }

  protected isHiddenByDefault(): boolean {
    return false;
  }
}

class WidthInstrument extends Range {
  protected readonly handler: keyof ToolLifeCycle = 'onChangeRadius';

  protected inputFactory(): HTMLInputElement {
    let input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('step', "1");
    input.value = '10';
    return input;
  }

  protected ctxSetter(v: string): void {
    self.ctx.lineWidth = parseInt(v);
  }

  protected getHolderClass(): string {
    return "paintRadius";
  }

  protected getText(): string {
    return "W:";
  }

  protected getTitle(): string {
    return "Width";
  }

  protected isHiddenByDefault(): boolean {
    return true;
  }
}

class FontInstrument extends Instrument {
  protected readonly handler: keyof ToolLifeCycle = 'onChangeFont';

  protected inputFactory(): HTMLSelectElement {
    let input = document.createElement('select');
    return input;
  }

  protected ctxSetter(v: string): void {
    self.ctx.fontFamily = v
  }

  protected getHolderClass(): string {
    return "paintFont";
  }

  protected getText(): string {
    return "F:";
  }

  protected getTitle(): string {
    return "Font";
  }

  protected isHiddenByDefault(): boolean {
    return true;
  }
}

class ApplyInstrument extends Instrument {
  protected readonly trigger: string = 'click';
  protected readonly handler: keyof ToolLifeCycle = 'onApply';

  protected inputFactory(): HTMLInputElement {
    let input = document.createElement('input');
    input.type = 'button';
    input.value = 'Apply';
    return input;
  }

  protected getHolderClass(): string {
    return "paintApplyText";
  }

  protected getText(): string {
    return "";
  }

  protected getTitle(): string {
    return "";
  }

  protected isHiddenByDefault(): boolean {
    return true;
  }
}

abstract class CssUtils {

  public abstract removeClass(element: HTMLElement, visibilityClass: string): void;

  public abstract addClass(element: HTMLElement, visibilityClass: string): void;

  public abstract hasClass(element: HTMLElement, visibilityClass: string): boolean;

  public abstract toggleClass(element: HTMLElement, visibilityClass: string): boolean;

  private readonly visibilityClass: string = 'spainterHidden';

  public showElement(element: HTMLElement): void {
    this.removeClass(element, this.visibilityClass);
  }

  public hideElement(element: HTMLElement): void {
    this.addClass(element, this.visibilityClass);
  }

  public setClassToState(element: HTMLElement, isVisible: boolean, clazz: string): void {
    if (isVisible) {
      this.removeClass(element, clazz);
    } else {
      this.addClass(element, clazz);
    }
  }
}

class ModernCssUtils extends CssUtils {
  public removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className)
  }

  public addClass(element: HTMLElement, className: string): void {
    element.classList.add(className)
  }

  public toggleClass(element: HTMLElement, className: string): boolean {
    return element.classList.toggle(className);
  }

  public hasClass(element: HTMLElement, className: string): boolean {
    return element.classList.contains(className);
  }

}

class OldCssUtils extends CssUtils {
  public removeClass(element: HTMLElement, className: string): void {
    if (element.className) {
      element.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
    }
  }

  public addClass(element: HTMLElement, className: string): void {
    if (!this.hasClass(element, className)) {
      let oldClassName = element.className;
      element.className += (' ' + className);
    }
  }

  public toggleClass(element: HTMLElement, className: string): boolean {
    if (this.hasClass(element, className)) {
      this.removeClass(element, className);
      return false;
    } else {
      this.addClass(element, className);
      return true;
    }
  }

  public hasClass(element: HTMLElement, className: string): boolean {
    return Boolean(element.className) && element.className.split(' ').indexOf(className) >= 0;
  }
}

interface PainterConf {
  onBlobPaste?: BlobCallback;

  logger?: Logger;
  buttonClass?: string;
  rangeClass?: string;
  textClass?: string;

  rangeFactory?(): HTMLInputElement
}

function format(str: string) {
  return (...args: string[]) => {
    let replacement = 0;
    return str.replace(/{}/g, function () {
      return args[replacement++];
    });
  };
}

const PICKED_TOOL_CLASS = 'active-icon';
const ZOOM_SCALE = 1.1;

let self: Painter;

class Tmp {

  private readonly tmpCanvas: HTMLCanvasElement = document.createElement('canvas');
  private readonly tmpData: CanvasRenderingContext2D = this.tmpCanvas.getContext('2d') as CanvasRenderingContext2D;


  public saveState() {
    this.tmpCanvas.width = self.dom.canvas.width;
    this.tmpCanvas.height = self.dom.canvas.height;
    this.tmpData.clearRect(0, 0, self.dom.canvas.width, self.dom.canvas.height);
    this.tmpData.drawImage(self.dom.canvas, 0, 0);
    self.logger.debug("Context saved")();
  }

  restoreState() {
    self.ctx.clearRect(0, 0, self.dom.canvas.width, self.dom.canvas.height);
    self.drawImage(b => b.drawImage(this.tmpCanvas, 0, 0));
    //clear in case new image is transparen
  }
}


interface Instruments {
  color: Instrument;
  opacity: Instrument;
  colorFill: Instrument;
  opacityFill: Instrument;
  width: Instrument;
  font: Instrument;
  apply: Instrument;
}

interface Tools {
  select: SelectTool;
  pen: PenTool;
  line: LineTool
  fill: FillTool;
  rect: RectTool;
  ellipse: ElipseTool;
  text: TextTool;
  eraser: EraserTool;
  img: ImgTool;
  crop: CropTool;
  move: MoveTool;
}


class Painter {
  public readonly logger: Logger;
  public zoom: number = 1; // TODO
  public mode: keyof Tools = 'pen';
  public readonly resizer: Resizer;
  public readonly cssUtils: CssUtils;
  public readonly buffer: Buffer;
  public readonly instruments: Instruments;
  public readonly tools: Tools;
  public readonly events: Events;
  public readonly conf: PainterConf;
  public readonly dom: {
    container: HTMLElement;
    canvas: HTMLCanvasElement;
    bottomTools: HTMLElement;
    paintDimensions: HTMLElement;
    paintXY: HTMLElement;
    trimImage: HTMLInputElement;
    header: HTMLElement;
    canvasResize: HTMLElement;
    canvasWrapper: HTMLElement;
    painterTools: HTMLElement;
    paintPastedImg: HTMLElement;
    paintSend: HTMLElement;
    paintCrpRect: HTMLElement;
    paintTextSpan: HTMLElement;
    paintResizeTools: HTMLElement;
  };
  private readonly mouseWheelEventName: string = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
  public readonly tmpCanvasContext: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
  public readonly ctx: CanvasRenderingContext2D;
  private readonly containerPainter: HTMLElement;

  constructor(containerPaitner: HTMLInputElement, conf: PainterConf = {}) {
    if (document.documentElement.classList.toggle) {
      this.cssUtils = new ModernCssUtils()
    } else {
      this.cssUtils = new OldCssUtils()
    }
    this.dom = {
      container: containerPaitner,
      canvas: this.$('canvas') as HTMLCanvasElement,
      bottomTools: this.$('.bottomTools'),
      paintDimensions: this.$('.paintDimensions'),
      paintXY: this.$('.paintXY'),
      trimImage: <HTMLInputElement>this.$('.trimImage'),
      header: document.createElement('div'),
      canvasResize: this.$('.canvasResize'),
      canvasWrapper: this.$('.canvasWrapper'),
      painterTools: this.$('.painterTools'),
      paintPastedImg: this.$('.paintPastedImg'),
      paintSend: this.$('.paintSend'),
      paintCrpRect: this.$('.paint-crp-rect'),
      paintTextSpan: this.$('.paintTextSpan'),
      paintResizeTools: this.$('.paintResizeTools'),
    };
    this.conf = conf;
    this.containerPainter = containerPaitner;
    if (conf.logger) {
      this.logger = conf.logger;
    } else {
      this.logger = ({
        debug: function () {
          return function () {
          };
        }
      }) as unknown as Logger;
    }
    containerPaitner.innerHTML = baseText;

    this.dom.header.ondblclick = () => {
      let w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight || e.clientHeight || g.clientHeight;

      this.dom.canvasWrapper.style.width = x - 60 + 'px';
      this.dom.canvasWrapper.style.height = y - 95 + 'px';
      this.dom.container.style.left = '1px';
      this.dom.container.style.top = '1px';
    };
    this.events = new Events();
    this.ctx = this.dom.canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    let height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight,
        document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    let width = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight,
        document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    this.setDimensions(500, 500);
    // this.dom.canvasWrapper.style.height = height * 0.9 - 100 + 'px'
    // this.dom.canvasWrapper.style.width = width * 0.9 - 80 + 'px'
    this.buffer = new Buffer();
    this.resizer = new Resizer();
    this.instruments = {
      apply: new ApplyInstrument(),
      color: new ColorInstrument(),
      opacity: new OpacityInstrument(),
      colorFill: new ColorFillInstrument(),
      opacityFill: new OpacityInstrument(),
      width: new WidthInstrument(),
      font: new FontInstrument(),
    };

    this.tools = {
      select: new SelectTool(),
      pen: new PenTool(),
      line: new LineTool(),
      fill: new FillTool(),
      rect: new RectTool(),
      ellipse: new ElipseTool(),
      text: new TextTool(),
      eraser: new EraserTool(),
      img: new ImgTool(),
      crop: new CropTool(),
      move: new MoveTool
    }
  }

  $(selector: string): HTMLElement {
    return this.containerPainter.querySelector(selector) as HTMLElement;
  };

  dropImg(f: File| null) {
    if (f && f.type.indexOf('image') >= 0) {
      this.logger.debug("Pasting images")();
      this.setMode('img');
      this.tools.img.readAndPasteCanvas(f);
      return true;
    } else {
      return false;
    }
  }

  setMode(mode: keyof Tools) {
    let oldMode: Tool = this.tools[this.mode];
    this.mode = mode;

    oldMode.onDeactivate();
    let icon = oldMode.getIcon();
    if (icon) {
      this.cssUtils.removeClass(icon, PICKED_TOOL_CLASS);
    }

    let newMode: Tool = this.tools[this.mode];
   newMode.onActivate();
    this.setCursor(newMode.getCursor);
    let newIcon = newMode.getIcon();
    if (newIcon) {
      this.cssUtils.addClass(newIcon, PICKED_TOOL_CLASS);
    }
    this.iterateInstrument((instr: Instrument) => {
      if (oldMode[instr.getHandler()]) { // TODO something weird here, not sure what it did
        this.cssUtils.hideElement(instr.getHolder());
      }
      if (newMode[instr.getHandler()]) {
        this.cssUtils.showElement(instr.getHolder());
      }
    });
  }

  private iterateInstrument(cb: (a: Instrument) => void): (keyof Instruments)[] {
    // TODO unsafe casting
    let strings: (keyof Instruments)[] = Object.keys(this.instruments) as unknown as (keyof Instruments)[];
    strings.forEach((l: keyof Instruments): void => {
      cb(this.instruments[l])
    })
    return  strings;
  }

  show() {
    document.body.addEventListener('mouseup', self.events.onmouseup, false);
    document.body.addEventListener('touchend', self.events.onmouseup, false);
  }

  hide() {
    document.body.removeEventListener('mouseup', self.events.onmouseup, false);
    document.body.removeEventListener('touchend', self.events.onmouseup, false);
  }


  setUIText(text: string) {
    this.dom.paintXY.textContent = text + ' ' + Math.round(this.zoom * 100) + '%';
  }

  openCanvas() {
    this.show();
    this.buffer.clear();
    this.iterateInstrument((a: Instrument) => {
      a.setInputValue();
    }); // TODO is it required
    this.setMode('pen');
  }

  public getPageXY(e: MouseEvent | TouchEvent): { pageX: number, pageY: number } {
    return {
      pageX: (<MouseEvent>e).pageX || (<TouchEvent>e).touches[0].pageX,
      pageY: (<MouseEvent>e).pageY || (<TouchEvent>e).touches[0].pageY,
    }
  }

  pasteToTextArea() {
    if (this.dom.trimImage.checked) {
      let trimImage = this.trimImage();
      if (trimImage) {
        if (this.conf.onBlobPaste) {
          trimImage.toBlob(this.conf.onBlobPaste);
        }
        this.hide();
      } else {
        this.logger.debug("image is empty")();
      }
    } else {
      if (this.conf.onBlobPaste) {
        this.dom.canvas.toBlob(this.conf.onBlobPaste);
      }
      this.hide();
    }
  }


  drawImage(cb: (ctx: CanvasRenderingContext2D) => void) {
    let savedA = this.ctx.globalAlpha;
    this.ctx.globalAlpha = 1;
    cb(this.ctx);
    this.ctx.globalAlpha = savedA;
  }

  setCursor(text: string) {
    this.dom.canvas.style.cursor = text;
  }

  buildCursor(fill: string, stroke: string, width: number) {
    if (width < 3) {
      width = 3;
    } else if (width > 126) {
      width = 126;
    }
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" height="128" width="128"><circle cx="64" cy="64" r="${width}" fill="${fill}" ${stroke}/></svg>`;
    return `url(data:image/svg+xml;base64,${btoa(svg)}, ${64} ${64}, auto`;
  }

  isNumberKey(evt) {
    let charCode = evt.which || evt.keyCode;
    return charCode > 47 && charCode < 58;
  }

  trimImage() { // TODO this looks bad
    let pixels = this.ctx.getImageData(0, 0, this.dom.canvas.width, this.dom.canvas.height);
    let l = pixels.data.length;
    let i;
    let bound: {
      top: number|null,
      left: number|null,
      right: number|null,
      bottom: number|null
    } = {
      top: null,
      left: null,
      right: null,
      bottom: null
    };
        let x: number;
        let y: number;
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
    let trimHeight = bound.bottom! - bound.top!,
        trimWidth = bound.right! - bound.left!; // TODO can it be null?
    if (trimWidth && trimHeight) {
      let trimmed = this.ctx.getImageData(bound.left!, bound.top!, trimWidth, trimHeight);
      this.tmpCanvasContext.canvas.width = trimWidth;
      this.tmpCanvasContext.canvas.height = trimHeight;
      this.tmpCanvasContext.putImageData(trimmed, 0, 0);
      return this.tmpCanvasContext.canvas;
    } else {
      return false;
    }
  }

  setZoom(isIncrease: boolean) {
    if (isIncrease) {
      this.zoom *= ZOOM_SCALE;
    } else {
      this.zoom /= ZOOM_SCALE;
    }
    // TODO null?
    this.setUIText(this.dom.paintXY.textContent!.split(' ')[0]);
    if (this.tools[this.mode].onZoomChange) {
      this.tools[this.mode].onZoomChange(this.zoom);
    }
  }

  applyZoom() {
    this.dom.canvas.style.width = this.dom.canvas.width * this.zoom + 'px';
    this.dom.canvas.style.height = this.dom.canvas.height * this.zoom + 'px';
  }

  getScaledOrdinate(ordinateName: 'width' | 'height', clientOrdinateName: 'clientWidth'| 'clientHeight', value: number) {
    let clientOrdinate = this.dom.canvas[clientOrdinateName];
    let ordinate = this.dom.canvas[ordinateName];
    return ordinate == clientOrdinate ? value : Math.round(ordinate * value / clientOrdinate); // apply page zoom
  }

  getOffset(el: HTMLElement) : {offsetTop: number, offsetLeft: number}{
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = <HTMLElement>el.offsetParent;
    }
    return {offsetTop: _y, offsetLeft: _x};
  }

  setOffset(e: MouseEvent| TouchEvent) {
    if (!e.hasOwnProperty('offsetX') && e.hasOwnProperty('touches')) {
      let offset = this.getOffset(this.dom.canvas);
      let pxy = this.getPageXY(e);
      interface MouseSetter extends MouseEvent {
        offsetX: number;
        offsetY: number;
      }
      (<MouseSetter>e).offsetX = Math.round(pxy.pageX - offset.offsetLeft);
      (<MouseSetter>e).offsetY = Math.round(pxy.pageY - offset.offsetTop);
    }
  }

  getXY(e: MouseEvent): { x: number, y: number } {
    let newVar = {
      x: this.getScaledOrdinate('width', 'clientWidth', e.offsetX),
      y: this.getScaledOrdinate('height', 'clientHeight', e.offsetY)
    };
    return newVar
  }

  setDimensions(w: string | number, h: string| number) {
    let state = this.buffer.getState();
    let wi: number, hi: number;
    if (typeof w === 'string' && typeof h === 'string') {
      wi = parseInt(w);
      hi = parseInt(h);
    } else if (typeof h === 'number' && typeof w === 'number') {
      wi = w;
      hi = h;
    } else {
      throw Error("invalid typings");
    }

    this.dom.canvas.width = wi;
    this.dom.canvas.height = hi;
    this.buffer.restoreState(state);
    this.dom.paintDimensions.textContent = `${wi}x${hi}`;
  }
}
interface CheckPoint {
  width: number;
  height: number,
  data: ImageData;
}

interface BsData {
  lineWidth: number;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  globalAlpha: number;
  lineJoin: CanvasLineJoin;
  lineCap: CanvasLineCap;
  globalCompositeOperation: string;
}
class Buffer {


  undoImages : CheckPoint[] = [];

  redoImages : CheckPoint[] = [];
  // let paintUndo = $('paintUndo');
  // let paintRedo = $('paintRedo');

  current: CheckPoint | null = null;

  getCanvasImage(img: ImageData | null = null): CheckPoint {
    return {
      width: self.dom.canvas.width,
      height: self.dom.canvas.height,
      data: img || self.ctx.getImageData(0, 0, self.dom.canvas.width, self.dom.canvas.height)
    }
  };


  clear() {
    this.undoImages = [];
    this.redoImages = [];
    this.current = null;
  };


  dodo(from: CheckPoint[], to: CheckPoint[]) {
    let restore = from.pop();
    if (restore) {
      if (!this.current) {
        throw Error("current doesn't exist");
      }
      to.push(this.current);
      this.current = restore;
      if (self.dom.canvas.width != this.current.width
          || self.dom.canvas.height != this.current.height) {
        self.logger.debug("Resizing canvas from {}x{} to {}x{}",
            self.dom.canvas.width, self.dom.canvas.height,
            this.current.width, this.current.height
        )();
        self.setDimensions(this.current.width, this.current.height)
      }
      self.ctx.putImageData(restore.data, 0, 0);
      this.setIconsState();
    }
  };


  setIconsState() {
    // self.cssUtils.setClassToState(paintUndo, undoImages.length, 'disabled');
    // self.cssUtils.setClassToState(paintRedo, redoImages.length, 'disabled');
  };


  redo() {
    this.dodo(this.redoImages, this.undoImages);
  };



  undo() {
    this.dodo(this.undoImages, this.redoImages);
  };

  finishAction(img: ImageData) {
    self.logger.debug('finish action')();
    if (this.current) {
     this.undoImages.push(this.current);
    }
    this.redoImages = [];
    this.setIconsState();
    this.current = this.getCanvasImage(img);
    self.applyZoom();
  };

  getState(): BsData {
    return {
      globalAlpha: self.ctx.globalAlpha,
      globalCompositeOperation: self.ctx.globalCompositeOperation,
      lineCap: self.ctx.lineCap,
      lineJoin: self.ctx.lineJoin,
      lineWidth: self.ctx.lineWidth,
      strokeStyle: self.ctx.strokeStyle,
    };
  };

  restoreState(state: BsData) {
    self.ctx.globalAlpha = state.globalAlpha;
    self.ctx.globalCompositeOperation = state.globalCompositeOperation;
    self.ctx.lineCap = state.lineCap;
    self.ctx.lineJoin = state.lineJoin;
    self.ctx.lineWidth = state.lineWidth;
    self.ctx.strokeStyle = state.strokeStyle;
  };

  startAction(): ImageData {
    self.logger.debug('start action')();
    if (!this.current) {
      this.current = this.getCanvasImage();
    }
    return this.current.data;
  };

}


interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface LastCoord {
  oy: number;
  ox: number;
  x: number;
  y:number;
  ow: number;
  oh: number;
  op: number;
  nl: number;
}

interface PositionAlias {
  width: 'ow',
  height: 'oh',
  top: 'oy',
  left: 'ox';
}

interface Cursor {
  m: 'move';
  b: 's-resize';
  t: 's-resize';
  l: 'e-resize';
  r: 'e-resize';
  tl: 'se-resize';
  br: 'se-resize';
  bl: 'ne-resize';
  tr: 'ne-resize';
}

interface Handlers {
  m(x: number, y: number): void;
  b(x: number, y: number): void;
  t(x: number, y: number): void;
  l(x: number, y: number): void;
  r(x: number, y: number): void;
}

class Resizer implements Position{

  alias: PositionAlias = {
    width: 'ow',
    height: 'oh',
    top: 'oy',
    left: 'ox'
  };

  private mode: keyof Cursor = 'm'; // TODO

  readonly imgHolder: HTMLElement;
  top: number = 0;
  left: number = 0;
  width: number = 0;
  height: number = 0;
  lastCoord: LastCoord = {
    oy: 0,
    ox: 0,
    x: 0,
    y: 0,
    ow: 0,
    oh: 0,
    op: 0,
    nl: 0,
  }

  restoreOrd (name : keyof Position , padd: keyof LastCoord = null) {
    self.logger.debug("restore ord {} {}", name, padd)();
    let alias: 'ow' | 'oh' | 'oy' | 'ox' = this.alias[name];
    this[name] = this.lastCoord[alias] + (padd ? this.lastCoord[padd] : 0);
    this.imgHolder.style[name] = this[name] * self.zoom + 'px';
  }

  setOrd (name: keyof Position, v: number, ampl: number = 1, padding: number = 0) {
    self.logger.debug("setOrd ord {} {} {} {}", name, v, ampl, padding)();
    let alias = this.alias[name];
    this.imgHolder.style[name] = ampl * ((this.lastCoord[alias] + padding) * self.zoom) + v + 'px';
    this[name] = ampl * this.lastCoord[alias] + v / self.zoom + padding;
  }

  rotate () {
    let w = this.imgHolder.style.width;
    this.imgHolder.style.width = this.imgHolder.style.height;
    this.imgHolder.style.height = w;
    let olw = this.width;
    this.width = this.height;
    this.height = olw;
  }

  cursorStyle: HTMLStyleElement;

  constructor() {
    this.cursorStyle = document.createElement('style');
    document.head.appendChild(this.cursorStyle);
    this.imgHolder = self.dom.paintCrpRect;

    this.imgHolder.onmousedown = this.trackMouseMove;
    this.imgHolder.ontouchstart = this.trackMouseMove;
  }

  setData(t: number, l: number, w: number, h: number) {
    this.top = t / self.zoom;
    this.left = l / self.zoom;
    this.width = w;
    this.height = h;
    this.imgHolder.style.left = l - 1 + 'px';
    this.imgHolder.style.top = t - 1 + 'px';
    this.imgHolder.style.width = w * self.zoom + 2 + 'px';
    this.imgHolder.style.height = h * self.zoom + +2 + 'px';
  };

  _setCursor(cursor: string | null) {
    this.cursorStyle.textContent = cursor ? (`.paintPastedImg, .paint-crp-rect, .painter {cursor: ${cursor} !important}`) : "";
  };

  onZoomChange() {
    this.imgHolder.style.width = this.width * self.zoom + 2 + 'px';
    this.imgHolder.style.height = this.height * self.zoom + 2 + 'px';
    this.imgHolder.style.top = this.top * self.zoom - 1 + 'px';
    this.imgHolder.style.left = this.left * self.zoom - 1 + 'px';
  };

  show() {
    self.cssUtils.showElement(this.imgHolder);
    self.logger.debug("Adding mouseUp doc listener")();
    document.addEventListener('mouseup', this.docMouseUp);
    document.addEventListener('touchend', this.docMouseUp);
  };

  hide() {
    this._setCursor(null);
    self.cssUtils.hideElement(this.imgHolder);
    self.logger.debug("Removing mouseUp doc listener")();
    this.docMouseUp();
    document.removeEventListener('mouseup', this.docMouseUp);
    document.removeEventListener('touchend', this.docMouseUp);
  };

  trackMouseMove(e: MouseEvent | TouchEvent, mode: keyof Cursor| undefined = undefined) {
    self.logger.debug("Resizer mousedown")();
    this.mode = mode || <keyof Cursor>(<HTMLElement>e.target).getAttribute('pos'); // TODO
    self.dom.canvasWrapper.addEventListener('mousemove', this.handleMouseMove);
    self.dom.canvasWrapper.addEventListener('touchmove', this.handleMouseMove);
    this.setParamsFromEvent(e);
    this._setCursor(this.cursors[this.mode]);
  };


  setParamsFromEvent(e: MouseEvent | TouchEvent) {
    let pxy = self.getPageXY(e);
    this.lastCoord = {
      x: pxy.pageX,
      y: pxy.pageY,
      ox: this.left, // origin x
      oy: this.top, // origin y
      ow: this.width, // origin width
      oh: this.height, // origin height
      op: this.width / this.height, // origin proportion
      nl: 0 // TODO
    };
    // ( lastCoord.op * x)^2 + x^2 = z;
    this.lastCoord.nl = Math.pow(this.lastCoord.op, 2) + 1;
  };

  docMouseUp() {
    //self.logger.debug("Resizer mouseup")();
    self.dom.canvasWrapper.removeEventListener('mousemove', this.handleMouseMove);
    self.dom.canvasWrapper.removeEventListener('touchmove', this.handleMouseMove);
  };

  cursors: Cursor = {
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
  handlers = {
    m: (x: number, y: number) => {
      this.setOrd('top', y);
      this.setOrd('left', x);
    },
    b: (x: number, y: number) => {
      if (y / self.zoom < - this.lastCoord.oh) {
        this.setOrd('height', -y, -1);
        this.setOrd('top', y, undefined, this.lastCoord.oh);
      } else {
        this.setOrd('height', y);
        this.restoreOrd('top');
      }
    },
    t: (x: number, y: number) => {
      if (y / self.zoom > this.lastCoord.oh) {
        this.setOrd('height', y, -1);
        this.restoreOrd('top', 'oh');
      } else {
        this.setOrd('top', y);
        this.setOrd('height', -y);
      }
    },
    l: (x: number, y: number) => {
      if (x / self.zoom > this.lastCoord.ow) {
        this.setOrd('width', x, -1);
        this.restoreOrd('left', 'ow');
      } else {
        this.setOrd('left', x);
        this.setOrd('width', -x);
      }
    },
    r: (x: number, y: number) => {
      if (x / self.zoom < -this.lastCoord.ow) {
        this.setOrd('width', -x, -1);
        this.setOrd('left', x, undefined, this.lastCoord.ow);
      } else {
        this.restoreOrd('left');
        this.setOrd('width', x);
      }
    }
  };

  calcProportion(x, y) {
    let d = {
      tl: {dx: 1, dy: 1},
      tr: {dx: 1, dy: -1},
      bl: {dx: -1, dy: 1},
      br: {dx: 1, dy: 1}
    }[this.mode]; // TODO?
    let dx = x > 0 ? 1 : -1;
    let dy = y > 0 ? 1 : -1;
    let nl = x * x * dx * d.dx + y * y * dy * d.dy;
    let dnl = nl > 0 ? 1 : -1;
    let v = dnl * Math.sqrt(Math.abs(nl) / this.lastCoord.nl);
    y = v * d.dy;
    x = v * this.lastCoord.op * d.dx;
    return {x: x, y: y};
  };

  handleMouseMove(e) {
    //self.logger.debug('handleMouseMove {}', e)();
    let pxy = self.getPageXY(e);
    let x = pxy.pageX - this.lastCoord.x;
    let y = pxy.pageY - this.lastCoord.y;
    if (e.shiftKey && this.mode.length === 2) {
      let __ret = this.calcProportion(x, y);
      x = __ret.x;
      y = __ret.y;
    }
    self.logger.debug('handleMouseMove ({}, {})', x, y)();
    let s: keyof Handlers = <keyof Handlers>this.mode.charAt(0);
    this.handlers[s](x, y);
    if (this.mode.length === 2) {
      let s1: keyof Handlers= <keyof Handlers>this.mode.charAt(1);
      this.handlers[s1](x, y);
    }
  };
}


interface KeyActivator {
  code: string
  icon: string,
  title: string
}

abstract class ToolLifeCycle {
  onChangeColor(e: Event): void {
  };

  onChangeColorFill(e: Event): void {
  };

  onChangeOpacity(e: Event): void {
  };

  onChangeFillOpacity(e: Event): void {
  };

  onChangeRadius(e: Event): void {
  };

  onApply(e: Event): void {
  };

  onChangeFont(e: Event): void {
  };
}

abstract class Tool extends ToolLifeCycle {

  constructor() {
    super();
  }

  private icon: HTMLElement | null = null;

  abstract keyActivator: KeyActivator;

  getCursor(): string | null {
    return null;
  }

  onActivate(): void {
  };

  onZoomChange(): void {
  };

  onDeactivate(): void {
  };

  isSelectionActive(): void {
  };

  onMouseDown(): void {
  };

  onMouseUp(): void {
  };

  getAreaData(): void {
  };

  getIcon(): HTMLElement| null {
    return this.icon;
  }

  getBufferHandler(): boolean {
    return false;
  }

}

class EraserTool extends Tool {
  keyActivator = {
    code: 'KeyD',
    icon: 'icon-eraser',
    title: 'Eraser (D)'
  }

  getCursor() {
    return self.buildCursor('#aaaaaa', ' stroke="black" stroke-width="2"', self.ctx.lineWidth);
  };

  onChangeRadius(e) {
    self.setCursor(this.getCursor());
  };

  onActivate() {
    this.tmpAlpha = self.ctx.globalAlpha;
    self.ctx.globalAlpha = 1;
    self.ctx.globalCompositeOperation = "destination-out";
  };

  onDeactivate() {
    self.ctx.globalAlpha = this.tmpAlpha;
    self.ctx.globalCompositeOperation = "source-over";
  };

  onMouseDown(e) {
    let coord = self.helper.getXY(e);
    self.ctx.moveTo(coord.x, coord.y);
    self.ctx.beginPath();
    this.onMouseMove(e, coord)
  };

  onMouseMove(e, coord) {
    self.ctx.lineTo(coord.x, coord.y);
    self.ctx.stroke();
  };

  onMouseUp() {
    self.ctx.closePath();
  };
}

abstract class Appliable extends Tool {


  constructor() {
    super();
  }

  enableApply() {
    self.instruments.apply.value.removeAttribute('disabled');
  };

  disableApply() {
    self.instruments.apply.value.setAttribute('disabled', 'disabled');
  };
}

class Events {
  private mouseDown: boolean = false;

  onmousedown(e: MouseEvent) {
    let tool: Tool = self.tools[self.mode];
    // if (!this.onMouseDown) {
    //   return;
    // } TODO
    self.setOffset(e);
    // self.logger.debug("{} mouse down", self.mode)();
    this.mouseDown = true;
    let rect = self.dom.canvas.getBoundingClientRect();
    let imgData;
    if (!tool.getBufferHandler()) {
      imgData = self.buffer.startAction();
    }
    tool.onMouseDown(e, imgData);
  }

  onmousemove(e) {
    let this = self.tools[self.mode];
    self.helper.setOffset(e);
    let xy = self.helper.getXY(e);
    self.helper.setUIText("[" + xy.x + "," + xy.y + "]");
    if (self.events.mouseDown && this.onMouseMove) {
      this.onMouseMove(e, xy);
    }
  }

  onmouseup(e) {
    if (self.events.mouseDown) {
      self.events.mouseDown = false;
      let this = self.tools[self.mode];
      if (!tool.bufferHandler) {
        self.buffer.finishAction();
      }
      let mu = this.onMouseUp;
      if (mu) {
        // self.logger.debug("{} mouse up", self.mode)();
        mu(e)
      }
    }
  }

  onmousewheel(e) {
    if (!e.ctrlKey) {
      return;
    }
    e.preventDefault();
    self.helper.setOffset(e);
    let xy = self.helper.getXY(e)
    self.helper.setZoom(e.detail < 0 || e.wheelDelta > 0); // isTop
    self.helper.applyZoom()
    let clientRect = self.dom.canvasWrapper.getBoundingClientRect();
    let scrollLeft = (xy.x * self.zoom) - (e.clientX - clientRect.left);
    let scrollTop = (xy.y * self.zoom) - (e.clientY - clientRect.top);
    self.dom.canvasWrapper.scrollLeft = scrollLeft
    self.dom.canvasWrapper.scrollTop = scrollTop;
  }

  contKeyPress(event) {
    self.logger.debug("keyPress: {} ({})", event.keyCode, event.code)();
    if (event.keyCode === 13) {
      if (self.tools[self.mode].onApply) {
        self.tools[self.mode].onApply();
      } else {
        self.helper.pasteToTextArea();
      }
    }
    self.keyProcessors.forEach(function (proc) {
      if (event.code == proc.code
          && (!proc.ctrlKey || (proc.ctrlKey && event.ctrlKey))) {
        proc.clickAction(event);
      }
    });
  }

  painterResize(e) {
    let st = self.dom.canvasWrapper.style;
    let w = parseInt(st.width.split('px')[0]);
    let h = parseInt(st.height.split('px')[0]);
    let pxy = self.helper.getPageXY(e);
    let listener
    (e)
    {
      let cxy = self.helper.getPageXY(e);
      self.dom.canvasWrapper.style.width = w - pxy.pageX + cxy.pageX + 'px';
      self.dom.canvasWrapper.style.height = h - pxy.pageY + cxy.pageY + 'px';
    }
    ;
    self.logger.debug("Added mousmove. touchmove")();
    document.addEventListener('mousemove', listener);
    document.addEventListener('touchmove', listener);
    let remove
    ()
    {
      document.removeEventListener('mousemove', listener);
      document.removeEventListener('touchmove', listener);
    }
    ;
    document.addEventListener('mouseup', remove);
    document.addEventListener('touchend', remove);
  }

  canvasImageDrop(e: DragEvent) {
    if (e.dataTransfer && e.dataTransfer.files) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (self.dropImg(e.dataTransfer.files[i])) {
          e.preventDefault();
          break;
        }
      }
    }
  }

  canvasImagePaste(e: ClipboardEvent) {
    if (document.activeElement === self.dom.container && e.clipboardData) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        let asFile = e.clipboardData.items[i].getAsFile();
        if (self.dropImg(asFile)) {
          e.preventDefault();
          break;
        }
      }
    }
  }
}

class CropTool extends Appliable {
  keyActivator = {
    code: 'KeyC',
    icon: 'icon-crop',
    title: 'Crop Image (C)'
  };
  bufferHandler = true;

  getCursor() {
    return 'crosshair';
  };

  onApply() {
    let params = self.resizer.params;
    if (!params.width || !params.height) {
      self.logger.debug("Can't crop to {}x{}", params.width, params.height)();
    } else {
      self.buffer.startAction();
      let img: ImageData = self.ctx.getImageData(params.left, params.top, params.width, params.height);
      self.helper.setDimensions(params.width, params.height);
      self.ctx.putImageData(img, 0, 0);
      self.buffer.finishAction(img);
      self.setMode('pen');
    }
  };

  onActivate() {
    this.disableApply();
  };

  onZoomChange = self.resizer.onZoomChange;

  onDeactivate() {
    self.resizer.hide();
    this.enableApply();
  };

  onMouseDown(e) {
    self.resizer.show();
    this.disableApply();
    self.resizer.setData(e.offsetY, e.offsetX, 0, 0);
    self.resizer.trackMouseMove(e, 'br');
  };

  onMouseUp(e) {
    let params = self.resizer.params;
    if (!params.width || !params.height) {
      self.resizer.hide();
    } else {
      this.onApply();
    }

  };
}

class ResizeTool extends Tool {
  let
  this = this;
  this
.
  keyActivator = {
    code: 'KeyW',
    icon: 'icon-resize',
    title: 'Change dimensions (W)'
  };
  this
.
  container = self.dom.paintResizeTools;
  this
.
  width = this.container.querySelector('[placeholder=width]');
  this
.
  height = this.container.querySelector('[placeholder=height]');
  this
.

  lessThan4(e) {
    if (this.value.length > 4) {
      this.value = this.value.slice(0, 4);
    }
  };

  this
.

  onlyNumber(e) {
    let charCode = e.which || e.keyCode;
    return charCode > 47 && charCode < 58;
  };

  this
.
  width
.
  onkeypress = this.onlyNumber;
  this
.
  width
.
  oninput = this.lessThan4;
  this
.
  height
.
  oninput = this.lessThan4;
  this
.
  height
.
  onkeypress = this.onlyNumber;
  this
.

  onApply() {
    let data = self.buffer.startAction();
    self.helper.setDimensions(this.width.value, this.height.value);
    self.ctx.putImageData(data, 0, 0);
    self.buffer.finishAction();
    self.setMode('pen')
  };

  this
.

  getCursor() {
    return null;
  };

  this
.

  onActivate() {
    self.cssUtils.showElement(this.container);
    this.width.value = self.dom.canvas.width;
    this.height.value = self.dom.canvas.height;
  };

  onDeactivate() {
    self.cssUtils.hideElement(this.container);
  };
}

class MoveTool extends Tool {
  keyActivator = {
    code: 'KeyM',
    icon: 'icon-move',
    title: 'Move (M)'
  };

  getCursor() {
    return 'move';
  };

  onMouseDown(e) {
    let pxy = self.helper.getPageXY(e);
    this.lastCoord = {x: pxy.pageX, y: pxy.pageY};
  };

  onMouseMove(e: MouseEvent | TouchEvent) {
    let pxy = self.getPageXY(e);
    let x = this.lastCoord.x - pxy.pageX;
    let y = this.lastCoord.y - pxy.pageY;
    self.logger.debug("Moving to: {{}, {}}", x, y)();
    self.dom.canvasWrapper.scrollTop += y;
    self.dom.canvasWrapper.scrollLeft += x;
    this.lastCoord = {x: pxy.pageX, y: pxy.pageY};
    // self.logger.debug('X,Y: {{}, {}}', self.dom.canvasWrapper.scrollLeft, self.dom.canvasWrapper.scrollTop )();
  };

  onMouseUp(coord) {
    this.lastCoord = null;
  };
}

self.actions = [
  {
    keyActivator: {
      code: 'KeyR',
      icon: 'icon-rotate',
      title: 'Rotate (R)'
    },
    handler: function () {
      if (self.tools['select'].isSelectionActive()) {
        let m = self.tools.select;
        let d = m.getAreaData();
        self.logger.debug("{}x{}", d.width, d.height)();
        self.tmpCanvasContext.canvas.width = d.height; //specify width of your canvas
        self.tmpCanvasContext.canvas.height = d.width; //specify height of your canvas
        let ctx = self.tmpCanvasContext;
        ctx.save();
        ctx.translate(d.height / 2, d.width / 2);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(d.img, -d.width / 2, -d.height / 2); //draw it
        ctx.restore();
        d.img.src = self.tmpCanvasContext.canvas.toDataURL();
        m.rotateInfo();
      } else {
        self.buffer.startAction();
        let tmpData = self.dom.canvas.toDataURL();
        let w = self.dom.canvas.width;
        let h = self.dom.canvas.height;
        self.helper.setDimensions(h, w);
        self.ctx.save();
        self.ctx.translate(h / 2, w / 2);
        self.ctx.rotate(Math.PI / 2);
        let img = new Image();
        img.onload(e)
        {
          self.helper.drawImage(img, -w / 2, -h / 2);
          self.ctx.restore();
          self.buffer.finishAction();
        }
        ;
        img.src = tmpData;
      }
    }
  }, {
    keyActivator: {
      code: 'KeyZ',
      ctrlKey: true,
      icon: 'icon-undo',
      title: 'Undo (Ctrl+Z)'
    },
    handler: function () {
      self.buffer.undo();
    }
  }, {
    keyActivator: {
      code: 'KeyY',
      ctrlKey: true,
      icon: 'icon-redo',
      title: 'Redo (Ctrl+Y)'
    },
    handler: function () {
      self.buffer.redo();
    }
  }, {
    keyActivator: {
      code: '+',
      icon: 'icon-zoom-in',
      title: 'Zoom In (Ctrl+)/(Mouse Wheel)'
    },
    handler: function () {
      self.helper.setZoom(true);
    }
  }, {
    keyActivator: {
      code: '-',
      icon: 'icon-zoom-out',
      title: 'Zoom Out (Ctrl-)/(Mouse Wheel)'
    },
    handler: function () {
      self.helper.setZoom(false);
    }
  }, {
    keyActivator: {
      code: 'Delete',
      icon: 'icon-trash-circled',
      title: 'Delete (Del)'
    },
    handler: function () {
      if (self.tools['select'].isSelectionActive()) {
        self.tools['select'].inProgress = false; // don't restore image
        self.buffer.finishAction();
        self.tools['select'].onDeactivate();
      } else {
        self.buffer.startAction();
        self.ctx.clearRect(0, 0, self.dom.canvas.width, self.dom.canvas.height);
        self.buffer.finishAction();
      }
    }
  }
];


class ImgTool extends Tool {

  keyActivator = {
    icon: 'icon-picture spainterHidden',
    title: 'Pasting image',
    code: ''
  };
  img = self.dom.paintPastedImg;
  bufferHandler = true;
  imgObj = null;

  readAndPasteCanvas(file: File) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload(event)
    {
      this.imgObj = new Image();
      let b64 = event.target.result;
      this.imgObj.onload()
      {
        this.img.src = b64;
        self.resizer.setData(
            self.dom.canvasWrapper.scrollTop,
            self.dom.canvasWrapper.scrollLeft,
            this.imgObj.width,
            this.imgObj.height
        );
      }
      ;
      this.imgObj.src = b64;
    }
    ;
  }

  getCursor() {
    return null;
  }

  onApply(event) {
    let data = self.buffer.startAction();
    let params = self.resizer.params;
    let nw = params.left + params.width;
    let nh = params.top + params.height;
    if (nw > self.dom.canvas.width || nh > self.dom.canvas.height) {
      self.helper.setDimensions(
          Math.max(nw, self.dom.canvas.width),
          Math.max(nh, self.dom.canvas.height)
      );
      self.ctx.putImageData(data, 0, 0);
    }
    self.helper.drawImage(this.imgObj,
        0, 0, this.imgObj.width, this.imgObj.height,
        params.left, params.top, params.width, params.height);
    self.buffer.finishAction();
    self.setMode('pen');
  }

  onZoomChange(...args) {
    self.resizer.onZoomChange(...args)
  }

  onActivate(e) {
    self.resizer.show();
    self.cssUtils.showElement(this.img);
  }

  onDeactivate() {
    this.onApply();
    self.resizer.hide();
    self.cssUtils.hideElement(this.img);
  };
}

class TextTool extends Appliable {
  keyActivator = {
    code: 'KeyT',
    icon: 'icon-text',
    title: 'Text (T)'
  }

  private bufferHandler: boolean = true;
  span: HTMLElement;

  constructor() {
    super();
    this.span = self.dom.paintTextSpan;
    this.span.addEventListener('keypress', function (e) {
      if (e.keyCode !== 13 || e.shiftKey) {
        e.stopPropagation(); //proxy onapply
      }
    });

  }


  //prevent self.events.contKeyPress

  onChangeFont(e) {
    this.span.style.fontFamily = e.target.value;
  }

  onActivate() { // TODO this looks bad
    this.disableApply();
    this.onChangeFont({target: {value: self.ctx.fontFamily}});
    this.onChangeRadius({target: {value: self.ctx.lineWidth}});
    this.onChangeFillOpacity({target: {value: self.instruments.opacityFill.inputValue * 100}});
    this.onChangeColorFill({target: {value: self.ctx.fillStyle}});
    this.span.innerHTML = '';
  };

  onDeactivate() {
    if (this.lastCoord) {
      this.onApply();
    }
    self.cssUtils.hideElement(this.span);
  };

  onApply() {
    self.buffer.startAction();
    self.ctx.font = (5 + self.ctx.lineWidth) + "px " + self.ctx.fontFamily;
    self.ctx.globalAlpha = self.instruments.opacityFill.inputValue;
    let width = 5 + self.ctx.lineWidth; //todo lineheight causes so many issues
    let lineheight = parseInt(width * 1.25);
    let linediff = parseInt(width * 0.01);
    let lines = this.span.textContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
      self.ctx.fillText(lines[i], this.lastCoord.x, width + i * lineheight + this.lastCoord.y - linediff);
    }
    self.ctx.globalAlpha = self.instruments.opacity.inputValue;
    self.buffer.finishAction();
    self.setMode('pen');
  }

  onZoomChange() {
    this.span.style.fontSize = (self.zoom * (self.ctx.lineWidth + 5)) + 'px';
    this.span.style.top = (this.originOffest.y * self.zoom / this.originOffest.z) + 'px';
    this.span.style.left = (this.originOffest.x * self.zoom / this.originOffest.z) + 'px';
  }

  getCursor() {
    return 'text';
  };

  onChangeRadius(e) {
    this.span.style.fontSize = (self.zoom * (5 + parseInt(e.target.value))) + 'px';
  };

  onChangeFillOpacity(e) {
    this.span.style.opacity = e.target.value / 100
  };

  onChangeColorFill(e) {
    this.span.style.color = e.target.value;
  }

  onMouseDown(e) {
    self.cssUtils.showElement(this.span);
    this.originOffest = {
      x: e.offsetX,
      y: e.offsetY,
      z: self.zoom
    };
    this.enableApply();
    this.span.style.top = this.originOffest.y + 'px';
    this.span.style.left = this.originOffest.x + 'px';
    this.lastCoord = self.helper.getXY(e);
    setTimeout(function (e) {
      this.span.focus()
    });
  }
}

class RectTool extends Tool {
  keyActivator = {
    code: 'KeyQ',
    icon: 'icon-rect',
    title: 'Rectangle (Q)'
  }

  getCursor() {
    return 'crosshair';
  }

  onMouseDown(e) {
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
  };

  onMouseMove(e, endCoord) {
    let dim = {
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

class ElipseTool extends Tool {
  keyActivator = {
    code: 'KeyE',
    icon: 'icon-ellipse',
    title: 'Eclipse (E)'
  }

  getCursor() {
    return 'crosshair';
  }

  onMouseDown(e, data) {
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

  draw(x, y, w, h) {
    let kappa = .5522848,
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

  onMouseMove(e, endCoord) {
    let dim = {
      w: endCoord.x - this.startCoord.x,
      h: endCoord.y - this.startCoord.y
    };
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
  };
}
}

class LineTool extends Tool {
  keyActivator = {
    code: 'KeyL',
    icon: 'icon-line',
    title: 'Line (L)'
  };

  getCursor() {
    return 'crosshair';
  };

  onMouseDown(e) {
    self.tmp.saveState();
    this.startCoord = self.helper.getXY(e);
    this.onMouseMove(e, this.startCoord);
  };

  calcProportCoord(currCord) {
    let deg = Math.atan((this.startCoord.x - currCord.x) / (currCord.y - this.startCoord.y)) * 8 / Math.PI;
    if (Math.abs(deg) < 1) { // < 45/2
      currCord.x = this.startCoord.x;
    } else if (Math.abs(deg) > 3) { // > 45 + 45/2
      currCord.y = this.startCoord.y;
    } else {
      let base = (Math.abs(currCord.x - this.startCoord.x) + Math.abs(currCord.y - this.startCoord.y, 2)) / 2;
      currCord.x = this.startCoord.x + base * (this.startCoord.x < currCord.x ? 1 : -1);
      currCord.y = this.startCoord.y + base * (this.startCoord.y < currCord.y ? 1 : -1);
    }
  }

  onMouseMove(e, currCord) {
    self.tmp.restoreState();
    self.ctx.beginPath();
    if (e.shiftKey) {
      this.calcProportCoord(currCord);
    }
    self.ctx.moveTo(this.startCoord.x, this.startCoord.y);
    self.ctx.lineTo(currCord.x, currCord.y);
    self.ctx.stroke();
  };

  onMouseUp(e) {
    self.ctx.closePath();
  };
}


class FloodFill {
  called: string
  xssss: string
  yssss: string
  fillcolorssss: string

  floodfill(data, x, y, fillcolor, tolerance, width, height) {
    called = 0;
    xssss = x;
    yssss = y;
    fillcolorssss = fillcolor;
    let length = data.length;
    let Q = [];
    let i = (x + y * width) * 4;
    let e = i, w = i, me, mw, w2 = width * 4;
    let targetcolor = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (!pixelCompare(i, targetcolor, fillcolor, data, length, tolerance)) {
      return false;
    }
    Q.push(i);
    while (Q.length) {
      i = Q.pop();
      if (pixelCompareAndSet(i, targetcolor, fillcolor, data, length, tolerance)) {
        e = i;
        w = i;
        mw = parseInt(i / w2) * w2; //left bound
        me = mw + w2;             //right bound
        while (mw < w && mw < (w -= 4) && pixelCompareAndSet(w, targetcolor, fillcolor, data, length, tolerance)) ; //go left until edge hit
        while (me > e && me > (e += 4) && pixelCompareAndSet(e, targetcolor, fillcolor, data, length, tolerance)) ; //go right until edge hit
        for (let j = w; j < e; j += 4) {
          if (j - w2 >= 0 && pixelCompare(j - w2, targetcolor, fillcolor, data, length, tolerance)) Q.push(j - w2); //queue y-1
          if (j + w2 < length && pixelCompare(j + w2, targetcolor, fillcolor, data, length, tolerance)) Q.push(j + w2); //queue y+1
        }
      }
    }
    return data;
  }

  pixelCompare(i, targetcolor, fillcolor, data, length, tolerance) {
    if (i < 0 || i >= length) return false; //out of bounds
    if (data[i + 3] === 0 && fillcolor.a > 0) return true;  //surface is invisible and fill is visible

    if (
        Math.abs(targetcolor[3] - fillcolor.a) <= tolerance &&
        Math.abs(targetcolor[0] - fillcolor.r) <= tolerance &&
        Math.abs(targetcolor[1] - fillcolor.g) <= tolerance &&
        Math.abs(targetcolor[2] - fillcolor.b) <= tolerance
    ) return false; //target is same as fill

    if (
        (targetcolor[3] === data[i + 3]) &&
        (targetcolor[0] === data[i]) &&
        (targetcolor[1] === data[i + 1]) &&
        (targetcolor[2] === data[i + 2])
    ) return true; //target matches surface

    if (
        Math.abs(targetcolor[3] - data[i + 3]) <= (255 - tolerance) &&
        Math.abs(targetcolor[0] - data[i]) <= tolerance &&
        Math.abs(targetcolor[1] - data[i + 1]) <= tolerance &&
        Math.abs(targetcolor[2] - data[i + 2]) <= tolerance
    ) return true; //target to surface within tolerance

    return false; //no match
  }

  pixelCompareAndSet(i, targetcolor, fillcolor, data, length, tolerance) {
    called++;
    if (called > 10000000) {
      throw "Unable to flood fill the image, because cycle detected.";
    }
    if (pixelCompare(i, targetcolor, fillcolor, data, length, tolerance)) {
      //fill the color
      data[i] = fillcolor.r;
      data[i + 1] = fillcolor.g;
      data[i + 2] = fillcolor.b;
      data[i + 3] = fillcolor.a;
      return true;
    }
    return false;
  }
}

class FillTool extends Tool {
  keyActivator = {
    code: 'KeyF',
    icon: 'icon-fill',
    title: 'Flood Fill (F)'
  };
  bufferHandler = true;

  buildCursor() {
    let rawString = format(FLOOD_FILL_CURSOR, self.ctx.fillStyle);
    return format('url(data:image/svg+xml;base64,{}) {} {}, auto')(btoa(rawString), 39, 86);
  }

  getCursor() {
    return this.buildCursor();
  }

  onChangeColorFill(e) {
    self.helper.setCursor(this.buildCursor());
  }

  floodFill =
      this.getRGBA() {
  let
  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(self.ctx.fillStyle);

  if(

!
  result
) {
  throw
  "Invalid color";
}

return {
  r: parseInt(result[1], 16),
  g: parseInt(result[2], 16),
  b: parseInt(result[3], 16),
  a: (self.instruments.opacityFill.inputValue || 0) * 255
}
}
;
this.onMouseDown(e)
{
  if (!((self.dom.canvas.width * self.dom.canvas.height) < 1000001)) {
    self.logger.debug("Can't fill image because amount of  data is too huge. Your browser would just explode ;(");
  } else {
    let xy = self.helper.getXY(e);
    let image = self.buffer.startAction();
    let processData = image.data.slice(0);
    this.floodFill(processData, xy.x, xy.y, this.getRGBA(), 0, image.width, image.height);
    let resultingImg = new ImageData(processData, image.width, image.height);
    self.ctx.putImageData(resultingImg, 0, 0);
    self.buffer.finishAction(resultingImg);
  }
}
}

class PenTool extends Tool {
  keyActivator = {
    code: 'KeyB',
    icon: 'icon-brush-1',
    title: 'Brush (B)'
  };

  onChangeColor(e) {
    self.helper.setCursor(this.getCursor());
  };

  onChangeRadius(e) {
    self.helper.setCursor(this.getCursor());
  };

  onChangeOpacity(e) {
    self.helper.setCursor(this.getCursor());
  };

  getCursor() {
    return self.helper.buildCursor(self.ctx.strokeStyle, '', self.ctx.lineWidth);
  };

  onActivate() {
    self.ctx.lineJoin = 'round';
    self.ctx.lineCap = 'round';
  };

  onMouseDown(e) {
    let coord = self.helper.getXY(e);
    self.ctx.moveTo(coord.x, coord.y);
    this.points = [];
    self.tmp.saveState();
    this.onMouseMove(e, coord)
  };

  onMouseMove(e, coord) {
    // self.logger.debug("mouse move,  points {}", JSON.stringify(this.points))();
    self.tmp.restoreState();
    this.points.push(coord);
    self.ctx.beginPath();
    self.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 0; i < this.points.length; i++) {
      self.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    self.ctx.stroke();
  };

  onMouseUp(e) {
    self.ctx.closePath();
    this.points = [];
  };
}


class SelectTool extends Appliable {
  keyActivator = {
    code: 'KeyS',
    icon: 'icon-selection',
    title: 'Select (S)'
  }

  constructor() {
    super();
    this.imgInfo = {width: 0, height: 0};
  }

  private imgInfo: { width: number, height: number };
  private inProgress: boolean = false;
  private mouseUpClicked: boolean = false;
  bufferHandler = true;
  domImg = self.dom.paintPastedImg;

  getCursor() {
    return 'crosshair';
  };

  onActivate() {
    this.inProgress = false;
    this.mouseUpClicked = false;
  };

  // document.addEventListener('copy', this.onCopy);
  onZoomChange(...args) {
    self.resizer.onZoomChange(...args);
  }

  onDeactivate() {
    if (this.inProgress) {
      let params = self.resizer.params;
      self.logger.debug(
          'Applying image {}, {}x{}, to  {x: {}, y: {}, w: {}, h:{}',
          this.imgInfo.width,
          this.imgInfo.height,
          params.left,
          params.top,
          params.width,
          params.height
      )();
      self.helper.drawImage(this.domImg,
          0, 0, this.imgInfo.width, this.imgInfo.height,
          params.left, params.top, params.width, params.height);
      self.buffer.finishAction();
      this.inProgress = false; // don't restore in onDeactivate
    }
    self.resizer.hide();
    self.cssUtils.hideElement(this.domImg);
  }

  isSelectionActive() {
    return self.mode === 'select' && this.inProgress && this.mouseUpClicked;
  }

  onMouseDown(e: Event) {
    //self.logger.debug('select mouseDown')();
    this.onDeactivate();
    this.mouseUpClicked = false;
    self.resizer.show();
    self.resizer.setData(e.offsetY, e.offsetX, 0, 0);
    self.resizer.trackMouseMove(e, 'br');
  };

  onMouseUp(e) {
    if (this.mouseUpClicked) {
      return;
    }
    let params = self.resizer.params;
    if (!params.width || !params.height) {
      self.resizer.hide();
    } else {
      //self.logger.debug('select mouseUp')();
      this.inProgress = true;
      this.mouseUpClicked = true;
      let imageData = self.ctx.getImageData(params.left, params.top, params.width, params.height);
      self.tmpCanvasContext.canvas.width = params.width;
      self.tmpCanvasContext.canvas.height = params.height;
      this.imgInfo = {width: params.width, height: params.height};
      self.tmpCanvasContext.putImageData(imageData, 0, 0);
      self.cssUtils.showElement(this.domImg);
      this.domImg.src = self.tmpCanvasContext.canvas.toDataURL();
      self.buffer.startAction();
      self.ctx.clearRect(params.left, params.top, params.width, params.height);
    }
  }

  rotateInfo() {
    let c = this.imgInfo.width;
    this.imgInfo.width = this.imgInfo.height;
    this.imgInfo.height = c;
    self.resizer.params.rotate();
  }

  getAreaData() {
    return {
      width: this.imgInfo.width,
      height: this.imgInfo.height,
      img: this.domImg
    }
  };
}
