import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { BlogPost } from "./types";

interface FeaturedPostProps {
  post: BlogPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="mb-16 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
        <div className="w-full lg:w-[60%] relative aspect-[16/10] bg-[#010526]/5 overflow-hidden rounded-sm shadow-md">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover object-top hover:scale-[1.02] transition-transform duration-700"
            priority
          />
        </div>

        <div className="w-full lg:w-[40%] flex flex-col justify-between py-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-xs font-sans text-[#010526]/60">
              <span className="font-bold uppercase tracking-widest text-[#010526] bg-[#010526]/5 px-2 py-0.5 rounded-sm">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {post.date}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight text-[#010526] hover:opacity-85 transition-opacity">
              <Link href={`/blog/${post.id}`}>
                {post.title}
              </Link>
            </h2>

            <p className="text-sm font-sans text-[#010526]/65 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6 border-t border-[#010526]/10 pt-4">
            <span className="flex items-center gap-1 text-xs font-sans text-[#010526]/70">
              <User size={12} /> Written by {post.author}
            </span>
            <Link
              href={`/blog/${post.id}`}
              className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-widest text-[#010526] hover:opacity-60 transition-opacity"
            >
              <span>Read Article</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
