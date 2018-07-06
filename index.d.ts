declare module 'spainter' {

  interface PainterConf {
    onBlobPaste(blob: Blob): void;
    logger?: any;
    buttonClass?: string;
    rangeClass?: string;
    textClass?: string;
    rangeFactory?(): HTMLInputElement
  }
  class Painter {
    constructor(div: HTMLElement, conf: PainterConf);
  }
  export = Painter;
}