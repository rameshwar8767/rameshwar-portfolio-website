import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaDocker,
  FaAws,
  FaGitAlt,
  FaLinux,
  FaGithub,
} from "react-icons/fa";

import {
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiKubernetes,
  SiJenkins,
  SiGrafana,
} from "react-icons/si";

const technologies = [
  {
    name: "AWS",
    icon: FaAws,
    color: "text-orange-500",
  },
  {
    name: "Docker",
    icon: FaDocker,
    color: "text-blue-500",
  },
  {
    name: "Kubernetes",
    icon: SiKubernetes,
    color: "text-blue-600",
  },
  {
    name: "Jenkins",
    icon: SiJenkins,
    color: "text-red-500",
  },
  {
    name: "Node.js",
    icon: FaNodeJs,
    color: "text-green-500",
  },
  {
    name: "React",
    icon: FaReact,
    color: "text-sky-500",
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    color: "text-green-600",
  },
  {
    name: "Grafana",
    icon: SiGrafana,
    color: "text-orange-500",
  },
  {
    name: "Linux",
    icon: FaLinux,
    color: "text-yellow-500",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    color: "text-slate-800 dark:text-white",
  },
  {
    name: "Tailwind",
    icon: SiTailwindcss,
    color: "text-cyan-500",
  },
];

const HeroTechStack = () => {
  return (
    <section className="mt-16">

      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 text-center text-lg font-semibold uppercase tracking-[4px] text-slate-500"
      >
        Technologies I Work With
      </motion.h3>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {technologies.map((tech, index) => {
          const Icon = tech.icon;

          return (
            <motion.div
              key={tech.name}
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                y: -8,
                scale: 1.05,
              }}
              className="glass-card group flex flex-col items-center rounded-3xl p-6"
            >
              <Icon
                size={42}
                className={`${tech.color} transition-transform duration-300 group-hover:scale-110`}
              />

              <h4 className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">
                {tech.name}
              </h4>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
};

export default HeroTechStack;