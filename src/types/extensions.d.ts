declare module "*.jpg" {}
declare module "*.svg" {}
declare module "*.gif" {}
declare module "*.json" {
  const value: unknown;
  export default value;
}
declare module "*.sass" {}
declare module "*.css" {}
declare module "*.scss" {}
declare module "*.png" {}
declare module "*.html" {
  const value: string;
  export default value;
}
