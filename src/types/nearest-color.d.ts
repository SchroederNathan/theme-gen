declare module 'nearest-color' {
  interface NearestColor {
    from: (colors: Record<string, string>) => (color: string) => { name: string; value: string };
  }
  const nearestColor: NearestColor;
  export default nearestColor;
}