// Portfolio.jsx
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { projectsData } from './data/projects.js';

// LAZY import of Plasma to reduce initial bundle on mobile
const Plasma = React.lazy(() => import('./components/Plasma'));

export default function Portfolio() {
  const visibleSections = useScrollAnimation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Decide whether to load/show Plasma. Keep conservative defaults on server.
  // Treat as "show on desktop" OR when a touch device should get desktop visuals (rare).
  const showPlasma = useMemo(() => {
    if (typeof window === 'undefined') return false;
    // show on wide viewports (desktop) OR on non-multi-touch devices (some tablets behave differently)
    return window.innerWidth >= 768 || ('ontouchstart' in window && navigator.maxTouchPoints <= 1);
  }, []);

  // stable plasma props so parent re-renders don't create new objects
  const plasmaProps = useMemo(
    () => ({
      color: '#6f00ff',
      speed: 0.3,
      direction: 'forward',
      scale: 0.8,
      opacity: 0.4,
      mouseInteractive: false,
    }),
    []
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Plasma Background (lazy-loaded) */}
      <Suspense fallback={null}>
        {showPlasma ? <Plasma {...plasmaProps} /> : null}
      </Suspense>

      {/* Main Content */}
      <div className="relative z-10">
        {/* HERO SECTION */}
        <section
          id="hero"
          className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-12"
        >
          <h1
            className={`text-5xl md:text-7xl font-bold tracking-tight mb-6 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            Hi, I'm Jegan
          </h1>

          <p
            className={`text-lg md:text-2xl max-w-2xl text-gray-200 leading-relaxed transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            I build thoughtful, user-focused web & mobile experiences — blending clean design,
            intelligent systems, and smooth interactions.
          </p>

          <div
            className={`mt-10 flex flex-wrap gap-4 justify-center transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <a
              href="#projects"
              className="px-6 py-3 bg-white text-black rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              View My Work
            </a>

            <a
              href="#contact"
              className="px-6 py-3 border border-white/40 text-white rounded-xl hover:bg-white/10 hover:scale-105 transition-all"
            >
              Contact
            </a>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className={`py-24 px-6 md:px-20 text-center transition-all duration-700 ${
            visibleSections.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl font-bold mb-6">About Me</h2>

          <p className="max-w-2xl mx-auto text-gray-200 text-lg md:text-xl leading-relaxed">
            I'm a developer who cares deeply about design, performance, and clarity.
            I enjoy transforming complex ideas into seamless interactive experiences —
            from AI-powered tools to immersive 3D visualizations.
          </p>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className={`py-24 px-6 md:px-20 text-center transition-all duration-700 ${
            visibleSections.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl font-bold mb-12">Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {projectsData.map((project, i) => (
              <div
                key={project.id}
                className={`p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl hover:scale-105 hover:bg-white/15 transition-all duration-300 ${
                  visibleSections.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-200 mb-4">{project.desc}</p>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 font-medium hover:underline inline-block"
                >
                  View Project →
                </a>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className={`py-24 px-6 md:px-20 text-center transition-all duration-700 ${
            visibleSections.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>

          <p className="max-w-xl mx-auto text-gray-200 mb-10">
            Open to collaborations, freelance work, or just meaningful conversations.
          </p>

          <div className="flex justify-center gap-10 text-white">
            <a
              href="mailto:thejegan31@gmail.com"
              className="hover:text-blue-300 hover:scale-110 transition-all"
              aria-label="Email"
            >
              <Mail size={32} />
            </a>
            <a
              href="https://github.com/thejegan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 hover:scale-110 transition-all"
              aria-label="GitHub"
            >
              <Github size={32} />
            </a>
            <a
              href="https://linkedin.com/in/thejegan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 hover:scale-110 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin size={32} />
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10 text-center text-gray-300 border-t border-white/10">
          © {new Date().getFullYear()} Jegan — Built with care & clarity.
        </footer>
      </div>
    </div>
  );
}
