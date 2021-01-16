import {Logger} from "lines-logger";

interface PainterConf {
  logger?: Logger;
  buttonClass?: string;
  rangeClass?: string;
  textClass?: string;
  onBlobPaste?(blob: Blob): void;
  rangeFactory?(): HTMLInputElement;
}

interface DomElements {
  container: HTMLElement;
  canvas: HTMLElement;
  bottomTools: HTMLElement;
  paintDimensions: HTMLElement;
  paintXY: HTMLElement;
  trimImage: HTMLElement;
  header: HTMLElement;
  canvasResize: HTMLElement;
  canvasWrapper: HTMLElement;
  painterTools: HTMLElement;
  paintPastedImg: HTMLElement;
  paintSend: HTMLElement;
  paintCrpRect: HTMLElement;
  paintTextSpan: HTMLElement;
  paintResizeTools: HTMLElement;
}

type InstrumentName = 'color'| 'opacity' | 'colorFill' | 'opacityFill' | 'width' | 'font' | 'apply';

interface KeyActivator {
  code: string;
  icon: string;
  title: string;
}

interface Tool {
  bufferHandler: boolean;
  keyActivator: KeyActivator;
  onDeactivate?(): void;
  onMouseDown?(e: Event, data?: any): void;
  onMouseUp?(): void;
  onZoomChange?(): void;
  onActivate?(): void;
  onApply?(): void;
  getCursor?(): void;
  onMouseMove?(e: Event): void;
}

export {PainterConf, DomElements, InstrumentName, KeyActivator, Tool}
