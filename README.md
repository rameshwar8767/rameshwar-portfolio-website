# Personal Portfolio Website

A modern, responsive, and full-stack personal portfolio website designed to showcase projects, skills, and professional experience. Built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS, featuring smooth animations using Framer Motion.

## 🚀 Features

- **Modern UI/UX**: Sleek design with Tailwind CSS and responsive layout for all devices.
- **Interactive Animations**: Engaging transitions and animations powered by Framer Motion.
- **Full-Stack Architecture**: Separate frontend and backend directories for scalable development.
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing.
- **Media Management**: Cloudinary integration for robust image storage and delivery.
- **Contact Form**: Integrated with EmailJS for seamless messaging.
- **SEO Optimized**: Fast performance with Vite and React.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React & React Icons
- **Routing**: React Router DOM
- **Utilities**: EmailJS for contact forms

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Uploads**: Multer & Cloudinary
- **Security**: CORS, Environment Variables (`dotenv`)

## 📂 Project Structure

```text
Portfolio/
├── backend/                # Express backend application
│   ├── middleware/         # Custom Express middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── utils/              # Helper functions
│   ├── uploads/            # Temporary local file uploads
│   └── server.js           # Backend entry point
├── frontend/               # React frontend application
│   ├── src/                # React components, pages, and assets
│   ├── public/             # Static public assets
│   ├── index.html          # HTML entry point
│   └── vite.config.js      # Vite configuration
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Cloudinary Account](https://cloudinary.com/) for image uploads

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Portfolio
```

### 2. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173 (Default Vite port)
- **Backend API**: http://localhost:5000 (Default Express port)

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
