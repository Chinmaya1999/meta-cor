/**
 * Single source of truth for site content. Used by the backend seed script
 * and as the frontend's offline fallback.
 *
 * VERIFIED (from https://www.metawealthcapital.com/ on 2026-11-19):
 *  - Dubai, UAE location (no street address published)
 *  - Phone +971 558271719
 *  - "60+ years combined experience across India, UAE, UK and Singapore"
 *  - Service areas named on the live site
 *
 * NOT VERIFIED – must be supplied/approved by the client before launch:
 *  - Email address, street address, social links, regulatory licences,
 *    team names / titles / qualifications / photos, legal copy.
 */

export interface ServiceContent {
  slug: string;
  title: string;
  icon: string; // lucide icon name
  tagline: string;
  summary: string;
  overview: string;
  challenges: string[];
  howItWorks: string[];
  expertise: string[];
  faqs: { q: string; a: string }[];
  order: number;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const COMPANY = {
  name: "MetaWealth Capital",
  tagline: "Investment Advisory & Wealth Management",
  phone: "+971 558271719",
  phoneHref: "tel:+971558271719",
  location: "Dubai, UAE",
  // UNVERIFIED: email decoded from an obfuscated link; confirm with client.
  email: "",
  address: "", // street address not published – confirm before enabling the map
  social: { linkedin: "", instagram: "", x: "" } as Record<string, string>,
  regulatoryStatement: "", // must be provided by the client's compliance team
};

export const TRUST_STATS = [
  { value: 60, suffix: "+", label: "Years of combined advisory experience", note: "Combined team experience" },
  { value: 4, suffix: "", label: "Markets of professional experience", note: "India · UAE · UK · Singapore" },
];

export const TRUST_POINTS = [
  "Personalised financial planning",
  "Long-term client relationships",
];

export const MARKETS = [
  { name: "India", x: 66, y: 52, text: "Team experience across Indian financial markets and cross-border family planning." },
  { name: "UAE", x: 59, y: 47, text: "Dubai, UAE is our published location and the base for client conversations." },
  { name: "United Kingdom", x: 47, y: 27, text: "Team experience in UK markets, taxation and wealth structures." },
  { name: "Singapore", x: 74, y: 62, text: "Team experience in Singapore's international financial centre." },
];

export const SERVICES: ServiceContent[] = [
  {
    slug: "financial-planning", title: "Financial Planning", icon: "Compass", order: 1,
    tagline: "A single plan for everything that matters.",
    summary: "Personalised financial plans based on your income, goals, investments, protection and future requirements.",
    overview: "Financial planning brings your investments, insurance, tax and retirement thinking into one coherent picture. We start with your ambitions and your family, then build a plan that can adapt as life changes.",
    challenges: ["Savings and investments held across several institutions or countries", "Uncertainty about whether current plans will meet future goals", "Competing priorities: family, business, property and retirement", "No single adviser who sees the whole picture"],
    howItWorks: ["We map your income, assets, liabilities and protection", "We translate your goals into measurable time horizons", "We prioritise actions and document a written plan", "We review the plan regularly as circumstances change"],
    expertise: ["Cash-flow and goal-based planning", "Integration of investment, insurance, tax and retirement planning", "Cross-border family circumstances"],
    faqs: [
      { q: "Who is financial planning for?", a: "Individuals, families and business owners who want their financial decisions to work together rather than in isolation." },
      { q: "How often is the plan reviewed?", a: "We recommend at least an annual review, and whenever your circumstances change materially." },
      { q: "Is the plan a guarantee of outcomes?", a: "No. A financial plan is built on assumptions and cannot guarantee future results." },
    ],
  },
  {
    slug: "investment-advisory", title: "Investment Advisory", icon: "LineChart", order: 2,
    tagline: "Unbiased advice, aligned with your objectives.",
    summary: "Investment recommendations aligned with your financial objectives, time horizons and risk tolerance.",
    overview: "We advise individuals, families and businesses on how to invest to achieve their financial goals. Our approach is grounded in modern portfolio theory and an unbiased view of the options available to you.",
    challenges: ["Too many products and too little clarity", "Concentration in a single asset class, market or currency", "Difficulty matching investments to time horizon and risk comfort", "Keeping pace with changing markets without reacting emotionally"],
    howItWorks: ["We clarify objectives, time horizon and risk tolerance", "We assess your existing holdings and preferences", "We recommend a diversified approach aligned to your profile", "We monitor and review as markets and circumstances evolve"],
    expertise: ["Modern portfolio theory and diversification", "Risk-aware investment selection", "Advice for individuals, families and businesses"],
    faqs: [
      { q: "Is your advice independent?", a: "Our published positioning is unbiased advisory. Specific regulatory status and disclosures will be set out in our regulatory information." },
      { q: "Can returns be guaranteed?", a: "No. All investments carry risk, including the possible loss of capital. Past performance is not a reliable indicator of future results." },
    ],
  },
  {
    slug: "wealth-management", title: "Wealth Management", icon: "Landmark", order: 3,
    tagline: "Build, preserve and manage, together.",
    summary: "A coordinated approach to help individuals and families build, preserve and manage their assets.",
    overview: "Wealth management goes beyond investing. It coordinates your financial investments, real estate and other assets with tax, protection and succession considerations, under one long-term relationship.",
    challenges: ["Assets spread across investments, property and business interests", "Balancing growth today with preservation for the future", "Coordinating several professionals and advisers", "Passing wealth on in an orderly way"],
    howItWorks: ["A deep discovery of your financial position and family", "A coordinated strategy across all asset types", "Implementation with the specialists you need", "Ongoing review and open communication"],
    expertise: ["Multi-asset, multi-jurisdiction wealth", "Family and business-owner circumstances", "Long-term preservation focus"],
    faqs: [
      { q: "What assets do you advise on?", a: "Our published scope covers financial investments, real estate and other forms of assets, subject to applicable regulation." },
      { q: "Is there a minimum portfolio size?", a: "Any minimum, fee or pricing information will be confirmed by the team at consultation." },
    ],
  },
  {
    slug: "retirement-planning", title: "Retirement Planning", icon: "Sunset", order: 4,
    tagline: "Prepare for the life you want after work.",
    summary: "Long-term financial planning and income considerations to help you prepare for retirement.",
    overview: "Retirement planning estimates what you may need, how long it needs to last, and the steps required to get there, while recognising inflation, longevity and changing priorities.",
    challenges: ["Not knowing how much is enough", "Inflation eroding purchasing power", "Relocation and cross-border pension questions", "Turning savings into sustainable income"],
    howItWorks: ["We define your desired retirement lifestyle", "We model savings, inflation and income needs", "We identify gaps and options to close them", "We review periodically and adjust"],
    expertise: ["Retirement income considerations", "Inflation-aware goal setting", "Expatriate and cross-border circumstances"],
    faqs: [
      { q: "When should I start?", a: "Earlier is generally easier, but a plan is useful at any stage. We tailor the approach to your age and goals." },
      { q: "Are the calculators on this site advice?", a: "No. They are hypothetical illustrations only and not personal advice or a prediction of returns." },
    ],
  },
  {
    slug: "tax-planning", title: "Tax Strategy", icon: "Scale", order: 5,
    tagline: "Strategy shaped by the rules that apply to you.",
    summary: "Tax planning and strategic guidance based on applicable jurisdictional requirements.",
    overview: "Tax is part of every financial decision. We consider tax as one element of your wider plan, always with reference to the rules of the jurisdictions that apply to you.",
    challenges: ["Income or assets in more than one country", "Uncertainty about residency and reporting obligations", "Tax considerations affecting investment choices", "Planning ahead rather than reacting"],
    howItWorks: ["We understand your residency and asset footprint", "We identify planning considerations across jurisdictions", "We coordinate with your tax and legal advisers", "We revisit as laws and circumstances change"],
    expertise: ["Cross-border planning considerations", "Integration with investment and estate planning"],
    faqs: [
      { q: "Do you provide legal or tax filing services?", a: "Our service is strategic planning guidance. Filing and legal advice should be obtained from appropriately licensed professionals." },
    ],
  },
  {
    slug: "estate-planning", title: "Estate Planning", icon: "TreePine", order: 6,
    tagline: "Continuity for the family that follows.",
    summary: "Help considering wealth transfer, asset succession and intergenerational financial planning.",
    overview: "Estate planning is about continuity: ensuring your assets pass to the people you choose, in the way you intend, with as little uncertainty as possible.",
    challenges: ["Unclear succession for family or business assets", "Assets in several jurisdictions", "Guardianship and provision for dependants", "Avoiding family disputes"],
    howItWorks: ["We discuss your family and wishes", "We map assets and potential succession issues", "We work alongside your legal advisers", "We review when family circumstances change"],
    expertise: ["Intergenerational planning", "Coordination with legal professionals"],
    faqs: [
      { q: "Do you draft wills or trusts?", a: "Legal documents must be prepared by qualified legal professionals. We help you plan and coordinate." },
    ],
  },
  {
    slug: "risk-management", title: "Risk Management", icon: "ShieldCheck", order: 7,
    tagline: "Protect what you have worked for.",
    summary: "Understanding financial risks and aligning decisions with your personal risk tolerance and protection needs.",
    overview: "Good planning considers what could go wrong as carefully as what could go right. We assess investment risk, protection needs and insurance as part of your wider plan.",
    challenges: ["Income dependent on a single source", "Gaps in insurance or protection", "Portfolio risk that no longer matches your comfort level", "Unplanned events affecting the family"],
    howItWorks: ["We review existing protection and exposures", "We assess your risk tolerance and capacity", "We recommend aligned protection and portfolio options", "We review when life changes"],
    expertise: ["Insurance planning", "Risk-tolerance alignment"],
    faqs: [
      { q: "Do you sell insurance?", a: "Our published scope includes insurance planning. Details of any distribution arrangements will be disclosed in our regulatory information." },
    ],
  },
];

export const APPROACH = [
  { n: "01", title: "Discover", text: "Understand your financial position, family requirements, ambitions and objectives." },
  { n: "02", title: "Analyse", text: "Assess assets, liabilities, risk tolerance, investment preferences and financial needs." },
  { n: "03", title: "Strategise", text: "Develop a personalised financial and investment strategy." },
  { n: "04", title: "Implement", text: "Coordinate the implementation of the agreed recommendations." },
  { n: "05", title: "Review", text: "Review progress and adjust the plan when circumstances change." },
];

export const WHY = [
  { title: "Personalised Advisory", text: "Advice built around your family, goals and circumstances, not a standard model." },
  { title: "Experienced Professionals", text: "A team with over 60 years of combined advisory experience across four markets." },
  { title: "Transparent Communication", text: "Clear explanations, plain language and openness about how recommendations are made." },
  { title: "Long-Term Perspective", text: "Decisions made for the decades ahead, not the headlines of the week." },
  { title: "Integrated Financial Planning", text: "Investments, tax, protection, retirement and estate considered together." },
  { title: "Client-Centric Approach", text: "Your objectives come first, and the relationship is built to last." },
];

export interface ArticleContent {
  slug: string; title: string; category: string; excerpt: string; body: string[];
  publishedAt: string; readingMinutes: number;
}

// Educational starter articles (general, non-promissory). Client must review before publishing.
export const ARTICLES: ArticleContent[] = [
  {
    slug: "why-a-written-financial-plan-matters", category: "Financial Education",
    title: "Why a Written Financial Plan Matters", publishedAt: "2026-10-02", readingMinutes: 4,
    excerpt: "A plan on paper turns vague intentions into decisions you can measure and revisit.",
    body: ["Most people have financial goals. Fewer have written them down with a time frame and an amount attached. A written plan forces useful questions: what are we saving for, by when, and what could change?", "A good plan is a living document. It records your assumptions, so that when inflation, income or family circumstances change, you know which assumptions to revisit rather than starting again.", "This article is general education and not personal advice. No plan can guarantee future outcomes."],
  },
  {
    slug: "understanding-risk-tolerance-and-risk-capacity", category: "Investment Planning",
    title: "Understanding Risk Tolerance and Risk Capacity", publishedAt: "2026-09-15", readingMinutes: 5,
    excerpt: "How you feel about risk and how much risk you can afford are not the same thing.",
    body: ["Risk tolerance describes your emotional comfort with volatility. Risk capacity describes your financial ability to absorb a loss without derailing your goals.", "A sound investment approach considers both, alongside your time horizon. Someone comfortable with risk but near a fixed goal may still need a more cautious approach.", "All investments carry risk, including loss of capital. This content is educational only."],
  },
  {
    slug: "retirement-planning-across-borders", category: "Retirement",
    title: "Retirement Planning When Life Spans Several Countries", publishedAt: "2026-08-28", readingMinutes: 6,
    excerpt: "Cross-border careers create opportunities and complications for retirement income.",
    body: ["Many professionals build their careers across more than one country. That can mean pensions and savings in several places, each with different rules.", "Start by listing every pension and savings account, where it is held, and the rules governing access. Then consider where you may wish to live in retirement and what that means for tax and currency.", "Rules vary by jurisdiction and change over time. Seek advice specific to your situation."],
  },
  {
    slug: "the-role-of-tax-in-wealth-planning", category: "Tax Strategy",
    title: "The Role of Tax in Wealth Planning", publishedAt: "2026-08-10", readingMinutes: 4,
    excerpt: "Tax rarely decides an investment on its own, but it should never be an afterthought.",
    body: ["Tax treatment can influence how and where assets are held. It is best considered at the start of planning rather than at the end of the year.", "For clients with links to several jurisdictions, residency and reporting obligations deserve early attention.", "This is general information, not tax advice."],
  },
  {
    slug: "starting-the-estate-planning-conversation", category: "Estate Planning",
    title: "Starting the Estate Planning Conversation", publishedAt: "2026-07-22", readingMinutes: 5,
    excerpt: "Succession is as much a family conversation as a legal exercise.",
    body: ["Estate planning is often delayed because it touches on difficult subjects. Starting with your wishes rather than the paperwork makes it more approachable.", "Consider who should benefit, who should make decisions if you cannot, and how assets in different countries will be treated.", "Legal documents should be prepared by qualified legal professionals."],
  },
  {
    slug: "diversification-in-plain-language", category: "Wealth Management",
    title: "Diversification in Plain Language", publishedAt: "2026-07-05", readingMinutes: 4,
    excerpt: "Spreading risk is simple in principle and subtle in practice.",
    body: ["Diversification means not relying on a single asset, market or currency for your financial future. It does not eliminate risk or guarantee profit.", "True diversification looks at how holdings behave relative to each other, not just how many there are.", "This content is educational and not investment advice."],
  },
];

export const ARTICLE_CATEGORIES = ["Wealth Management", "Investment Planning", "Tax Strategy", "Retirement", "Estate Planning", "Financial Education"];

export const AREAS_OF_INTEREST = [
  "Financial Planning", "Investment Advisory", "Wealth Management", "Retirement Planning",
  "Tax Strategy", "Estate Planning", "Risk Management", "Education Funding", "Other",
];

export const CONSULTATION_TYPES = ["Initial introduction call", "Financial planning discussion", "Investment advisory discussion", "Retirement or estate planning discussion"];

export const RISK_DISCLOSURE =
  "Investing involves risk, including the possible loss of capital. Past performance is not a reliable indicator of future results. Illustrations on this website are hypothetical, based on assumptions you provide, and are not guarantees, forecasts or personal investment advice.";
