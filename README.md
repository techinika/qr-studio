# QR STUDIO - Dynamic QR Code Generator & Scanner

<p align="center">
  <a href="https://qr.studio">
    <img src="https://qr.studio/qr-studio.png" alt="QR STUDIO" width="120" height="120" />
  </a>
</p>

<p align="center">
  <strong>QR STUDIO</strong> is a powerful dynamic QR code generator with real-time analytics, custom branding, folder organization, and team collaboration features.
</p>

<p align="center">
  <a href="https://qr.studio">Live Demo</a> •
  <a href="https://qr.studio/generate">Generate QR</a> •
  <a href="https://qr.studio/scan">Scan QR</a> •
  <a href="https://qr.studio/solutions">Solutions</a>
</p>

---

## Features

### Public (No Signup Required)
- **QR Code Generator** - Create custom QR codes with colors and logos
- **QR Scanner** - Scan QR codes using camera or upload image
- **High-Resolution Export** - Download PNG files
- **Real-time Preview** - See QR code as you design

### Registered Users
- **Dynamic QR Codes** - Change destination URLs anytime without reprinting
- **Password Protection** - Secure content behind custom passwords
- **Analytics Dashboard** - Track scans, locations, devices, and times
- **Folder Organization** - Organize QR codes into folders
- **Team Collaboration** - Work together with team members (up to 5 seats)
- **Advanced Styling** - Custom corner styles and dot patterns

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **QR Generation**: [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- **Payments**: Stripe (subscription)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowalski.dev/)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (Firestore + Auth enabled)
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/qr-man.git

# Navigate to the project
cd qr-man

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and Stripe credentials
```

### Environment Variables

```env
# Firebase (get from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe (get from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_BASE_URL=https://qr.studio
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Project Structure

```
qr-man/
├── app/                    # Next.js App Router pages
│   ├── (authenticated)/   # Protected routes (workspace, etc.)
│   ├── api/               # API routes
│   ├── generate/          # QR code generator (public)
│   ├── scan/             # QR code scanner (public)
│   ├── solutions/        # Industry solutions pages
│   ├── privacy/         # Privacy policy
│   ├── terms/           # Terms of service
│   ├── login/           # Authentication
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── pages/            # Page-level components
│   └── parts/            # Reusable UI parts
│       ├── workspace/    # Workspace components
│       └── ConfirmModal.tsx
├── db/                    # Firebase functions
├── lib/                   # Utilities, contexts, main config
├── types/                 # TypeScript types
└── public/                # Static assets
```

---

## Key Components

### Public Pages
- `/` - Landing page with features and CTAs
- `/generate` - QR code generator (no signup required)
- `/scan` - QR code scanner
- `/solutions` - Industry-specific use cases
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Authenticated Pages
- `/workspace` - Main dashboard with QR codes list
- `/workspace/generate` - Advanced QR builder
- `/workspace/folder/[id]` - Folder details
- `/workspace/view/[id]` - QR code details/edit
- `/workspace/team` - Team management
- `/workspace/profile` - User profile
- `/workspace/profile/billing` - Subscription management

### Dynamic Routes
- `/r/[qrcode]` - Dynamic QR code redirect handler

---

## Firebase Database Schema

### Collections

#### `qrcodes`
```typescript
{
  name: string,
  originalUrl: string,
  uuid: string,           // For dynamic QR codes
  folderId: string | null,
  workspaceId: string,
  ownerId: string,
  isDynamic: boolean,
  isPasswordProtected: boolean,
  password: string | null,
  fgColor: string,
  bgColor: string,
  qrStyle: {
    cornerColor: string,
    cornerStyle: "square" | "rounded" | "dot",
    dotColor: string,
    dotStyle: "square" | "rounded" | "dots",
  },
  logo: string | null,     // Base64 encoded image
  scanCount: number,
  createdAt: timestamp,
}
```

#### `folders`
```typescript
{
  name: string,
  workspaceId: string,
  ownerId: string,
  itemCount: number,
  createdAt: timestamp,
}
```

#### `workspaceMembers`
```typescript
{
  email: string,
  role: "Owner" | "Admin" | "Member",
  workspaceId: string,
  workspaceName: string,
  invitedBy: string,
  status: "pending" | "active" | "rejected",
  createdAt: timestamp,
}
```

#### `workspaces`
```typescript
{
  name: string,
  ownerId: string,
  createdAt: timestamp,
}
```

---

## Statistics Note

> **Important**: Statistics are only accurately recorded for **Dynamic QR Codes**. Static QR codes (created without an account) use client-side tracking which may not capture all scans. For accurate analytics, create an account and use Dynamic QR codes.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- [Ubunifu Labs](https://ubunifu.techinika.co.rw) - For inspiration and support
- [Firebase](https://firebase.google.com/) - For authentication and database
- [Tailwind CSS](https://tailwindcss.com/) - For beautiful styling

---

## Support

For questions or support, contact: **products@techinika.com**

---

<p align="center">
  Made with ❤️ by <a href="https://ubunifu.techinika.co.rw">Ubunifu Labs</a>
</p>
