import {Instrument} from "@/instruments/Instrument";

class OpacityFill extends Instrument {
  handler= 'onChangeFillOpacity';
  range= true;
  ctxSetter(v: string) {
    this.inputValue = v / 100;
  };
  title= 'Fill alpha (color transparency)';
  text= "AF:";
  holderClass= 'paintFillOpacity';
  hiddenByDefault= true;
  inputFactory() {
    var input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('step', 1);
    input.value = '100';
    return input;
  }
}

export {OpacityFill}
