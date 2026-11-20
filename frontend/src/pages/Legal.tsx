import { useParams } from "react-router-dom";
import { RISK_DISCLOSURE } from "@shared/content";
import { PageHero, Seo } from "@/components/PageHero";
import { useSite } from "@/hooks/useSite";
import NotFound from "./NotFound";

/* DRAFT legal copy. Must be reviewed and approved by the client's legal/compliance advisers before launch. */
export default function Legal() {
  const { doc = "" } = useParams();
  const site = useSite();
  const contact = site.email ? `${site.phone} or ${site.email}` : site.phone;
  const pages: Record<string, { title: string; body: [string, string][] }> = {
    privacy: { title: "Privacy Policy", body: [
      ["Who we are", `MetaWealth Capital ("we", "us") is based in ${site.location}. You can contact us at ${contact}.`],
      ["Information we collect", "We collect the details you give us through our forms: your name, email address, phone number, country, area of interest, preferred consultation dates and your message. Our servers also record technical information such as IP address for security and spam prevention."],
      ["How we use it", "We use your information to respond to enquiries, arrange consultations, send newsletters you have subscribed to, and keep our website secure. We do not sell your personal information."],
      ["Sensitive information", "Please do not send passwords, account credentials, card details or other sensitive financial information through our website forms or by email."],
      ["Retention and your rights", "We keep enquiry records only as long as needed for the purpose collected or as required by law. Subject to applicable law, you may ask to access, correct or delete your information, or unsubscribe at any time, by contacting us."],
      ["Cookies", "Our website uses only essential technologies at present. See our Cookie Policy."],
    ] },
    terms: { title: "Terms of Use", body: [
      ["Information only", "The content on this website is general information and does not constitute investment, tax, legal or other advice, or an offer or solicitation in any jurisdiction."],
      ["No guarantees", "We make no guarantee about future returns. Calculators and questionnaires provide hypothetical, educational illustrations based on assumptions you provide."],
      ["Intellectual property", "Content on this website is owned by or licensed to MetaWealth Capital and may not be reproduced without permission."],
      ["Third-party links", "We are not responsible for the content of external websites linked from ours."],
      ["Governing law", "Governing law and jurisdiction will be confirmed by MetaWealth Capital's legal advisers."],
    ] },
    cookies: { title: "Cookie Policy", body: [
      ["What are cookies", "Cookies are small files stored on your device by websites."],
      ["What we use", "This website currently uses only essential, functional storage, such as keeping administrators securely signed in. We do not use advertising or analytics cookies. If that changes, we will update this policy and ask for your consent where required."],
      ["Managing cookies", "You can block or delete cookies in your browser settings. Essential features may not work if you do."],
    ] },
    "risk-disclosure": { title: "Risk Disclosure", body: [
      ["Investment risk", RISK_DISCLOSURE],
      ["Currency and market risk", "Investments denominated in other currencies are subject to exchange-rate movements. Markets can be volatile and liquidity may be limited."],
      ["Illustrations", "Calculators and projections on this website are hypothetical, assume constant rates of return and exclude fees, taxes and inflation unless stated. They are not forecasts or guarantees."],
      ["Seek advice", "You should consider your own objectives, circumstances and risk tolerance, and obtain professional advice before making financial decisions."],
    ] },
    regulatory: { title: "Regulatory Information", body: [
      ["Regulatory status", site.regulatoryStatement || "MetaWealth Capital's regulatory status, licences and registrations will be published on this page. Please contact us to discuss which services we can provide to you in your jurisdiction."],
      ["Jurisdictions", "Services are only provided where we are permitted to do so under applicable law and regulation. References to markets in which our team has experience (India, UAE, UK and Singapore) describe professional experience and do not indicate offices or licensed operations."],
    ] },
  };
  const p = pages[doc];
  if (!p) return <NotFound />;
  return (
    <>
      <Seo title={p.title} description={`${p.title} for MetaWealth Capital.`} />
      <PageHero title={p.title} crumbs={[{ name: p.title, path: `/legal/${doc}` }]} variant="waves" />
      <section className="section"><div className="container-x max-w-3xl prose-mw">{p.body.map(([h, t]) => <div key={h}><h2>{h}</h2><p>{t}</p></div>)}<p className="mt-10 text-sm text-muted">Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p></div></section>
    </>
  );
}
