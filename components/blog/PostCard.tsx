import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { BlogPost } from "./types";

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex flex-col h-full border border-[#010526]/5 rounded-sm overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="relative w-full aspect-[4/3] bg-[#010526]/5 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover object-top hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[10px] font-sans text-[#010526]/50">
            <span className="font-bold uppercase tracking-wider text-[#010526] bg-[#010526]/5 px-2 py-0.5 rounded-sm">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={10} /> {post.date}
            </span>
          </div>

          <h3 className="text-lg font-bold leading-snug text-[#010526] line-clamp-2 hover:opacity-85 transition-opacity">
            <Link href={`/blog/${post.id}`}>
              {post.title}
            </Link>
          </h3>

          <p className="text-xs font-sans text-[#010526]/60 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#010526]/5">
          <span className="text-[11px] font-sans text-[#010526]/70">
            By {post.author}
          </span>
          <Link
            href={`/blog/${post.id}`}
            className="flex items-center gap-1 text-[11px] font-sans font-bold uppercase tracking-wider text-[#010526] hover:opacity-60 transition-opacity"
          >
            <span>Read More</span>
            <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </article>
  );
}
