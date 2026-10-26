# Vista Hermosa Beauty Salon - Implementation Plan

## 1. Tech Stack

**Frontend:**
- **Next.js 15** (App Router) + TypeScript - Full-stack framework
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library (matching componentstyle aesthetic)
- **lucide-react** - Icons
- **framer-motion** - Animations (like in componentstyle)
- **date-fns** - Date handling

**Backend/Services:**
- **API Routes** (Next.js) - Can deploy as full app to Render or Cloudflare Pages with Workers
- **Supabase** - PostgreSQL database + Storage buckets (for blog images)
- **Nodemailer** - SMTP email sending (emailsystem95@gmail.com)
- **UptimeRobot** - To keep backend alive (if needed)

**Deployment:** Cloudflare Pages (frontend) + Render (if separate backend) or full Next.js on Render

## 2. Design Direction

**Colors:**
- Background: `#F7D9BF` (warmer) or `#F2C4BF` - use `#F7D9BF` as primary bg
- Foreground/Text: `#000000` (black)
- Accents: Elegant rose/gold tones to match salon aesthetic
- Match the "agency" template's bold typography style

**Typography:**
- Display: Syne or Playfair Display (elegant, salon-appropriate)
- Body: Inter (clean, readable)

**Style Inspiration:**
- From "agency" template: Hero with large text, bold layout, marquee elements, smooth animations
- From "componentstyle": Modern buttons with shimmer effects, rounded corners, clean UI components

**Logo:** Butterfly icon (to match reference style) - will need to add to public/ later

## 3. Project Structure
```
vistahermosa/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Home)
│   ├── booking/
│   ├── blog/
│   ├── admin/
│   └── api/
├── components/
│   ├── nav.tsx
│   ├── footer.tsx
│   ├── ui/ (shadcn components)
│   └── ...
├── lib/
│   ├── supabase/
│   ├── utils.ts
│   └── email.ts
└── public/
```

## 4. Database Schema (Supabase)

### Tables:

**services**
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
title VARCHAR NOT NULL,
description TEXT NOT NULL,
price DECIMAL(10,2), -- nullable/optional
created_at TIMESTAMP DEFAULT NOW()
```

**time_slots_config**
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
type VARCHAR NOT NULL, -- 'recurring', 'day_override', 'date_override'
day_of_week INTEGER, -- 0-6 (Sunday-Saturday) for recurring/weekday rules
specific_date DATE, -- for date-specific rules
start_time TIME NOT NULL,
end_time TIME NOT NULL,
action VARCHAR NOT NULL, -- 'add' or 'remove'
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT NOW()
```

**bookings**
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
service_id UUID REFERENCES services(id),
booking_date DATE NOT NULL,
start_time TIME NOT NULL,
end_time TIME,
client_name VARCHAR NOT NULL,
client_email VARCHAR NOT NULL,
client_phone VARCHAR NOT NULL,
message TEXT,
status VARCHAR DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
created_at TIMESTAMP DEFAULT NOW()
```

**blog_posts**
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
title VARCHAR NOT NULL,
description TEXT NOT NULL,
image_url TEXT,
image_path TEXT,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
```

**blog_likes**
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
client_identifier VARCHAR NOT NULL, -- from localStorage
created_at TIMESTAMP DEFAULT NOW(),
UNIQUE(blog_post_id, client_identifier)
```

**Storage Bucket:** `blog-images` (public or private with signed URLs)

## 5. Pages Implementation

### Home Page (`/`)
Sections as specified:
1. **Hero Section** - Modern, distinctive like agency template. Include CTA to booking.
2. **Services Section** - Display services from DB or static, link to booking
3. **Contact Section** - Show email, phone, address, maybe embedded map

Also include Nav and Footer on all pages except admin.

### Booking Page (`/booking`) - 4 Steps
1. **Step 1:** Select service from admin-configured services
2. **Step 2:** Select date (calendar, maybe disable past dates)
3. **Step 3:** Load available time slots for selected date (compute based on time_slots_config, exclude booked slots)
4. **Step 4:** Enter contact info (name, email, phone) + optional message
5. Submit via API → send confirmation email to owner + maybe client → redirect to home on success

### Blog Page (`/blog`)
- List all posts newest first
- Each post: image, title, description
- Like button (heart icon) - toggle like/unlike
- Like counter showing total likes
- Store client identifier in localStorage, track via blog_likes table
- Only allow removing own like (enforced by same client_identifier)

### Admin Page (`/admin`) - Protected
4 sections:

**1. Services Management**
- List all services
- Add: title, description, optional price
- Edit/Delete services

**2. Booking Monitoring**
- List all bookings (pending/confirmed/cancelled)
- Actions: Confirm, Cancel, Email client (via SMTP)
- Show client details, service, date/time, message

**3. Time Slot Configuration**
- Create/edit/delete recurring time slots
- Set days off (mark weekday as off)
- Add/cancel slots for specific weekdays
- Add/cancel slots for specific dates (non-recurring)
- Add/remove specific time slot for specific date or weekday

**4. Blog Post Editing**
- Upload image from device to Supabase bucket
- Add title and description
- Post, edit, delete blog posts

## 6. API Routes

```
/api/services - GET, POST, PUT, DELETE
/api/bookings - GET, POST, PUT (update status)
/api/time-slots - GET, POST, PUT, DELETE (complex logic)
/api/blog - GET, POST, PUT, DELETE
/api/blog/like - POST (toggle like)
/api/email - POST (send email)
```

## 7. Components

**Shared (all except admin):**
- `Nav` - Logo + name (butterfly icon), links to home#services, home#contact, /blog, "Book Now" button → /booking
- `Footer` - Email, phone (971 998 9715), address (TBD - need to ask? but user says "Adress: _"), map embed

**UI:** shadcn components (button, card, form, calendar, dialog, etc.)

## 8. Implementation Steps

1. Initialize Next.js app with TypeScript, Tailwind
2. Install dependencies (supabase, nodemailer, framer-motion, date-fns, lucide-react, etc.)
3. Setup shadcn/ui
4. Configure Tailwind with salon color palette
5. Create design system (fonts, colors)
6. Build Nav and Footer components
7. Build Home page (hero, services, contact)
8. Build Booking flow (multi-step)
9. Build Blog page with likes
10. Build Admin panel with all 4 sections
11. Setup Supabase client, create tables/bucket
12. Implement API routes
13. Setup email sending (nodemailer)
14. Add authentication/protection for admin (simple password or Supabase auth)
15. Test all functionality
16. Remove reference folders
17. Deploy

## 9. Notes & Questions

- **Address:** User says "Adress: _" (empty) - need to confirm or use placeholder
- **Logo:** User says "I will attach the logo here" - use butterfly icon placeholder for now
- **Admin auth:** Need simple protection (password-based) since it's a small salon site
- **Time slot logic:** Complex - need helper to compute available slots for a given date
- **Map in footer:** Can use Google Maps embed or OpenStreetMap
- **Email:** Using SMTP credentials provided

**Ready to start implementation after approval.**
