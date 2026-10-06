import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Rocket } from "lucide-react";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState(["all"]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects`);
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        activeFilters.includes("all") || 
        p.technologies?.some((tag) => activeFilters.includes(tag));

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilters, projects]);

  const allTags = useMemo(() => {
    const tags = new Set(["all"]);
    projects.forEach(p => {
      if (p.technologies) {
        p.technologies.forEach(t => tags.add(t));
      }
    });
    return Array.from(tags).slice(0, 8); // Limit to top 8 filters to avoid clutter
  }, [projects]);

  const handleFilterClick = (filter) => {
    if (filter === "all") {
      setActiveFilters(["all"]);
      return;
    }
    setActiveFilters((prev) => {
      const withoutAll = prev.filter((f) => f !== "all");
      if (withoutAll.includes(filter)) {
        const next = withoutAll.filter((f) => f !== filter);
        return next.length === 0 ? ["all"] : next;
      }
      return [...withoutAll, filter];
    });
  };

  return (
    <section className="section-container min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A collection of cloud-native applications and scalable pipelines.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col gap-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by tech or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 rounded-lg bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 focus:border-emerald-500 transition-all outline-none shadow-sm text-sm"
              />
            </div>
            {!loading && (
              <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm font-bold border border-slate-200 dark:border-slate-700">
                Showing {filteredProjects.length} Projects
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {allTags.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all duration-300 border ${
                  activeFilters.includes(filter)
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm"
                    : "bg-white dark:bg-[#0a0a0a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {loading ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold">
                Loading projects...
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-slate-900 mb-6">
                  <Rocket size={48} className="text-slate-400 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">No projects found</h3>
                <p className="text-slate-500">Try broadening your search or switching filters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;