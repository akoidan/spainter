import {Instrument} from "@/instruments/Instrument";

class Font extends Instrument {
  handler= 'onChangeFont';
  title= 'Font';
  text= "F:";
  holderClass= 'paintFont';
  hiddenByDefault= true;
  ctxSette (v: string) {
    this.ctx.fontFamily = v;
  }

  inputFactory(): HTMLElement {
    var input = document.createElement('select');
    return input;
  }
}

export {Font}
