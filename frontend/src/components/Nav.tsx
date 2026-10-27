"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 860) setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <nav className="container-wide nav" aria-label="Primary">
        <Link href="/" className="logo" aria-label="Vista Hermosa home" onClick={closeMenu}>
          <span className="logo-mark" aria-hidden="true">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>Vista Hermosa</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="nav-links"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>{isOpen ? "Close" : "Menu"}</span>
        </button>

        <ul id="nav-links" className={`nav-links${isOpen ? " open" : ""}`}>
          <li>
            <Link href="/#services" onClick={closeMenu}>
              Services
            </Link>
          </li>
          <li>
            <Link href="/#contact" onClick={closeMenu}>
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              aria-current={pathname === "/blog" ? "page" : undefined}
              onClick={closeMenu}
            >
              Journal
            </Link>
          </li>
          <li className="nav-cta">
            <Link
              href="/booking"
              aria-current={pathname === "/booking" ? "page" : undefined}
              onClick={closeMenu}
            >
              Book Now
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
