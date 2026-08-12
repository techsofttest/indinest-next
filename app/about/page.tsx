import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { apiUrl } from "@/lib/api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getAboutCmsContent() {
  try {
    const res = await fetch(apiUrl("/api/cms/about-us"), {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export default async function AboutPage() {
  const pageData = await getAboutCmsContent();

  if (!pageData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526]">
      <Header />

      <main className="flex-1 w-full font-sans">
        {/* Dynamic CMS content section */}
        <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-serif font-normal text-[#010526] mb-8 leading-tight">
              {pageData.title}
            </h1>
            
            <div 
              className="prose prose-slate max-w-none text-[#010526]/85 leading-relaxed text-sm md:text-base space-y-6
                [&_h1]:text-2xl [&_h1]:font-serif [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-[#010526]
                [&_h2]:text-xl [&_h2]:font-serif [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-[#010526]
                [&_h3]:text-lg [&_h3]:font-serif [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-[#010526]
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                [&_li]:mb-2"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-20 bg-[#010526]/[0.02] border-t border-b border-[#010526]/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 border border-[#010526]/20 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Artisanal Craft</h3>
              <p className="text-xs md:text-sm font-sans text-[#010526]/70 leading-relaxed">
                Every piece in our collection is handcrafted by skilled artisans using techniques passed down through generations.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 border border-[#010526]/20 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Sustainability</h3>
              <p className="text-xs md:text-sm font-sans text-[#010526]/70 leading-relaxed">
                We are committed to ethical fashion. We use organic dyes, sustainable fabrics, and ensure fair wages for all our creators.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 border border-[#010526]/20 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Modern Heritage</h3>
              <p className="text-xs md:text-sm font-sans text-[#010526]/70 leading-relaxed">
                Our silhouettes are designed for the contemporary global Indian, seamlessly blending rich heritage with modern functionality.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
