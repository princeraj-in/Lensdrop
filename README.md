# 📸 LensDrop

> **The modern, frictionless wedding & event memory collective.**  
> Seamlessly collect, curate, and relive every moment captured through your guests’ perspectives in real time.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12.12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Motion](https://img.shields.io/badge/Motion-v12.23-E10098?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)

---

## 🌟 Executive Overview

**LensDrop** bridges the gap between wedding couples and their guests. Traditional methods of collecting event memories—such as messaging apps or shared folders—compress quality, require complex logins, or get lost in the shuffle. 

With LensDrop, hosts generate an instant **Live QR Code** or digital invitation for their wedding or reception. Guests simply scan with their native smartphone camera to upload original high-resolution photos and videos—**no app downloads or account registrations required for guests**.

Behind the scenes, hosts and platform administrators enjoy an intuitive command suite featuring real-time photo streaming, client-side progressive image compression, one-click full-archive ZIP exports, and a role-based Super Admin management console.

---

## ✨ Key Platform Pillars

### 🎯 Frictionless Guest Experience
- **Zero-Install QR Drop**: Guests scan an event-specific QR code displayed on tables, screens, or welcome boards to immediately access the drop zone.
- **Client-Side Compression**: High-definition mobile uploads undergo client-side image optimization via `browser-image-compression` prior to transfer, eliminating latency and bandwidth congestion.
- **Drag-and-Drop Dropzone**: Native support for desktop and mobile uploads powered by `react-dropzone`.

### 💍 Host & Event Curation
- **Host Moderation Queue (Approval Mode)**: Toggleable privacy shield allowing hosts to review guest uploads privately before publishing them to the public live stream or gallery. Includes batch approvals, batch rejections, multi-select checkboxes, fullscreen inspection, and undo states.
- **Interactive Event Galleries**: Live, responsive photo walls that automatically update with guest submissions in real time.
- **One-Click Batch Archiving**: Hosts can download entire wedding collections in a single ZIP bundle powered by `JSZip` and `file-saver`.
- **Digital Invitation Studio**: Built-in invitation generator and customizable digital passes with direct RSVP and event details.
- **Privacy & Permissions**: Granular controls allowing hosts to lock galleries, require upload approval, or distribute view-only links.

### 🛡️ Enterprise Super Admin Suite
- **Mission Control Overview**: Centralized platform metrics displaying aggregate user count, total events hosted, storage utilization, and real-time server health.
- **User Governance**: Searchable member directory with immediate account state controls (Active, Banned) and verified deletion flows with custom modal validations.
- **Platform Event Auditing**: Global visibility into all active events across the network with media counts and creator attribution.
- **System Settings**: High-level killswitches including instant **Maintenance Mode** and **Registration Gate** controls.

### 🎨 Design & Aesthetics
- **Dark-Theme Glassmorphism**: Tailored backdrop blurs, luminous borders (`emerald-500` & `indigo-500`), and balanced visual hierarchy.
- **Fluid Micro-Interactions**: Motion-driven route transitions, hover lift effects, and accessible loading states.
- **Dual-Themed Adaptation**: Seamless support for both light and dark modes across user-facing layouts.

---

## 🏗️ Architecture & Technology Stack

```
                        ┌────────────────────────────────────────┐
                        │              LensDrop Web              │
                        │   (React 19 + TypeScript + Vite 6)     │
                        └───────────────────┬────────────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
               ▼                            ▼                            ▼
      ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
      │   Client Core   │          │   Media Engine  │          │ Security & Data │
      ├─────────────────┤          ├─────────────────┤          ├─────────────────┤
      │ • React Router 7│          │ • Image Compress│          │ • Firebase Auth │
      │ • Tailwind v4   │          │ • Cloudinary CDN│          │ • Cloud Firestore│
      │ • Motion        │          │ • JSZip / Saver │          │ • Firebase Store│
      │ • Lucide Icons  │          │ • QRCode.React  │          │ • RBAC Guards   │
      └─────────────────┘          └─────────────────┘          └─────────────────┘
```

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Functional architecture, modern hooks, declarative rendering |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) | End-to-end type safety, strict typing for events & users |
| **Build Tooling** | [Vite 6](https://vitejs.dev/) | Sub-millisecond HMR, optimized tree-shaken production bundle |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern CSS utility-first design, fluid responsive grid |
| **Animations** | [Motion (Framer)](https://motion.dev/) | Layout animations, stagger transitions, fluid modals |
| **Identity & Database** | [Firebase v12](https://firebase.google.com/) | Auth (Email + Google SSO), Cloud Firestore real-time subscriptions |
| **Media Handling** | `browser-image-compression` + `jszip` | Client-side compression, asynchronous bundle packaging |
| **Icons & Indicators** | [Lucide React](https://lucide.dev/) | Standardized, accessible SVG iconography |

---

## 📁 Directory Structure

```text
lensdrop/
├── public/                     # Public static assets & favicon
├── src/
│   ├── components/             # Reusable UI & presentation components
│   │   ├── admin/              # Dedicated admin view controls
│   │   ├── AdminSidebar.tsx    # Responsive slide-over admin navigation
│   │   ├── AuthForm.tsx        # Reusable credentials interface
│   │   ├── ConfirmModal.tsx    # Glassmorphism danger confirmation modal
│   │   ├── DigitalInvite.tsx   # Interactive wedding digital invitation
│   │   ├── ImageGrid.tsx       # Masonry-style media display grid
│   │   ├── InvitationGenerator.tsx # Invitation builder modal
│   │   ├── Loader.tsx          # Dynamic orbital glassmorphic spinner
│   │   ├── Navbar.tsx          # Public header navigation
│   │   ├── ProfileMenu.tsx     # Floating profile & session menu
│   │   ├── QRGenerator.tsx     # High-contrast live QR render card
│   │   ├── Sidebar.tsx         # User dashboard navigation
│   │   └── UploadZone.tsx      # Multi-file drag & drop container
│   ├── contexts/
│   │   └── AuthContext.tsx     # Global Firebase auth, user state & RBAC
│   ├── lib/
│   │   ├── toast.ts            # Standardized notification dispatches
│   │   └── utils.ts            # Class merging & general utilities
│   ├── pages/
│   │   ├── admin/              # Sub-routes for the Super Admin panel
│   │   │   ├── AdminEvents.tsx # Global platform events inspector
│   │   │   ├── AdminSettings.tsx # Maintenance mode & signup controls
│   │   │   └── AdminUsers.tsx  # User directory with ban & purge actions
│   │   ├── settings/           # User configuration pages
│   │   │   ├── AppearanceSettings.tsx
│   │   │   ├── LegalSettings.tsx
│   │   │   ├── ProfileSettings.tsx
│   │   │   ├── SecuritySettings.tsx
│   │   │   └── SupportSettings.tsx
│   │   ├── AdminDashboard.tsx  # Admin overview & live platform metrics
│   │   ├── Dashboard.tsx       # Host event management & creation suite
│   │   ├── EventAdmin.tsx      # Host control panel for a specific event
│   │   ├── EventGallery.tsx    # Live guest gallery & photo stream
│   │   ├── Home.tsx            # High-conversion landing page
│   │   ├── Login.tsx           # Authentication portal (Email & Google)
│   │   └── Signup.tsx          # Registration flow
│   ├── firebase.ts             # Firebase client initialization
│   ├── index.css               # Global Tailwind CSS imports & theme overrides
│   ├── main.tsx                # Application bootstrap entry
│   └── App.tsx                 # Route declarations & shell layout
├── metadata.json               # AI Studio project manifest & capabilities
├── package.json                # Project dependencies and script runner
├── tsconfig.json               # TypeScript compiler rules
└── vite.config.ts              # Vite plugins and server bindings
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` (v9+) or `pnpm` / `yarn`
- **Firebase Project**: With Authentication (Email & Google Provider) and Cloud Firestore enabled.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/pkskkumar900-debug/LensDrop.git
cd LensDrop
npm install
```

### 2. Configure Environment
Create a `.env` file in the project root:
```env
# Cloudinary CDN Configuration (Optional for cloud media hosting)
VITE_CLOUDINARY_CLOUD_NAME="your_cloud_name"
VITE_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"

# Application URL
APP_URL="http://localhost:3000"
```

> **Note**: Firebase configuration keys reside in `src/firebase.ts`. For production, ensure your Firestore Security Rules allow authenticated users to manage their own events and public visitors to append media to valid event IDs.

### 3. Start Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:3000` to view the running app.

### 4. Build for Production
```bash
npm run build
```
This runs the TypeScript check (`tsc -b`) and bundles static assets into `dist/` with optimized chunk splitting.

---

## 🔐 Authentication & Role-Based Access Control (RBAC)

LensDrop enforces strict route gating:

1. **Public Routes**:
   - `/`: Landing page with feature showcases and demo invites.
   - `/login` & `/signup`: Auth gateways with smart redirects.
   - `/event/:id`: Guest photo upload and live community stream.
2. **Authenticated Host Routes**:
   - `/dashboard`: Event creation, host metrics, and collection links.
   - `/upload/:id`: Dedicated host management console for an individual event.
   - `/settings/*`: Personal profile, security, and appearance settings.
3. **Super Admin Routes**:
   - `/admin/dashboard`: Platform overview & real-time analytics.
   - `/admin/users`: User directory, ban enforcement, and account deletion.
   - `/admin/events`: Network-wide event auditing.
   - `/admin/settings`: Global maintenance and registration toggles.

> **Admin Privilege Check**:  
> Users matching the verified admin email (`pkskkumar900@gmail.com`) or bearing an active administrator claim are automatically routed to the emerald-accented Super Admin Console upon sign-in.

---

## 📋 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Boots the Vite development server bound to `0.0.0.0:3000` |
| `npm run build` | Compiles TypeScript and builds optimized production bundles to `dist/` |
| `npm run preview` | Spins up a local preview server of the built `dist/` directory |
| `npm run lint` | Runs `tsc --noEmit` to validate types without writing outputs |
| `npm run clean` | Deletes the `dist/` build directory |

---

## 🔒 Security Best Practices

- **Client-Side Sanitation**: File uploads are verified for MIME types (`image/*`, `video/*`) prior to buffer generation.
- **Direct-to-Cloud Uploads**: Heavy image payloads bypass intermediate proxy servers to optimize performance.
- **Persistent Sessions**: User tokens are managed securely via Firebase Auth and validated on every protected route mount.

---

## 🤝 Contributing

Contributions make the open-source community a fantastic place to learn, inspire, and create:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Connect & Support

Created by **Prince Raj**

- **GitHub**: [@pkskkumar900-debug](https://github.com/pkskkumar900-debug)
- **LinkedIn**: [Prince Raj](https://www.linkedin.com/in/prince-raj-ba4b973b3)
- **Instagram**: [@princerjjjjj](https://www.instagram.com/princerjjjjj)

---

<div align="center">
  <sub>Built with ❤️ for every smile, every tear, and every unforgettable memory.</sub>
</div>
