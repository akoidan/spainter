import {Instrument} from "@/instruments/Instrument";

class Opacity extends Instrument{
  handler= 'onChangeOpacity';
  range= true;
  ctxSetter (v: string) {
    this.ctx.globalAlpha = v / 100;
    this.inputValue = v / 100;
  }
  title= 'Alpha (color transparency)';
  text= "A:";
  holderClass= 'paintOpacity';
  hiddenByDefault= true;
  inputFactory() {
    var input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('step', 1);
    input.value = '100';
    return input;
  }
}

export {Opacity}
