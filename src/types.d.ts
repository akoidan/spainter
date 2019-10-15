interface CanvasRenderingContext2D {
  mozImageSmoothingEnabled: boolean;
  fontFamily: string;
}

declare module '*.html' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}
