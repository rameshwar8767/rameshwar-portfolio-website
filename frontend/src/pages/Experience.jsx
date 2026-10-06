import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Code2 } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const Experience = () => {
  const [experienceData, setExperienceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/experience`);
        const data = await response.json();
        if (data.success) {
          setExperienceData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch experience:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="section-container relative min-h-screen py-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Professional Experience
          </motion.h2>
        </div>

        {experienceData.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No experience records found.
          </div>
        ) : (
          <div className="space-y-12">
            {experienceData.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 md:pl-0"
              >
                <div className="p-8 md:p-10 relative overflow-hidden group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a]">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium mb-2">
                        <Briefcase size={16} className="text-emerald-500" />
                        {exp.company}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-1 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {exp.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {exp.responsibilities.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200 dark:border-slate-800">
                      {exp.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-slate-50 dark:bg-[#111] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
