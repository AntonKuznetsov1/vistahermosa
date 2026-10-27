import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SalonArt from "@/components/SalonArt";
import Link from "next/link";
import { Sparkles, Scissors, Heart, Mail, Phone, MapPin } from "lucide-react";

const services = [
  {
    title: "Hair Services",
    description: "Cuts, styling, coloring & treatments",
    detail:
      "Cuts, styling, coloring and treatments shaped around your hair and your routine.",
    tags: ["Cuts", "Styling", "Coloring", "Treatments"],
    icon: Scissors,
    variant: "hair",
  },
  {
    title: "Beauty & Skincare",
    description: "Facials, makeup & skincare treatments",
    detail:
      "Facials, makeup and skincare treatments designed to leave you refreshed and glowing.",
    tags: ["Facials", "Makeup", "Skincare"],
    icon: Heart,
    variant: "skin",
  },
  {
    title: "Nail Care",
    description: "Manicures, pedicures & nail art",
    detail:
      "Manicures, pedicures and nail art finished with care, down to the last detail.",
    tags: ["Manicures", "Pedicures", "Nail Art"],
    icon: Sparkles,
    variant: "nails",
  },
] as const;

const marqueeOne = ["Hair", "Beauty", "Skincare", "Nails", "Makeup", "Treatments"];
const marqueeTwo = ["Cuts", "Color", "Facials", "Manicures", "Pedicures", "Styling"];

const bookingSteps = [
  {
    title: "Select a service",
    text: "Choose the treatment you would like, from hair and skincare to nails.",
  },
  {
    title: "Pick a date",
    text: "Find a day that works for you with our easy-to-use calendar.",
  },
  {
    title: "Choose a time",
    text: "See the available time slots and reserve the one that suits you best.",
  },
  {
    title: "Confirm details",
    text: "Add your contact information and send your booking request in seconds.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />

      <main id="main">
        <section className="hero container-wide" aria-labelledby="hero-title">
          <span className="label">Beauty salon · Vista Hermosa, Michoacan</span>
          <h1 id="hero-title" className="hero-title">
            <span className="line">
              <span>Where beauty</span>
            </span>
            <span className="line">
              <span>
                meets{" "}
                <span className="pill-word" aria-hidden="true">
                  <Sparkles />
                </span>{" "}
                <em>elegance.</em>
              </span>
            </span>
          </h1>
          <div className="hero-foot">
            <p>
              Where beauty meets elegance in the heart of Michoacan. Hair,
              skincare and nails, tailored to you.
            </p>
            <Link
              className="badge"
              href="/booking"
              aria-label="Book your appointment"
            >
              <svg className="badge-ring" viewBox="0 0 150 150" aria-hidden="true">
                <defs>
                  <path
                    id="badge-circle"
                    d="M75 75m-58 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0"
                  />
                </defs>
                <text
                  fontSize="13.2"
                  fontWeight="600"
                  letterSpacing="3.2"
                  fill="currentColor"
                >
                  <textPath href="#badge-circle">
                    BOOK YOUR APPOINTMENT · BOOK YOUR APPOINTMENT ·
                  </textPath>
                </text>
              </svg>
              <span className="dot" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </section>

        <section className="container-wide" aria-label="Vista Hermosa salon">
          <div className="art-panel reveal">
            <SalonArt variant="hero" />
            <Link href="/booking" className="art-cta">
              Book your appointment
            </Link>
            <span className="art-note">Hair · Skincare · Nails</span>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeOne, ...marqueeOne].map((word, index) => (
              <span key={`${word}-${index}`}>{word}</span>
            ))}
          </div>
        </div>
        <div className="marquee brand" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeTwo, ...marqueeTwo].map((word, index) => (
              <span key={`${word}-${index}`}>{word}</span>
            ))}
          </div>
        </div>

        <section className="section container-wide" aria-labelledby="intro-title">
          <div className="intro-grid">
            <div>
              <span className="label">The salon</span>
            </div>
            <div className="reveal">
              <h2 id="intro-title">
                A warm, welcoming space for your hair, skin and nails.
              </h2>
              <p>
                At Vista Hermosa Beauty Salon, every appointment is tailored to
                you. From a fresh cut and color to a calming facial or a
                perfect manicure, we take the time to help you feel your best.
              </p>
              <div className="chip-row">
                <span className="chip">Hair</span>
                <span className="chip">Beauty &amp; Skincare</span>
                <span className="chip">Nail Care</span>
              </div>
              <div className="mt-7">
                <Link className="btn btn-line" href="/booking">
                  Book your visit <span className="arrow">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="section section-tight container-wide"
          aria-labelledby="services-title"
        >
          <div className="section-top">
            <div>
              <span className="label">What we offer</span>
              <h2 id="services-title" className="big">
                Our Services
              </h2>
            </div>
            <Link href="/booking" className="btn btn-dark">
              Book an appointment <span className="arrow">↗</span>
            </Link>
          </div>

          <div className="case-grid">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href="/booking"
                  className={`case-card reveal${index === 0 ? " case-feature" : ""}`}
                >
                  <div className="case-media">
                    <SalonArt variant={service.variant} />
                    <span className="case-icon" aria-hidden="true">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="view">
                      Book now <span className="arrow">↗</span>
                    </span>
                  </div>
                  <div className="case-info">
                    <h3>{service.title}</h3>
                    <span>{service.description}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="section section-dark" aria-labelledby="details-title">
          <div className="container-wide">
            <div className="section-top">
              <div>
                <span className="label">What we do</span>
                <h2 id="details-title" className="big">
                  Services
                </h2>
              </div>
              <p className="muted" style={{ maxWidth: 420, margin: 0 }}>
                Pick one service, or let us help you put together the perfect
                appointment. Every visit starts with you.
              </p>
            </div>

            <div className="services-list">
              {services.map((service, index) => (
                <details
                  className="service-item"
                  key={service.title}
                  open={index === 0}
                >
                  <summary>
                    <span className="num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{service.title}</h3>
                    <span className="plus" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className="service-body">
                    <p>{service.detail}</p>
                    <ul>
                      {service.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <Link href="/booking" className="btn btn-brand service-link">
                      Book this service <span className="arrow">↗</span>
                    </Link>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section container-wide" aria-labelledby="process-title">
          <div className="section-top">
            <div>
              <span className="label">How it works</span>
              <h2 id="process-title" className="big">
                Booking is easy
              </h2>
            </div>
            <Link href="/booking" className="btn btn-dark">
              Start booking <span className="arrow">↗</span>
            </Link>
          </div>

          <ol className="process-grid">
            {bookingSteps.map((step, index) => (
              <li className="process-card reveal" key={step.title}>
                <span className="step-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="contact"
          className="section section-tight container-wide"
          aria-labelledby="contact-title"
        >
          <div className="section-top">
            <div>
              <span className="label">Get in touch</span>
              <h2 id="contact-title" className="big">
                Get In Touch
              </h2>
            </div>
            <p style={{ maxWidth: 400, margin: 0 }}>
              We&apos;d love to hear from you. Call, email, or book your
              appointment online.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-list reveal">
              <div className="contact-row">
                <span className="icon" aria-hidden="true">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h3>Email</h3>
                  <a href="mailto:tanglica101@gmail.com">
                    tanglica101@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-row">
                <span className="icon" aria-hidden="true">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <h3>Phone</h3>
                  <a href="tel:9719989715">971 998 9715</a>
                </div>
              </div>

              <div className="contact-row">
                <span className="icon" aria-hidden="true">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3>Address</h3>
                  <p>Vista Hermosa, Michoacan De Ocampo, Mexico</p>
                </div>
              </div>
            </div>

            <aside className="contact-aside reveal">
              <h2>Ready when you are.</h2>
              <p>
                Book your appointment online and choose the service, date and
                time that suit you. We&apos;ll take care of the rest.
              </p>
              <Link className="big-link" href="/booking">
                Book an appointment ↗
              </Link>
            </aside>
          </div>
        </section>

        <section className="cta" aria-labelledby="cta-title">
          <div className="container-wide">
            <span className="label">Your next appointment</span>
            <h2 id="cta-title">
              <Link href="/booking">Let&apos;s get you glowing</Link>
            </h2>
            <p>
              Tell us what you have in mind. Book online in a few simple steps
              and we&apos;ll get everything ready for you.
            </p>
            <Link className="btn btn-dark" href="/booking">
              Book an appointment <span className="arrow">↗</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
