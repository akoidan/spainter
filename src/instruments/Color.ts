import {Instrument} from "@/types/model";

class Color extends Instrument{
  title= 'Color';
  text= "C:";
  holderClass= 'paintColor';
  hiddenByDefault= true;
  inputFactory() {
    var input = document.createElement('input');
    input.type = 'color';
    input.value = '#ff0000';
    return input;
  }
  handler= 'onChangeColor';
  ctxSetter (v: string) {
    this.ctx.strokeStyle = v;
  }
}

export {Color}
