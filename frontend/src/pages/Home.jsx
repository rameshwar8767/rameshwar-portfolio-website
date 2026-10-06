import { motion } from "framer-motion";

import HeroContent from "../components/HeroContent";
import HeroProfile from "../components/HeroProfile";
import HeroStats from "../components/HeroStats";
import HeroTechStack from "../components/HeroTechStack";
import ScrollIndicator from "../components/ScrollIndicator";

import Projects from "./Projects";
import Skills from "./Skills";
import Certifications from "./Certifications";
import Contact from "./Contact";

import ProfileImage from "../assets/profile.jpg"; // Update path if needed

const Home = () => {
  return (
    <main className="relative overflow-hidden">

      {/* ================= Background ================= */}

      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle dot pattern or minimal background instead of heavy blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-20 dark:opacity-40" />
      </div>

      {/* ================= Hero ================= */}

      <section
        id="home"
        className="relative flex min-h-screen items-center py-24"
      >
        <div className="section-container">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Left */}

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <HeroContent />
            </motion.div>

            {/* Right */}

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <HeroProfile image={ProfileImage} />
            </motion.div>

          </div>

          {/* Stats */}

          <div className="mt-20">
            <HeroStats />
          </div>

          {/* Tech Stack */}

          <div className="mt-20">
            <HeroTechStack />
          </div>

        </div>

        {/* Scroll */}

        <ScrollIndicator />

      </section>

      {/* ================= Projects ================= */}

      <section id="projects">
        <Projects />
      </section>

      {/* ================= Skills ================= */}

      <section id="skills">
        <Skills />
      </section>

      {/* ================= Certifications ================= */}

      <section id="certifications">
        <Certifications />
      </section>

      {/* ================= Contact ================= */}

      <section id="contact">
        <Contact />
      </section>

    </main>
  );
};

export default Home;