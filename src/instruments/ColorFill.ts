import {Instrument} from "@/types/model";

class ColorFill extends Instrument {
  handler= 'onChangeColorFill';
  ctxSetter (v: string) {
    this.ctx.fillStyle = v;
  }
  title= 'Fill color';
  text= "CF:";
  holderClass= 'paintColorFill';
  hiddenByDefault= true;
  inputFactory() {
    var input = document.createElement('input');
    input.type = 'color';
    input.value = '#0000ff';
    return input;
  }
}

export {ColorFill}
