import express from 'express';
import { supabase } from '../lib/supabase';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, services(title)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { service_id, booking_date, start_time, client_name, client_email, client_phone, message } = req.body;
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([{ 
        service_id, 
        booking_date, 
        start_time, 
        client_name, 
        client_email, 
        client_phone, 
        message,
        status: 'pending'
      }])
      .select('*, services(title)');
    
    if (error) throw error;
    
    // Send email to owner
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'tanglica101@gmail.com',
        subject: 'New Booking Request - Vista Hermosa',
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Service:</strong> ${data[0].services?.title}</p>
          <p><strong>Date:</strong> ${booking_date}</p>
          <p><strong>Time:</strong> ${start_time}</p>
          <p><strong>Name:</strong> ${client_name}</p>
          <p><strong>Email:</strong> ${client_email}</p>
          <p><strong>Phone:</strong> ${client_phone}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }
    
    res.json({ success: true, booking: data[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, sendEmail } = req.body;
    
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, services(title)')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (sendEmail && booking) {
      try {
        const statusText = status === 'confirmed' ? 'Confirmed' : status === 'cancelled' ? 'Cancelled' : status;
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: booking.client_email,
          subject: `Booking ${statusText} - Vista Hermosa Beauty Salon`,
          html: `
            <h2>Your Booking has been ${statusText}</h2>
            <p><strong>Service:</strong> ${booking.services?.title}</p>
            <p><strong>Date:</strong> ${booking.booking_date}</p>
            <p><strong>Time:</strong> ${booking.start_time}</p>
            <p>Thank you for choosing Vista Hermosa Beauty Salon.</p>
          `
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }
    }
    
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
