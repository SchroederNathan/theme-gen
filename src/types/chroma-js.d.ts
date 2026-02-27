declare module "chroma-js" {
  interface ChromaColor {
    luminance(): number;
    hex(): string;
    darken(amount?: number): ChromaColor;
    brighten(amount?: number): ChromaColor;
    set(channel: string, value: number): ChromaColor;
    oklch(): [number, number, number];
    clipped(): boolean;
    css(mode?: string): string;
  }

  interface Chroma {
    (color: string): ChromaColor;
    hsl(h: number, s: number, l: number): ChromaColor;
    oklch(l: number, c: number, h: number): ChromaColor;
    mix(
      color1: string | ChromaColor,
      color2: string | ChromaColor,
      f?: number,
      mode?: string
    ): ChromaColor;
  }

  const chroma: Chroma;
  export default chroma;
}
