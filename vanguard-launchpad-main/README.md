# Vanguard Marketing Website

A professional marketing website with comprehensive admin dashboard and content management system.

## Project Overview

This is a full-stack marketing website built with React, Node.js, and MongoDB. It features a modern UI with real-time content management capabilities.

## Features

### Frontend
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Real-time Updates**: Live content synchronization
- **Media Management**: Global media toggle and file uploads
- **Statistics Display**: Dynamic stats from admin dashboard

### Backend
- **RESTful API**: Express.js with MongoDB
- **Authentication**: JWT-based with secret token access
- **File Uploads**: Multer for media management
- **Real-time Sync**: Cache invalidation and data updates

### Admin Dashboard
- **Statistics Management**: Edit home page numbers
- **Media Management**: Upload and manage images/videos
- **Content Management**: Portfolio items, testimonials, branding
- **System Settings**: Global media toggle
- **Secret Access**: Secure admin login via token

## Tech Stack

### Frontend
- React 18.3.1
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- React Query
- React Router
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/habibabdulfetah230-maker/Vanguard-Marketing.git
cd Vanguard-Marketing
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

3. **Set up environment variables**
```bash
# Copy environment example
cp .env.example .env

# Edit .env with your configuration
```

4. **Start the development servers**
```bash
# Start backend server
npm run server:dev

# Start frontend server (in new terminal)
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Frontend
VITE_API_BASE_URL=http://localhost:5000/api

# Backend
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vanguard_launchpad
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1d

# Default Admin
DEFAULT_ADMIN_EMAIL=admin@vanguard.com
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_NAME=Super Admin
```

## Usage

### Public Access
- **Website**: `http://localhost:8080`
- **Portfolio**: View real work samples
- **Testimonials**: Client feedback
- **Contact**: Contact form

### Admin Access
- **Secret URL**: `http://localhost:8080/admin?token=vanguard-admin-secret-2024`
- **Statistics**: Edit home page numbers
- **Media**: Upload and manage files
- **Content**: Manage portfolio and testimonials
- **Settings**: Global media toggle

## Project Structure

```
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── lib/              # API utilities
│   ├── context/          # React contexts
│   └── hooks/            # Custom hooks
├── server/
│   ├── src/
│   │   ├── config/       # Server configuration
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── modules/      # Feature modules
├── uploads/              # File uploads
└── .env.example          # Environment template
```

## Deployment

### Production Setup

1. **Environment Configuration**
   - Set `NODE_ENV=production`
   - Update `MONGODB_URI` to production database
   - Set secure `JWT_SECRET`
   - Update `VITE_API_BASE_URL` to production API

2. **Build and Deploy**
```bash
# Build frontend
npm run build

# Start production server
npm run server
```

### Platform Deployment
The application is ready for deployment on:
- Vercel (Frontend)
- Render (Full-stack)
- DigitalOcean
- AWS
- Any Node.js hosting platform

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Content Management
- `GET /api/videos` - Get video projects
- `POST /api/videos` - Create video project
- `PUT /api/videos/:id` - Update video project
- `DELETE /api/videos/:id` - Delete video project

### Media Management
- `GET /api/media/settings` - Get media settings
- `PUT /api/media/settings` - Update media settings
- `POST /api/media/upload` - Upload media file
- `GET /api/media/items` - Get media items

### Statistics
- `GET /api/stats` - Get statistics
- `PUT /api/stats` - Update statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ for Vanguard Marketing
