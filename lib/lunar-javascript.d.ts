/**
 * lunar-javascript ships without TypeScript types.
 * @see https://github.com/6tail/lunar-javascript
 */
declare module "lunar-javascript" {
  export class Solar {
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): Solar;
    getLunar(): Lunar;
  }

  export class Lunar {
    getEightChar(): EightChar;
  }

  /** 八字 — get*() return two-character 干支 strings (e.g. "甲子"). */
  export class EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
  }
}
