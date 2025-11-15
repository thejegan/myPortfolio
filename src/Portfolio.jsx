// src/Portfolio.jsx
import React, { useEffect, useState, Suspense } from 'react';
import projects from './data/projects';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import './index.css'; // Tailwind + custom CSS

const Plasma = React.lazy(() => import('./components/Plasma'));

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [showPlasma, setShowPlasma] = useState(true); // user preference toggle
  const visible = useScrollAnimation();

  useEffect(() => {
    setMounted(true);
    // Respect user preference for reduced motion and saved preference in localStorage
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black text-[var(--text)] antialiased">
      {/* Plasma background (lazy + gated) */}
      <Suspense fallback={<div aria-hidden className="plasma-fallback pointer-events-none" />}>
        {mounted && showPlasma && <Plasma opacity={0.7} speed={0.6} />}
      </Suspense>

      {/* Top action bar */}
      <TopBar showPlasma={showPlasma} setShowPlasma={setShowPlasma} />

      {/* Page container */}
      <div className="relative z-10 container-max py-24"> {/* increased top padding for topbar */}
        <Header />

        <main className="space-y-20">
          <Hero />
          <About />
          <Skills />
          <ProjectsList projects={projects} visible={visible} />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
}

/* ---------------------------
   TopBar (sticky, stylish)
   --------------------------- */
function TopBar({ showPlasma, setShowPlasma }) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[min(980px,92%)] bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-full px-4 py-2 flex items-center justify-between gap-3 shadow-lg animate-pop">
      {/* Left: availability */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-800/70 border border-slate-700 text-slate-100 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow"></span>
          <span>Available for work!</span>
        </span>
      </div>

      {/* Center: actions */}
      <div className="flex items-center gap-3">
        <a
          href="#contact"
          className="btn-action"
        >
          Get in touch →
        </a>

        <a
          href="#projects"
          className="btn-action btn-muted"
        >
          View projects →
        </a>

        <a
          href="./data/cv.pdf"
          download
          className="btn-action btn-muted"
        >
          Download CV ⬇
        </a>
      </div>

      {/* Right: socials & plasma toggle */}
      <div className="flex items-center gap-3">
        <a className="round-icon" href="https://linkedin.com/thejegan" aria-label="LinkedIn">in</a>
        <a className="round-icon" href="https://github.com/thejegan" aria-label="GitHub">GH</a>
        <a className="round-icon" href="https://instagram.com/thejegan_" aria-label="Instagram">IG</a>

        <label className="inline-flex items-center gap-2 ml-2 text-sm">
          <input
            type="checkbox"
            checked={showPlasma}
            onChange={(e) => {
              setShowPlasma(e.target.checked);
              try { localStorage.setItem('pref_plasma', e.target.checked ? '1' : '0'); } catch {}
            }}
            className="form-checkbox h-4 w-4 text-indigo-500"
          />
        </label>
      </div>
    </div>
  );
}

/* ---------------------------
   Main header (kept simple under topbar)
   --------------------------- */
function Header() {
  return (
    <header className="flex items-center justify-between py-2">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-black font-semibold animate-pop">J</div>
        <div>
          <div className="text-lg font-semibold text-slate-100">Jegan</div>
          <div className="text-xs text-slate-300">Full-Stack & Mobile Developer</div>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-4 text-slate-200">
        <a href="#projects" className="text-sm hover:text-white transition">Projects</a>
        <a href="#contact" className="text-sm text-slate-300 hover:text-white transition">Contact</a>
      </nav>
    </header>
  );
}

/* ---------------------------
   Other sections (unchanged, small animation classes added)
   --------------------------- */

function Hero() {
  return (
    <section id="hero" className="pt-2">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-100">
            I build fast, optimized, and polished apps — mobile & web.
          </h1>
          <p className="mt-4 text-slate-200 max-w-xl">
            Full-stack & mobile developer focused on high-performance UI, clean architecture and practical machine learning.
            I build apps people enjoy using and systems that are easy to maintain.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#projects" className="inline-block bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-sm font-medium text-white shadow-sm transition transform hover:-translate-y-0.5">View Projects</a>
            <a href="#contact" className="inline-block border border-slate-700 px-4 py-2 rounded text-sm text-slate-200 hover:text-white transition">Contact Me</a>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="w-72 h-56 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-4 shadow-lg animate-float">
            <div className="w-full h-full border-2 border-slate-700 rounded-lg flex items-center justify-center text-sm text-slate-200">
              Interactive preview / screenshot
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="pt-6 animate-fade-up delay-100">
      <h2 className="text-2xl font-semibold text-slate-100">About</h2>
      <p className="mt-3 text-slate-200 max-w-3xl">
        I’m Jegan — a developer who enjoys bridging the gap between design, frontend performance and practical ML.
        I’ve worked on cross-platform mobile apps (Flutter + Supabase), production-ready React frontends with custom WebGL experiences,
        and lightweight ML models for mobile/edge deployment.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-4 rounded-lg shadow-sm transform hover:-translate-y-1 transition">
          <h3 className="font-semibold text-slate-100">What I build</h3>
          <ul className="mt-3 text-slate-200 space-y-2">
            <li>Performance-focused UI & animations</li>
            <li>Realtime features with Supabase</li>
            <li>Small, mobile-friendly ML models</li>
          </ul>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg shadow-sm transform hover:-translate-y-1 transition">
          <h3 className="font-semibold text-slate-100">How I work</h3>
          <p className="mt-2 text-slate-200">
            I prefer small, measurable iterations — ship fast, measure performance, and iterate. I optimize for real users and low-resource devices.
          </p>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const frontend = ['React', 'Tailwind CSS', 'Three.js', 'Next.js'];
  const mobile = ['Flutter', 'Riverpod', 'Supabase'];
  const backend = ['Node.js', 'Express', 'Postgres', 'Supabase'];
  const ml = ['Scikit-learn', 'TensorFlow', 'AdaBoost'];

  return (
    <section id="skills" className="animate-fade-up delay-150">
      <h2 className="text-2xl font-semibold text-slate-100">Skills</h2>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[frontend, mobile, backend, ml].map((col, i) => (
          <div key={i} className="bg-slate-800 p-3 rounded transform hover:-translate-y-0.5 transition">
            {col.map((s) => (
              <div key={s} className="text-sm text-slate-200 py-1">{s}</div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsList({ projects = [], visible = {} }) {
  return (
    <section id="projects" className="pt-6">
      <h2 className="text-2xl font-semibold text-slate-100">Projects</h2>
      <div className="mt-6 grid gap-6">
        {projects.map((p) => {
          const isVisible = visible[`proj-${p.id}`];
          return (
            <article
              key={p.id}
              id={`proj-${p.id}`}
              className={`bg-slate-800 p-5 rounded-lg border border-slate-700 transition-transform transform ${isVisible ? 'translate-y-0 opacity-100 animate-fade-up' : 'translate-y-6 opacity-70'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100">{p.title}</h3>
                  <p className="mt-2 text-slate-200">{p.short}</p>
                  <p className="mt-3 text-sm text-slate-300">{p.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-200">{t}</span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    {p.links.github && (
                      <a href={p.links.github} className="text-sm text-slate-200 hover:text-white">Code</a>
                    )}
                    {p.links.live && (
                      <a href={p.links.live} className="text-sm text-indigo-400 hover:underline">Live</a>
                    )}
                    <span className="ml-auto text-xs text-slate-400">{p.role}</span>
                  </div>
                </div>

                <div className="w-36 h-24 hidden md:block rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs text-slate-200 transform hover:scale-105 transition">
                  Screenshot
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------
   Updated Contact component (single-column, modern)
   --------------------------- */
function Contact() {
  return (
    <section id="contact" className="pt-6 animate-fade-up delay-200">
      <h2 className="text-2xl font-semibold text-slate-100 mb-6">Contact</h2>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
        {/* Contact Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-sm text-slate-200">Name</label>
            <input
              className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm text-slate-200">Email</label>
            <input
              className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="you@example.com"
              type="email"
            />
          </div>
          <div>
            <label className="text-sm text-slate-200">Message</label>
            <textarea
              className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
              rows="4"
              placeholder="Say hi..."
            />
          </div>
          <div className="text-right">
            <button
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded text-sm font-medium text-white shadow hover:shadow-indigo-500/20 transition"
            >
              Send
            </button>
          </div>
        </form>

        {/* Buttons like your sample image */}
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <a
            href="#contact"
            className="flex items-center gap-2 bg-black/40 hover:bg-black/60 border border-slate-700 text-slate-100 px-5 py-2 rounded-full text-sm transition"
          >
            Get in touch →
          </a>

          <a
            href="#projects"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-slate-600 text-slate-200 px-5 py-2 rounded-full text-sm transition"
          >
            View projects →
          </a>

          <a
            href="./data/cv.pdf"
            download
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-slate-600 text-slate-200 px-5 py-2 rounded-full text-sm transition"
          >
            Download CV ⬇
          </a>

          {/* Socials */}
          <a href="https://linkedin.com/thejegan" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white/10 transition text-slate-200" aria-label="LinkedIn">in</a>
          <a href="https://github.com/thejegan" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white/10 transition text-slate-200" aria-label="GitHub">GH</a>
          <a href="https://instagram.com/thejegan_" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white/10 transition text-slate-200" aria-label="Instagram">IG</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-12 text-center text-sm text-slate-400">
      <div>Made by Jegan • © {new Date().getFullYear()}</div>
    </footer>
  );
}
