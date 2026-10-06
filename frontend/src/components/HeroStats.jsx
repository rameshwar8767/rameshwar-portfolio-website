import { motion } from "framer-motion";
import {
  Briefcase,
  Award,
  Cloud,
  Server,
} from "lucide-react";

const stats = [
  {
    id: 1,
    icon: Briefcase,
    value: "10+",
    label: "Projects Completed",
    color: "from-cyan-500 to-sky-500",
  },
  {
    id: 2,
    icon: Award,
    value: "AWS",
    label: "Cloud Practitioner",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 3,
    icon: Cloud,
    value: "MERN",
    label: "Full Stack Developer",
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 4,
    icon: Server,
    value: "DevOps",
    label: "Docker • Kubernetes",
    color: "from-indigo-500 to-violet-500",
  },
];

const HeroStats = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-14"
    >
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
            }}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className="glass-card p-6 rounded-3xl text-center group"
          >
            {/* Icon */}

            <div
              className={`mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br ${item.color}
              flex items-center justify-center shadow-lg`}
            >
              <Icon
                size={30}
                className="text-white"
              />
            </div>

            {/* Value */}

            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {item.value}
            </h3>

            {/* Label */}

            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              {item.label}
            </p>

            {/* Bottom Line */}

            <div className="mt-5 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: index * 0.2,
                }}
                className={`h-full bg-gradient-to-r ${item.color}`}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default HeroStats;