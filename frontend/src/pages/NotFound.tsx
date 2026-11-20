import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-navy pt-24">
      <Seo title="Page not found" description="The page you are looking for could not be found." noindex />
      <div className="container-x text-center"><p className="eyebrow mb-4">Error 404</p><h1 className="h-display !text-white">This page could not be found.</h1><span className="gold-rule mx-auto mt-7" />
        <p className="lead mx-auto mt-6 max-w-md !text-white/70">The link may be outdated, or the page may have moved.</p>
        <div className="mt-10 flex justify-center gap-4"><Link to="/" className="btn btn-gold">Back to home</Link><Link to="/contact" className="btn btn-outline">Contact us</Link></div></div>
    </section>
  );
}
