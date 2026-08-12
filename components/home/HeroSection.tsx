import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[75vh] md:h-[80vh] bg-white overflow-hidden grid grid-cols-1 md:grid-cols-2">
      {/* Left Split: Heritage */}
      <div className="relative h-full overflow-hidden group">
        <video
          src="/hero-section/v1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
        />
        {/* Elegant overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/35 transition-colors duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-12 md:pb-16 px-6 md:px-12 text-white">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-2 font-medium">
            Timeless Elegance
          </span>
          <h2 
            className="text-3xl md:text-5xl font-bold uppercase tracking-wider mb-6"
            style={{ fontFamily: "var(--font-pt-serif)" }}
          >
            Heritage Sarees
          </h2>
          <Button
            href="/products"
            variant="white"
            className="tracking-[0.2em] px-6 py-2.5 transition-all text-xs"
          >
            Explore Products
          </Button>
        </div>
      </div>

      {/* Right Split: Modern */}
      <div className="relative h-full overflow-hidden group border-t md:border-t-0 md:border-l border-white/20">
        <video
          src="/hero-section/v3.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
        />
        {/* Elegant overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/35 transition-colors duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-12 md:pb-16 px-6 md:px-12 text-white">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-2 font-medium">
            Modern Silhouettes
          </span>
          <h2 
            className="text-3xl md:text-5xl font-bold uppercase tracking-wider mb-6"
            style={{ fontFamily: "var(--font-pt-serif)" }}
          >
            Designer Sarees
          </h2>
          <Button
            href="/products"
            variant="white"
            className="tracking-[0.2em] px-6 py-2.5 transition-all text-xs"
          >
            Explore Products
          </Button>
        </div>
      </div>
    </section>
  );
}
