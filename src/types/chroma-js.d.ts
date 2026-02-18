declare module "chroma-js" {
  interface ChromaColor {
    luminance(): number;
    hex(): string;
    darken(amount?: number): ChromaColor;
    brighten(amount?: number): ChromaColor;
    set(channel: string, value: number): ChromaColor;
  }

  interface Chroma {
    (color: string): ChromaColor;
    hsl(h: number, s: number, l: number): ChromaColor;
    mix(color1: string, color2: string, f?: number, mode?: string): ChromaColor;
  }

  const chroma: Chroma;
  export default chroma;
}
