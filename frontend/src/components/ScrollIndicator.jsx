import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ScrollIndicator = () => {
  const scrollToNext = () => {
    const projectsSection = document.getElementById("projects");

    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: 2,
        duration: 0.8,
      }}
      className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
    >
      <motion.button
        onClick={scrollToNext}
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.95,
        }}
        className="group flex flex-col items-center gap-3 outline-none"
        aria-label="Scroll to Projects Section"
      >
        <span className="text-xs font-semibold uppercase tracking-[4px] text-slate-500 dark:text-slate-400">
          Scroll
        </span>

        {/* Mouse */}

        <div className="relative flex h-14 w-8 justify-center rounded-full border-2 border-cyan-500/40">
          <motion.div
            animate={{
              y: [0, 18, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "easeInOut",
            }}
            className="mt-2 h-3 w-1 rounded-full bg-cyan-500"
          />
        </div>

        {/* Arrow */}

        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
          }}
          className="rounded-full bg-cyan-500/10 p-2 text-cyan-500"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default ScrollIndicator;