import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar, ShieldCheck } from "lucide-react";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/certifications");
        const data = await res.json();
        if (data.success) {
          setCertifications(data.data);
        }
      } catch (error) {
        console.error("Failed to load certifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  return (
    <section className="section-container relative overflow-hidden min-h-screen">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:20px_20px] opacity-40 -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Certifications
          </motion.h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Professional validations of my technical skills and industry knowledge.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold">
            Loading certifications...
          </div>
        ) : certifications.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            No certifications found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] p-6 lg:p-8 overflow-hidden transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#111] text-emerald-500 group-hover:scale-110 transition-transform duration-300 border border-slate-200 dark:border-slate-800">
                        <Award size={24} />
                      </div>
                      <ShieldCheck className="text-slate-200 dark:text-slate-800" size={32} />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-emerald-500 transition-colors">
                      {cert.name}
                    </h3>
                    
                    <div className="flex flex-col gap-2 mt-4">
                      <p className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider text-xs">
                        {cert.organization}
                      </p>
                      {cert.issueDate && (
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <Calendar size={14} />
                          {cert.issueDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Links Section */}
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4">
                    {cert.certificateUrl && (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors"
                      >
                        VIEW CERTIFICATE
                        <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors"
                      >
                        VERIFY CREDENTIAL
                        <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;