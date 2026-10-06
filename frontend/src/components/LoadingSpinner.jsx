import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-24 h-24 rounded-full border border-cyan-500/30"
        />

        {/* Middle Spinning Hexagon-ish Frame */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-16 h-16 rounded-xl border-2 border-dashed border-indigo-500/40"
        />

        {/* Core Spinning Gradient Spinner */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-12 h-12 rounded-full border-t-4 border-r-4 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        />
      </div>

      {/* Loading Text with Typewriter-style Opacity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-12 flex flex-col items-center gap-2"
      >
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
        >
          Initializing Portfolio
        </motion.span>
        
        <div className="h-1 w-32 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            animate={{ x: [-128, 128] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;