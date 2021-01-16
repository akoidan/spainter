import {CssUtils} from "@/utils/CssUtils";

class IECssUtils extends CssUtils {
  public addClass(element: HTMLElement, className: string): void {
    if (!this.hasClass(element, className)) {
      element.className += ` ${className}`;
    }
  }

  public removeClass(element: HTMLElement, className: string): void {
    if (element.className) {
      element.className.replace(new RegExp(`(?:^|\\s)${className}(?:\\s|$)`, "u"), " ");
    }
  }

  public hasClass(element: HTMLElement, className: string): boolean {
    return element?.className?.split(" ").includes(className);
  }

  public toggleClass(element: HTMLElement, className: string): boolean {
    if (this.hasClass(element, className)) {
      this.removeClass(element, className);
      return false;
    }
    this.addClass(element, className);
    return true;
  }
}

export {IECssUtils};
