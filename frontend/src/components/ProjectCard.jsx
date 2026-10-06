import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Code2, ArrowUpRight } from "lucide-react";

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      layout
      className="group flex flex-col h-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] rounded-xl hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden">
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <div className="flex gap-3">
             {project.technologies?.slice(0, 3).map((t, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/20">
                  {t}
                </span>
             ))}
          </div>
        </div>

        {/* Featured Tag */}
        {project.featured && (
          <div className="absolute top-4 left-4 z-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest shadow-lg">
            Featured
          </div>
        )}

        <img
          src={project.imageUrl || 'https://via.placeholder.com/800x600'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />
      </div>

      {/* Content Body */}
      <div className="p-6 lg:p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors duration-300">
            {project.title}
          </h3>
          <ArrowUpRight className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack - Bottom Aligned */}
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies?.map((tech, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 dark:bg-[#111] text-xs font-mono font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <ExternalLink size={16} />
                Demo
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-secondary w-full ${!project.liveUrl ? 'col-span-2' : ''}`}
              >
                <Github size={16} />
                Code
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;