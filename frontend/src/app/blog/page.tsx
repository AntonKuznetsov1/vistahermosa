"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [clientId, setClientId] = useState<string>("");

  useEffect(() => {
    // Generate or get client identifier
    let id = localStorage.getItem("vistahermosa_client_id");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("vistahermosa_client_id", id);
    }
    setClientId(id);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blog`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      toast.error("Failed to load blog posts");
    }
  };

  const toggleLike = async (postId: string) => {
    if (!clientId) return;
    
    try {
      const res = await fetch(`${API_URL}/api/blog/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_identifier: clientId })
      });
      
      const data = await res.json();
      
      if (data.liked) {
        setLikedPosts(new Set(likedPosts).add(postId));
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, like_count: p.like_count + 1 } : p
        ));
      } else {
        const newLiked = new Set(likedPosts);
        newLiked.delete(postId);
        setLikedPosts(newLiked);
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, like_count: Math.max(0, p.like_count - 1) } : p
        ));
      }
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  return (
    <div className="min-h-screen">
      <Nav />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            Our Blog
          </h1>
          
          <div className="space-y-8">
            {posts.map((post) => (
              <Card key={post.id}>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <CardDescription>
                    {new Date(post.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap mb-4">{post.description}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-2"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                      <span>{post.like_count}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {posts.length === 0 && (
              <p className="text-center text-gray-600 py-12">No blog posts yet.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
