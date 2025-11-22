import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Boot Screen Component
const BootScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);

  const bootMessages = [
    'BIOS Version 4.2.1 - Arunkumar Systems',
    'Initializing hardware components...',
    'CPU: Intel Core i7-12700K @ 3.6GHz',
    'RAM: 32GB DDR5 @ 5200MHz',
    'GPU: NVIDIA RTX 4080 16GB',
    'Loading kernel modules...',
    'Mounting file systems...',
    'Starting network services...',
    'Loading portfolio data...',
    'Initializing React components...',
    'Compiling Framer Motion animations...',
    'Loading user preferences...',
    'Starting GUI subsystem...',
    '',
    'Welcome to Arunkumar\'s Portfolio Terminal v3.0',
    'Type "help" for available commands',
    '',
    'System ready.'
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootMessages.length) {
        setLines(prev => [...prev, bootMessages[i]]);
        setProgress(((i + 1) / bootMessages.length) * 100);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="boot-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="boot-text">
        {lines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className="boot-line"
          >
            {line || ' '}
          </motion.div>
        ))}
      </div>
      <div className="boot-progress">
        <motion.div
          className="boot-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

// Matrix Rain Component
const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(0).map(() => Math.random() * -100);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drop * fontSize);
        if (drop * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
};

// Floating Particles
const Particles = () => {
  return (
    <div className="particles">
      {Array(50).fill(0).map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{ y: '100vh', x: `${Math.random() * 100}%` }}
          animate={{ y: '-100vh', rotate: 720 }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

// Animated Counter
const AnimatedCounter = ({ target, label }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, target]);

  return (
    <motion.div
      ref={ref}
      className="stat-item"
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="stat-number">{count}+</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
};

// Skill Bar Component
const SkillBar = ({ name, level, delay }) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <div className="skill-item" ref={ref}>
      <div className="skill-name">
        <span>{name}</span>
        <span>{level}%</span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-progress"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: delay * 0.1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Snake Game Component
const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const gameRef = useRef({});

  const startGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = 10;

    let snake = [{ x: 140, y: 100 }];
    let food = { x: 0, y: 0 };
    let dx = gridSize;
    let dy = 0;
    let currentScore = 0;

    const placeFood = () => {
      food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
      food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    };

    placeFood();
    setScore(0);
    setGameActive(true);

    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          if (dy === 0) { dx = 0; dy = -gridSize; }
          break;
        case 'ArrowDown': case 's': case 'S':
          if (dy === 0) { dx = 0; dy = gridSize; }
          break;
        case 'ArrowLeft': case 'a': case 'A':
          if (dx === 0) { dx = -gridSize; dy = 0; }
          break;
        case 'ArrowRight': case 'd': case 'D':
          if (dx === 0) { dx = gridSize; dy = 0; }
          break;
        default: break;
      }
    };

    document.addEventListener('keydown', handleKey);
    gameRef.current.handleKey = handleKey;

    const gameLoop = setInterval(() => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#111';
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Draw food with glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff0040';
      ctx.fillStyle = '#ff0040';
      ctx.fillRect(food.x, food.y, gridSize - 1, gridSize - 1);
      ctx.shadowBlur = 0;

      // Draw snake
      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff41' : '#00aa2a';
        ctx.fillRect(segment.x, segment.y, gridSize - 1, gridSize - 1);
      });

      // Move snake
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Check collisions
      if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
          snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        clearInterval(gameLoop);
        document.removeEventListener('keydown', handleKey);
        setGameActive(false);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff0040';
        ctx.font = '16px "Fira Code"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#00ff41';
        ctx.font = '12px "Fira Code"';
        ctx.fillText(`Score: ${currentScore}`, canvas.width / 2, canvas.height / 2 + 15);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        setScore(currentScore);
        placeFood();
      } else {
        snake.pop();
      }
    }, 100);

    gameRef.current.interval = gameLoop;
  };

  useEffect(() => {
    return () => {
      if (gameRef.current.interval) clearInterval(gameRef.current.interval);
      if (gameRef.current.handleKey) document.removeEventListener('keydown', gameRef.current.handleKey);
    };
  }, []);

  return (
    <motion.div
      className="game-card"
      whileHover={{ scale: 1.02, borderColor: '#bf00ff' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="game-screen">
        <canvas ref={canvasRef} width="280" height="200" />
      </div>
      <div className="game-score">Score: {score}</div>
      <div className="game-info">
        <h3 className="game-title">Snake.exe</h3>
        <p className="game-desc">Classic snake game with terminal aesthetics</p>
        <p className="game-controls">Controls: Arrow Keys or WASD</p>
      </div>
      <motion.button
        className="game-btn"
        onClick={startGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={gameActive}
      >
        {gameActive ? 'PLAYING...' : 'START GAME'}
      </motion.button>
    </motion.div>
  );
};

// Memory Game Component
const MemoryGame = () => {
  const symbols = ['{ }', '[ ]', '( )', '< >', '&&', '||', '=>', '::'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const startGame = () => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setMatched(m => [...m, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <motion.div
      className="game-card"
      whileHover={{ scale: 1.02, borderColor: '#bf00ff' }}
    >
      <div className="game-screen" style={{ padding: '10px' }}>
        <div className="memory-grid">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className={`memory-card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotateY: flipped.includes(card.id) || matched.includes(card.id) ? 180 : 0,
                backgroundColor: matched.includes(card.id) ? 'rgba(0, 255, 65, 0.2)' : '#111'
              }}
            >
              {(flipped.includes(card.id) || matched.includes(card.id)) ? card.symbol : '?'}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="game-score">Moves: {moves} | Pairs: {matched.length / 2}/8</div>
      <div className="game-info">
        <h3 className="game-title">Memory.exe</h3>
        <p className="game-desc">Match the programming symbols</p>
      </div>
      <motion.button
        className="game-btn"
        onClick={startGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {cards.length ? 'RESTART' : 'START GAME'}
      </motion.button>
    </motion.div>
  );
};

// Typing Game Component
const TypingGame = () => {
  const words = ['function', 'variable', 'const', 'return', 'async', 'await', 'import', 'export', 'class', 'interface'];
  const [currentWord, setCurrentWord] = useState('Press Start');
  const [input, setInput] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameActive, setGameActive] = useState(false);
  const [stats, setStats] = useState({ words: 0, correct: 0, total: 0 });
  const startTimeRef = useRef(0);

  const startGame = () => {
    setGameActive(true);
    setStats({ words: 0, correct: 0, total: 0 });
    startTimeRef.current = Date.now();
    newWord();
  };

  const newWord = () => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    setInput('');
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    setStats(s => ({ ...s, total: s.total + 1 }));

    if (value === currentWord) {
      const newStats = {
        words: stats.words + 1,
        correct: stats.correct + currentWord.length,
        total: stats.total + 1
      };
      setStats(newStats);

      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
      setWpm(Math.round(newStats.words / elapsed) || 0);
      setAccuracy(Math.round((newStats.correct / newStats.total) * 100));
      newWord();
    }
  };

  return (
    <motion.div
      className="game-card"
      whileHover={{ scale: 1.02, borderColor: '#bf00ff' }}
    >
      <div className="game-screen" style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            key={currentWord}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ fontSize: '24px', color: '#00d4ff', marginBottom: '20px' }}
          >
            {currentWord}
          </motion.div>
          <input
            type="text"
            value={input}
            onChange={handleInput}
            disabled={!gameActive}
            placeholder="Type here..."
            className="typing-input"
          />
        </div>
      </div>
      <div className="game-score">WPM: {wpm} | Accuracy: {accuracy}%</div>
      <div className="game-info">
        <h3 className="game-title">TypeRacer.exe</h3>
        <p className="game-desc">Test your typing speed</p>
      </div>
      <motion.button
        className="game-btn"
        onClick={startGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {gameActive ? 'RESTART' : 'START GAME'}
      </motion.button>
    </motion.div>
  );
};

// Hacker Game Component
const HackerGame = () => {
  const [lines, setLines] = useState([]);
  const [hacks, setHacks] = useState(0);
  const [isHacking, setIsHacking] = useState(false);

  const messages = [
    'Initializing backdoor protocol...',
    'Bypassing firewall...',
    'Accessing mainframe...',
    'Decrypting password hash...',
    'Password found: ********',
    'Establishing SSH tunnel...',
    'Uploading payload...',
    'Executing remote shell...',
    'Extracting database...',
    'Covering tracks...',
    'ACCESS GRANTED',
    'System compromised successfully!'
  ];

  const startHack = async () => {
    setIsHacking(true);
    setLines([]);

    for (let i = 0; i < messages.length; i++) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 500));
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setLines(prev => [...prev, { code, msg: messages[i] }]);

      if (Math.random() > 0.5) {
        const data = Array(20).fill().map(() => Math.random().toString(16).substring(2, 4)).join(' ');
        setLines(prev => [...prev, { data }]);
      }
    }

    setHacks(h => h + 1);
    setIsHacking(false);
  };

  return (
    <motion.div
      className="game-card"
      whileHover={{ scale: 1.02, borderColor: '#bf00ff' }}
    >
      <div className="game-screen" style={{ padding: '15px', overflow: 'hidden' }}>
        <div className="hacker-terminal">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: '10px', marginBottom: '2px' }}
            >
              {line.data ? (
                <span style={{ color: '#333' }}>{line.data}</span>
              ) : (
                <>
                  <span style={{ color: '#444' }}>[{line.code}]</span> {line.msg}
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="game-score">Systems Hacked: {hacks}</div>
      <div className="game-info">
        <h3 className="game-title">Hacker.exe</h3>
        <p className="game-desc">Simulate hacking into systems</p>
      </div>
      <motion.button
        className="game-btn"
        onClick={startHack}
        disabled={isHacking}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isHacking ? 'HACKING...' : 'INITIATE HACK'}
      </motion.button>
    </motion.div>
  );
};

// Project Card Component
const ProjectCard = ({ title, description, tech, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="project-card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="project-preview">
        {children}
      </div>
      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tech">
          {tech.map((t, i) => (
            <motion.span
              key={i}
              className="tech-tag"
              initial={{ scale: 1 }}
              animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {t}
            </motion.span>
          ))}
        </div>
        <div className="project-actions">
          <motion.button
            className="project-btn demo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Demo
          </motion.button>
          <motion.button
            className="project-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Source Code
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Animated Project Preview - Robot
const RobotPreview = () => {
  return (
    <motion.div className="preview-container">
      <motion.div
        className="robot-body"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="robot-head"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="robot-eyes">
            <motion.div
              className="robot-eye"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="robot-eye"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </motion.div>
        <motion.div
          className="robot-antenna"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <motion.div
            className="antenna-light"
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Main App Component
const App = () => {
  const [booting, setBooting] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [cmdOutput, setCmdOutput] = useState([]);
  const [showCmdOutput, setShowCmdOutput] = useState(false);

  const sections = ['home', 'about', 'skills', 'experience', 'projects', 'games', 'achievements', 'contact'];

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = e.target.value.trim().toLowerCase();
      let response = '';

      switch (cmd) {
        case 'help':
          response = `Available commands:\n  help, about, skills, contact, projects, clear, sudo hire`;
          break;
        case 'about':
          response = `Chiliveri Arunkumar\nECE Student | Full-Stack Developer | Robotics Engineer`;
          break;
        case 'skills':
          response = `Technical Skills:\n• Web: React, Node.js, MongoDB\n• IoT: Arduino, Sensors\n• AI: n8n, AI Integration`;
          break;
        case 'contact':
          response = `Email: Chiliveriarunkumar27@gmail.com\nPhone: +91 6304707047`;
          break;
        case 'clear':
          setCmdOutput([]);
          setShowCmdOutput(false);
          e.target.value = '';
          return;
        case 'sudo hire':
          response = `🎉 ACCESS GRANTED 🎉\nI'm available for opportunities!\nContact: Chiliveriarunkumar27@gmail.com`;
          break;
        default:
          response = `Command not found: ${cmd}\nType 'help' for available commands.`;
      }

      setCmdOutput(prev => [...prev, { cmd, response }]);
      setShowCmdOutput(true);
      e.target.value = '';
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -50 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (booting) {
    return (
      <>
        <MatrixRain />
        <BootScreen onComplete={() => setBooting(false)} />
      </>
    );
  }

  return (
    <div className="app">
      <MatrixRain />
      <Particles />
      <div className="scanlines" />

      <motion.div
        className="terminal-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-header">
          <div className="terminal-btn red" />
          <div className="terminal-btn yellow" />
          <div className="terminal-btn green" />
          <div className="terminal-title">arunkumar@portfolio:~</div>
        </div>

        <div className="terminal-body">
          {/* Navigation */}
          <nav className="nav-bar">
            {sections.map((section) => (
              <motion.button
                key={section}
                className={`nav-cmd ${activeSection === section ? 'active' : ''}`}
                onClick={() => setActiveSection(section)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ./{section}
              </motion.button>
            ))}
          </nav>

          <AnimatePresence mode="wait">
            {/* Home Section */}
            {activeSection === 'home' && (
              <motion.section
                key="home"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <div className="hero-container">
                  <motion.pre
                    className="ascii-art"
                    animate={{
                      textShadow: [
                        '0 0 10px #00ff41',
                        '0 0 20px #00ff41',
                        '0 0 10px #00ff41'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
{`    ___    ____  __  ___   ____ __ __  __  ___    ___    ____
   /   |  / __ \\/ / / / | / / //_// / / / /   |  / _ \\  / __ \\
  / /| | / /_/ / / / /  |/ / ,<  / / / / / /| | / /_/ / / /_/ /
 / ___ |/ _, _/ /_/ / /|  / /| |/ /_/ / / ___ |/ _, _/ / _, _/
/_/  |_/_/ |_|\\____/_/ |_/_/ |_|\\____/ /_/  |_/_/ |_| /_/ |_|`}
                  </motion.pre>

                  <motion.h1
                    className="hero-name glitch"
                    data-text="CHILIVERI ARUNKUMAR"
                    variants={itemVariants}
                  >
                    CHILIVERI ARUNKUMAR
                  </motion.h1>

                  <motion.p className="hero-title" variants={itemVariants}>
                    [ Full-Stack Developer | Robotics Engineer | AI Automation Specialist ]
                  </motion.p>

                  <motion.div
                    className="typing-text"
                    variants={itemVariants}
                  >
                    <TypeWriter />
                  </motion.div>

                  <motion.div className="hero-stats" variants={itemVariants}>
                    <AnimatedCounter target={200} label="Students Mentored" />
                    <AnimatedCounter target={500} label="Event Attendees" />
                    <AnimatedCounter target={10} label="Projects Completed" />
                    <AnimatedCounter target={2} label="Innovation Awards" />
                  </motion.div>
                </div>
              </motion.section>
            )}

            {/* About Section */}
            {activeSection === 'about' && (
              <motion.section
                key="about"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">About Me</h2>
                <div className="about-content">
                  <motion.div className="about-text" variants={itemVariants}>
                    <p>> Electronics & Communication Engineering student with a passion for building innovative solutions at the intersection of hardware and software.</p>
                    <p>> Expertise in robotics, full-stack development (MERN), and AI automation. I love turning complex problems into elegant, functional solutions.</p>
                    <p>> Proven leader in organizing 2+ national-level technical events and hackathons. I've mentored 200+ students in technical project development.</p>
                    <p>> Currently serving as Technical Chair Person at MLRIT CIE E-Cell, guiding cross-functional teams toward successful outcomes.</p>
                  </motion.div>
                  <motion.div className="info-card" variants={itemVariants}>
                    <h3>// System Information</h3>
                    {[
                      ['Name:', 'Chiliveri Arunkumar'],
                      ['Location:', 'Hyderabad, India'],
                      ['Education:', 'B.Tech ECE'],
                      ['GPA:', '7.4'],
                      ['Status:', 'Available']
                    ].map(([label, value], i) => (
                      <motion.div
                        key={label}
                        className="info-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <span className="info-label">{label}</span>
                        <span className="info-value">{value}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <motion.section
                key="skills"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">Technical Skills</h2>
                <div className="skills-grid">
                  {[
                    {
                      title: '// Web Development',
                      skills: [
                        ['React.js', 90], ['Node.js', 85], ['MongoDB', 80], ['Express.js', 85], ['HTML/CSS', 95]
                      ]
                    },
                    {
                      title: '// Programming & IoT',
                      skills: [
                        ['C Programming', 85], ['IoT Systems', 90], ['Robotics', 88], ['Microcontrollers', 85]
                      ]
                    },
                    {
                      title: '// Automation & AI',
                      skills: [
                        ['n8n Workflow', 85], ['AI Integration', 80]
                      ]
                    },
                    {
                      title: '// Design & Tools',
                      skills: [
                        ['Figma', 80], ['Adobe Illustrator', 75], ['Canva', 90], ['WordPress', 85]
                      ]
                    }
                  ].map((category, catIdx) => (
                    <motion.div
                      key={category.title}
                      className="skill-category"
                      variants={itemVariants}
                      whileHover={{ borderColor: '#00ff41' }}
                    >
                      <h3>{category.title}</h3>
                      {category.skills.map(([name, level], i) => (
                        <SkillBar key={name} name={name} level={level} delay={catIdx * 5 + i} />
                      ))}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <motion.section
                key="experience"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">Professional Experience</h2>
                <div className="timeline">
                  {[
                    {
                      date: 'July 2025 - Present',
                      title: 'Technical Chair Person',
                      company: 'MLRIT CIE E-Cell, Hyderabad',
                      points: [
                        'Spearhead technical strategy and project direction',
                        'Orchestrate planning and execution of technical workshops',
                        'Serve as primary technical contact for engineering challenges'
                      ]
                    },
                    {
                      date: 'December 2024 - July 2025',
                      title: 'Technical Mentor',
                      company: 'MLRIT CIE E-Cell, Hyderabad',
                      points: [
                        'Mentored 200+ students through complete lifecycle of micro-projects',
                        'Engineered and delivered comprehensive IoT workshop',
                        'Provided critical analysis contributing to runner-up finishes'
                      ]
                    },
                    {
                      date: 'June 2023 - December 2024',
                      title: 'Technical Member',
                      company: 'MLRIT CIE E-Cell, Hyderabad',
                      points: [
                        'Contributed to development of technical projects',
                        'Organized Meta Loop Hackathon'
                      ]
                    }
                  ].map((exp, i) => (
                    <motion.div
                      key={exp.title}
                      className="timeline-item"
                      variants={itemVariants}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className="timeline-date">{exp.date}</div>
                      <div className="timeline-title">{exp.title}</div>
                      <div className="timeline-company">{exp.company}</div>
                      <ul className="timeline-desc">
                        {exp.points.map((point, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.2 + j * 0.1 }}
                          >
                            {point}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Projects Section */}
            {activeSection === 'projects' && (
              <motion.section
                key="projects"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">Key Projects</h2>
                <div className="projects-grid">
                  <ProjectCard
                    title="Project Medha: Semi-Humanoid Robot"
                    description="Led end-to-end design and construction of semi-humanoid robot with autonomous navigation, event anchoring, and real-time human interaction capabilities."
                    tech={['Robotics', 'IoT', 'AI', 'Python']}
                  >
                    <RobotPreview />
                  </ProjectCard>

                  <ProjectCard
                    title="Full-Stack E-commerce Platform"
                    description="Architected complete e-commerce website using MERN stack with RESTful APIs, product catalog, shopping cart, and order management."
                    tech={['React', 'Node.js', 'MongoDB', 'Express']}
                  >
                    <EcommercePreview />
                  </ProjectCard>

                  <ProjectCard
                    title="AI-Powered Automated Workflows"
                    description="Deployed automated workflows using n8n integrated with AI assistants, streamlining processes and improving operational efficiency."
                    tech={['n8n', 'GPT-4', 'APIs', 'Automation']}
                  >
                    <AutomationPreview />
                  </ProjectCard>

                  <ProjectCard
                    title="IoT-Based Gas Detection System"
                    description="Built real-time gas detection prototype using IoT sensors, microcontrollers, and wireless communication for environmental safety monitoring."
                    tech={['ESP32', 'IoT', 'Sensors', 'Firebase']}
                  >
                    <GasPreview />
                  </ProjectCard>
                </div>
              </motion.section>
            )}

            {/* Games Section */}
            {activeSection === 'games' && (
              <motion.section
                key="games"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">Interactive Games</h2>
                <p style={{ color: '#666', marginBottom: '20px', fontSize: '12px' }}>
                  > Play some games while you're here! These demonstrate my interactive development skills.
                </p>
                <div className="games-grid">
                  <SnakeGame />
                  <TypingGame />
                  <MemoryGame />
                  <HackerGame />
                </div>
              </motion.section>
            )}

            {/* Achievements Section */}
            {activeSection === 'achievements' && (
              <motion.section
                key="achievements"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">Achievements & Leadership</h2>
                <div className="achievements-grid">
                  {[
                    { icon: '🏆', title: 'Event Management', desc: 'Organized 2+ national-level technical events and hackathons for 500+ attendees' },
                    { icon: '🥈', title: 'Innovation Recognition', desc: 'Runner-up twice in MLR Institute of Technology\'s Innovation Challenge' },
                    { icon: '👨‍🏫', title: 'Community Impact', desc: 'Mentored 200+ students in technical project development and career readiness' },
                    { icon: '🤖', title: 'Project Medha', desc: 'Led development of semi-humanoid robot with autonomous navigation capabilities' },
                    { icon: '🎯', title: 'Meta Loop Hackathon', desc: 'Coordinated logistics and technical infrastructure for major hackathon event' },
                    { icon: '💡', title: 'IoT Workshop', desc: 'Engineered and delivered comprehensive IoT workshop with hands-on training' }
                  ].map((achievement, i) => (
                    <motion.div
                      key={achievement.title}
                      className="achievement-card"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, borderColor: '#ffb000' }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <motion.div
                        className="achievement-icon"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {achievement.icon}
                      </motion.div>
                      <h3 className="achievement-title">{achievement.title}</h3>
                      <p className="achievement-desc">{achievement.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Contact Section */}
            {activeSection === 'contact' && (
              <motion.section
                key="contact"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">Contact Me</h2>
                <div className="contact-container">
                  <motion.div className="contact-info" variants={itemVariants}>
                    {[
                      { icon: '📧', label: 'Email', value: 'Chiliveriarunkumar27@gmail.com', href: 'mailto:Chiliveriarunkumar27@gmail.com' },
                      { icon: '📱', label: 'Phone', value: '+91 6304707047', href: 'tel:+916304707047' },
                      { icon: '📍', label: 'Location', value: 'Hyderabad, Telangana, 500085' },
                      { icon: '💼', label: 'LinkedIn', value: 'Connect with me', href: '#' },
                      { icon: '🐙', label: 'GitHub', value: 'View my repos', href: '#' }
                    ].map((contact, i) => (
                      <motion.div
                        key={contact.label}
                        className="contact-item"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 10 }}
                      >
                        <div className="contact-icon">{contact.icon}</div>
                        <div className="contact-details">
                          <h4>{contact.label}</h4>
                          {contact.href ? (
                            <a href={contact.href}>{contact.value}</a>
                          ) : (
                            <span>{contact.value}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div className="contact-form" variants={itemVariants}>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                      {['Name', 'Email', 'Subject'].map((field) => (
                        <div key={field} className="form-group">
                          <label>{field}:</label>
                          <motion.input
                            type={field === 'Email' ? 'email' : 'text'}
                            required
                            placeholder={`Enter your ${field.toLowerCase()}`}
                            whileFocus={{ borderColor: '#00d4ff', boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)' }}
                          />
                        </div>
                      ))}
                      <div className="form-group">
                        <label>Message:</label>
                        <motion.textarea
                          required
                          placeholder="Enter your message"
                          whileFocus={{ borderColor: '#00d4ff', boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)' }}
                        />
                      </div>
                      <motion.button
                        type="submit"
                        className="submit-btn"
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        SEND MESSAGE
                      </motion.button>
                    </form>
                  </motion.div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Command Line */}
          <div className="command-line">
            <div className="cmd-input-container">
              <span className="cmd-prompt">visitor@arunkumar:~$</span>
              <input
                type="text"
                className="cmd-input"
                placeholder="Type 'help' for available commands..."
                onKeyPress={handleCommand}
              />
            </div>
            {showCmdOutput && (
              <motion.div
                className="cmd-output"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                {cmdOutput.map((item, i) => (
                  <div key={i}>
                    <div style={{ color: '#00d4ff' }}>visitor@arunkumar:~$ {item.cmd}</div>
                    <pre style={{ color: '#888', margin: '10px 0', whiteSpace: 'pre-wrap' }}>{item.response}</pre>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// TypeWriter Component
const TypeWriter = () => {
  const strings = [
    'Building the future with code and circuits...',
    'Full-Stack Developer & Robotics Engineer',
    'Transforming ideas into reality',
    'Creating intelligent automation solutions'
  ];
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = strings[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1));
        if (text === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setText(current.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setIndex((index + 1) % strings.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, strings]);

  return <span>{text}<span className="cursor">|</span></span>;
};

// Ecommerce Preview
const EcommercePreview = () => (
  <motion.div className="preview-container ecommerce">
    <motion.div
      className="cart-icon"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      🛒
    </motion.div>
    <motion.div
      className="product-falling"
      animate={{ y: [-50, 150], opacity: [1, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.div>
);

// Automation Preview
const AutomationPreview = () => (
  <motion.div className="preview-container automation">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="node"
        style={{ left: `${20 + i * 30}%` }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
      />
    ))}
    <motion.div
      className="data-flow"
      animate={{ x: [0, 200], opacity: [1, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.div>
);

// Gas Detection Preview
const GasPreview = () => {
  const [level, setLevel] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(Math.random() * 60 + 20);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const color = level > 70 ? '#ff0040' : level > 50 ? '#ffb000' : '#00ff41';

  return (
    <motion.div className="preview-container gas">
      <motion.div
        className="sensor-display"
        animate={{ borderColor: color }}
      >
        <motion.span
          animate={{ color }}
          style={{ fontSize: '24px', fontWeight: 'bold' }}
        >
          {Math.round(level)}%
        </motion.span>
      </motion.div>
      {level > 70 && (
        <motion.div
          className="warning-light"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default App;
