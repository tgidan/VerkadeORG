import { useState } from 'react';
import { motion } from 'motion/react';
import { Github, Mail, MapPin, Code2, Terminal, Shield } from 'lucide-react';
import profileImg from '@/assets/49a1785e771a49a87eb2223123bb7c7036f6a744.png';

export default function App() {
  const [activeSection, setActiveSection] = useState('about');

  const skills = [
    'Web Security',
    'QA & Automation',
    'K8',
    'CI/CD',
    'Cypress',
    'Pentesting'
  ];

  const projects = [
    {
      title: 'Project One',
      description: 'Security or testing related project description.',
    },
    {
      title: 'Project Two',
      description: 'Another project with focus on reliability or automation.',
    },
  ];

  const career = [
    {
      role: 'Software Test Developer',
      company: 'Company Name',
      location: 'Netherlands',
      period: '2024 — Present',
      highlights: [
        'Built and maintained Cypress E2E suites for critical flows.',
        'Integrated CI/CD test gates and reporting.',
        'Worked with developers to improve testability and reliability.',
      ],
    },
    {
      role: 'Cybersecurity Student (MSc)',
      company: 'TU Eindhoven',
      location: 'Eindhoven, NL',
      period: '2023 — Present',
      highlights: [
        'Focus areas: web security, threat modeling, secure software engineering.',
        'Hands-on labs in pentesting and defensive engineering.',
      ],
    },
  ];

  const writings = [
    'Threat modeling a small web app',
    'Testing APIs without breaking production',
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a] -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0e1a]/70 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400/50">
              <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-xl tracking-wide">
              Daan <span className="text-cyan-400">Verkade</span>
            </span>
          </motion.div>

          <nav className="flex gap-8" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {['About', 'Projects', 'Career', 'Writing', 'Contact'].map((item) => (
              <motion.button
                key={item}
                onClick={() => {
                  setActiveSection(item.toLowerCase());
                  document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm hover:text-cyan-400 transition-colors relative"
                whileHover={{ y: -2 }}
              >
                {item}
                {activeSection === item.toLowerCase() && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400"
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                style={{ fontFamily: 'Playfair Display, serif' }}
                className="text-7xl mb-4 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Cyber<span className="text-cyan-400">security</span>
              </motion.h1>
              <motion.h2
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                className="text-5xl mb-6 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                student
              </motion.h2>
              <motion.div
                className="flex items-baseline gap-3 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xl text-cyan-400">&</span>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-3xl">
                  software test developer
                </h3>
              </motion.div>
            </motion.div>

            <motion.p
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              className="text-gray-400 text-lg mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Hi and welcome to my webpage! I'm Daan Verkade, a cybersecurity student doing his master at the Technical University of Eindhoven.
              On this website you can find anything related to my professional work, education, projects, hobbies, and part-time undertakings.
            </motion.p>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <motion.button
                onClick={() => {
                  setActiveSection('projects');
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-cyan-500 text-black rounded-lg flex items-center gap-2"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                <Terminal size={18} />
                See projects
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-cyan-400/50 text-cyan-400 rounded-lg"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Contact
              </motion.button>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-3 border border-white/20 rounded-lg flex items-center"
              >
                <Github size={20} />
              </motion.a>
            </motion.div>
          </div>

          {/* Right Side - Image & Status Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden border border-white/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={profileImg}
                alt="Daan Verkade"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
            </motion.div>

            {/* Floating Status Card */}
            <motion.div
              className="absolute -right-4 top-8 bg-[#1a1f35]/90 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}
            >
              <h3 style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-sm text-gray-400 mb-4">
                Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-sm">
                    Available
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin size={14} className="text-cyan-400" />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-sm">
                    Netherlands
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail size={14} className="text-cyan-400" />
                  <a
                    href="mailto:professional@verkade.org"
                    className="text-sm text-cyan-400 hover:underline"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    professional@verkade.org
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Floating Icons */}
            <motion.div
              className="absolute -left-8 bottom-20 bg-[#1a1f35]/80 backdrop-blur-sm border border-cyan-400/30 rounded-full p-4"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Shield size={24} className="text-cyan-400" />
            </motion.div>

            <motion.div
              className="absolute -right-8 bottom-40 bg-[#1a1f35]/80 backdrop-blur-sm border border-purple-400/30 rounded-full p-4"
              animate={{
                y: [0, -15, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            >
              <Code2 size={24} className="text-purple-400" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Tags */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                className="px-4 py-2 bg-[#1a1f35]/50 border border-white/10 rounded-full text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-colors cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-6xl mb-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            About <span className="text-cyan-400">_</span>
          </motion.h2>
          <motion.p
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            className="text-xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hi, I'm Daan. I study cybersecurity and work as a software test developer. I enjoy building secure, testable systems and learning by doing.
          </motion.p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-[#0f1421]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-6xl mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Projects <span className="text-purple-400">_</span>
          </motion.h2>
          <div className="space-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                className="bg-[#1a1f35]/50 border border-white/5 rounded-xl p-6 hover:border-purple-400/30 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ x: 10, boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)' }}
              >
                <h3
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  className="text-2xl mb-2 group-hover:text-purple-400 transition-colors"
                >
                  {project.title}
                </h3>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-gray-400">
                  {project.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section id="career" className="py-20 px-6 bg-[#0f1421]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-6xl mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Career <span className="text-cyan-400">_</span>
          </motion.h2>

          <div className="space-y-6">
            {career.map((item, index) => (
              <motion.div
                key={`${item.role}-${item.company}-${item.period}`}
                className="bg-[#1a1f35]/50 border border-white/5 rounded-xl p-6 hover:border-cyan-400/30 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ x: 10, boxShadow: '0 0 30px rgba(34, 211, 238, 0.18)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      className="text-2xl mb-1 group-hover:text-cyan-400 transition-colors"
                    >
                      {item.role}
                    </h3>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-sm text-gray-400">
                      {item.company} • {item.location}
                    </p>
                  </div>

                  <div
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    className="text-sm text-gray-400 sm:text-right"
                  >
                    {item.period}
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {item.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1">▸</span>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-gray-300">
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Writing Section */}
      <section id="writing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-6xl mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Writing <span className="text-green-400">_</span>
          </motion.h2>
          <ul className="space-y-4">
            {writings.map((writing, index) => (
              <motion.li
                key={writing}
                className="flex items-start gap-3 text-lg group cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <span className="text-green-400 mt-1">▸</span>
                <span
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  className="text-gray-300 group-hover:text-green-400 transition-colors"
                >
                  {writing}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-[#0f1421]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-6xl mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Get in <span className="text-cyan-400">Touch</span>
          </motion.h2>
          <motion.p
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            className="text-xl text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Email:{' '}
            <a
              href="mailto:professional@verkade.org"
              className="text-cyan-400 hover:underline"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              professional@verkade.org
            </a>
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-sm text-gray-500">
            © 2026 Daan Verkade
          </p>
          <div className="flex gap-4">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -3 }}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              href="mailto:professional@verkade.org"
              whileHover={{ scale: 1.2, y: -3 }}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Mail size={20} />
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
}
