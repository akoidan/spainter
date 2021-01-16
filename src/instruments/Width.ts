import {Instrument} from "@/instruments/Instrument";

class Width extends Instrument {
  range= true;
  handler= 'onChangeRadius';
  ctxSetter (v: string) {
    this.ctx.lineWidth = v;
  }
  title= 'Width';
  text= "W:";
  holderClass= 'paintRadius';
  hiddenByDefault= true;
  inputFactory() {
    var input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('step', 1);
    input.value = '10';
    return input;
  }
}

export {Width}
