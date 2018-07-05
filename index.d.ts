declare module 'spainter' {

  interface PainterConf {
    onBlobPaste(blob: Blob);
    logger: any;
  }
  class Painter {
    constructor(div: HTMLElement, conf: PainterConf);
  }
  export = Painter;
}