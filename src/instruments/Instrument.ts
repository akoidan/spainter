abstract class Instrument {

  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  title?: string;
  inputValue?: string|number;
  text?: string;
  abstract holderClass: string;
  abstract hiddenByDefault: boolean;
  abstract handler: string;
  inputFactory?(): HTMLElement;
  ctxSetter?(a: string): void;

}

export {Instrument}
