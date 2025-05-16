declare module 'chroma-js' {
  interface Chroma {
    (color: string): {
      luminance(): number;
    };
  }
  const chroma: Chroma;
  export default chroma;
} 