"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { API_URL } from "@/lib/api";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  like_count: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const clientIdRef = useRef<string>("");

  useEffect(() => {
    // Generate or get client identifier
    let id = localStorage.getItem("vistahermosa_client_id");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("vistahermosa_client_id", id);
    }
    clientIdRef.current = id;

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog`);
        const data = await res.json();
        if (!cancelled) setPosts(data);
      } catch {
        if (!cancelled) toast.error("Failed to load blog posts");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleLike = async (postId: string) => {
    const clientId = clientIdRef.current;
    if (!clientId) return;
    
    try {
      const res = await fetch(`${API_URL}/api/blog/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_identifier: clientId })
      });
      
      const data = await res.json();
      
      if (data.liked) {
        setLikedPosts((prev) => new Set(prev).add(postId));
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, like_count: p.like_count + 1 } : p
          )
        );
      } else {
        setLikedPosts((prev) => {
          const newLiked = new Set(prev);
          newLiked.delete(postId);
          return newLiked;
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, like_count: Math.max(0, p.like_count - 1) }
              : p
          )
        );
      }
    } catch {
      toast.error("Failed to update like");
    }
  };

  return (
    <div className="min-h-screen">
      <Nav />

      <main id="main">
        <section className="page-hero container-wide" aria-labelledby="blog-title">
          <span className="label">Journal</span>
          <h1 id="blog-title">
            Our Blog <sup>({posts.length})</sup>
          </h1>
          <p>
            News, tips and little moments from the salon. Find something worth
            reading before your next appointment.
          </p>
        </section>

        <div className="container-wide pb-24">
          <div className="post-list">
            {posts.map((post) => (
              <article key={post.id} className="post-card reveal">
                {post.image_url && (
                  <div className="post-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image_url}
                      alt={post.title}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="post-body">
                  <div className="post-meta">
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p className="post-text">{post.description}</p>
                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    className={`like-btn${likedPosts.has(post.id) ? " liked" : ""}`}
                    aria-pressed={likedPosts.has(post.id)}
                    aria-label={`Like ${post.title}`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        likedPosts.has(post.id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    <span>{post.like_count}</span>
                  </button>
                </div>
              </article>
            ))}

            {posts.length === 0 && (
              <p className="empty-state">No blog posts yet.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
