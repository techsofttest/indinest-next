"use client";

import { useState } from "react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import PageBanner from "@/components/common/PageBanner";
import BlogCategories from "@/components/blog/BlogCategories";
import FeaturedPost from "@/components/blog/FeaturedPost";
import PostCard from "@/components/blog/PostCard";
import { BlogPost } from "@/components/blog/types";
import { initialPosts } from "@/components/blog/data";

const categories = ["All", "Heritage", "Bridal", "Styling Guides", "Behind the Scenes"];

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All"
    ? initialPosts
    : initialPosts.filter(post => post.category === selectedCategory);

  const featuredPost = initialPosts.find(post => post.featured);
  const listPosts = filteredPosts.filter(post => {
    if (selectedCategory === "All" && featuredPost) return post.id !== featuredPost.id;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
      <Header />

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 md:px-8 py-4 md:py-8">
        <PageBanner
          imageUrl="/banner/banner2.png"
          imageAlt="The Journal Banner"
          subtitle="The Journal"
          title="The Edit"
          className="mb-12"
        />

        {/* Categories navigation */}
        <BlogCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Featured Post (only when 'All' is selected) */}
        {selectedCategory === "All" && featuredPost && (
          <FeaturedPost post={featuredPost} />
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {listPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
