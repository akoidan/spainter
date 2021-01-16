import {Painter} from "@/utils/Painter";

class Appliable {
  protected painter: Painter;

  constructor(painter: Painter) {
    this.painter = painter;
  }
  enableApply() {
    self.instruments.apply.value.removeAttribute('disabled');
  };
  disableApply() {
    self.instruments.apply.value.setAttribute('disabled', 'disabled');
  };
}

export {Appliable}
