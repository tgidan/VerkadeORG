import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon } from 'lucide-react';

type LineType = 'input' | 'output' | 'error' | 'success' | 'system';

interface Line {
  id: number;
  type: LineType;
  text: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (hue: number | null) => void;
  onFlip: () => void;
  onMatrixToggle: (on: boolean) => void;
  isFlipped: boolean;
  matrixOn: boolean;
}

let _id = 0;
function mkLine(type: LineType, text: string): Line {
  return { id: _id++, type, text };
}

const WELCOME: Line[] = [
  mkLine('system', '╔══════════════════════════════════════════╗'),
  mkLine('system', '║   verkade.org  —  Interactive Terminal   ║'),
  mkLine('system', '╚══════════════════════════════════════════╝'),
  mkLine('output', ''),
  mkLine('output', 'Welcome. Type "help" to see available commands.'),
  mkLine('output', ''),
];

const THEME_MAP: Record<string, number | null> = {
  cyan: null,
  default: null,
  purple: 90,
  green: -60,
  red: 180,
  orange: -150,
  pink: 60,
};

export function Terminal({
  isOpen,
  onClose,
  onThemeChange,
  onFlip,
  onMatrixToggle,
  isFlipped,
  matrixOn,
}: Props) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLines = (newLines: Line[]) =>
    setLines((prev) => [...prev, ...newLines]);

  const processCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    addLines([mkLine('input', `$ ${trimmed}`)]);
    setCmdHistory((prev) => [trimmed, ...prev].slice(0, 50));
    setHistIdx(-1);

    const parts = trimmed.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    const rawArgs = trimmed.slice(cmd.length).trim();

    switch (cmd) {
      case 'cd': {
        const SECTIONS = ['home', 'about', 'career', 'education', 'projects', 'skills', 'contact'];
        const target = args[0] ?? '';
        if (!target) {
          addLines([
            mkLine('output', ''),
            mkLine('output', 'Usage: cd <section>'),
            mkLine('output', `Sections: ${SECTIONS.join(', ')}`),
            mkLine('output', ''),
          ]);
        } else if (SECTIONS.includes(target)) {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
          addLines([
            mkLine('output', ''),
            mkLine('success', `Navigating to /${target}...`),
            mkLine('output', ''),
          ]);
        } else {
          addLines([
            mkLine('error', `cd: ${target}: No such section`),
            mkLine('output', `Sections: ${SECTIONS.join(', ')}`),
          ]);
        }
        break;
      }

      case 'help':
        addLines([
          mkLine('output', ''),
          mkLine('success', 'Available commands:'),
          mkLine('output', ''),
          mkLine('output', '  help          — show this help'),
          mkLine('output', '  cd <section>  — navigate to a section'),
          mkLine('output', '  about         — who is Daan?'),
          mkLine('output', '  skills        — list skills'),
          mkLine('output', '  projects      — list projects'),
          mkLine('output', '  whoami        — identify yourself'),
          mkLine('output', '  ls            — list directory'),
          mkLine('output', '  cat <file>    — read a file'),
          mkLine('output', '  echo <msg>    — echo a message'),
          mkLine('output', '  ping <host>   — ping a host'),
          mkLine('output', '  date          — current date & time'),
          mkLine('output', '  history       — command history'),
          mkLine('output', '  clear         — clear the terminal'),
          mkLine('output', '  exit          — close the terminal'),
          mkLine('output', ''),
          mkLine('system', '  Hint: there may be hidden commands worth finding...'),
          mkLine('output', ''),
        ]);
        break;

      case 'about':
        addLines([
          mkLine('output', ''),
          mkLine('success', '▸ Daan Verkade'),
          mkLine('output', '  Cybersecurity MSc student at TU Eindhoven.'),
          mkLine('output', '  Software Test Developer at Anago.'),
          mkLine('output', '  Enthusiast of security, testing, and teaching.'),
          mkLine('output', '  Based in the Netherlands. ☁'),
          mkLine('output', ''),
        ]);
        break;

      case 'skills':
        addLines([
          mkLine('output', ''),
          mkLine('success', 'Skills:'),
          mkLine('output', '  [●] Web Security        [●] QA & Automation'),
          mkLine('output', '  [●] Cypress             [●] K6'),
          mkLine('output', '  [●] CI/CD               [●] Pentesting'),
          mkLine('output', '  [●] Threat Modeling     [●] Teaching'),
          mkLine('output', '  [●] Mentoring'),
          mkLine('output', ''),
        ]);
        break;

      case 'projects':
        addLines([
          mkLine('output', ''),
          mkLine('success', 'Projects:'),
          mkLine('output', '  ▸ Project ICARUS — Facial recognition & OSINT research'),
          mkLine('output', '  ▸ Flipper Zero   — BadUSB & RF security experiments'),
          mkLine('output', '  ▸ ProofFlow      — Mathematical proof editor (BSc thesis)'),
          mkLine('output', ''),
        ]);
        break;

      case 'whoami':
        addLines([
          mkLine('output', ''),
          mkLine('output', 'Identifying visitor...'),
          mkLine('success', 'You are: A curious visitor to verkade.org'),
          mkLine('output', 'Access level: GUEST'),
          mkLine('system', 'Note: All terminal activity is monitored. (just kidding)'),
          mkLine('output', ''),
        ]);
        break;

      case 'ls':
      case 'dir': {
        const showHidden =
          args.includes('-a') ||
          args.includes('-la') ||
          args.includes('-al') ||
          args.includes('-lah');
        addLines([
          mkLine('output', ''),
          mkLine('output', 'drwxr-xr-x  about/'),
          mkLine('output', 'drwxr-xr-x  career/'),
          mkLine('output', 'drwxr-xr-x  education/'),
          mkLine('output', 'drwxr-xr-x  projects/'),
          mkLine('output', '-rw-r--r--  about.txt'),
          mkLine('output', '-rw-r--r--  skills.txt'),
          mkLine('output', '-rw-r--r--  contact.txt'),
          ...(showHidden
            ? [
                mkLine('success', '-rw-------  .secret'),
                mkLine('success', '-rwxr-xr-x  .matrix'),
                mkLine('success', '-rwxr-xr-x  .flip'),
              ]
            : []),
          mkLine('output', ''),
        ]);
        break;
      }

      case 'cat':
        if (!args[0]) {
          addLines([mkLine('error', 'cat: missing file operand')]);
        } else if (args[0] === 'about.txt') {
          addLines([
            mkLine('output', ''),
            mkLine('output', "Hi, I'm Daan Verkade."),
            mkLine('output', ''),
            mkLine('output', 'Cybersecurity student at TU Eindhoven (MSc) and'),
            mkLine('output', 'Software Test Developer at Anago. Passionate about'),
            mkLine('output', 'web security, test automation, and teaching.'),
            mkLine('output', ''),
            mkLine('output', "When I'm not breaking things to understand them,"),
            mkLine('output', "I'm writing tests to make sure they stay fixed."),
            mkLine('output', ''),
          ]);
        } else if (args[0] === 'skills.txt') {
          addLines([
            mkLine('output', ''),
            mkLine('output', 'Web Security, QA & Automation, K6, CI/CD,'),
            mkLine('output', 'Cypress, Pentesting, Threat Modeling,'),
            mkLine('output', 'Teaching, Mentoring'),
            mkLine('output', ''),
          ]);
        } else if (args[0] === 'contact.txt') {
          addLines([
            mkLine('output', ''),
            mkLine('output', 'Email:  professional@verkade.org'),
            mkLine('output', 'GitHub: github.com/tgidan'),
            mkLine('output', ''),
          ]);
        } else if (args[0] === '.secret') {
          addLines([
            mkLine('output', ''),
            mkLine('success', '┌────────────────────────────────────────────────┐'),
            mkLine('success', '│  You found something hidden.               │'),
            mkLine('success', '│                                            │'),
            mkLine('success', '│  Unlockable commands:                      │'),
            mkLine('success', '│    matrix        — enter the matrix        │'),
            mkLine('success', '│    flip          — flip the world          │'),
            mkLine('success', '│    theme <color> — change reality          │'),
            mkLine('success', '│    neofetch      — system information      │'),
            mkLine('success', '│    hack          — go h4x0r                │'),
            mkLine('success', '│    coffee        — much needed             │'),
            mkLine('success', '└────────────────────────────────────────────────┘'),
            mkLine('output', ''),
          ]);
        } else if (args[0] === '.supersecret') {
          addLines([
            mkLine('output', ''),
            mkLine('success', '┌───────────────────────────────────────────────────────────┐'),
            mkLine('success', '│  How did you find this???   — ALL COMMANDS           │'),
            mkLine('success', '├───────────────────────────────────────────────────────────┤'),
            mkLine('success', '│  PUBLIC                                              │'),
            mkLine('success', '│    help              — show help                     │'),
            mkLine('success', '│    cd <section>      — navigate to a section         │'),
            mkLine('success', '│    about             — who is Daan?                  │'),
            mkLine('success', '│    skills            — list skills                   │'),
            mkLine('success', '│    projects          — list projects                 │'),
            mkLine('success', '│    whoami            — identify yourself             │'),
            mkLine('success', '│    ls [-a]           — list directory                │'),
            mkLine('success', '│    cat <file>        — read a file                   │'),
            mkLine('success', '│    echo <msg>        — echo a message                │'),
            mkLine('success', '│    ping <host>       — ping a host                   │'),
            mkLine('success', '│    date              — current date & time           │'),
            mkLine('success', '│    history           — command history               │'),
            mkLine('success', '│    clear             — clear the terminal            │'),
            mkLine('success', '│    exit              — close the terminal            │'),
            mkLine('success', '├───────────────────────────────────────────────────────────┤'),
            mkLine('success', '│  HIDDEN                                              │'),
            mkLine('success', '│    matrix            — enter the matrix              │'),
            mkLine('success', '│    flip              — flip the world                │'),
            mkLine('success', '│    theme <color>     — change reality                │'),
            mkLine('success', '│    neofetch          — system information            │'),
            mkLine('success', '│    hack              — go h4x0r                      │'),
            mkLine('success', '│    coffee            — much needed                   │'),
            mkLine('success', '│    sudo              — escalate privileges           │'),
            mkLine('success', '│    konami            — you know the code             │'),
            mkLine('success', '│    hi Daan           — maybe I\'ll say hello back     │'),
            mkLine('success', '│    hello             — say hello!                    │'),
            mkLine('success', '│    queen             — who would it be?              │'),
            mkLine('success', '│    vinci             — An absolute legend!           │'),
            mkLine('success', '└───────────────────────────────────────────────────────────┘'),
            mkLine('output', ''),
          ]);
        } else if (args[0] === '.matrix') {
          addLines([
            mkLine('output', ''),
            mkLine('success', 'You already know what to type.'),
            mkLine('output', ''),
          ]);
        } else if (args[0] === '.flip') {
          addLines([
            mkLine('output', ''),
            mkLine('success', "You already know what to type. Don't you?"),
            mkLine('output', ''),
          ]);
        } else {
          addLines([
            mkLine('error', `cat: ${args[0]}: No such file or directory`),
          ]);
        }
        break;

      case 'echo':
        addLines([mkLine('output', rawArgs || '')]);
        break;

      case 'ping': {
        const host = args[0] || 'localhost';
        addLines([
          mkLine('output', ''),
          mkLine('output', `PING ${host}: 56 data bytes`),
          mkLine('success', `64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.042 ms`),
          mkLine('success', `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.038 ms`),
          mkLine('success', `64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.041 ms`),
          mkLine('output', '--- ping statistics ---'),
          mkLine('output', '3 packets transmitted, 3 received, 0% packet loss'),
          mkLine('output', ''),
        ]);
        break;
      }

      case 'date':
        addLines([mkLine('output', new Date().toString())]);
        break;

      case 'history':
        if (cmdHistory.length === 0) {
          addLines([mkLine('output', 'No commands in history yet.')]);
        } else {
          addLines([
            mkLine('output', ''),
            ...cmdHistory.map((c, i) =>
              mkLine('output', `  ${String(cmdHistory.length - i).padStart(3)}  ${c}`)
            ),
            mkLine('output', ''),
          ]);
        }
        break;

      case 'clear':
        setLines([]);
        return;

      // ── Easter eggs ────────────────────────────────────────────────────────

      case 'matrix':
        onMatrixToggle(!matrixOn);
        addLines([
          mkLine('output', ''),
          mkLine(
            'success',
            matrixOn ? 'Matrix deactivated. Reality restored.' : 'Entering the Matrix...'
          ),
          ...(!matrixOn
            ? [
                mkLine('system', 'You took the red pill.'),
                mkLine('system', 'Type "matrix" again to take the blue pill.'),
              ]
            : []),
          mkLine('output', ''),
        ]);
        break;

      case 'flip':
        onFlip();
        addLines([
          mkLine('output', ''),
          mkLine(
            'success',
            isFlipped ? 'Reality restored.' : 'The world has been flipped.'
          ),
          mkLine('system', isFlipped ? 'Welcome back to normal.' : 'This is your world now.'),
          mkLine('output', ''),
        ]);
        break;

      case 'theme': {
        const color = args[0] ?? '';
        if (!color) {
          addLines([
            mkLine('output', ''),
            mkLine('output', 'Usage: theme <color>'),
            mkLine('output', 'Colors: cyan (default), purple, green, red, orange, pink'),
            mkLine('output', ''),
          ]);
        } else if (color in THEME_MAP) {
          onThemeChange(THEME_MAP[color]);
          addLines([
            mkLine('output', ''),
            mkLine('success', `Theme changed to: ${color}`),
            mkLine('output', ''),
          ]);
        } else {
          addLines([
            mkLine('error', `Unknown theme: ${color}`),
            mkLine('output', 'Colors: cyan (default), purple, green, red, orange, pink'),
          ]);
        }
        break;
      }

      case 'neofetch':
        addLines([
          mkLine('output', ''),
          mkLine('success', ' ██████╗ ██╗   ██╗'),
          mkLine('success', ' ██╔══██╗██║   ██║   daan@verkade.org'),
          mkLine('success', ' ██║  ██║██║   ██║   ─────────────────────────────'),
          mkLine('success', ' ██║  ██║╚██╗ ██╔╝   OS: Portfolio OS v1.0'),
          mkLine('success', ' ██████╔╝ ╚████╔╝    Host: verkade.org'),
          mkLine('success', ' ╚═════╝   ╚═══╝     Shell: interactive-sh'),
          mkLine('output', '                       Role: Cybersecurity Student'),
          mkLine('output', '                       Location: Netherlands ⚡'),
          mkLine('output', '                       Skills: Security, QA, Testing'),
          mkLine('output', '                       Coffee: ████████░░ 80%'),
          mkLine('output', '                       CTF rank: [CLASSIFIED]'),
          mkLine('output', ''),
        ]);
        break;

      case 'coffee':
        addLines([
          mkLine('output', ''),
          mkLine('output', '         ) )'),
          mkLine('output', '        ( ('),
          mkLine('output', '      .......'),
          mkLine('output', '     |       |___'),
          mkLine('output', '     |       |   \\'),
          mkLine('output', '     |       |    |'),
          mkLine('output', '     |       |____|'),
          mkLine('output', '      \\_____/'),
          mkLine('output', ''),
          mkLine('success', '  Freshly brewed. You deserve it. ☕'),
          mkLine('output', ''),
        ]);
        break;

      case 'hack': {
        const hackOutput: Line[] = [
          mkLine('output', ''),
          mkLine('output', 'Initializing hack sequence...'),
          mkLine('output', 'Scanning target: verkade.org'),
          mkLine('output', '  port  22   SSH       [OPEN]'),
          mkLine('output', '  port  80   HTTP      [OPEN]'),
          mkLine('output', '  port 443   HTTPS     [OPEN]'),
          mkLine('output', '  port 1337  LEET      [OPEN]'),
          mkLine('output', ''),
          mkLine('output', 'Attempting SQL injection...'),
          mkLine('error', 'ERROR: Input sanitized. Nice try.'),
          mkLine('output', 'Trying XSS payload...'),
          mkLine('error', 'ERROR: CSP blocked. Really?'),
          mkLine('output', 'Brute-forcing password...'),
          mkLine('output', '  ["password","123456","admin","letmein","hunter2"]'),
          mkLine('error', 'ERROR: None of those worked. Shocking.'),
          mkLine('output', '.'),
          mkLine('output', '..'),
          mkLine('output', '...'),
          mkLine('error', 'HACK FAILED'),
          mkLine('output', ''),
          mkLine('system', 'Turns out Daan knows about security. Who knew.'),
          mkLine('output', ''),
        ];
        addLines(hackOutput);
        break;
      }

      case 'sudo': {
        const subcmd = args.join(' ');
        if (subcmd === 'make me a sandwich') {
          addLines([
            mkLine('output', ''),
            mkLine('success', 'Okay.'),
            mkLine('output', ''),
            mkLine('output', '       🥪'),
            mkLine('output', ''),
          ]);
        } else if (subcmd.startsWith('rm')) {
          addLines([
            mkLine('output', ''),
            mkLine('error', "rm: cannot remove '/': Permission denied"),
            mkLine('system', 'Nice try. Incident logged. (it was not)'),
            mkLine('output', ''),
          ]);
        } else if (subcmd === 'hack the planet') {
          addLines([
            mkLine('output', ''),
            mkLine('success', 'HACK THE PLANET! 🌍'),
            mkLine('output', ''),
          ]);
        } else if (subcmd === 'request_presence') {
          const url = `${window.location.origin}/?page=request`;
          addLines([
            mkLine('output', ''),
            mkLine('success', 'Opening presence request form...'),
            mkLine('output', url),
            mkLine('output', ''),
          ]);
          setTimeout(() => { window.location.href = url; }, 800);
        } else if (subcmd === 'help') {
          addLines([
            mkLine('output', ''),
            mkLine('success', 'sudo subcommands:'),
            mkLine('output', '  make me a sandwich'),
            mkLine('output', '  rm <file>'),
            mkLine('output', '  hack the planet'),
            mkLine('output', '  help'),
            mkLine('output', ''),
          ]);
        } else {
          addLines([
            mkLine('output', ''),
            mkLine('error', `sudo: ${args[0] ?? 'command'}: command not found`),
            mkLine('system', "This incident will be reported. (it won't)"),
            mkLine('system', "Try 'sudo help' for list of subcommands"),
            mkLine('output', ''),
          ]);
        }
        break;
      }

      case 'hi':
        if (args[0] === 'daan') {
          addLines([
            mkLine('output', ''),
            mkLine('success', 'Hello beautiful. 💙'),
            mkLine('output', ''),
          ]);
        } else {
          addLines([mkLine('error', `Command not found: ${trimmed}`), mkLine('output', 'Type "help" for available commands.')]);
        }
        break;

      case 'hello':
        addLines([
          mkLine('output', ''),
          mkLine('success', 'Hey there, stranger! 👋'),
          mkLine('output', "You've stumbled into the right terminal."),
          mkLine('system', 'Welcome to verkade.org. Make yourself at home.'),
          mkLine('output', ''),
        ]);
        break;

      case 'queen':
        addLines([
          mkLine('output', ''),
          mkLine('success', '♛  A special thanks to Ida Slomnicka  ♛'),
          mkLine('output', ''),
          mkLine('output', '  The original design of this website was crafted'),
          mkLine('output', '  by Ida — a talented designer and valued colleague.'),
          mkLine('output', ''),
          mkLine('system', '  This one\'s for you. Thank you, Ida. 🙏'),
          mkLine('output', ''),
        ]);
        break;

      case 'vinci':
        addLines([
          mkLine('output', ''),
          mkLine('success', 'Vinci'),
          mkLine('output', ''),
          mkLine('output', '  Pro table soccer player, aspiring chef, and all-around legend & CEO.'),
          mkLine('output', '  The nickname given by my valued colleagues Rik, Petar, and Luuk.'),
          mkLine('output', ''),
          mkLine('system', '  Thanks for the laughs and good times. You know who you are. 🙌'),
          mkLine('output', ''),
        ]);
        break;

      case 'konami':
        addLines([
          mkLine('output', ''),
          mkLine('success', '↑ ↑ ↓ ↓ ← → ← → B A'),
          mkLine('output', ''),
          mkLine('success', "Classic. But this isn't that kind of game."),
          mkLine('system', '...or is it?'),
          mkLine('output', ''),
        ]);
        break;

      case 'exit':
      case 'quit':
      case 'close':
        onClose();
        return;

      default:
        addLines([
          mkLine('error', `Command not found: ${cmd}`),
          mkLine('output', 'Type "help" for available commands.'),
        ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(newIdx);
      setInput(cmdHistory[newIdx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      setHistIdx(newIdx);
      setInput(newIdx === -1 ? '' : (cmdHistory[newIdx] ?? ''));
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const lineClass = (type: LineType): string => {
    switch (type) {
      case 'input':   return 'text-white';
      case 'success': return 'text-cyan-400';
      case 'error':   return 'text-red-400';
      case 'system':  return 'text-yellow-300/80';
      default:        return 'text-gray-300';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={isMaximized
            ? 'fixed inset-0 z-50 p-0'
            : 'fixed bottom-0 left-0 right-0 z-50 px-4 pb-4'}
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
          onClick={() => !isMinimized && inputRef.current?.focus()}
        >
          <div className={`${isMaximized ? 'h-full rounded-none' : 'mx-auto max-w-4xl rounded-xl'} bg-[#0d1117] border border-cyan-400/20 overflow-hidden shadow-2xl shadow-cyan-500/10 flex flex-col`}>
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5 select-none shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 group">
                  <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    aria-label="Close terminal"
                    className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                  >
                    <span className="hidden group-hover:block text-[8px] leading-none text-red-900 font-bold">×</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsMinimized((v) => !v); }}
                    aria-label="Minimize terminal"
                    className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 flex items-center justify-center transition-colors"
                  >
                    <span className="hidden group-hover:block text-[8px] leading-none text-yellow-900 font-bold">−</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsMaximized((v) => !v); setIsMinimized(false); }}
                    aria-label="Maximize terminal"
                    className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 flex items-center justify-center transition-colors"
                  >
                    <span className="hidden group-hover:block text-[8px] leading-none text-green-900 font-bold">+</span>
                  </button>
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <TerminalIcon size={11} />
                  verkade.org — interactive-sh
                </span>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Output area */}
                <div className={`${isMaximized ? 'flex-1' : 'h-64'} overflow-y-auto p-4 text-sm leading-relaxed`}>
                  {lines.map((l) => (
                    <div key={l.id} className={`${lineClass(l.type)} whitespace-pre-wrap break-all`}>
                      {l.text}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input row */}
                <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 shrink-0">
                  <span className="text-cyan-400 text-sm select-none">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-white text-sm outline-none caret-cyan-400 placeholder:text-gray-600"
                    placeholder="enter command..."
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
