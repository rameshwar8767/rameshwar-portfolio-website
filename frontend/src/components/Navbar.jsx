import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Download,
  Github,
  Linkedin,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useProfile } from "../hooks/useProfile";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/certifications", label: "Certifications" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { profile } = useProfile();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth >= 1280) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", esc);

    return () => window.removeEventListener("keydown", esc);
  }, []);

  useEffect(() => {
    let last = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;

      setScrolled(current > 20);

      if (current > last && current > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      last = current;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -120 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.35 }}
        className={`fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto rounded-xl transition-all duration-300
          ${
            scrolled
              ? "bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm"
              : "bg-transparent"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* ---------- LOGO ---------- */}

            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 dark:bg-white transition-transform group-hover:scale-105">
                <span className="text-lg font-black text-white dark:text-slate-900 font-mono">
                  RM
                </span>
              </div>
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                  rameshwar<span className="text-emerald-500">.dev</span>
                </h2>
              </div>
            </Link>

            {/* ---------- DESKTOP MENU ---------- */}

            <div className="hidden xl:flex items-center gap-6">
              <div className="flex items-center gap-6">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="relative z-10">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="nav-underline"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white"
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-300 dark:bg-slate-800" />

              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link
                to="/resume"
                className="btn-primary"
              >
                Resume
              </Link>
            </div>

            {/* ---------- MOBILE BUTTON ---------- */}

            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle Navigation"
              className="xl:hidden glass-card rounded-2xl p-3"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && ( 
                      <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[90] bg-slate-950/60 backdrop-blur-sm xl:hidden"
              />

              {/* Mobile Drawer */}
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 26,
                }}
                className="fixed right-0 top-0 z-[95] h-screen w-[320px] max-w-[90vw] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl xl:hidden"
              >
                <div className="flex h-full flex-col px-7 py-8">

                  {/* Header */}

                  <div className="flex items-center justify-between">

                    <div>
                      <h2 className="text-lg font-bold font-mono tracking-tight">
                        rameshwar<span className="text-emerald-500">.dev</span>
                      </h2>
                    </div>

                    <button
                      onClick={() => setOpen(false)}
                      className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X size={22} />
                    </button>

                  </div>

                  {/* Navigation */}

                  <div className="mt-12 flex flex-col gap-3">

                    {NAV_ITEMS.map((item) => (

                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `rounded-2xl px-5 py-4 text-lg font-semibold transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>

                    ))}

                  </div>

                  {/* Bottom */}

                  <div className="mt-auto">

                    <div className="mb-6 flex items-center gap-3">

                      <a
                        href={profile?.github || "https://github.com/rameshwar8767"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card rounded-xl p-3 hover:scale-110 transition"
                      >
                        <Github size={20} />
                      </a>

                      <a
                        href={profile?.linkedin || "https://www.linkedin.com/in/manerameshwar/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card rounded-xl p-3 hover:scale-110 transition"
                      >
                        <Linkedin size={20} />
                      </a>

                      <button
                        onClick={toggleTheme}
                        className="glass-card rounded-xl p-3 hover:scale-110 transition"
                      >
                        {theme === "dark" ? (
                          <Sun
                            size={20}
                            className="text-yellow-400"
                          />
                        ) : (
                          <Moon
                            size={20}
                            className="text-indigo-500"
                          />
                        )}
                      </button>

                    </div>

                    <Link
                      to="/resume"
                      className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3"
                    >
                      <Download size={18} />
                      View Resume
                    </Link>

                  </div>

                </div>

              </motion.aside>
            </>
          )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;