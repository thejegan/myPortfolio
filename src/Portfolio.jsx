// src/Portfolio.jsx - Modern, Responsive, Optimized (Complete - images enabled)
import React, { useEffect, useState, Suspense } from 'react';
import projects from './data/projects';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import './index.css';

const Plasma = React.lazy(() => import('./components/Plasma'));

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [showPlasma, setShowPlasma] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const visible = useScrollAnimation();

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('pref_plasma');
      if (saved !== null) {
        setShowPlasma(saved === '1');
      } else {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mq.matches) setShowPlasma(false);
      }
    } catch (e) {
      const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq && mq.matches) setShowPlasma(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white antialiased bg-[color:var(--bg)]">
      <Suspense fallback={null}>
        {mounted && showPlasma && (
          // show on mobile too, but keep non-interactive
          <div className="block pointer-events-none select-none">
            <Plasma opacity={0.6} speed={0.5} />
          </div>
        )}
      </Suspense>

      <TopBar showPlasma={showPlasma} setShowPlasma={setShowPlasma} isScrolled={isScrolled} />

      <div className="relative z-10">
        <div className="container-max">
          <main className="space-y-32 py-20 lg:py-32">
            <Hero />
            <About />
            <Skills />
            <ProjectsList projects={projects} visible={visible} />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   TopBar (hide-on-scroll on mobile)
   ------------------------- */
function TopBar({ showPlasma, setShowPlasma, isScrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = React.useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const tickingRef = React.useRef(false);

  // Helper: only apply hide-on-scroll on small screens (mobile)
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024; // matches lg breakpoint
  };

  useEffect(() => {
    function onScroll() {
      if (!isMobile()) {
        // Ensure nav visible on larger screens
        if (hidden) setHidden(false);
        return;
      }

      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const lastY = lastYRef.current;
        const delta = currentY - lastY;

        // Small threshold to prevent flicker
        if (Math.abs(delta) > 8) {
          // Scrolling down -> hide (but only after some minimal offset)
          if (delta > 0 && currentY > 60) {
            setHidden(true);
            // auto-close menu if open so it doesn't stick
            setMenuOpen(false);
          } else if (delta < 0) {
            // Scrolling up -> show
            setHidden(false);
          }
        }

        lastYRef.current = currentY;
        tickingRef.current = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Also listen for resize to re-evaluate isMobile -> ensure nav visible after resize to desktop
    const onResize = () => {
      if (!isMobile() && hidden) setHidden(false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [hidden]);

  // If menu opens, ensure nav is visible so user can interact with it
  useEffect(() => {
    if (menuOpen && hidden) setHidden(false);
  }, [menuOpen, hidden]);

  return (
    <nav
      // transform off-screen when hidden. Keep bg so no flash.
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-black/95 backdrop-blur-md py-3 shadow-xl`}
      style={{ transform: hidden ? 'translateY(-110%)' : 'translateY(0)' }}
    >
      <div className="container-max">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300">
              J
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg">Jegan</div>
              <div className="text-xs text-slate-400">Full-Stack Developer</div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-6">
            <a href="#about" className="nav-link">About</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#contact" className="nav-link">Contact</a>

            <label className="hidden xl:flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showPlasma}
                onChange={(e) => {
                  setShowPlasma(e.target.checked);
                  try { localStorage.setItem('pref_plasma', e.target.checked ? '1' : '0'); } catch {}
                }}
                className="toggle-checkbox"
              />
              <span className="text-slate-400">Effects</span>
            </label>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href="#contact" className="btn-primary">Let's Talk</a>
          </div>

          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 animate-slide-down">
            <div className="flex flex-col gap-3">
              <a href="#about" onClick={() => setMenuOpen(false)} className="mobile-nav-link">About</a>
              <a href="#skills" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Skills</a>
              <a href="#projects" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Projects</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Contact</a>
              <a href="#contact" className="btn-primary mt-2">Let's Talk</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* -------------------------
   Hero
   ------------------------- */
function Hero() {
  return (
    <section id="hero" className="min-h-[90vh] lg:min-h-[75vh] flex items-center pt-20 lg:pt-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm animate-pulse-glow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow"></span>
            <span className="text-sm text-emerald-400 font-medium">Available for work</span>
          </div>

          <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight space-y-2">
                <span className="block bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  I'm Jegan,
                </span>

                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Full-Stack Developer
                </span>
              </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed">
              Full-stack & mobile developer crafting high-performance, user-centric applications with modern tech stacks.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="btn-primary group">
              View My Work
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#contact" className="btn-secondary">Get in Touch</a>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <span className="text-sm text-slate-500">Follow me:</span>
            <div className="flex items-center gap-4">
              <a href="https://github.com/thejegan" className="social-icon" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://linkedin.com/in/thejegan" className="social-icon" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://instagram.com/thejegan_" className="social-icon" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center animate-fade-in-up animation-delay-200">
          <div className="relative">
            <div className="relative z-10 w-80 h-96 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 p-6 shadow-2xl animate-float">
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center animate-pulse-glow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Code Quality</h3>
                    <p className="text-sm text-slate-400">Clean, maintainable, and scalable solutions</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Performance</span>
                    <span>98%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-progress" style={{width: '98%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------
   About
   ------------------------- */
function About() {
  return (
    <section id="about" className="scroll-mt-20 animate-on-scroll">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl font-bold mb-2">About Me</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>

          <p className="text-lg text-slate-300 leading-relaxed">
            I'm a passionate developer who bridges design, performance, and practical machine learning.
            My focus is on creating experiences that users love and systems that developers can maintain.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="stat-card">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">5+</div>
              <div className="text-sm text-slate-400">Projects Completed</div>
            </div>
            <div className="stat-card">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">10+</div>
              <div className="text-sm text-slate-400">Technologies</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="feature-card group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance First</h3>
            <p className="text-slate-400">Optimized rendering, lazy loading, and efficient state management for blazing-fast experiences.</p>
          </div>

          <div className="feature-card group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Mobile Excellence</h3>
            <p className="text-slate-400">Cross-platform apps with Flutter and real-time features powered by Supabase.</p>
          </div>

          <div className="feature-card group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Solutions</h3>
            <p className="text-slate-400">Practical ML models optimized for mobile and edge deployment scenarios.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------
   Skills
   ------------------------- */
function Skills() {
  const skillCategories = [
    {
      title: 'Frontend',
      icon: '🎨',
      skills: ['React', 'Next.js', 'Tailwind CSS', 'Three.js', 'TypeScript'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Mobile',
      icon: '📱',
      skills: ['Flutter', 'Riverpod', 'Supabase', 'Firebase'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Backend',
      icon: '⚙️',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'REST APIs'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'ML/AI',
      icon: '🤖',
      skills: ['TensorFlow', 'Scikit-learn', 'AdaBoost', 'Transfer Learning'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="skills" className="scroll-mt-20 animate-on-scroll">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Skills & Technologies</h2>
        <p className="text-slate-400 text-lg">Tools and technologies I work with</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((category, idx) => (
          <div
            key={category.title}
            className="skill-card group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
              {category.icon}
            </div>
            <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                // chips on mobile, block-ish on sm+
                <span key={skill} className="skill-tag inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-800/40 sm:block">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------
   ProjectsList (now renders images)
   ------------------------- */
function ProjectsList({ projects = [], visible = {} }) {
  return (
    <section id="projects" className="scroll-mt-20 animate-on-scroll">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Featured Projects</h2>
        <p className="text-slate-400 text-lg">Some of my recent work</p>
      </div>

      <div className="grid gap-8">
        {projects.map((project, idx) => (
          <article
            key={project.id}
            id={`proj-${project.id}`}
            className="project-card group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {/* IMAGE / THUMB */}
              <div className="lg:col-span-1">
                <div className="aspect-video lg:aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // hide broken image to show fallback icon
                        e.currentTarget.style.display = 'none';
                        // optional: you could toggle a state to show a nicer fallback
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-slate-300 mb-3">{project.short}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span key={tech} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <span className="text-sm text-slate-500">{project.role}</span>
                  <div className="flex gap-3">
                    {project.links.github && (
                      <a href={project.links.github} className="project-link" target="_blank" rel="noopener noreferrer">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        <span className="ml-2">Code</span>
                      </a>
                    )}
                    {project.links.live && (
                      <a href={project.links.live} className="project-link" target="_blank" rel="noopener noreferrer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        <span className="ml-2">Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* -------------------------
   Contact
   ------------------------- */
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ sending: false, success: null, error: null });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ sending: true, success: null, error: null });

    // Basic client-side validation
    if (!form.name || !form.email || !form.message) {
      setStatus({ sending: false, success: null, error: 'Please fill all fields.' });
      return;
    }

    try {
      // Replace this with your real API endpoint or service
      await new Promise((r) => setTimeout(r, 700));
      setForm({ name: '', email: '', message: '' });
      setStatus({ sending: false, success: 'Message sent — thanks!', error: null });
    } catch (err) {
      setStatus({ sending: false, success: null, error: 'Failed to send message. Try again later.' });
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 animate-on-scroll">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold">Get in touch</h2>
          <p className="text-slate-400 mt-2">Interested in working together? Send a message and I’ll get back to you.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <div>
            <label className="sr-only" htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="w-full bg-transparent border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="sr-only" htmlFor="email">Email</label>
            <input id="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" type="email" className="w-full bg-transparent border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="md:col-span-2">
            <label className="sr-only" htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Tell me about your project..." className="w-full bg-transparent border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>

          <div className="md:col-span-2 flex items-center justify-between gap-4">
            <div className="text-sm text-slate-400">Prefer email? thejegan31@gmail.com</div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={status.sending} className="btn-primary">
                {status.sending ? 'Sending...' : 'Send Message'}
              </button>
              <button type="button" onClick={() => setForm({ name: '', email: '', message: '' })} className="btn-secondary">Reset</button>
            </div>
          </div>

          {status.error && <div className="md:col-span-2 text-sm text-red-400">{status.error}</div>}
          {status.success && <div className="md:col-span-2 text-sm text-emerald-400">{status.success}</div>}
        </form>
      </div>
    </section>
  );
}

/* -------------------------
   Footer
   ------------------------- */
function Footer() {
  return (
    <footer className="py-12 text-center text-slate-400">
      <div className="container-max">
        <div className="mb-6">
          <a href="#" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">J</div>
            <div className="text-left">
              <div className="font-semibold text-white">Jegan</div>
              <div className="text-xs">Full-Stack Developer</div>
            </div>
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <a href="https://github.com/thejegan" className="social-icon" aria-label="GitHub">GitHub</a>
          <a href="https://linkedin.com/in/thejegan" className="social-icon" aria-label="LinkedIn">LinkedIn</a>
          <a href="mailto:thejegan31@gmail.com" className="social-icon" aria-label="Email">Email</a>
        </div>

        <div className="text-xs">© {new Date().getFullYear()} Jegan — Built with React & Tailwind</div>
      </div>
    </footer>
  );
}
// End of file
 