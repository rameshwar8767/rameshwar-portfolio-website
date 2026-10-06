import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Monitor, Server, Cloud, CheckCircle2, Settings, Terminal, Database, Layers } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

// Helper function to pick an icon based on category name
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('cloud') || name.includes('devops')) return Cloud;
  if (name.includes('backend') || name.includes('server')) return Server;
  if (name.includes('frontend') || name.includes('ui') || name.includes('web')) return Monitor;
  if (name.includes('database') || name.includes('data')) return Database;
  if (name.includes('tool') || name.includes('git')) return Terminal;
  if (name.includes('language') || name.includes('programming')) return Code;
  return Layers;
};

const SkillBadge = ({ name }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111] transition-colors hover:border-slate-300 dark:hover:border-slate-700">
    <CheckCircle2 size={14} className="text-emerald-500" />
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {name}
    </span>
  </div>
);

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/skills");
        const data = await response.json();
        if (data.success) {
          setSkills(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills).sort();

  return (
    <section className="section-container relative py-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 dark:text-white"
          >
            Technical Arsenal
          </motion.h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl">
            My expertise spans cloud infrastructure, automated deployment pipelines, and full-stack software development.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No skills found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {categories.map((category, idx) => {
              const CategoryIcon = getCategoryIcon(category);
              const items = groupedSkills[category];

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a]"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#111] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                      <CategoryIcon size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {category}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <SkillBadge 
                        key={item._id} 
                        name={item.name} 
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;