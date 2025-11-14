import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Aurora from "./components/Aurora.jsx";

export default function Portfolio() {
  return (
    <>
      {/* Aurora Background */}
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.7}
        amplitude={1.2}
        speed={0.4}
      />

      {/* Main Content */}
      <div className="relative z-10 text-white">

        {/* HERO */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight mb-6"
          >
            Hi, I'm Jegan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl max-w-2xl text-gray-200 leading-relaxed"
          >
            I build thoughtful, user-focused web & mobile experiences — blending clean design,
            intelligent systems, and smooth interactions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex gap-4 justify-center"
          >
            <a
              href="#projects"
              className="px-6 py-3 bg-white text-black rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              View My Work
            </a>

            <a
              href="#contact"
              className="px-6 py-3 border border-white/40 text-white rounded-xl hover:bg-white/10 transition-all"
            >
              Contact
            </a>
          </motion.div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-24 px-6 md:px-20 text-center">
          <h2 className="text-4xl font-semibold mb-6">About Me</h2>

          <p className="max-w-2xl mx-auto text-gray-200 text-lg md:text-xl leading-relaxed">
            I’m a developer who cares deeply about design, performance, and clarity.
            I enjoy transforming complex ideas into seamless interactive experiences —
            from AI-powered tools to immersive 3D visualizations.
          </p>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-24 px-6 md:px-20 text-center">
          <h2 className="text-4xl font-semibold mb-12">Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                name: "Plaro",
                desc: "Educational social platform built using Flutter, Dart & Supabase.",
                link: "https://github.com/plaroindia/Project-Plaro",
                tech: ["Flutter", "Supabase", "Dart"],
              },
              {
                name: "Astrogators (3D Solar System)",
                desc: "Interactive 3D solar system simulation using Three.js.",
                link: "#",
                tech: ["Three.js", "WebGL"],
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
                <p className="text-gray-200 mb-4">{p.desc}</p>

                <a href={p.link} className="text-blue-300 font-medium hover:underline">
                  View Project
                </a>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-24 px-6 md:px-20 text-center">
          <h2 className="text-4xl font-semibold mb-8">Get In Touch</h2>

          <p className="max-w-xl mx-auto text-gray-200 mb-10">
            Open to collaborations, freelance work, or just meaningful conversations.
          </p>

          <div className="flex justify-center gap-10 text-white">
            <a href="mailto:thejegan31@gmail.com" className="hover:text-blue-300">
              <Mail size={32} />
            </a>
            <a href="https://github.com/yourgithub" className="hover:text-blue-300">
              <Github size={32} />
            </a>
            <a href="https://linkedin.com/in/thejegan" className="hover:text-blue-300">
              <Linkedin size={32} />
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10 text-center text-gray-300">
          © {new Date().getFullYear()} Jegan — Built with care & clarity.
        </footer>
      </div>
    </>
  );
}
