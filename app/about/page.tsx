"use client";

import Image from "next/image";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import PageBanner from "@/components/common/PageBanner";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526]">
      <Header />

      <PageBanner
        title="Our Story"
        subtitle="THE INDINEST HERITAGE"
        imageUrl="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=2069&auto=format&fit=crop"
        imageAlt="About IndiNest"
      />

      <main className="flex-1 w-full">
        {/* Intro Section */}
        <section className="py-20 md:py-32 px-6 md:px-8 max-w-[1000px] mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-light uppercase tracking-widest text-[#010526] mb-8 leading-tight">
            Redefining <br /> Indian Elegance
          </h2>
          <p className="text-base md:text-lg font-sans text-[#010526]/70 leading-relaxed max-w-3xl mx-auto">
            IndiNest was born out of a desire to bridge the gap between traditional Indian craftsmanship and modern aesthetics. We travel across the subcontinent, working directly with master weavers and artisans to bring you pieces that are not just clothing, but heirlooms.
          </p>
        </section>

        {/* Feature Grid */}
        <section className="py-20 bg-[#010526]/[0.02]">
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

        {/* Image & Text Split */}
        <section className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto my-20 lg:my-32">
          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto min-h-[500px]">
            <Image 
              src="https://images.unsplash.com/photo-1583391733958-d25e07fac662?q=80&w=1974&auto=format&fit=crop"
              alt="Artisan weaving"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 md:p-16 lg:p-24 xl:p-32 bg-white">
            <h2 className="text-2xl md:text-4xl font-light uppercase tracking-widest text-[#010526] mb-8 leading-tight">
              The Journey of <br/> a Thousand Threads
            </h2>
            <div className="flex flex-col gap-6 text-sm font-sans text-[#010526]/70 leading-relaxed">
              <p>
                What started as a small capsule collection in 2020 has now grown into a global destination for conscious luxury. Our founders realized that while the world moved towards fast fashion, the intricate weaves of India were slowly being forgotten.
              </p>
              <p>
                IndiNest was established to give these art forms a global platform. From the pure zari Kanjeevarams of the south to the delicate Chikankari of the north, we curate, collaborate, and create magic.
              </p>
            </div>
            <a 
              href="/products" 
              className="mt-10 inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity border-b border-[#010526] pb-1 w-max"
            >
              Explore Our Collections
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
