# Ayurved Life 🌿

Ancient wisdom, modern wellness. A premium e-commerce platform for Ayurvedic products.

## 🚀 Project Structure

This is a monorepo containing:
- **`frontend/`**: The modern Next.js 16 web application.
- **`backend/`**: Legacy Django backend (migrated to Supabase).

## 🛠️ Tools & Technologies Used

### Frontend
- **Next.js 16** (App Router, Server Components)
- **React 19**
- **Supabase SSR** (Auth integration)
- **Vanilla CSS** (Custom premium design, glassmorphism, responsive)
- **Lucide Icons** (or custom SVGs)

### Backend & Services
- **Supabase**:
  - **Database**: PostgreSQL with Row Level Security (RLS)
  - **Auth**: Email/Password, Google OAuth, and Phone OTP (+91)
  - **Storage**: For user avatars
- **Razorpay**: Payment gateway integration for online payments.
- **Twilio**: (Optional) For sending SMS OTPs.

## 🏁 Getting Started

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📄 License
This project is private and confidential.
