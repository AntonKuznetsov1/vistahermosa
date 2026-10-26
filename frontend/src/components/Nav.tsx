"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="h-8 w-8 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Vista Hermosa
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/#services" className="hover:underline transition-all">
              Services
            </Link>
            <Link href="/#contact" className="hover:underline transition-all">
              Contact
            </Link>
            <Link href="/blog" className="hover:underline transition-all">
              Blog
            </Link>
            <Link href="/booking">
              <Button className="rounded-full">Book Now</Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/#services"
              className="block hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/#contact"
              className="block hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="block hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link href="/booking" onClick={() => setIsOpen(false)}>
              <Button className="w-full rounded-full">Book Now</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
