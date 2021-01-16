import {Instrument} from "@/types/model";

class Apply extends Instrument {
  trigger= 'click';
  handler= 'onApply';
  holderClass= 'paintApplyText';
  hiddenByDefault= true;
  inputFactory() {
    var input = document.createElement('input');
    input.type = 'button';
    input.value = 'Appply';
    return input;
  };
}

export {Apply};
