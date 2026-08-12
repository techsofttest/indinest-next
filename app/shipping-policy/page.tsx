import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { apiUrl } from "@/lib/api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getCmsContent() {
  try {
    const res = await fetch(apiUrl("/api/cms/shipping-dispatch"), {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export default async function ShippingPolicyPage() {
  const pageData = await getCmsContent();

  if (!pageData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526]">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16 md:py-24 font-sans">
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
      </main>

      <Footer />
    </div>
  );
}
