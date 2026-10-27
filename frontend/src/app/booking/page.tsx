"use client";

import { Fragment, useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number | null;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
}

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        const data = await res.json();
        if (!cancelled) setServices(data);
      } catch {
        if (!cancelled) toast.error("Failed to load services");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;

    const load = async () => {
      try {
        const dateStr = date.toISOString().split('T')[0];
        const res = await fetch(`${API_URL}/api/time-slots/available/${dateStr}`);
        const data = await res.json();
        if (!cancelled) setTimeSlots(data);
      } catch {
        if (!cancelled) toast.error("Failed to load time slots");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [date]);

  const handleSubmit = async () => {
    if (!selectedService || !date || !selectedTime || !formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: selectedService.id,
          booking_date: dateStr,
          start_time: selectedTime,
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          message: formData.message
        })
      });

      if (res.ok) {
        toast.success("Booking request sent successfully!");
        router.push("/");
      } else {
        toast.error("Failed to send booking request");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Nav />

      <main id="main">
        <section className="page-hero container-wide" aria-labelledby="booking-title">
          <span className="label">Schedule</span>
          <h1 id="booking-title">Book an appointment</h1>
          <p>
            Choose a service, pick a date and time, and leave the rest to us.
          </p>
        </section>

        <div className="container-wide pb-24">
          <div className="booking-layout">
            <div className="steps reveal" aria-label="Booking progress">
              {[1, 2, 3, 4].map((s) => (
                <Fragment key={s}>
                  <div
                    className={`step-dot${step === s ? " active" : step > s ? " done" : ""}`}
                    aria-current={step === s ? "step" : undefined}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`step-bar${step > s ? " done" : ""}`} />
                  )}
                </Fragment>
              ))}
            </div>

            {step === 1 && (
              <div className="panel reveal">
                <div className="panel-head">
                  <h2>Step 1: Select Service</h2>
                  <p>Choose the service you&apos;d like</p>
                </div>

                <div className="space-y-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className={`service-option${selectedService?.id === service.id ? " selected" : ""}`}
                    >
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      {service.price && (
                        <p className="price">${service.price}</p>
                      )}
                    </button>
                  ))}

                  {services.length === 0 && (
                    <p className="empty-state">Loading services...</p>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!selectedService}
                    className="btn btn-dark w-full"
                  >
                    Next <span className="arrow">↗</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="panel reveal">
                <div className="panel-head">
                  <h2>Step 2: Select Date</h2>
                  <p>Choose your preferred date</p>
                </div>

                <div className="calendar-shell">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </div>

                <div className="flex gap-3 mt-6 w-full">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-line flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!date}
                    className="btn btn-dark flex-1"
                  >
                    Next <span className="arrow">↗</span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="panel reveal">
                <div className="panel-head">
                  <h2>Step 3: Select Time Slot</h2>
                  <p>Available times for {date?.toDateString()}</p>
                </div>

                {timeSlots.length === 0 ? (
                  <p className="empty-state">No available time slots for this date</p>
                ) : (
                  <div className="time-grid">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.start_time}
                        type="button"
                        onClick={() => setSelectedTime(slot.start_time)}
                        className={`time-slot${selectedTime === slot.start_time ? " selected" : ""}`}
                      >
                        {slot.start_time}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-line flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    disabled={!selectedTime}
                    className="btn btn-dark flex-1"
                  >
                    Next <span className="arrow">↗</span>
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="panel reveal">
                <div className="panel-head">
                  <h2>Step 4: Your Information</h2>
                  <p>Enter your contact details</p>
                </div>

                <div className="field">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="field">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="field">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="field">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Describe what you need..."
                  />
                </div>

                <div className="summary-box">
                  <h4>Booking Summary</h4>
                  <p><strong>Service:</strong> {selectedService?.title}</p>
                  <p><strong>Date:</strong> {date?.toDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-line flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn btn-dark flex-1"
                  >
                    {loading ? "Sending..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
