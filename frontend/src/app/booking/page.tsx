"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    fetchServices();
  }, []);

  useEffect(() => {
    if (date) {
      fetchTimeSlots();
    }
  }, [date]);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`);
      const data = await res.json();
      setServices(data);
    } catch (error) {
      toast.error("Failed to load services");
    }
  };

  const fetchTimeSlots = async () => {
    if (!date) return;
    try {
      const dateStr = date.toISOString().split('T')[0];
      const res = await fetch(`${API_URL}/api/time-slots/available/${dateStr}`);
      const data = await res.json();
      setTimeSlots(data);
    } catch (error) {
      toast.error("Failed to load time slots");
    }
  };

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
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Nav />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            Book an Appointment
          </h1>
          
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-black text-white' : 'bg-gray-300'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`flex-1 h-1 ${step > s ? 'bg-black' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Select Service</CardTitle>
                <CardDescription>Choose the service you'd like</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedService?.id === service.id
                        ? 'border-black bg-accent'
                        : 'border-border hover:border-black'
                    }`}
                  >
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <p className="text-gray-700">{service.description}</p>
                    {service.price && (
                      <p className="mt-2 font-semibold">${service.price}</p>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedService}
                  className="w-full mt-4"
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Select Date</CardTitle>
                <CardDescription>Choose your preferred date</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  className="rounded-md border"
                />
                <div className="flex gap-2 mt-4 w-full">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!date} className="flex-1">
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Select Time Slot</CardTitle>
                <CardDescription>Available times for {date?.toDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {timeSlots.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No available time slots for this date</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.start_time}
                        onClick={() => setSelectedTime(slot.start_time)}
                        className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                          selectedTime === slot.start_time
                            ? 'border-black bg-accent'
                            : 'border-border hover:border-black'
                        }`}
                      >
                        {slot.start_time}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep(4)} disabled={!selectedTime} className="flex-1">
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Your Information</CardTitle>
                <CardDescription>Enter your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Describe what you need..."
                  />
                </div>
                
                <div className="bg-accent p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Booking Summary</h4>
                  <p><strong>Service:</strong> {selectedService?.title}</p>
                  <p><strong>Date:</strong> {date?.toDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                    {loading ? "Sending..." : "Confirm Booking"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
