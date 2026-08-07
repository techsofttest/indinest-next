import Button from "@/components/ui/Button";

const editorialItems = [
  {
    id: 1,
    imageSrc: "/products/editorial/men_kurta2.png",
    imageAlt: "Men's Heritage Kurta",
    label: "Men's Editorial",
    description: "Contemporary design meets classical tailoring",
  },
  {
    id: 2,
    imageSrc: "/products/editorial/ed2.jpg",
    imageAlt: "Heritage Banarasi Saree",
    label: "Heritage Weaves",
    description: "Intricately woven silk sarees for grand celebrations",
  },
  {
    id: 3,
    imageSrc: "/products/editorial/ed3.jpg",
    imageAlt: "Kundan Jewellery",
    label: "Temple & Kundan Art",
    description: "Handcrafted heirloom jewelry passed down generations",
  },
  {
    id: 4,
    imageSrc: "/products/editorial/ed4.png",
    imageAlt: "Tops",
    label: "From City To Coast",
    description: "These drapes are making waves all season long",
  },
];

interface EditorialItem {
  id: number;
  imageSrc: string;
  imageAlt: string;
  label: string;
  description: string;
}

interface EditorialGridProps {
  items?: EditorialItem[];
}

export default function EditorialGrid({ items = editorialItems }: EditorialGridProps) {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col cursor-pointer group"
          >
            {/* Card Container */}
            <div className="w-full aspect-[4/5] bg-[#F0F2FF] mb-6 overflow-hidden relative">
              <img
                src={item.imageSrc}
                alt={item.imageAlt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Bottom text and CTA overlay inside the card */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10 text-left">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 text-white/80">
                  {item.label}
                </h3>
                <p className="text-xl md:text-2xl font-serif text-white mb-5 leading-normal">
                  {item.description}
                </p>
                <Button
                  variant="white"
                  size="sm"
                  className="self-start text-[10px] font-bold tracking-[0.2em] uppercase"
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
