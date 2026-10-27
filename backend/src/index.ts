import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import servicesRoutes from './routes/services';
import bookingsRoutes from './routes/bookings';
import timeSlotsRoutes from './routes/timeSlots';
import blogRoutes from './routes/blog';
import emailRoutes from './routes/email';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');
    callback(null, allowedOrigins.includes(normalizedOrigin));
  },
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Vista Hermosa Beauty Salon API' });
});

app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/time-slots', timeSlotsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/email', emailRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
