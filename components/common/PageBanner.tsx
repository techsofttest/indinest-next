import Image from "next/image";

interface PageBannerProps {
    imageUrl: string;
    imageAlt: string;
    subtitle: string;
    title: string;
    className?: string;
}

export default function PageBanner({ imageUrl, imageAlt, subtitle, title, className = "" }: PageBannerProps) {
    return (
        <div className={`relative w-full h-48 md:h-64 bg-[#010526]/10 overflow-hidden rounded-sm shadow-sm ${className}`}>
            <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover object-center"
                priority
            />
            <div className="absolute inset-0 bg-[#010526]/40 backdrop-blur-[1px] flex items-center justify-center">
                <div className="text-center text-white px-4">
                    <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-bold">{subtitle}</span>
                    <h1 className="text-3xl md:text-5xl uppercase tracking-widest font-light mt-1 drop-shadow-sm">
                        {title}
                    </h1>
                </div>
            </div>
        </div>
    );
}