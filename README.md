# NSS Check-In System | Inspiria Knowledge Campus

A modern, high-performance volunteer management and check-in system for the National Service Scheme (NSS) unit at Inspiria Knowledge Campus. This platform streamlines volunteer activities, event tracking, and impact visualization.

## 🚀 Features

### **Volunteer Portal**
- **Interactive Landing Page**: Experience a 3D scroll-reactive gallery showcasing real-world impact and a draggable masonry grid of event photos.
- **Seamless Check-In**: Quick and easy event check-in system with support for image uploads and location tracking.
- **Personal Dashboard**: Track your volunteer hours, metrics, and upcoming events in real-time.
- **Event Discovery**: Browse and register for upcoming social welfare drives and community service events.
- **Profile Management**: Maintain a professional volunteer profile and track your journey.

### **Admin Portal**
- **Unified Dashboard**: Real-time overview of unit metrics, volunteer growth, and event success.
- **Volunteer Management**: Approve, manage, and monitor the activity of all registered volunteers.
- **Event Coordination**: Create, edit, and manage social drives and community service activities.
- **Attendance Verification**: Streamlined system to verify and approve volunteer check-ins.
- **Leaderboard**: Visualize and reward top contributors within the NSS unit.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack for lightning-fast development.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type-safe code.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for modern, responsive UI.
- **Database & Auth**: [Supabase](https://supabase.com/) & [NextAuth.js v5](https://authjs.dev/) (Beta).
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Motion](https://motion.dev/) for high-end interactive experiences.
- **Icons**: [Lucide React](https://lucide.dev/) for consistent, beautiful iconography.
- **Components**: Custom-built UI components following [shadcn/ui](https://ui.shadcn.com/) patterns.

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router (Pages & API)
│   ├── admin/            # Admin portal with role-based protection
│   ├── api/              # Backend API routes (Auth, Events, Check-ins)
│   ├── auth/             # Authentication pages (Login, Register)
│   └── dashboard/        # Volunteer dashboard
├── components/           # Reusable UI components
│   ├── blocks/           # Complex UI blocks (Galleries, Hero sections)
│   ├── ui/               # Base UI components (Buttons, Inputs, etc.)
│   └── providers/        # React Context providers (Auth, Session)
├── lib/                  # Core utilities (Auth config, Supabase client)
└── public/               # Static assets (Logos, Icons)
```

## 🚦 Getting Started

### **Prerequisites**
- Node.js 18+ 
- Supabase account and project
- Cloudinary account (for image uploads)

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nss-checkin-system.git
   cd nss-checkin-system
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Configure Environment Variables:
   Create a `.env.local` file with the following:
   ```env
   NEXTAUTH_SECRET=your_secret
   AUTH_URL=http://localhost:3000
   
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🎨 Design Philosophy

The project uses a high-contrast, professional theme centered around the **NSS Red** and **NSS Blue** branding. It features:
- **Infinite Drag Scroll**: An interactive masonry grid for exploring impact.
- **The Infinite Grid**: A reactive background pattern that responds to mouse movement.
- **Glassmorphism**: Backdrop blurs and subtle borders for a modern, airy feel.
- **Staggered Animations**: Smooth entrance transitions for all major UI sections.

## 📝 License

This project is developed for the NSS Unit at **Inspiria Knowledge Campus**. All rights reserved.
