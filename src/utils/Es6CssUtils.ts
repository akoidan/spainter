import {CssUtils} from "@/utils/CssUtils";

class Es6CssUtils extends CssUtils {
  public addClass(element: HTMLElement, className: string): void {
    element.classList.add(className);
  }

  public removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className);
  }

  public hasClass(element: HTMLElement, className: string): boolean {
    return element.classList.contains(className);
  }


  public toggleClass(element: HTMLElement, className: string): boolean {
    return element.classList.toggle(className);
  }
}

export {Es6CssUtils};
