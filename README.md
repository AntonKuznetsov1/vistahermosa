# Vista Hermosa Beauty Salon Website

A full-featured beauty salon website with booking system, blog, and admin panel.

## Tech Stack

### Frontend (Cloudflare Pages)
- Next.js 15 + TypeScript + Tailwind CSS v4
- shadcn/ui components
- Lucide React icons

### Backend (Render)
- Node.js + Express + TypeScript
- Supabase (PostgreSQL + Storage)
- Nodemailer for SMTP emails

## Project Structure
```
vistahermosa/
├── frontend/  # Next.js app for Cloudflare Pages
├── backend/   # Express API for Render
└── README.md
```

## Features

- **Home Page**: Hero section, Services section, Contact section
- **Booking**: 4-step booking flow (Service → Date → Time Slot → Contact Info)
- **Blog**: Post listing with like functionality (newest first)
- **Admin Panel** (password: Natasha2011): Services CRUD, Booking monitoring, Time slot configuration, Blog post management

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your Supabase and SMTP credentials
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL
npm run dev
```

## Environment Variables

### Backend (.env)
- PORT
- FRONTEND_URL
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SMTP_USER (emailsystem95@gmail.com)
- SMTP_PASS (abqj zpmc kgqt ogoe)
- ADMIN_PASSWORD (Natasha2011)

### Frontend (.env.local)
- NEXT_PUBLIC_API_URL

## Deployment

- **Frontend**: Deploy to Cloudflare Pages from the `frontend` directory
- **Backend**: Deploy to Render from the `backend` directory (use Procfile)
- **Database**: Supabase (create tables and blog-images bucket)
- **Uptime**: Use UptimeRobot to keep backend alive

## Contact
- Email: tanglica101@gmail.com
- Phone: 971 998 9715
- Address: Vista Hermosa, Michoacan De Ocampo, Mexico
