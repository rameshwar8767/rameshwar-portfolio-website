import { Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
  Navigate
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { ThemeProvider } from "./contexts/ThemeContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Certifications from "./pages/Certifications";
import Contact from "./pages/Contact";
import Experience from "./pages/Experience";
import ResumeViewer from "./pages/ResumeViewer";

import { AuthProvider } from "./contexts/AuthContext";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsManager from "./pages/admin/ProjectsManager";
import CertificationsManager from "./pages/admin/CertificationsManager";
import ExperienceManager from "./pages/admin/ExperienceManager";
import SkillsManager from "./pages/admin/SkillsManager";
import ProfileManager from "./pages/admin/ProfileManager";
import EducationManager from "./pages/admin/EducationManager";
import MessagesManager from "./pages/admin/MessagesManager";

/**
 * Scroll to top whenever route changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

/**
 * Application Routes
 */
function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resume" element={<ResumeViewer />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/projects" element={<ProjectsManager />} />
              <Route path="/admin/certifications" element={<CertificationsManager />} />
              <Route path="/admin/experience" element={<ExperienceManager />} />
              <Route path="/admin/skills" element={<SkillsManager />} />
              <Route path="/admin/profile" element={<ProfileManager />} />
              <Route path="/admin/education" element={<EducationManager />} />
              <Route path="/admin/messages" element={<MessagesManager />} />
              {/* Other admin routes will go here */}
            </Route>
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <section className="section-container flex min-h-[70vh] items-center justify-center">
                <div className="glass-card max-w-lg animate-float p-12 text-center">
                  <h1 className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-8xl font-black text-transparent">
                    404
                  </h1>

                  <h2 className="mb-4 text-2xl font-bold">
                    Page Not Found
                  </h2>

                  <p className="mb-8 text-slate-600 dark:text-slate-400">
                    The page you are trying to access doesn't exist or may have
                    been moved.
                  </p>

                  <Link
                    to="/"
                    className="btn-primary inline-flex items-center justify-center"
                  >
                    Back to Home
                  </Link>
                </div>
              </section>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

/**
 * Root Application
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-950 text-slate-100">
            {/* Navigation (Only show on public routes ideally, but for now we keep it and hide it in CSS or let it be) */}
            <Routes>
              <Route path="/admin/*" element={null} />
              <Route path="/resume" element={null} />
              <Route path="*" element={<Navbar />} />
            </Routes>

            {/* Scroll Restoration */}
            <ScrollToTop />

            {/* Main Content */}
            <main
              id="main-content"
              className="relative z-10 flex-1"
            >
              <AppRoutes />
            </main>

            {/* Footer */}
            <Routes>
              <Route path="/admin/*" element={null} />
              <Route path="/resume" element={null} />
              <Route path="*" element={<Footer />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}