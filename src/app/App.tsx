import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, Mail, MapPin, Code2, Terminal, Shield } from 'lucide-react';
import profileImg from '@/assets/DVerkade.png';
import { Terminal as TerminalPanel } from './components/Terminal';
import { MatrixRain } from './components/MatrixRain';

const _MONTH: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sept: 8, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function _parseDate(s: string): Date | null {
  if (s === 'Present') return new Date(2026, 3, 1);
  const m = s.trim().match(/^(\w{3,5})\s+(\d{4})$/);
  if (!m) return null;
  const mo = _MONTH[m[1]];
  const yr = parseInt(m[2]);
  if (mo === undefined || isNaN(yr)) return null;
  return new Date(yr, mo, 1);
}

// Non-linear time scale: compress sparse/single-item segments to keep busy regions dominant.
function _buildScale(
  validItems: Array<{ start: Date; end: Date }>,
  tStart: number,
  tEnd: number,
): {
  t2p: (t: number) => number;
  compressedSegs: Array<{ leftPct: number; widthPct: number; yrStart: number; yrEnd: number }>;
} {
  // All milestone timestamps
  const pts = Array.from(new Set([
    tStart, tEnd,
    ...validItems.flatMap(it => [it.start.getTime(), it.end.getTime()]),
  ])).sort((a, b) => a - b);

  const THRESHOLD_MS = 13 * 30.44 * 24 * 3600 * 1000; // ~13 months
  const RATIO = 0.15; // sparse segments get 15% of their natural display width

  type Seg = { s: number; e: number; dur: number; display: number; compressed: boolean };
  const segs: Seg[] = pts.slice(0, -1).map((s, i) => {
    const e   = pts[i + 1];
    const dur = e - s;
    // "active" = items whose range fully covers this segment
    const active = validItems.filter(it => it.start.getTime() <= s && it.end.getTime() >= e).length;
    const compressed = dur > THRESHOLD_MS && active <= 1;
    return { s, e, dur, display: compressed ? dur * RATIO : dur, compressed };
  });

  const totalDisplay = segs.reduce((s, g) => s + g.display, 0);
  // Cumulative display-percent at the START of each segment
  const cum: number[] = segs.reduce(
    (acc, seg) => { acc.push(acc[acc.length - 1] + (seg.display / totalDisplay) * 100); return acc; },
    [0],
  );

  const t2p = (t: number): number => {
    if (t <= tStart) return 0;
    if (t >= tEnd)   return 100;
    for (let i = 0; i < segs.length; i++) {
      if (t <= segs[i].e) {
        const frac = (t - segs[i].s) / segs[i].dur;
        return cum[i] + frac * (segs[i].display / totalDisplay) * 100;
      }
    }
    return 100;
  };

  const compressedSegs = segs
    .map((seg, i) => ({
      leftPct:  cum[i],
      widthPct: (seg.display / totalDisplay) * 100,
      yrStart:  new Date(seg.s).getFullYear(),
      yrEnd:    new Date(seg.e).getFullYear(),
      compressed: seg.compressed,
    }))
    .filter(s => s.compressed);

  return { t2p, compressedSegs };
}

function _assignLanes(items: Array<{ start: number; end: number }>): number[] {
  const laneEnds: number[] = [];
  const result = new Array(items.length).fill(0);
  const order = items.map((_, i) => i).sort((a, b) => items[a].start - items[b].start);
  for (const i of order) {
    const { start, end } = items[i];
    let placed = false;
    for (let l = 0; l < laneEnds.length; l++) {
      if (laneEnds[l] <= start) {
        result[i] = l;
        laneEnds[l] = end;
        placed = true;
        break;
      }
    }
    if (!placed) {
      result[i] = laneEnds.length;
      laneEnds.push(end);
    }
  }
  return result;
}

export default function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [hueRotate, setHueRotate] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [matrixOn, setMatrixOn] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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
    'Teaching',
    'Mentoring',
  ];

    const career = [
    {
      role: 'Software Test Developer',
      company: 'Anago',
      location: 'Netherlands, \'s Hertogenbosch',
      period: 'Sept 2023 - Present',
      highlights: [
        'Built and maintained Cypress E2E suites for dynamic web applications.',
        'Implemented K6 load tests to measure API calls response times and reliability.',
        'Worked with developers to improve testability and reliability.',
        'Great cook that made delicious meals for the entire company on a regular basis.',
      ],
    },
    {
      role: 'Member PR team M&CS department',
      company: 'TU/e',
      location: 'Netherlands, Eindhoven',
      period: 'Feb 2021 - Present',
      highlights: [
        'Told prospective students about the Computer Science and Engineering bachelor program at TU/e, and organized events to promote the program.',
        'Additionally, I also told prospective students about the cybersecurity master program at TU/e, and organized events to promote the program.',
        'Presenter at master open days',
        'Participated videos for the campus tour and for the entrance exam of the bachelor program.',
      ],
    },
    {
      role: 'Board Year - Secretary',
      company: 'GEWIS, study association for Computer Science and Engineering',
      location: 'Netherlands, Eindhoven',
      period: 'Jul 2022 - Jul 2023',
      highlights: [
        'Managed internal and external communications, including meeting minutes and newsletters',
        'GDPR responsible, ensuring compliance with data protection regulations and handling data requests',
        'Responsible for database management, including maintaining and updating the member database and ensuring data integrity',
        'SNiC responsible, actively participating in organizing the annual SNiC conference, which included managing the SNiC committee, overseeing the day event, and making sure GEWIS was well represented at the meetings.',
      ],
    },
    {
      role: 'Internship - Mathematical Teacher',
      company: 'Luzac Lyceum Eindhoven',
      location: 'Netherlands, Eindhoven',
      period: 'Sept 2021 - Apr 2022',
      highlights: [
        'Responsible for teaching 2nd year vmbo-t, havo and vwo students',
        'Responsible for teaching 3th year vmbo-t, havo and vwo students',
        'Also assisted in teaching 4th year vmbo-t students and 1st year vmbo-t, havo and vwo students',
        'Provided extra lessons in Mathematics and Programming (Informatica) for students who needed extra help',
        'Guided a student with his PWS (Profiel Werkstuk). Research topic: Attack vectors on humans in the field of cybersecurity.',
      ],
    },
    {
      role: 'Internship - Mathematical Teacher',
      company: 'Aloysius de Roosten',
      location: 'Netherlands, Eindhoven',
      period: 'Feb 2020 - May 2021',
      highlights: [
        'This internship served to gain understanding of who I wanted to become as a teacher and what school I would like to work at.',
        'Gave a few hours worth of mathematics classes to 3th year vmbo-t students.',
        'Responsible for surveying students practicing for their mathematics exam and providing feedback on their performance and progress.',
      ],
    },
    {
      role: 'Active member',
      company: 'GEWIS, study association for Computer Science and Engineering',
      location: 'Netherlands, Eindhoven',
      period: 'Oct 2019 - Present',
      highlights: [
        'First-Year Committee (Lorem Ipsum) - Chairman',
        'First-Year Support - Chairman: organized activities and provided support for first-year students to help them integrate into the university/GEWIS community.',
        'GEBEUN - Treasurer: Organized activities and DIY projects for the association. Also managed the budget for these activities and projects, ensuring that they were financially viable and aligned with the association\'s goals.',
        'C4 - Secretary: Organized career related activities such as company visits, workshops, and lectures to help students prepare for their future careers. Managed communications and logistics for these events. For some time I was also in contact with companies such as Capgemini and PwC.',
        'GEFLITST - Member: Committee that makes pictures of all events GEWIS organizes.',
        'Intro Committee 2023 - Chairman: Organized the introduction week for new students, which included planning activities, coordinating with other committees, and ensuring a smooth and enjoyable experience for all participants.',
        'Intro Committee 2022 - Vice-Chairman',
        'AViCO - Member: Committee responsible for everything to do with audio and sound',
        'KCC 2026 - Member: Responsible for checking the finances of the association.',
      ],
    },
    {
      role: 'Advisory Board Member',
      company: 'SNiC (Stichting Nationaal Informatica Congres)',
      location: 'Netherlands, Eindhoven',
      period: 'Jul 2023 - Present',
      highlights: [
        'Here I try to provide input and advice on the organization of the annual SNiC conference, which is the largest student organized computer science conference in the Netherlands.',
      ],
    },
    {
      role: 'Active member',
      company: 'Other assocations and communities',
      location: 'Netherlands, Eindhoven',
      period: '1 year',
      highlights: [
        'AEGEE Eindhoven - Chairman of PR committee: Responsible for promotion of activites and design of promotional material and merchandise.',
        'Eindhoven Student Golf Association De Club - Treasurer Activities Committee: Organized monthly activity for all members to attend '
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
        'Internship at a Security Operation Centre (SOC) to gain real-world experience in cybersecurity operations.',
      ],
    },
    {
      program: 'Computer Science And Engineering (BSc)',
      institution: 'TU Eindhoven',
      location: 'Eindhoven, NL',
      period: 'Sept 2019 — Jun 2024',
      highlights: [
        'Focus areas: software development, algorithms, data structures, computer architecture, operating systems, cryptography, pentesting, and web security.',
        <>
          Final project: ProofFlow. An abstract editor designed to help users in writing mathematical proofs, with the help of theorem prover languages such as Rocq and Lean4 using the Language Server Protocol. It works as a standalone editor, but additional repositories are necessary to be installed in order for features such as language support and VS Code support to function. You can find the repositories here:{' '}
          <a
            href="https://github.com/Moonlington/ProofFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline break-words"
          >
            ProofFlow GitHub repository
          </a>
        </>,
        'Minor in teaching Mathematics to High School students',
      ],
    },
    {
      program: 'High School - VWO',
      institution: 'KSG De Breul',
      location: 'Zeist, NL',
      period: 'Sept 2012 — Jun 2019',
      highlights: [
        'Took courses in Mathematics, Physics, Computer Science (Informatica), and Chemistry.',
        'Informatica project: Euro Truck Simulator 2 website for tracking and sharing truck routes and stats, built with PHP, MySQL, HTML, CSS, and JavaScript.',
        'Informatica project: Snake game built with C# using only its graphics library and windows forms, without using any game engines or frameworks.',
        'Physics project: Charging a phone with a bicycle dynamo.',
        'Cambridge C2 Proficiency in English.',
      ],
    },
  ];

  // ── Gantt layout computation (career + education combined) ──────────────
  const _allItems = [
    ...career.map((item, i) => ({
      kind:       'career' as const,
      label:      item.role,
      sublabel:   item.company,
      period:     item.period,
      location:   item.location,
      highlights: item.highlights,
      origIdx:    i,
    })),
    ...education.map((item, i) => ({
      kind:       'education' as const,
      label:      item.program,
      sublabel:   item.institution,
      period:     item.period,
      location:   item.location,
      highlights: item.highlights,
      origIdx:    i,
    })),
  ];
  const _parsePeriod = (period: string) => {
    const parts = period.split(/\s*[–—-]\s*/);
    return {
      start: _parseDate(parts[0]?.trim() ?? ''),
      end:   _parseDate(parts[1]?.trim() ?? ''),
    };
  };
  const _allDates  = _allItems.map(item => _parsePeriod(item.period));
  const _validIdx  = _allDates
    .map((d, i) => ({ ...d, i }))
    .filter(d => d.start && d.end) as Array<{ start: Date; end: Date; i: number }>;
  const _tStart    = _validIdx.length ? Math.min(..._validIdx.map(d => d.start.getTime())) : 0;
  const _tEnd      = _validIdx.length ? Math.max(..._validIdx.map(d => d.end.getTime()))   : 1;
  const { t2p: _t2p, compressedSegs: _compressedSegs } = _buildScale(_validIdx, _tStart, _tEnd);
  const _lanePer   = _assignLanes(_validIdx.map(d => ({ start: d.start.getTime(), end: d.end.getTime() })));
  const _ganttItems = _allItems.map((item, i) => {
    const d    = _allDates[i];
    const vIdx = _validIdx.findIndex(v => v.i === i);
    if (vIdx === -1 || !d.start || !d.end) return { ...item, valid: false, lane: 0, left: 0, width: 0 };
    const left  = _t2p(d.start.getTime());
    const right = _t2p(d.end.getTime());
    return {
      ...item,
      valid: true,
      lane:  _lanePer[vIdx],
      left,
      width: Math.max(right - left, 1.5),
    };
  });
  const _numLanes  = _lanePer.length ? Math.max(..._lanePer) + 1 : 1;
  const _startYear = new Date(_tStart).getFullYear();
  const _endYear   = new Date(_tEnd).getFullYear();
  const _years     = Array.from({ length: _endYear - _startYear + 2 }, (_, k) => _startYear + k);
  // ────────────────────────────────────────────────────────────────────────

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



  const writings = [
    '',
  ];

  return (
    <div
      className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden"
      id="home"
      style={{
        filter: hueRotate !== null ? `hue-rotate(${hueRotate}deg)` : undefined,
        transform: isFlipped ? 'rotate(180deg)' : undefined,
        transition: 'filter 0.6s ease, transform 0.6s ease',
      }}
    >
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400/50">
              <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              className="text-base sm:text-xl tracking-wide"
            >
              Daan <span className="text-cyan-400">Verkade</span>
            </span>
          </motion.div>

         <nav
          className="hidden md:flex gap-8"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {['Home', 'Skills', 'About', 'Career', 'Education', 'Projects', 'Writing', 'Contact'].map((item) => (
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
                className="text-4xl sm:text-5xl md:text-7xl mb-4 leading-tight"
              >
                Cyber<span className="text-cyan-400">security</span>
              </motion.h1>

              <motion.h2
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                className="text-2xl sm:text-3xl md:text-5xl mb-6 text-gray-300"
              >
                student
              </motion.h2>

              <motion.div className="flex items-baseline gap-2 sm:gap-3 mb-8">
                <span
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  className="text-base sm:text-xl text-cyan-400"
                >
                  &
                </span>
                <h3
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  className="text-xl sm:text-2xl md:text-3xl"
                >
                  software test developer
                </h3>
              </motion.div>
            </motion.div>

            <motion.p
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 leading-relaxed"
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
  className="relative w-full max-w-md mx-auto md:max-w-none"
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
      className="w-full h-auto object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
  </motion.div>

  {/* Status Card */}
  <motion.div
    className="
      mt-4 w-full
      bg-[#1a1f35]/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl
      md:w-auto md:min-w-[260px] md:max-w-[320px]
      md:absolute md:-right-4 md:top-8 md:mt-0
    "
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 1 }}
    whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}
  >
    <h3
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
      className="text-sm text-gray-400 mb-4"
    >
      Status
    </h3>

    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          className="text-sm"
        >
          Available
        </span>
      </div>

      <div className="flex items-center gap-2 text-gray-300">
        <MapPin size={14} className="text-cyan-400 shrink-0" />
        <span
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          className="text-sm"
        >
          Netherlands
        </span>
      </div>

      <div className="flex items-center gap-2 text-gray-300 min-w-0">
        <Mail size={14} className="text-cyan-400 shrink-0" />
        <a
          href={mailToLink}
          className="text-sm text-cyan-400 hover:underline break-all"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          professional@verkade.org
        </a>
      </div>
    </div>
  </motion.div>

  {/* Floating Icons - desktop only */}
  <motion.div
    className="hidden md:block absolute -left-8 bottom-20 bg-[#1a1f35]/80 backdrop-blur-sm border border-cyan-400/30 rounded-full p-4"
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
    className="hidden md:block absolute -right-8 bottom-40 bg-[#1a1f35]/80 backdrop-blur-sm border border-purple-400/30 rounded-full p-4"
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
      <section id="skills" className="py-12 px-6">
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

    <motion.div
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      className="text-xl text-gray-300 leading-relaxed space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <p>
        Hi, I'm Daan. I study cybersecurity and work as a software test developer at Anago.
        I have a passion for web security, pentesting, and teaching. I enjoy sharing my knowledge
        and experiences with others, whether it's through mentoring, writing, or giving talks.
        As you can probably notice from the webpage, I have a lot of hobbies and interest, and I like
        to keep myself busy with various projects and activities.
      </p>

      <p>
        From a professional interest, I am always looking for new opportunities to learn and grow in the field of cybersecurity.
        I am especially interested in red teaming and offensive security, but I also have experience with defensive security
        and secure software development. You can sometimes see me attending Capture The Flag (CTF) events, and in my free time
        you can see me tinker on projects related to cybersecurity. Some of these projects can also be found on this webpage.
        At some point in the future I aspire to also give lectures/workshops on cybersecurity related topics, as I really enjoy
        teaching and sharing knowledge with others. So be sure to keep an eye on this future project of mine.
      </p>

      <p>
        When I am not busy with cybersecurity, I also have a lot of other hobbies and interests.
        I enjoy playing the guitar (funk, jazz, (prog) metal, and rock), cooking, playing golf, and started jogging.
      </p>
    </motion.div>
  </div>
</section>

      {/* Career & Education Section – Gantt chart */}
      <section id="career" className="py-20 bg-[#0f1421] overflow-hidden">
        {/* anchor so the "Education" nav link still scrolls here */}
        <div id="education" />
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-6xl mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Career <span className="text-cyan-400">&</span> Education <span className="text-purple-400">_</span>
          </motion.h2>
        </div>

        {/* Scrollable Gantt area */}
        <div className="px-6">
          <div
            className="overflow-x-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(34,211,238,0.25) transparent' }}
          >
            {/* Inner chart — fixed px width so bars are proportional */}
            <div
              className="relative"
              style={{ minWidth: '960px', height: `${_numLanes * 52 + 40}px` }}
            >
              {/* Year grid lines + labels */}
              {_years.map(yr => {
                const pct = _t2p(new Date(yr, 0, 1).getTime());
                if (pct < 0 || pct > 100) return null;
                return (
                  <div
                    key={yr}
                    style={{ position: 'absolute', left: `${pct}%`, top: 0, bottom: 0, width: '1px' }}
                    className="bg-white/5"
                  >
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        left: 4,
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                      className="text-xs text-gray-600 select-none whitespace-nowrap"
                    >
                      {yr}
                    </span>
                  </div>
                );
              })}

              {/* X-axis baseline */}
              <div
                className="absolute left-0 right-0 bg-white/10"
                style={{ bottom: 24, height: '1px' }}
              />

              {/* Bars */}
              {_ganttItems.map((item, index) => {
                if (!item.valid) return null;
                const isSelected = selectedCareer === index;
                const isCy = item.kind === 'career';
                const col = isCy
                  ? { r: 34,  g: 211, b: 238 }
                  : { r: 168, g: 85,  b: 247 };
                const rgba = (a: number) => `rgba(${col.r},${col.g},${col.b},${a})`;
                return (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedCareer(isSelected ? null : index)}
                    className="absolute rounded-md border text-left overflow-hidden group focus:outline-none"
                    style={{
                      left:         `${item.left}%`,
                      width:        `${item.width}%`,
                      top:          `${item.lane * 52}px`,
                      height:       '40px',
                      minWidth:     '64px',
                      paddingLeft:  '8px',
                      paddingRight: '8px',
                      borderColor:  isSelected ? rgba(0.75) : rgba(0.18),
                      background:   isSelected ? rgba(0.18) : rgba(0.07),
                      boxShadow:    isSelected ? `0 0 20px ${rgba(0.35)}` : 'none',
                    }}
                    initial={{ opacity: 0, scaleX: 0.85 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    whileHover={{
                      borderColor: rgba(0.6),
                      background:  rgba(0.16),
                      boxShadow:   `0 0 18px ${rgba(0.3)}`,
                    }}
                  >
                    <p
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      className="text-xs font-semibold text-white/80 truncate leading-tight"
                    >
                      {item.label}
                    </p>
                    <p
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      className="text-xs text-gray-500 truncate leading-tight"
                    >
                      {item.sublabel}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Note for items with unparseable dates */}
        {_ganttItems.some(i => !i.valid) && (
          <p
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
            className="max-w-7xl mx-auto px-6 mt-3 text-xs text-gray-600"
          >
            * One or more entries have approximate durations and are omitted from the chart.
          </p>
        )}

        {/* Legend */}
        <div className="max-w-7xl mx-auto px-6 mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-cyan-400/40 border border-cyan-400/60" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs text-gray-500">Career</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-purple-400/40 border border-purple-400/60" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs text-gray-500">Education</span>
          </div>
        </div>

        {/* Detail popup */}
        {selectedCareer !== null && (() => {
          const sel = _ganttItems[selectedCareer];
          const isCy = sel.kind === 'career';
          const accentClass = isCy ? 'text-cyan-300' : 'text-purple-300';
          const borderStyle = isCy ? 'border-cyan-400/30' : 'border-purple-400/30';
          const shadowStyle = isCy ? '0 0 40px rgba(34,211,238,0.12)' : '0 0 40px rgba(168,85,247,0.12)';
          const arrowClass  = isCy ? 'text-cyan-400' : 'text-purple-400';
          const periodClass = isCy ? 'text-cyan-400'  : 'text-purple-400';
          return (
            <motion.div
              key={selectedCareer}
              className="max-w-3xl mx-auto mt-8 px-6"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={`relative rounded-2xl border ${borderStyle} bg-[#1a1f35]/80 p-6`}
                style={{ boxShadow: shadowStyle }}
              >
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-xl leading-none"
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className={`text-2xl ${accentClass} mb-1`}>
                      {sel.label}
                    </h3>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-sm text-gray-400">
                      {sel.sublabel} • {sel.location}
                    </p>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className={`text-sm ${periodClass} whitespace-nowrap`}>
                    {sel.period}
                  </span>
                </div>
                <ul className="space-y-2">
                  {sel.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`${arrowClass} mt-1`}>▸</span>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-gray-300 text-sm">
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })()}
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

      {/* Floating terminal toggle button */}
      <motion.button
        onClick={() => setTerminalOpen((prev) => !prev)}
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 p-3 bg-[#161b22] border border-cyan-400/30 rounded-full text-cyan-400 hover:border-cyan-400/70 transition-colors"
        title="Open terminal (Ctrl+`)"
        aria-label="Toggle terminal"
      >
        <Terminal size={20} />
      </motion.button>

      {/* Matrix rain overlay */}
      {matrixOn && <MatrixRain />}

      {/* Interactive terminal */}
      <TerminalPanel
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onThemeChange={setHueRotate}
        onFlip={() => setIsFlipped((prev) => !prev)}
        onMatrixToggle={setMatrixOn}
        isFlipped={isFlipped}
        matrixOn={matrixOn}
      />
    </div>
  );
}
