"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const address = "Vista Hermosa, Michoacan De Ocampo, Mexico";
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="logo-mark" aria-hidden="true">
                <Sparkles className="h-5 w-5" />
              </span>
              <span>Vista Hermosa</span>
            </div>
            <h2>Your beauty,<br />our passion.</h2>
            <p style={{ color: "#c9c3b6" }}>
              A beauty salon in the heart of Michoacan, where every appointment
              is a little moment for you.
            </p>
          </div>

          <div>
            <h3>Explore</h3>
            <ul>
              <li><Link href="/#services">Services</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
              <li><Link href="/blog">Journal</Link></li>
              <li><Link href="/booking">Book Now</Link></li>
            </ul>
          </div>

          <div>
            <h3>Contact Info</h3>
            <div className="footer-contact">
              <a href="mailto:tanglica101@gmail.com">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>tanglica101@gmail.com</span>
              </a>
              <a href="tel:9719989715">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>971 998 9715</span>
              </a>
              <div>
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>{address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3>Location</h3>
            <div className="footer-map">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vista Hermosa Location"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="footer-word" aria-hidden="true">vista hermosa</div>

        <div className="footer-bottom">
          <span>&copy; {year} Vista Hermosa Beauty Salon. All rights reserved.</span>
          <nav aria-label="Footer">
            <Link href="/booking">Book an appointment</Link>
            <Link href="/#contact">Get in touch</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
