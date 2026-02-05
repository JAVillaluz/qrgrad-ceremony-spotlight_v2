# QRGrad Ceremony Spotlight 🎓

A modern, elegant graduation ceremony management system with QR code scanning and real-time display synchronization.

## 🌟 Features

- **Offline-First**: Runs completely offline using localStorage (no internet required!)
- **QR Code Scanning**: Quick student check-in via QR codes
- **Real-Time Sync**: Admin panel and display screen sync instantly across tabs
- **Role-Based Access**: Admin and user roles with secure authentication
- **Elegant Design**: Prestigious ceremonial theme with gold accents
- **Student Management**: Add up to 1000 students with photos and details
- **Multi-Section Support**: Organize students by sections
- **Walked Log**: Track all students who have walked the stage

## 🚀 Quick Start

### Default Admin Credentials

The application comes with a default admin account:
- **Email:** `admin@local.com`
- **Password:** `admin123`

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd qrgrad-ceremony-spotlight

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will start at `http://localhost:8080` (or another port if 8080 is in use).

### First Login

1. Navigate to `/auth` or click "Admin Panel" from the homepage
2. Login with the default credentials above
3. You're ready to manage your ceremony!

## 📖 Documentation

For complete offline mode documentation, see [OFFLINE_MODE.md](./OFFLINE_MODE.md)

## 🎯 Usage

### Admin Dashboard
- **Add Students**: Click "Add Student" and fill in details
- **Generate QR Codes**: Automatically created for each student
- **Manage Sections**: Organize students into sections
- **Start Ceremony**: Begin the graduation ceremony
- **Scan QR Codes**: Use QR scanner or manual selection

### Display Page
- Open `/display` in a separate window or screen
- Displays current student in real-time
- Syncs automatically with admin dashboard
- Perfect for projection during the ceremony

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn-ui + Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **QR Codes**: html5-qrcode

## 🎨 Design System

The application features a prestigious ceremonial design inspired by award ceremonies:
- **Colors**: Navy blue, ceremonial gold, cream
- **Typography**: Playfair Display (headings), Cormorant Garamond (elegant text)
- **Animations**: Smooth transitions and gold shimmer effects
- **Responsive**: Works on desktop, tablet, and mobile

## 📦 Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── ceremony/       # Ceremony display components
│   ├── scanner/        # QR code scanner
│   └── ui/            # shadcn-ui components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and libraries
│   ├── localAuth.ts   # Offline authentication
│   └── localDatabase.ts # Offline database
├── pages/              # Route pages
├── stores/             # Zustand stores
└── types/              # TypeScript types
```

## 🔒 Security Notes

- This offline mode is designed for development and local use
- Passwords are stored in plain text in localStorage (not production-ready)
- All data stays in the browser - no external servers
- For production use, implement proper authentication and database

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn-ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

**Made with ❤️ for memorable graduation ceremonies**
