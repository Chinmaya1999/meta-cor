export interface GoalInput { current: number; monthly: number; annualReturn: number; years: number }
export interface GoalPoint { year: number; contributed: number; value: number }

/** Monthly-compounded future value with end-of-month contributions. Hypothetical illustration only. */
export function goalProjection({ current, monthly, annualReturn, years }: GoalInput) {
  const r = annualReturn / 100 / 12;
  const points: GoalPoint[] = [];
  let value = current;
  for (let m = 0; m <= years * 12; m++) {
    if (m > 0) value = value * (1 + r) + monthly;
    if (m % 12 === 0) points.push({ year: m / 12, contributed: current + monthly * m, value });
  }
  const contributed = current + monthly * years * 12;
  return { points, contributed, final: value, growth: value - contributed };
}

export interface RetirementInput { age: number; retireAge: number; savings: number; monthly: number; inflation: number; annualReturn: number; targetToday: number }
export function retirementProjection(i: RetirementInput) {
  const years = Math.max(0, i.retireAge - i.age);
  const g = goalProjection({ current: i.savings, monthly: i.monthly, annualReturn: i.annualReturn, years });
  const infl = Math.pow(1 + i.inflation / 100, years);
  const goalNominal = i.targetToday * infl;
  return { years, projected: g.final, projectedToday: g.final / infl, goalNominal, gap: goalNominal - g.final, contributed: g.contributed, points: g.points, onTrack: g.final >= goalNominal };
}

export interface Q { id: string; q: string; options: { label: string; score: number }[] }
export const QUESTIONS: Q[] = [
  { id: "horizon", q: "When will you need to start using most of this money?", options: [{ label: "Within 3 years", score: 1 }, { label: "3 to 7 years", score: 2 }, { label: "7 to 15 years", score: 3 }, { label: "More than 15 years", score: 4 }] },
  { id: "goal", q: "What is the main goal for these funds?", options: [{ label: "Protect what I have", score: 1 }, { label: "Generate steady income", score: 2 }, { label: "Balanced growth and stability", score: 3 }, { label: "Maximise long-term growth", score: 4 }] },
  { id: "drop", q: "If your investments fell 20% in a year, what would you most likely do?", options: [{ label: "Sell everything to avoid further loss", score: 1 }, { label: "Sell some to reduce risk", score: 2 }, { label: "Hold and wait for recovery", score: 3 }, { label: "Invest more while prices are lower", score: 4 }] },
  { id: "exp", q: "How would you describe your investment experience?", options: [{ label: "None", score: 1 }, { label: "Limited: savings and deposits", score: 2 }, { label: "Moderate: funds and shares", score: 3 }, { label: "Extensive: a range of asset classes", score: 4 }] },
  { id: "income", q: "How stable is your income and how substantial are your reserves?", options: [{ label: "Uncertain, with limited reserves", score: 1 }, { label: "Stable, with modest reserves", score: 2 }, { label: "Stable, with healthy reserves", score: 3 }, { label: "Very stable, with substantial reserves", score: 4 }] },
  { id: "return", q: "Which statement best matches your attitude to risk and return?", options: [{ label: "Capital safety matters most, even if returns are low", score: 1 }, { label: "I accept small fluctuations for modest returns", score: 2 }, { label: "I accept moderate fluctuations for better returns", score: 3 }, { label: "I accept large fluctuations for the chance of high returns", score: 4 }] },
];
export const PROFILES = [
  { max: 1.75, name: "Conservative", text: "You appear to prioritise capital stability and predictability over growth." },
  { max: 2.5, name: "Moderately Conservative", text: "You appear to favour stability while accepting some variation for modest growth." },
  { max: 3.25, name: "Balanced", text: "You appear comfortable with a mix of stability and growth, accepting moderate ups and downs." },
  { max: 4.01, name: "Growth-oriented", text: "You appear comfortable with significant fluctuation in pursuit of long-term growth." },
];
export const profileFor = (answers: number[]) => { const avg = answers.reduce((a, b) => a + b, 0) / answers.length; return { avg, ...PROFILES.find((p) => avg <= p.max)! }; };
