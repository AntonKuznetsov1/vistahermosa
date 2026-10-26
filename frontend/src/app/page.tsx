import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Sparkles, Scissors, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />
      
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Sparkles className="h-16 w-16" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Vista Hermosa
              <br />
              <span className="text-4xl md:text-6xl lg:text-7xl">Beauty Salon</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
              Where beauty meets elegance in the heart of Michoacan
            </p>
            <Link href="/booking">
              <Button size="lg" className="rounded-full text-lg px-8 py-6">
                Book Your Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Our Services
            </h2>
            <p className="text-lg text-gray-700">
              Professional beauty services tailored to you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Scissors className="h-10 w-10 mb-2" />
                <CardTitle>Hair Services</CardTitle>
                <CardDescription>Cuts, styling, coloring & treatments</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-10 w-10 mb-2" />
                <CardTitle>Beauty & Skincare</CardTitle>
                <CardDescription>Facials, makeup & skincare treatments</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Sparkles className="h-10 w-10 mb-2" />
                <CardTitle>Nail Care</CardTitle>
                <CardDescription>Manicures, pedicures & nail art</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/booking">
              <Button variant="outline" size="lg" className="rounded-full">
                View All Services & Book
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Get In Touch
            </h2>
            <p className="text-lg text-gray-700">
              We'd love to hear from you
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:tanglica101@gmail.com" className="text-gray-700 hover:underline">
                      tanglica101@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href="tel:9719989715" className="text-gray-700 hover:underline">
                      971 998 9715
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-700">Vista Hermosa, Michoacan De Ocampo, Mexico</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
