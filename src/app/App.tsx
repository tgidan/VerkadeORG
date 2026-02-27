import { useState } from 'react';
import { motion } from 'motion/react';
import { Github, Mail, MapPin, Code2, Terminal, Shield } from 'lucide-react';
import profileImg from '@/assets/DVerkade.png';

export default function App() {
  const [activeSection, setActiveSection] = useState('about');

  const gitLink = 'https://github.com/tgidan';
  const mailToLink = 'mailto:professional@verkade.org';

  const skills = [
    'Web Security',
    'QA & Automation',
    'K6',
    'CI/CD',
    'Cypress',
    'Pentesting',
    'Threat Modeling',
  ];

  const projects = [
    {
      title: 'Project ICARUS',
      description: [
        "Project ICARUS was a personal project I undertook to explore the capabilities of facial recognition and web scraping technologies.", 
        "The idea was inspired by the concept of using facial recognition to identify individuals and gather information about them from publicly available sources on the internet.",
        // "After seeing a video about someone creating glasses that can use facial recognition to identify people, I wanted to try building something similar myself.",
        // "The goal was to create a system that could identify people from a picture taken by a webcam, and then store all associated information in a json file.",
        // "As this project can be used maliciously, I will not share the code or go into too much detail about the implementation.",
        // "I used OpenCV for face detection and a pre-trained model for face recognition. Then using PimEyes and some custom web scraping, I was able to gather information about a person (myself) from just a picture of their face.",
        // "The current implementation is quite basic and can be easily improved. It can especially be made more dangerous by using data collected from the darkweb instead of just webscraping. However, I will not be pursuing this project",
        // "further as I have already learned a lot from it and don't want to create something that can be easily abused or get in legal trouble myself.",
        // "Note: I only tested this on individuals who provided consent and used publicly available data. Always respect privacy and legal boundaries when working on projects like this.",
        // "This project taught me a lot about web scraping, and in general how easy it can be to find information about a person. "
      ],    
    },
    {
      title: 'Flipper Zero',
      description: [
        "Because of my interest in cybersecurity, and especially red teaming, I wanted to acquire a Flipper Zero. Although the tool is not very powerful and can easily be replaced by a laptop with the right software and hardware, ",
        "it is a fun and versatile gadget that can be used for a variety of hacking and pentesting activities. Currently, I have been experimenting with BadUSB attacks and the WIFI GPIO module to learn more about these attack vectors and how they work.",
        "In the future, I plan to explore more of the Flipper's capabilities and see how it can be used in different scenarios."
      ]
    },
  ];

  const career = [
    {
      role: 'Software Test Developer',
      company: 'Anago',
      location: 'Netherlands, \'s Hertogenbosch',
      period: 'Sept 2023 — Present',
      highlights: [
        'Built and maintained Cypress E2E suites for dynamic web applications.',
        'Implemented K6 load tests to measure API calls response times and reliability.',
        'Worked with developers to improve testability and reliability.',
        'Great cook that made delicious meals for the entire company on a regular basis.',
      ],
    },
  ];

  const education = [
    {
      program: 'Cybersecurity (MSc)',
      institution: 'TU Eindhoven',
      location: 'Eindhoven, NL',
      period: 'Sept 2024 — Present',
      highlights: [
        'Focus areas: web security, threat modeling, secure software engineering, (quantum) cryptography.',
        'Hands-on labs in pentesting and defensive engineering.',
      ],
    },
    {
      program: 'Computer Science And Engineering (BSc)',
      institution: 'TU Eindhoven',
      location: 'Eindhoven, NL',
      period: 'Sept 2019 — June 2024',
      highlights: [
        'Focus areas: software development, algorithms, data structures, computer architecture, operating systems, cryptography, pentesting, and web security.',
        <>
          Final project: ProofFlow. An abstract editor designed to help users in writing mathematical proofs, with the help of theorem prover languages such as Rocq and Lean4 using the Language Server Protocol. It works as a standalone editor, but additional repositories are necessary to be installed in order for features such as language support and VS Code support to function. You can find the repositories here:{' '}
          <a
            href="https://github.com/Moonlington/ProofFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            https://github.com/Moonlington/ProofFlow
          </a>
        </>,
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
            {['About', 'Projects', 'Career', 'Education', 'Writing', 'Contact'].map((item) => (
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
                className="px-6 py-3 border border-cyan-400/50 text-cyan-400 rounded-lg cursor-pointer"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                onClick={() => {
                  window.location.href = mailToLink;
                }}
                >
                Contact
                </motion.button>
              <motion.a
                href={gitLink}
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
                    href={mailToLink}
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
                <div className="mt-3 space-y-3">
                  {project.description.map((paragraph, i) => (
                    <p
                      key={`${project.title}-p-${i}`}
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      className="text-gray-400 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
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

            {/* Education Section */}
      <section id="education" className="py-20 px-6 bg-[#0f1421]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-6xl mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Education <span className="text-purple-400">_</span>
          </motion.h2>

          <div className="space-y-6">
            {education.map((item, index) => (
              <motion.div
                key={`${item.program}-${item.institution}-${item.period}`}
                className="bg-[#1a1f35]/50 border border-white/5 rounded-xl p-6 hover:border-purple-400/30 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ x: 10, boxShadow: '0 0 30px rgba(168, 85, 247, 0.18)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      className="text-2xl mb-1 group-hover:text-purple-400 transition-colors"
                    >
                      {item.program}
                    </h3>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-sm text-gray-400">
                      {item.institution} • {item.location}
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
                  {item.highlights.map((h, idx) => (
                    <li key={`${item.program}-h-${idx}`} className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">▸</span>
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
              href={mailToLink}
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
              href={gitLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -3 }}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              href={mailToLink}
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
