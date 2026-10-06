import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  ArrowUp,
  Terminal
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";

const Footer = () => {
  const { profile } = useProfile();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
      setScrollProgress(progress);
      
      // Show/hide "back to top" logic based on scroll position
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialLinks = [
    { icon: Github, url: profile?.github || "https://github.com/rameshwar8767", label: "GitHub" },
    { icon: Linkedin, url: profile?.linkedin || "https://www.linkedin.com/in/manerameshwar/", label: "LinkedIn" },
    { icon: Mail, url: "mailto:manerameshwar909@gmail.com", label: "Email" }
  ];

  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Certifications", href: "#certifications" },
        { label: "Contact", href: "#contact" },
        { label: "Resume", href: "/resume" }
      ]
    }
  ];

  return (
    <footer className="relative mt-24 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
      {/* Animated Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-slate-900 dark:bg-emerald-500"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black font-mono">
                RM
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                rameshwar<span className="text-emerald-500">.dev</span>
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              Turning complex problems into elegant, high-performance web solutions. Based in India, working worldwide.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-[#111] text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <s.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Spacer for Desktop Grid alignment */}
          <div className="hidden lg:block"></div>

          {/* Links Columns */}
          {footerLinks.map((col, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-500 font-medium transition-all"
                    >
                      <span className="w-0 group-hover:w-4 h-[1.5px] bg-emerald-500 transition-all duration-300" />
                      {link.label}
                      {link.external && <ExternalLink size={12} className="opacity-40" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-xs text-slate-500 font-medium">
            © {currentYear} Rameshwar Mane. All rights reserved.
          </p>

          <AnimatePresence>
            {isVisible && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 p-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl z-50 hover:-translate-y-2 transition-transform active:scale-95 group"
              >
                <ArrowUp size={20} className="group-hover:animate-bounce" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </footer>
  );
};

export default Footer;