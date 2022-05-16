declare module 'spainter' {

  interface PainterConf {
    onBlobPaste?(blob: Blob): void;
    logger?: any;
    buttonClass?: string;
    rangeClass?: string;
    textClass?: string;
    rangeFactory?(div: HTMLElement): HTMLInputElement
  }
  class Painter {
    constructor(parentElement: HTMLElement, conf: PainterConf);
  }
  export = Painter;
}
