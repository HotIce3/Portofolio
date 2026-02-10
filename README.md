# 🚀 Filbert Matthew - Portfolio Website

A modern, fullstack portfolio website built with React, Node.js, and PostgreSQL. Features a beautiful minimalist design with dark/light mode and multi-language support.

## ✨ Features

- **Modern Design** - Clean, minimalist, and professional
- **Dark/Light Mode** - Toggle between themes
- **Multi-language** - English and Indonesian support
- **Admin Panel** - Manage projects, messages, and profile
- **Contact Form** - Receive messages from visitors
- **Responsive** - Looks great on all devices
- **SEO Optimized** - Meta tags and structured data
- **Fast** - Built with Vite for blazing fast performance

## 🛠️ Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- i18next

### Backend

- Node.js
- Express.js
- PostgreSQL (Neon)
- JWT Authentication
- bcrypt

### Deployment

- Vercel (Frontend + Serverless Functions)
- Neon (PostgreSQL Database)

## 📦 Project Structure

```
filbert-matthew-portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── i18n/          # Translations
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── ...
├── server/                 # Node.js backend
│   └── src/
│       ├── db/            # Database config & migrations
│       ├── middleware/    # Express middleware
│       └── routes/        # API routes
└── vercel.json            # Vercel configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/filbertmatthew/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Server (.env):

   ```bash
   cd server
   cp .env.example .env
   ```

   Edit `server/.env`:

   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

4. **Run database migrations**

   ```bash
   npm run db:migrate
   ```

5. **Seed the database (optional)**

   ```bash
   npm run db:seed
   ```

6. **Start development servers**

   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

### Default Admin Credentials

After seeding the database:

- **Email:** filbertmathew63@gmail.com
- **Password:** admin123

## 🌐 Deployment to Vercel

### 1. Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project and database
3. Copy the connection string

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Import the project to Vercel
3. Configure environment variables:
   - `DATABASE_URL` - Neon connection string
   - `JWT_SECRET` - Random secure string
   - `JWT_EXPIRES_IN` - e.g., "7d"
   - `NODE_ENV` - "production"
   - `CLIENT_URL` - Your Vercel domain

4. Deploy!

### 3. Run Migrations on Production

After deployment, run migrations via Vercel CLI or connect to your database:

```bash
npm run db:migrate
npm run db:seed
```

## 📝 API Endpoints

### Public

- `GET /api/profile` - Get profile info
- `GET /api/projects` - List projects
- `GET /api/projects/slug/:slug` - Get project by slug
- `POST /api/contact` - Submit contact form

### Protected (Admin)

- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/admin/stats` - Dashboard statistics
- `CRUD /api/admin/skills` - Manage skills
- `CRUD /api/admin/experiences` - Manage experiences
- `CRUD /api/admin/education` - Manage education
- `CRUD /api/admin/testimonials` - Manage testimonials

## 🎨 Customization

### Colors

Edit `client/tailwind.config.js` to change the primary color:

```js
colors: {
  primary: {
    500: '#3b82f6', // Your color
    // ...
  }
}
```

### Translations

Edit files in `client/src/i18n/locales/`:

- `en.json` - English
- `id.json` - Indonesian

### Profile

Use the admin panel at `/admin/profile` to update your information.

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 👤 Author

**Filbert Matthew**

- Email: filbertmathew63@gmail.com
- GitHub: [@filbertmatthew](https://github.com/HotIce3/)
- LinkedIn: [filbertmatthew](https://www.linkedin.com/in/fil-mat-b21958337/)

---

Made with ❤️ by Filbert Matthew
