# 🌩️ CloudyFiles - Cloud File Manager

A modern, responsive cloud file management application built with Next.js 15, React 19, and TypeScript. Features a beautiful dark-themed UI, secure authentication, and seamless file operations with AWS S3 integration.

## ✨ Features

### 🔐 Authentication
- **Clerk Integration**: Secure user authentication with modal sign-up/sign-in
- **Route Protection**: Automatic redirection based on authentication status
- **Landing Page**: Beautiful marketing page for unauthenticated users

### 📁 File Management
- **File Explorer**: Intuitive file and folder navigation
- **File Operations**: Upload, download, delete, and organize files
- **File Types**: Support for documents, images, videos, and audio files
- **File Viewer**: Built-in preview for supported file types
- **Breadcrumb Navigation**: Easy navigation through folder structure

### 🎨 User Interface
- **Dark Theme**: Modern dark UI that's easy on the eyes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Mobile-First**: Native app-like experience on mobile devices
- **Animations**: Smooth transitions and engaging micro-interactions
- **Shadcn/UI Components**: Beautiful, accessible UI components

### 📱 Mobile Experience
- **Mobile Sidebar**: Collapsible navigation optimized for touch
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Progressive Layout**: Content adapts seamlessly to screen sizes
- **Full-Width Utilization**: Optimal use of available screen space

### ☁️ Cloud Integration
- **AWS S3**: Secure cloud storage with presigned URLs
- **File Categorization**: Automatic organization by file type
- **Scalable Storage**: Enterprise-grade cloud infrastructure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- AWS S3 bucket (for file storage)
- Clerk account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cloud-file-manager.git
   cd cloud-file-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_s3_bucket_name
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.5**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling with custom animations
- **Shadcn/UI**: Modern, accessible component library

### Authentication
- **Clerk**: Complete authentication solution with social logins
- **Route Protection**: Automatic authentication guards

### Backend & Storage
- **AWS S3**: Scalable object storage
- **AWS SDK v3**: Modern AWS JavaScript SDK
- **Presigned URLs**: Secure file upload/download

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization
- **Turbopack**: Fast development builds

## 📂 Project Structure

```
cloud-file-manager/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (pages)/           # Page routes
│   │   │   └── Landing/       # Landing page for unauthenticated users
│   │   ├── api/               # API routes
│   │   │   └── objects/       # S3 file operations
│   │   ├── globals.css        # Global styles and animations
│   │   ├── layout.tsx         # Root layout with authentication
│   │   └── page.tsx           # Main dashboard page
│   ├── components/            # React components
│   │   └── ui/               # Shadcn/UI components
│   │       ├── button.tsx    # Button component
│   │       └── Navbar.tsx    # Navigation component
│   ├── lib/                  # Utility functions
│   │   └── utils.ts          # Helper utilities
│   └── middleware.ts         # Clerk middleware
├── public/                   # Static assets
├── components.json           # Shadcn/UI configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json            # Project dependencies
```

## 🎯 Key Components

### Authentication Flow
```typescript
// layout.tsx - Authentication-based routing
<ClerkProvider>
  <SignedOut>
    <LandingPage />
  </SignedOut>
  <SignedIn>
    {children}
  </SignedIn>
</ClerkProvider>
```

### File Operations
```typescript
// API route for S3 operations
POST /api/objects    # Upload files
GET /api/objects     # List files
DELETE /api/objects  # Delete files
```

### Responsive Design
```css
/* Mobile-first responsive classes */
.file-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}
```

## 🌟 Features in Detail

### Landing Page
- **Hero Section**: Compelling value proposition with animations
- **Feature Showcase**: Highlight key benefits and capabilities
- **Trust Indicators**: Social proof and reliability metrics
- **Call-to-Action**: Direct sign-up flow with Clerk modal

### File Explorer
- **Folder Navigation**: Hierarchical folder structure
- **File Type Filtering**: Filter by documents, images, videos, audio
- **Search Functionality**: Find files quickly
- **Batch Operations**: Select and manage multiple files

### Mobile Optimization
- **Sidebar Navigation**: Collapsible mobile menu
- **Touch Gestures**: Swipe and tap interactions
- **Responsive Grids**: Adaptive layout for different screen sizes
- **Full-Screen Modals**: Optimized modal experiences

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment
```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## 🔧 Configuration

### AWS S3 Setup
1. Create an S3 bucket
2. Configure CORS policy for web uploads
3. Set up IAM user with S3 permissions
4. Add credentials to environment variables

### Clerk Setup
1. Create a Clerk application
2. Configure sign-in/sign-up pages
3. Add social login providers (optional)
4. Set up webhooks for user events

## 🎨 Customization

### Theming
```css
/* Custom color scheme in globals.css */
:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --background: #0f172a;
  --foreground: #f8fafc;
}
```

### Animations
```css
/* Custom animations */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## 📱 Browser Support

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.dev/) - Authentication platform
- [AWS S3](https://aws.amazon.com/s3/) - Cloud storage
- [Shadcn/UI](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icon library

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

<div align="center">
  <p>Made with ❤️ by the Krish Jain</p>
  <p>
    <a href="#-cloudyfiles---cloud-file-manager">Back to Top</a>
  </p>
</div>
