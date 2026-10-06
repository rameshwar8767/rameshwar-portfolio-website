import { motion } from "framer-motion";
import { Cloud, GitMerge } from "lucide-react";

const HeroProfile = ({ image }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex justify-center w-full max-w-lg mx-auto"
    >
      {/* Background Decor */}
      <div className="absolute top-10 -right-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-10 -left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="w-full relative z-10 group mt-8 flex justify-center">

        {/* Main Profile Image Circular Window */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
          {/* Animated Tech Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30 dark:border-emerald-500/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-slate-200 dark:border-slate-800 border-t-emerald-500/50"
          />

          <div className="absolute inset-2 overflow-hidden rounded-full border-4 border-white dark:border-[#0a0a0a] shadow-2xl bg-slate-100 dark:bg-slate-900 transition-transform duration-500 group-hover:scale-105">
            {image ? (
              <img
                src={image}
                alt="Rameshwar Mane"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-slate-400 font-mono text-sm">Image Not Found</span>
              </div>
            )}
          </div>
        </div>

        {/* Floating Stat Badges */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute -left-6 top-12 p-3 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-3"
        >
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Cloud size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">AWS</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Certified</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="absolute -right-6 bottom-16 p-3 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-3"
        >
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <GitMerge size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">CI/CD</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Automated</p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default HeroProfile;