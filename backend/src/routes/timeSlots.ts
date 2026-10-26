import express from 'express';
import { supabase } from '../lib/supabase';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('time_slots_config')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/available/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday
    
    // Get all time slot configs
    const { data: configs, error: configError } = await supabase
      .from('time_slots_config')
      .select('*')
      .eq('is_active', true);
    
    if (configError) throw configError;
    
    // Get booked slots for this date
    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('start_time')
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']);
    
    if (bookingError) throw bookingError;
    
    const bookedTimes = new Set(bookings?.map(b => b.start_time) || []);
    
    // Collect available slots
    let availableSlots: any[] = [];
    
    // Process configs
    for (const config of configs || []) {
      if (config.type === 'recurring' && config.day_of_week === dayOfWeek && config.action === 'add') {
        const slotKey = config.start_time;
        if (!bookedTimes.has(slotKey)) {
          availableSlots.push({
            start_time: config.start_time,
            end_time: config.end_time,
            id: config.id
          });
        }
      } else if (config.type === 'date_override' && config.specific_date === date) {
        if (config.action === 'add') {
          const slotKey = config.start_time;
          if (!bookedTimes.has(slotKey)) {
            availableSlots.push({
              start_time: config.start_time,
              end_time: config.end_time,
              id: config.id
            });
          }
        }
        // if action is 'remove', we just don't add it
      }
    }
    
    // Remove duplicates and sort
    const uniqueSlots = Array.from(
      new Map(availableSlots.map(s => [s.start_time, s])).values()
    ).sort((a, b) => a.start_time.localeCompare(b.start_time));
    
    res.json(uniqueSlots);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, day_of_week, specific_date, start_time, end_time, action } = req.body;
    const { data, error } = await supabase
      .from('time_slots_config')
      .insert([{ type, day_of_week, specific_date, start_time, end_time, action, is_active: true }])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { start_time, end_time, is_active } = req.body;
    const { data, error } = await supabase
      .from('time_slots_config')
      .update({ start_time, end_time, is_active })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('time_slots_config')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
