"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number | null;
}

interface Booking {
  id: string;
  status: string;
  booking_date: string;
  start_time: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  message?: string | null;
  services?: { title: string } | null;
}

interface TimeSlot {
  id: string;
  type: string;
  day_of_week: number | null;
  specific_date: string | null;
  start_time: string;
  end_time: string;
  action: string;
}

interface BlogPost {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("services");
  
  // Services
  const [services, setServices] = useState<Service[]>([]);
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", price: "" });
  
  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Time slots
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [timeSlotForm, setTimeSlotForm] = useState({
    type: "recurring",
    day_of_week: "0",
    specific_date: "",
    start_time: "",
    end_time: "",
    action: "add"
  });
  
  // Blog
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [blogForm, setBlogForm] = useState({ title: "", description: "" });
  const [blogImage, setBlogImage] = useState<File | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`);
      const data = await res.json();
      setServices(data);
    } catch {
      toast.error("Failed to load services");
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings");
    }
  }, []);

  const fetchTimeSlots = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/time-slots`);
      const data = await res.json();
      setTimeSlots(data);
    } catch {
      toast.error("Failed to load time slots");
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/blog`);
      const data = await res.json();
      setPosts(data);
    } catch {
      toast.error("Failed to load posts");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const load = async () => {
      await Promise.resolve();
      if (cancelled) return;

      if (activeTab === "services") await fetchServices();
      else if (activeTab === "bookings") await fetchBookings();
      else if (activeTab === "timeslots") await fetchTimeSlots();
      else if (activeTab === "blog") await fetchPosts();
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    activeTab,
    fetchServices,
    fetchBookings,
    fetchTimeSlots,
    fetchPosts,
  ]);

  const handleLogin = () => {
    if (password === "Natasha2011") {
      setIsAuthenticated(true);
      toast.success("Logged in successfully");
    } else {
      toast.error("Incorrect password");
    }
  };

  const addService = async () => {
    try {
      await fetch(`${API_URL}/api/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: serviceForm.title,
          description: serviceForm.description,
          price: serviceForm.price || null
        })
      });
      toast.success("Service added");
      setServiceForm({ title: "", description: "", price: "" });
      fetchServices();
    } catch {
      toast.error("Failed to add service");
    }
  };

  const deleteService = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      fetchServices();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, sendEmail: true })
      });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const addTimeSlot = async () => {
    try {
      await fetch(`${API_URL}/api/time-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...timeSlotForm,
          day_of_week: timeSlotForm.type === 'recurring' ? parseInt(timeSlotForm.day_of_week) : null,
          specific_date: timeSlotForm.type === 'date_override' ? timeSlotForm.specific_date : null
        })
      });
      toast.success("Time slot added");
      fetchTimeSlots();
    } catch {
      toast.error("Failed to add time slot");
    }
  };

  const deleteTimeSlot = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/time-slots/${id}`, { method: "DELETE" });
      toast.success("Time slot deleted");
      fetchTimeSlots();
    } catch {
      toast.error("Failed to delete time slot");
    }
  };

  const addBlogPost = async () => {
    try {
      const formData = new FormData();
      formData.append("title", blogForm.title);
      formData.append("description", blogForm.description);
      if (blogImage) {
        formData.append("image", blogImage);
      }
      
      await fetch(`${API_URL}/api/blog`, {
        method: "POST",
        body: formData
      });
      toast.success("Blog post added");
      setBlogForm({ title: "", description: "" });
      setBlogImage(null);
      fetchPosts();
    } catch {
      toast.error("Failed to add blog post");
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/blog/${id}`, { method: "DELETE" });
      toast.success("Blog post deleted");
      fetchPosts();
    } catch {
      toast.error("Failed to delete blog post");
    }
  };

  if (!isAuthenticated) {
    return (
      <div id="main" className="admin-login admin-shell">
        <Card className="admin-login-card">
          <CardHeader>
            <span className="label mb-1">Vista Hermosa</span>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>Enter password to access admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="field">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div id="main" className="admin-shell">
      <div className="container-wide py-12">
        <div className="admin-header reveal">
          <div>
            <span className="label">Dashboard</span>
            <h1 className="text-4xl font-bold mb-2" style={{ letterSpacing: '-0.04em' }}>
              Admin Panel
            </h1>
          </div>
        </div>
        
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab${activeTab === "services" ? " active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            Services
          </button>
          <button
            type="button"
            className={`admin-tab${activeTab === "bookings" ? " active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Booking Monitoring
          </button>
          <button
            type="button"
            className={`admin-tab${activeTab === "timeslots" ? " active" : ""}`}
            onClick={() => setActiveTab("timeslots")}
          >
            Time Slot Configuration
          </button>
          <button
            type="button"
            className={`admin-tab${activeTab === "blog" ? " active" : ""}`}
            onClick={() => setActiveTab("blog")}
          >
            Blog Post Editing
          </button>
        </div>

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={serviceForm.title} onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} />
                </div>
                <div>
                  <Label>Price (Optional)</Label>
                  <Input value={serviceForm.price} onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})} placeholder="e.g., 50.00" />
                </div>
                <Button onClick={addService}>Add Service</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Existing Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {services.map((service) => (
                  <div key={service.id} className="admin-row">
                    <div>
                      <h3 className="font-semibold">{service.title}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      {service.price && <p className="text-sm font-semibold">${service.price}</p>}
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => deleteService(service.id)}>Delete</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-5 border border-line rounded-2xl bg-white/70 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{booking.services?.title}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p><strong>Date:</strong> {booking.booking_date} | <strong>Time:</strong> {booking.start_time}</p>
                  <p><strong>Client:</strong> {booking.client_name} | {booking.client_email} | {booking.client_phone}</p>
                  {booking.message && <p><strong>Message:</strong> {booking.message}</p>}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>Confirm</Button>
                    <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>Cancel</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Time Slots Tab */}
        {activeTab === "timeslots" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Time Slot Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <select
                    className="w-full h-10 rounded-lg border border-line bg-white/70 px-3 text-sm"
                    value={timeSlotForm.type}
                    onChange={(e) => setTimeSlotForm({...timeSlotForm, type: e.target.value})}
                  >
                    <option value="recurring">Recurring (by day of week)</option>
                    <option value="date_override">Specific Date</option>
                  </select>
                </div>
                
                {timeSlotForm.type === 'recurring' && (
                  <div>
                    <Label>Day of Week</Label>
                    <select
                      className="w-full h-10 rounded-lg border border-line bg-white/70 px-3 text-sm"
                      value={timeSlotForm.day_of_week}
                      onChange={(e) => setTimeSlotForm({...timeSlotForm, day_of_week: e.target.value})}
                    >
                      <option value="0">Sunday</option>
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                    </select>
                  </div>
                )}
                
                {timeSlotForm.type === 'date_override' && (
                  <div>
                    <Label>Specific Date</Label>
                    <Input
                      type="date"
                      value={timeSlotForm.specific_date}
                      onChange={(e) => setTimeSlotForm({...timeSlotForm, specific_date: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={timeSlotForm.start_time}
                      onChange={(e) => setTimeSlotForm({...timeSlotForm, start_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={timeSlotForm.end_time}
                      onChange={(e) => setTimeSlotForm({...timeSlotForm, end_time: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Action</Label>
                  <select
                    className="w-full h-10 rounded-lg border border-line bg-white/70 px-3 text-sm"
                    value={timeSlotForm.action}
                    onChange={(e) => setTimeSlotForm({...timeSlotForm, action: e.target.value})}
                  >
                    <option value="add">Add Slot</option>
                    <option value="remove">Remove/Set Day Off</option>
                  </select>
                </div>
                
                <Button onClick={addTimeSlot}>Add Configuration</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Current Configurations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {timeSlots.map((slot) => (
                  <div key={slot.id} className="admin-row">
                    <div>
                      <p className="font-semibold">
                        {slot.type === 'recurring' ? `Recurring - ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][slot.day_of_week ?? 0]}` : `Date: ${slot.specific_date}`}
                      </p>
                      <p className="text-sm text-gray-600">{slot.start_time} - {slot.end_time} | Action: {slot.action}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => deleteTimeSlot(slot.id)}>Delete</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === "blog" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Blog Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={blogForm.description} onChange={(e) => setBlogForm({...blogForm, description: e.target.value})} rows={6} />
                </div>
                <div>
                  <Label>Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setBlogImage(e.target.files?.[0] || null)} />
                </div>
                <Button onClick={addBlogPost}>Post Blog</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Existing Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {posts.map((post) => (
                  <div key={post.id} className="admin-row items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{new Date(post.created_at).toLocaleDateString()}</p>
                      <p className="text-sm whitespace-pre-wrap">{post.description.substring(0, 100)}...</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => deleteBlogPost(post.id)}>Delete</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
