import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, MapPin, Sparkles, ArrowRight, Github, Linkedin, FileText } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const About = () => {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, eduRes] = await Promise.all([
          fetch("http://localhost:5000/api/v1/profile"),
          fetch("http://localhost:5000/api/v1/education")
        ]);
        
        const profileData = await profileRes.json();
        const eduData = await eduRes.json();

        if (profileData.success) setProfile(profileData.data);
        if (eduData.success) setEducation(eduData.data);
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Get highest education for stats
  const highestEdu = education.length > 0 ? education[0] : null;

  const stats = [
    { label: "Role", value: profile?.title || "Developer" },
    { label: "Location", value: "Pune, India" }, // Could come from profile if added
    { label: "Degree", value: highestEdu ? highestEdu.degree : "N/A" },
    { label: "Grade", value: highestEdu && highestEdu.grade ? highestEdu.grade : "N/A" },
  ];

  return (
    <section className="min-h-screen py-24 px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-20 dark:opacity-40 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col items-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-black uppercase tracking-[0.3em] mb-4 border border-cyan-500/20"
          >
            Introduction
          </motion.div>
          <h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white text-center tracking-tight"
          >
            {profile?.title ? `Engineering Scalable\n${profile.title} Solutions.` : 'Software Engineering\n& Development.'}
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start mb-24">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 sticky top-24 flex justify-center lg:justify-start"
          >
            <div className="relative group w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors duration-500 shadow-[0_0_30px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]" />

              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white dark:border-[#0a0a0a] bg-slate-100 dark:bg-slate-900">
                <img
                  src={profile?.profileImageUrl || 'https://via.placeholder.com/400'}
                  alt={profile?.name || 'Profile'}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
              </div>

              <div className="absolute -bottom-2 -right-2 p-4 rounded-2xl bg-white/90 dark:bg-[#111]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">{profile?.name || 'Developer'}</h4>
                <div className="flex items-center gap-3 mt-2">
                  {profile?.github && <a href={profile.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-emerald-500 transition-colors"><Github size={14}/></a>}
                  {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-500 transition-colors"><Linkedin size={14}/></a>}
                  {profile?.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-red-500 transition-colors"><FileText size={14}/></a>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bio & Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-10"
          >
            <div className="space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              <p className="text-2xl font-medium text-slate-900 dark:text-slate-100">
                I'm a <span className="text-cyan-500 font-black italic">{profile?.title || 'Developer'}</span> based in India.
              </p>
              <p>
                {profile?.about || 'No description provided.'}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-6">
                {stats.map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div whileHover={{ y: -4 }} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] shadow-sm group">
                <GraduationCap className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Education</h3>
                {highestEdu ? (
                  <div className="text-sm text-slate-500 leading-relaxed">
                    <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">{highestEdu.degree}</div>
                    <div>{highestEdu.institution}</div>
                    <div className="text-emerald-500 font-bold mt-1">{highestEdu.grade}</div>
                  </div>
                ) : (
                   <p className="text-sm text-slate-500">No education listed.</p>
                )}
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] shadow-sm group">
                <Award className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Certifications</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Professional certifications bridging the gap between development and operations.
                </p>
                <a href="/certifications" className="text-xs font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2 hover:gap-3 transition-all">
                  Browse Gallery <ArrowRight size={14} />
                </a>
              </motion.div>
            </div>

            {/* Action CTA */}
            <div className="flex flex-wrap gap-4 pt-6">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/contact"
                className="btn-primary"
              >
                Let's Collaborate <Sparkles size={16} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/projects"
                className="btn-secondary"
              >
                View Projects
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Extended Education Timeline */}
        {education.length > 1 && (
            <div className="mt-24 pt-16 border-t border-slate-200 dark:border-slate-800">
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Academic Journey</h3>
               <div className="space-y-6">
                  {education.map(edu => (
                      <div key={edu._id} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a]">
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                              <div>
                                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">{edu.degree}</h4>
                                  <p className="text-slate-500">{edu.fieldOfStudy} • {edu.institution}</p>
                              </div>
                              <div className="text-right">
                                  <div className="text-sm font-bold text-emerald-500">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</div>
                                  <div className="text-xs text-slate-400 mt-1">{edu.grade}</div>
                              </div>
                          </div>
                      </div>
                  ))}
               </div>
            </div>
        )}
      </div>
    </section>
  );
};

export default About;