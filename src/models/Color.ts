export class Color {
  private static readonly PATTERN =
    /^rgba?\(\s*(?<red>\d{1,3}),\s*(?<green>\d{1,3}),\s*(?<blue>\d{1,3})(?:,\s*[\d.]+)?\s*\)$/;

  private constructor(
    readonly red: number,
    readonly green: number,
    readonly blue: number,
  ) {}

  static parse(css: string): Color {
    const groups = Color.PATTERN.exec(css.trim())?.groups;
    if (!groups) {
      throw new Error(`"${css}" is not an rgb colour`);
    }
    return new Color(Number(groups.red), Number(groups.green), Number(groups.blue));
  }

  isRed(): boolean {
    return this.red >= 200 && this.red > this.green && this.red > this.blue;
  }

  toString(): string {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`;
  }
}
