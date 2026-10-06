import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  BadgeCheck,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

const HeroContent = () => {
  const { profile } = useProfile();
  return (
    <div className="flex flex-col justify-center">

      {/* Availability Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 text-xs font-mono text-slate-600 dark:text-slate-300"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        AVAILABLE FOR HIRE
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl font-black tracking-tight leading-[1.1] md:text-6xl lg:text-7xl text-slate-900 dark:text-white"
      >
        Rameshwar Mane.
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-6 text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-400"
      >
        Cloud Engineer • DevOps • Software Developer
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-slate-500 dark:text-slate-400"
      >
        Building cloud-native applications, automated infrastructure, and reliable deployment pipelines. Passionate about leveraging Kubernetes, AWS, and modern software engineering practices to solve complex technical challenges.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-10 flex flex-wrap gap-4"
      >
        <a href="#projects" className="btn-primary">
          View Projects
          <ArrowRight size={18} />
        </a>

        <Link
          to="/resume"
          className="btn-secondary"
        >
          <Download size={18} />
          View Resume
        </Link>

        <a href="#contact" className="btn-secondary">
          <Mail size={18} />
          Contact
        </a>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-10 flex items-center gap-4"
      >
        <a
          href={profile?.github || "https://github.com/rameshwar8767"}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card rounded-full p-4 transition hover:-translate-y-1"
          aria-label="GitHub"
        >
          <Github size={22} />
        </a>

        <a
          href={profile?.linkedin || "https://www.linkedin.com/in/manerameshwar/"}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card rounded-full p-4 transition hover:-translate-y-1"
          aria-label="LinkedIn"
        >
          <Linkedin size={22} />
        </a>
      </motion.div>

      {/* Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        className="mt-12 flex flex-wrap gap-3"
      >
        {[
          "AWS Certified",
          "Kubernetes",
          "Docker",
          "Jenkins CI/CD",
          "Node.js",
          "Linux",
        ].map((item) => (
          <span
            key={item}
            className="rounded border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono font-medium shadow-sm dark:border-slate-800 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroContent;