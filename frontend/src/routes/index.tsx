import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import Home from "@/pages/Home";

const L = (f: () => Promise<{ default: React.ComponentType }>) => lazy(f);
const About = L(() => import("@/pages/About")), Services = L(() => import("@/pages/Services")), ServiceDetail = L(() => import("@/pages/ServiceDetail")),
  Approach = L(() => import("@/pages/Approach")), Team = L(() => import("@/pages/Team")), TeamDetail = L(() => import("@/pages/TeamDetail")),
  Insights = L(() => import("@/pages/Insights")), ArticleDetail = L(() => import("@/pages/ArticleDetail")), Contact = L(() => import("@/pages/Contact")),
  Book = L(() => import("@/pages/Book")), Tools = L(() => import("@/pages/Tools")), FAQ = L(() => import("@/pages/FAQ")), Legal = L(() => import("@/pages/Legal")),
  Credits = L(() => import("@/pages/Credits")), NewsletterConfirm = L(() => import("@/pages/NewsletterConfirm")), NotFound = L(() => import("@/pages/NotFound"));
const Admin = L(() => import("@/admin/routes"));

const Fallback = <div className="min-h-screen bg-navy" aria-busy="true" />;
export function AppRoutes() {
  return (
    <Suspense fallback={Fallback}>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="approach" element={<Approach />} />
          <Route path="team" element={<Team />} />
          <Route path="team/:slug" element={<TeamDetail />} />
          <Route path="insights" element={<Insights />} />
          <Route path="insights/:slug" element={<ArticleDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="book" element={<Book />} />
          <Route path="tools" element={<Tools />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="legal/:doc" element={<Legal />} />
          <Route path="credits" element={<Credits />} />
          <Route path="newsletter/confirm" element={<NewsletterConfirm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
