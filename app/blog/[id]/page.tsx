"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark } from "lucide-react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import PageBanner from "@/components/common/PageBanner";
import { initialPosts } from "@/components/blog/data";
import PostCard from "@/components/blog/PostCard";
import { calculateReadingTime } from "@/utils/readingTime";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Map IDs to some rich HTML/Markdown-like content for a luxury editorial look
const blogContents: Record<number, { subtitle: string; content: React.ReactNode }> = {
  1: {
    subtitle: "A journey through Varanasi's historic looms and the master weavers preserving ancient zari work.",
    content: (
      <>
        <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-[#010526] text-justify leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          The Banarasi saree is not merely a garment; it is a tapestry of history, culture, and exquisite craftsmanship woven together over generations. Originating from the sacred city of Varanasi (formerly Banaras), these sarees represent the pinnacle of Indian handloom heritage. Renowned for their gold and silver brocade or zari, fine silk, and opulent embroidery, they have remained a staple of royal wardrobes and bridal trousseaus for centuries.
        </p>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          The Origins of Varanasi's Silk Industry
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          Varanasi's association with textile weaving dates back to ancient times, with references found in Buddhist scriptures and the Mahabharata. However, the industry truly flourished during the Mughal era in the 16th century. Under the patronage of emperors like Akbar, Persian aesthetics blended seamlessly with indigenous Indian motifs, giving birth to the classic Banarasi brocade pattern we admire today.
        </p>

        <blockquote className="border-l-2 border-[#010526] pl-6 my-8 italic text-lg text-[#010526]/90 font-serif">
          "Each Banarasi saree is a story told in threads of gold, a quiet testament to the patience of the weaver who spends weeks, sometimes months, perfecting a single masterwork."
        </blockquote>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          Understanding the Weaving Process
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          A genuine Banarasi saree requires a meticulous process involving multiple artisans. First, the artist designs the pattern on graph sheets, creating the 'patra' or stencil. Then, the master weaver sets up the handloom (usually Pit looms or Jacquard looms), translating the stencil into punch-cards that control the lift of individual warp threads.
        </p>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          Depending on the complexity of the design—such as the iconic Amru, Tanchoi, Shikargah, or Jamdani styles—it can take anywhere from fifteen days to six months of painstaking daily work to complete one piece.
        </p>
      </>
    ),
  },
  2: {
    subtitle: "Deconstructing the color palettes, fabrics, and custom fitting choices guiding this season's brides.",
    content: (
      <>
        <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-[#010526] text-justify leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          Modern couture bridal wear is undergoing a fascinating renaissance. Today’s bride seeks a perfect harmony between rich heritage and effortless modernity. They want silhouettes that honor centuries of craft but feel lightweight, breathable, and personally expressive. From the resurgence of vermillion to the subtle rise of sage and champagne gold, bridal fashion has never been more vibrant.
        </p>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          The Palette of the Modern Bride
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          While red remains the timeless standard of Indian bridal couture, contemporary brides are exploring a broader palette. Soft pastel hues, monochromatic ivory drapes with heavy gold embroidery, and royal emerald greens are taking center stage. The key lies in selecting a color that resonates with the venue, lighting, and the bride's individual aura.
        </p>

        <blockquote className="border-l-2 border-[#010526] pl-6 my-8 italic text-lg text-[#010526]/90 font-serif">
          "Bridal couture is not just about standing out; it is about feeling at home in your own lineage while stepping confidently into your future."
        </blockquote>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          Bespoke Customizations and Private Fittings
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          An essential step in obtaining the perfect bridal look is the private salon experience. At IndiNest, our bespoke consultations ensure that necklines, sleeve lengths, and embroidery densities are customized to the millimeter. This ensures maximum comfort during long wedding rituals, allowing the bride to move with ultimate grace.
        </p>
      </>
    ),
  },
  3: {
    subtitle: "A visual walkthrough of our flagship boutiques in Mumbai and Mayfair, designed for intimate client fittings.",
    content: (
      <>
        <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-[#010526] text-justify leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          Step inside our flagship boutique spaces and enter a sanctuary of quiet luxury. Designed by award-winning architects, our salons in Mumbai and Mayfair, London, are conceived to celebrate craftsmanship in all its forms. With soft lighting, travertine stone surfaces, and custom-curated traditional art pieces, we invite you to experience Indian heritage in its most elevated avatar.
        </p>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          The Design Philosophy
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          Our spaces are crafted to mirror the details of our garments. We have paired raw silk wall panelings with brushed brass accents to represent the fusion of organic handlooms and fine metallic embroidery. The showcase rooms are designed with deep, dark hues like midnight blue and forest green to make our colorful textiles pop in their true luxury light.
        </p>

        <blockquote className="border-l-2 border-[#010526] pl-6 my-8 italic text-lg text-[#010526]/90 font-serif">
          "A visit to our maison is not a transaction; it is a sensory journey through heritage, designed to feel intimate, calm, and inspiring."
        </blockquote>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          Book Your Private Experience
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          We believe that selecting high-fashion garments should never be rushed. That is why our private salons are available by appointment, giving you access to our senior concierge and design consultants in a private space where you can inspect fabrics, textures, and custom fits over a cup of heritage chai.
        </p>
      </>
    ),
  },
  4: {
    subtitle: "Mastering the measurements, fabrics, and styles for the perfect heritage sherwani fit.",
    content: (
      <>
        <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-[#010526] text-justify leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          For the modern groom, the sherwani is the ultimate statement of royalty. Finding the perfect fit, however, can be a complex endeavor. A well-tailored sherwani must drape smoothly over the shoulders, offer comfort in movement, and hug the torso without restrictive pulling. Here is our master guide to ensuring your attire fits like a glove.
        </p>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          The Anatomy of a Perfect Fit
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          The secret to a majestic sherwani profile is the shoulder cut. If the shoulders droop or squeeze, the entire posture suffers. At IndiNest, we construct sherwanis using premium interlinings that hold their form through hours of celebration. Furthermore, the chest and waist measurements should leave exactly enough room to sit comfortably, keeping the lines straight and sharp.
        </p>

        <blockquote className="border-l-2 border-[#010526] pl-6 my-8 italic text-lg text-[#010526]/90 font-serif">
          "A sherwani is not just worn; it is inhabited. The fit must empower the wearer's stance, letting him command the room effortlessly."
        </blockquote>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          Fabric Choices and Textures
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          Depending on the season, we suggest grooms choose between raw silk, textured tussar silk, or fine velvet. Brocade sherwanis add a grand, ornate touch, while minimal ivory styles in premium silk offer a understated, high-fashion aesthetic.
        </p>
      </>
    ),
  },
  5: {
    subtitle: "An intimate look into how we source and collaborate directly with rural artisans across India.",
    content: (
      <>
        <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-[#010526] text-justify leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          At the core of IndiNest lies a deep commitment to the weavers and artisans of rural India. We believe that luxury is not just about the final product, but the chain of hands that brought it to life. By working directly with handloom clusters, we aim to ensure fair compensation, keep ancient techniques alive, and design clothing that carries a beautiful soul.
        </p>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          The Weaver's Journey
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          Every region in India has its unique handloom accent—from the fine chanderis of Madhya Pradesh to the double-ikat patolas of Gujarat. By visiting these communities, we work with artisans to update color schemes and designs for contemporary tastes, while preserving the integrity of their traditional weaving structures.
        </p>

        <blockquote className="border-l-2 border-[#010526] pl-6 my-8 italic text-lg text-[#010526]/90 font-serif">
          "True sustainability is when we honor the craftsman as an artist, and when the consumer values the story behind every single thread."
        </blockquote>

        <h3 className="text-xl font-medium uppercase tracking-widest text-[#010526] mt-10 mb-4">
          Preserving Ancient Skills for the Next Generation
        </h3>
        <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">
          As machine-made fast fashion took over, many master weavers began guiding their children toward different fields. By building a sustainable ecosystem for heritage weaves, we show the next generation that their ancestry's artistry is highly respected and financially viable, ensuring these beautiful looms never fall silent.
        </p>
      </>
    ),
  },
};

export default function BlogDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  const postId = parseInt(id, 10);

  const post = initialPosts.find((p) => p.id === postId);

  // Suggested / related posts (excluding the current one)
  const relatedPosts = initialPosts.filter((p) => p.id !== postId).slice(0, 3);

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
        <Header />
        <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-light uppercase tracking-widest text-[#010526] mb-4">
            Article Not Found
          </h2>
          <p className="font-sans text-sm text-[#010526]/60 mb-8">
            The journal entry you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border border-[#010526]/30 px-6 py-3 text-xs font-sans font-bold uppercase tracking-widest text-[#010526] hover:bg-[#010526]/5 transition-all"
          >
            <ArrowLeft size={14} />
            <span>Back to Journal</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const detailedContent = blogContents[post.id] || {
    subtitle: post.excerpt,
    content: <p className="leading-relaxed mb-6 font-sans text-sm text-[#010526]/80">{post.excerpt}</p>,
  };

  const readingTime = calculateReadingTime(detailedContent.content);

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
      <Header />

      <main className="flex-1 w-full max-w-[850px] mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Back navigation & Actions */}
        <div className="flex items-center justify-between border-b border-[#010526]/10 pb-4 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#010526]/60 hover:text-[#010526] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Journal</span>
          </Link>

          <div className="flex items-center gap-4 text-[#010526]/60">
            <button className="hover:text-[#010526] transition-colors" title="Bookmark article">
              <Bookmark size={16} />
            </button>
            <button className="hover:text-[#010526] transition-colors" title="Share article">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Article Meta */}
        <div className="flex items-center gap-4 text-xs font-sans text-[#010526]/60 mb-4 justify-center md:justify-start">
          <span className="font-bold uppercase tracking-widest text-[#010526] bg-[#010526]/5 px-2.5 py-0.5 rounded-sm">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {post.date}
          </span>
          <span className="flex items-center gap-1 hidden sm:inline-flex">
            <Clock size={12} /> {readingTime} Min Read
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-light leading-tight text-[#010526] tracking-wide mb-4 text-center md:text-left">
          {post.title}
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg font-serif text-[#010526]/75 italic leading-relaxed mb-8 text-center md:text-left">
          {detailedContent.subtitle}
        </p>

        {/* Author box */}
        <div className="flex items-center gap-3 border-b border-[#010526]/10 pb-6 mb-8 font-sans text-xs text-[#010526]/70 justify-center md:justify-start">
          <div className="w-8 h-8 rounded-full bg-[#010526]/10 flex items-center justify-center font-bold text-[#010526]">
            {post.author.charAt(0)}
          </div>
          <div>
            <span className="block font-bold text-[#010526]">Written by {post.author}</span>
            <span className="text-[10px]">Client Concierge & Design Lead</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[16/10] bg-[#010526]/5 overflow-hidden rounded-sm shadow-sm mb-10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Main Content Body */}
        <article className="prose prose-slate max-w-none mb-16">
          {detailedContent.content}
        </article>

        {/* Related Posts Section */}
        <div className="border-t border-[#010526]/10 pt-12 mt-12 max-w-[1100px] mx-auto">
          <h3 className="text-2xl uppercase tracking-widest font-light text-center text-[#010526] mb-8">
            Related Journal Entries
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <PostCard key={rPost.id} post={rPost} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
