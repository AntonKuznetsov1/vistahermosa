"use client";

import { Mail, Phone, MapPin, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState(2026);
  const address = "Vista Hermosa, Michoacan De Ocampo, Mexico";
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-black text-white mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6" />
              <span className="text-xl font-bold" style={{ letterSpacing: '-0.03em' }}>
                Vista Hermosa Beauty Salon
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Your beauty, our passion.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <a href="mailto:tanglica101@gmail.com" className="hover:underline">
                  tanglica101@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <a href="tel:9719989715" className="hover:underline">
                  971 998 9715
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>{address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <div className="w-full h-48 rounded-lg overflow-hidden">
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

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {year} Vista Hermosa Beauty Salon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
