export class Money {
  private static readonly PATTERN =
    /^(?<currency>\D*?)(?<whole>\d{1,3}(?:,\d{3})+|\d+)(?:\.(?<fraction>\d{1,2}))?$/;

  private constructor(
    readonly cents: number,
    readonly currency: string,
  ) {}

  static parse(text: string): Money {
    const groups = Money.PATTERN.exec(text.trim())?.groups;
    if (!groups) {
      throw new Error(`"${text}" is not a price`);
    }
    const whole = Number(groups.whole.replaceAll(',', ''));
    const fraction = Number((groups.fraction ?? '').padEnd(2, '0'));
    return new Money(whole * 100 + fraction, groups.currency);
  }

  static zero(currency = '$'): Money {
    return new Money(0, currency);
  }

  static sum(amounts: Money[]): Money {
    return amounts.reduce((total, amount) => total.add(amount), Money.zero(amounts[0]?.currency));
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents, this.currency);
  }

  multiply(quantity: number): Money {
    return new Money(this.cents * quantity, this.currency);
  }

  isLessThan(other: Money): boolean {
    return this.cents < other.cents;
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  toString(): string {
    return `${this.currency}${(this.cents / 100).toFixed(2)}`;
  }
}
