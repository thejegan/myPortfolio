import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Portfolio() {
  return (
    <div className="bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-16 md:py-32">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 text-white"
        >
          Hi, I'm <span className="text-blue-400">Jegan</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl max-w-2xl text-gray-300 mx-auto"
        >
          I create beautiful, user-friendly web and mobile apps, powered by AI and interactive design.
        </motion.p>
        <div className="mt-8 flex gap-4 justify-center">
          <a href="#projects" className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 transition">
            View My Work
          </a>
          <a href="#contact" className="border border-blue-400 text-blue-400 px-6 py-3 rounded-lg hover:bg-blue-500 hover:text-white transition">
            Contact Me
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-800 text-center px-6 md:px-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">About Me</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-400">
          I’m a developer focused on building apps that solve problems in smart, creative ways.  
          I’ve worked on AI models, interactive 3D web apps, and more. Let’s build something amazing together!
        </p>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-900 text-center px-6 md:px-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-blue-400 mb-8">Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Plaro",
              desc: "An educational social platform using Flutter,Dart and Supabase to connect learners and educators.",
              link: "#",
              tech: ["Flutter", "Supabase", "Dart"],
            },
            {
              name: "Astrogators (3D Solar System)",
              desc: "An interactive 3D simulation of the solar system using Three.js and WebGL.",
              link: "#",
              tech: ["Three.js", "WebGL"],
            },
          ].map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gray-700 shadow-lg rounded-lg p-6 hover:-translate-y-2 transition transform"
            >
              <h3 className="text-xl font-bold text-white">{project.name}</h3>
              <p className="text-gray-300 mt-2">{project.desc}</p>
              <div className="mt-4 text-blue-400">
                <a href={project.link} className="hover:underline">View Project</a>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {project.tech.map((tech) => (
                  <span key={tech} className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-800 text-center px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-white mb-6">Get In Touch</h2>
        <p className="text-gray-300 mb-8">I’m available for freelance work, collaborations, or full-time opportunities. Let’s create something awesome together!</p>
        <div className="flex justify-center gap-8 text-blue-400">
          <a href="mailto:thejegan31@gmail.com" className="hover:text-blue-500"><Mail size={28} /></a>
          <a href="https://github.com/yourgithub" target="_blank" rel="noreferrer" className="hover:text-blue-500"><Github size={28} /></a>
          <a href="https://linkedin.com/in/thejegan" target="_blank" rel="noreferrer" className="hover:text-blue-500"><Linkedin size={28} /></a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-gray-300 text-center">
        © {new Date().getFullYear()} Jegan. Built with ❤️ using React + Tailwind.
      </footer>
    </div>
  );
}
