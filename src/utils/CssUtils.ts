abstract class CssUtils {
  private static readonly visibilityClass: string = "spainterHidden";

  public showElement(element: HTMLElement): void {
    this.removeClass(element, CssUtils.visibilityClass);
  }

  public hideElement(element: HTMLElement): void {
    this.addClass(element, CssUtils.visibilityClass);
  }

  public setClassToState(element: HTMLElement, isVisible: boolean, className: string): void {
    if (isVisible) {
      this.removeClass(element, className);
    } else {
      this.addClass(element, className);
    }
  }

  public abstract addClass(element: HTMLElement, className: string): void;

  public abstract removeClass(element: HTMLElement, className: string): void;

  public abstract hasClass(element: HTMLElement, className: string): boolean;

  public abstract toggleClass(element: HTMLElement, className: string): boolean;
}

export {CssUtils};

