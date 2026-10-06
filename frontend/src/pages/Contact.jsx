import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  User,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";

const Contact = () => {
  const { profile } = useProfile();
  const formRef = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: profile?.github || "https://github.com/rameshwar8767",
      color: "hover:text-slate-900 dark:hover:text-white"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: profile?.linkedin || "https://www.linkedin.com/in/manerameshwar/",
      color: "hover:text-blue-600"
    },
  ];

  return (
    <section className="section-container relative min-h-screen overflow-hidden">
      {/* Minimal Background Decor */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Let's Start a Conversation
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Have a project in mind or just want to say hi? My inbox is always open.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* LEFT: INFO & SOCIALS */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] shadow-sm"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#111] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-500">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Email Me At</p>
                  <a href="mailto:manerameshwar909@gmail.com" className="text-lg font-bold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors">
                    manerameshwar909@gmail.com
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Follow My Work</p>
                <div className="grid grid-cols-1 gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-slate-800 transition-all group hover:border-slate-400 dark:hover:border-slate-600 ${link.color}`}
                    >
                      <div className="flex items-center gap-3 font-bold">
                        <link.icon size={20} />
                        {link.name}
                      </div>
                      <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl relative overflow-hidden"
            >
              <Sparkles className="absolute top-4 right-4 opacity-20 text-emerald-500" size={40} />
              <h4 className="text-xl font-black mb-2">Available for Hire</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                I'm currently looking for new opportunities. Let's build something extraordinary!
              </p>
            </motion.div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 p-8 lg:p-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] shadow-sm relative"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-slate-500">Thanks for reaching out, Rameshwar will get back to you soon.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 text-sm font-bold text-emerald-500 hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <User size={14} /> Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-lg bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Mail size={14} /> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 rounded-lg bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <MessageCircle size={14} /> Your Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      placeholder="Tell me about your project or just say hi..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 rounded-lg bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors resize-none text-sm"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === "loading"}
                    className="w-full py-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-3 disabled:opacity-50 transition-transform"
                  >
                    {status === "loading" ? (
                      <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        SEND MESSAGE
                      </>
                    )}
                  </motion.button>

                  {status === "error" && (
                    <p className="text-center text-red-500 font-bold text-sm">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;