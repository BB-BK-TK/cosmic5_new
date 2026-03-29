/**
 * 사주 사주(四柱) 계산 — 절기·입춘·일진을 `lunar-javascript` 엔진에 위임.
 *
 * 기존 `saju-db.js`의 로컬 절기표는 2020·2026년만 있어 그 외 연도는 월주가
 * 양력 월로 잘못 계산되는 치명적 버그가 있었음. 해석 DB·오행 집계는 기존
 * `SajuCalculator`를 그대로 사용한다.
 */

import { Solar } from "lunar-javascript";
import { SajuCalculator, SajuDB } from "./saju-db";

const GAN_ZH = "甲乙丙丁戊己庚辛壬癸";
const ZHI_ZH = "子丑寅卯辰巳午未申酉戌亥";

function zhGanZhiToPillar(zh: string): { stem: number; branch: number; ganji: string } {
  const s = (zh ?? "").trim();
  if (s.length < 2) {
    throw new Error(`Invalid gan zhi: "${zh}"`);
  }
  const stem = GAN_ZH.indexOf(s[0]!);
  const branch = ZHI_ZH.indexOf(s[1]!);
  if (stem < 0 || branch < 0) {
    throw new Error(`Unknown gan zhi: "${zh}"`);
  }
  const ganji = SajuDB.천간.목록[stem] + SajuDB.지지.목록[branch];
  return { stem, branch, ganji };
}

/** Same shape as `SajuCalculator.prototype.calculate` return value. */
export function calculateSajuFromSolar(
  year: number,
  month: number,
  day: number,
  hour: number,
  sajuCalc: SajuCalculator
): ReturnType<SajuCalculator["calculate"]> {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const ec = solar.getLunar().getEightChar();

  const yearP = zhGanZhiToPillar(ec.getYear());
  const monthP = zhGanZhiToPillar(ec.getMonth());
  const dayP = zhGanZhiToPillar(ec.getDay());
  const hourP = zhGanZhiToPillar(ec.getTime());

  const 연주 = { stem: yearP.stem, branch: yearP.branch, ganji: yearP.ganji };
  const 월주 = {
    stem: monthP.stem,
    branch: monthP.branch,
    ganji: monthP.ganji,
    절입월: month,
  };
  const 일주 = { stem: dayP.stem, branch: dayP.branch, ganji: dayP.ganji };
  const 시주 = { stem: hourP.stem, branch: hourP.branch, ganji: hourP.ganji };

  const elements = sajuCalc.calcElements(연주, 월주, 일주, 시주);
  const 일간 = SajuDB.천간.목록[일주.stem];
  type GanKey = keyof typeof SajuDB.천간.해석;
  type ZhiKey = keyof typeof SajuDB.지지.속성;
  const 일간정보 = SajuDB.천간.해석[일간 as GanKey];
  const 지지명 = SajuDB.지지.목록[연주.branch] as ZhiKey;
  const 띠 = SajuDB.지지.속성[지지명].동물;

  return {
    year: 연주,
    month: 월주,
    day: 일주,
    hour: 시주,
    elements,
    일간,
    일간정보,
    띠,
  };
}
