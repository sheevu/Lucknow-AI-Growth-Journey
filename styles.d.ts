declare module "*.css?inline" { const css: string; export default css; }
declare module "virtual:critical-css" {
  const css: string;
  export default css;
  export const stylesVersion: string;
}
