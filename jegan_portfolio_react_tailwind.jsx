import React from "react";
import { motion } from "framer-motion";

// Single-file React component for a modern responsive portfolio.
// Usage: Drop into a Next.js page (e.g. pages/index.jsx) or in CRA (App.jsx).
// Requirements: TailwindCSS configured, Framer Motion installed.
// Tailwind config: make sure you have @tailwind base, components, utilities in your CSS.

const projects = [
  {
    id: 1,
    title: "Plaro — Educational Social Platform",
    desc: "Flutter + Supabase + Elixir. Social learning with streaks, XP, and notes.",
    tech: ["Flutter", "Supabase", "Elixir"],
    demo: "#",
    code: "#",
  },
  {
    id: 2,
    title: "Smart Content Safety",
    desc: "Explicit content detector for educational platforms (FastAPI + PyTorch).",
    tech: ["Python", "FastAPI", "ML"],
    demo: "#",
    code: "#",
  },
  {
    id: 3,
    title: "Inventory Forecasting Dashboard",
    desc: "Time-series forecasting for e-commerce. Visualize predictions vs actuals.",
    tech: ["Python", "Django", "Plotly"],
    demo: "#",
    code: "#",
  },
  {
    id: 4,
    title: "Astrogators 3D (Three.js)",
    desc: "Interactive 3D planets and camera controls showcased on the web.",
    tech: ["Three.js", "GLTF"],
    demo: "#",
    code: "#",
  },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
      <header className="max-w-6xl mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-semibold">Jegan</div>
          <div className="hidden md:flex gap-6 items-center text-sm">
            <a href="#projects" className="hover:underline">
              Projects
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#work" className="hover:underline">
              Freelance
            </a>
            <a href="#contact" className="px-4 py-2 rounded-md bg-sky-400 text-slate-900 font-medium">
              Contact
            </a>
          </div>
          <div className="md:hidden">
            {/* Simple mobile menu anchor - implement menu toggle in a fuller app */}
            <a href="#contact" className="px-3 py-2 rounded bg-sky-400 text-slate-900 text-sm">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight"
            >
              Hi, I’m Jegan —
              <span className="block text-sky-400">AI, Web & Mobile developer.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-slate-300 max-w-xl"
            >
              I build polished products that combine machine learning, interactive 3D, and clean UX.
              I prefer practical, deployable solutions: from data pipelines to mobile apps and client-ready videos.
            </motion.p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-block px-5 py-3 rounded-md bg-sky-400 text-slate-900 font-medium"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="inline-block px-5 py-3 rounded-md border border-slate-700 text-slate-200"
              >
                Get In Touch
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-400">
              <div>Python</div>
              <div>•</div>
              <div>Flutter</div>
              <div>•</div>
              <div>Three.js</div>
              <div>•</div>
              <div>Django</div>
              <div>•</div>
              <div>Supabase</div>
            </div>
          </div>

          {/* Visual / 3D placeholder */}
          <div className="order-first md:order-last flex justify-center md:justify-end">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-md"
            >
              {/* A decorative animated blob that can be replaced by a Three.js canvas or GLTF viewer */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-800 to-slate-700 p-6">
                <svg viewBox="0 0 600 400" className="w-full h-64 md:h-80">
                  <defs>
                    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" rx="18" fill="url(#g1)" opacity="0.07" />
                  <g transform="translate(50,20)">
                    <motion.circle
                      cx="180"
                      cy="140"
                      r="70"
                      animate={{ rotate: [0, 360] }}
                      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                      style={{ originX: "180px", originY: "140px", fill: "rgba(255,255,255,0.06)" }}
                    />
                    <motion.ellipse
                      cx="120"
                      cy="90"
                      rx="40"
                      ry="80"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 5 }}
                      style={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                  </g>
                </svg>

                <div className="absolute left-6 bottom-6 text-xs text-slate-300">
                  Replace this with a Three.js canvas or a short demo GIF.
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="mt-12 py-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold">About</h2>
              <p className="mt-4 text-slate-300 max-w-2xl">
                I’m an engineer focused on making useful products with a strong emphasis on
                machine learning, real-time graphics, and reliable backend systems. I enjoy
                shipping MVPs fast and iterating based on user feedback.
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {[
                  "Python",
                  "Flutter",
                  "Django",
                  "Three.js",
                  "Supabase",
                  "Elixir",
                  "Tailwind",
                  "Framer Motion",
                ].map((s) => (
                  <div key={s} className="px-3 py-2 bg-slate-800 rounded-md text-center">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-slate-800 p-6 rounded-2xl">
                <h3 className="font-semibold">Quick facts</h3>
                <ul className="mt-4 text-slate-300 text-sm space-y-2">
                  <li>7-member product team experience (Plaro)</li>
                  <li>Built deployable ML models (AdaBoost, classifiers)</li>
                  <li>Experience with 3D web using Three.js</li>
                  <li>Freelance video editing and thumbnails</li>
                </ul>
                <a
                  href="#contact"
                  className="mt-6 inline-block px-4 py-2 rounded-md bg-sky-400 text-slate-900 font-medium"
                >
                  Hire me
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="mt-12 py-8">
          <h2 className="text-2xl font-bold">Selected Projects</h2>
          <p className="text-slate-400 mt-2">A curated set of projects highlighting product thinking and deployability.</p>

          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <motion.article
                key={p.id}
                whileHover={{ translateY: -6 }}
                className="rounded-2xl p-6 bg-gradient-to-tr from-slate-800 to-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="text-slate-300 mt-2 text-sm">{p.desc}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="px-2 py-1 text-xs bg-slate-800 rounded">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex gap-3">
                  <a
                    href={p.demo}
                    className="px-3 py-2 rounded-md bg-transparent border border-slate-600 text-sm"
                  >
                    Live
                  </a>
                  <a href={p.code} className="px-3 py-2 rounded-md bg-sky-400 text-slate-900 text-sm">
                    Code
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* FREELANCE / CREATIVE */}
        <section id="work" className="mt-12 py-8">
          <h2 className="text-2xl font-bold">Freelance & Creative Work</h2>
          <p className="text-slate-400 mt-2">Short previews of video editing and client work.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl bg-slate-800 p-4">
              <div className="h-40 bg-slate-900 rounded-md flex items-center justify-center text-slate-500">10s preview</div>
              <div className="mt-3">
                <div className="font-medium">Cinematic Promo Edit</div>
                <div className="text-sm text-slate-400">Color grading, b-roll assembly, captions</div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <div className="h-40 bg-slate-900 rounded-md flex items-center justify-center text-slate-500">Before / After</div>
              <div className="mt-3">
                <div className="font-medium">YouTube Short Editing</div>
                <div className="text-sm text-slate-400">Automated captions, hook edits</div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mt-12 py-8">
          <div className="bg-slate-800 p-6 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl font-bold">Work with me</h2>
                <p className="text-slate-300 mt-2">I’m available for freelance work, collaboration, and full-time roles.</p>

                <ul className="mt-4 text-sm text-slate-300 space-y-2">
                  <li>Email: <a href="mailto:your.email@example.com" className="text-sky-400">your.email@example.com</a></li>
                  <li>LinkedIn: <a href="#" className="text-sky-400">linkedin.com/in/jegan</a></li>
                  <li>Fiverr: <a href="#" className="text-sky-400">fiverr.com/yourprofile</a></li>
                </ul>
              </div>

              <form className="space-y-4">
                <input className="w-full px-4 py-3 rounded-md bg-slate-900 border border-slate-700 text-slate-200" placeholder="Your name" />
                <input className="w-full px-4 py-3 rounded-md bg-slate-900 border border-slate-700 text-slate-200" placeholder="Email" />
                <textarea className="w-full px-4 py-3 rounded-md bg-slate-900 border border-slate-700 text-slate-200" rows={4} placeholder="Message"></textarea>
                <button type="button" className="px-4 py-3 rounded-md bg-sky-400 text-slate-900 font-medium">Send</button>
              </form>
            </div>
          </div>
        </section>

        <footer className="mt-12 py-8 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Jegan • Built with React & Tailwind
        </footer>
      </main>
    </div>
  );
}
