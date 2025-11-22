import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// ==================== CUSTOM CURSOR ====================
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 700 });

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isClicking ? 0.5 : isHovering ? 2 : 1,
        }}
      />
      <motion.div
        className="cursor-ring"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovering ? 1.5 : 1,
        }}
      />
    </>
  );
};

// ==================== TEXT SCRAMBLE EFFECT ====================
const ScrambleText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?0123456789';

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text.split('').map((char, index) => {
          if (index < iteration) return text[index];
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      iteration += 1 / 3;
    }, 30);
  }, [text, isScrambling, chars]);

  return (
    <motion.span
      className={className}
      onHoverStart={scramble}
      style={{ cursor: 'pointer' }}
    >
      {displayText}
    </motion.span>
  );
};

// ==================== 3D TILT CARD ====================
const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className || ''}`}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
};

// ==================== MAGNETIC BUTTON ====================
const MagneticButton = ({ children, onClick, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={`magnetic-btn ${className || ''}`}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// ==================== GLOWING ORB ====================
const GlowingOrb = () => {
  return (
    <div className="orb-container">
      <motion.div
        className="glowing-orb"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="glowing-orb orb-2"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

// ==================== BOOT SCREEN ====================
const BootScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  const bootMessages = [
    { text: 'BIOS Version 4.2.1 - Arunkumar Systems', type: 'system' },
    { text: 'Initializing quantum processors...', type: 'info' },
    { text: 'CPU: Neural Core X1 @ 4.8GHz', type: 'success' },
    { text: 'RAM: 64GB HBM3 @ 8400MHz', type: 'success' },
    { text: 'GPU: RTX 5090 Ti 32GB', type: 'success' },
    { text: 'Loading neural network modules...', type: 'info' },
    { text: 'Mounting encrypted file systems...', type: 'info' },
    { text: 'WARNING: Security protocols active', type: 'warning' },
    { text: 'Establishing secure tunnel...', type: 'info' },
    { text: 'Decrypting portfolio data...', type: 'info' },
    { text: 'Initializing Framer Motion engine...', type: 'success' },
    { text: 'Loading 3D rendering pipeline...', type: 'info' },
    { text: 'Compiling shader effects...', type: 'info' },
    { text: 'Calibrating holographic display...', type: 'info' },
    { text: '', type: 'blank' },
    { text: '[ SYSTEM READY ]', type: 'final' },
    { text: 'Welcome to the Matrix, visitor...', type: 'final' },
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootMessages.length) {
        setLines(prev => [...prev, bootMessages[i]]);
        setProgress(((i + 1) / bootMessages.length) * 100);

        // Random glitch effect
        if (Math.random() > 0.7) {
          setGlitchActive(true);
          setTimeout(() => setGlitchActive(false), 100);
        }
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className={`boot-screen ${glitchActive ? 'glitch-active' : ''}`}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="boot-logo">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="boot-spinner"
        />
      </div>
      <div className="boot-text">
        {lines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`boot-line ${line.type}`}
          >
            {line.type !== 'blank' && <span className="line-prefix">[{String(idx).padStart(2, '0')}]</span>}
            {line.text}
          </motion.div>
        ))}
      </div>
      <div className="boot-progress">
        <motion.div
          className="boot-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
        <span className="progress-text">{Math.round(progress)}%</span>
      </div>
    </motion.div>
  );
};

// ==================== MATRIX RAIN ====================
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

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(0).map(() => Math.random() * -100);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];

        // Gradient color based on position
        const gradient = ctx.createLinearGradient(0, drop * fontSize - 20, 0, drop * fontSize);
        gradient.addColorStop(0, 'rgba(0, 255, 65, 0)');
        gradient.addColorStop(1, '#00ff41');

        ctx.fillStyle = gradient;
        ctx.font = `${fontSize}px monospace`;
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

// ==================== ANIMATED COUNTER ====================
const AnimatedCounter = ({ target, label, icon }) => {
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
      className="stat-item interactive"
      whileHover={{ scale: 1.1, rotateY: 10 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <motion.div
        className="stat-icon"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>
      <motion.div
        className="stat-number"
        animate={inView ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {count}+
      </motion.div>
      <div className="stat-label">{label}</div>
      <motion.div
        className="stat-glow"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

// ==================== 3D SKILL VISUALIZATION ====================
const SkillOrb = ({ skill, level, index, total }) => {
  const angle = (index / total) * Math.PI * 2;
  const radius = 120;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="skill-orb interactive"
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ scale: 1.3, zIndex: 10 }}
    >
      <motion.div
        className="orb-inner"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          background: `conic-gradient(var(--terminal-cyan) ${level}%, transparent ${level}%)`,
        }}
      />
      <div className="orb-content">
        <span className="orb-name">{skill}</span>
        <span className="orb-level">{level}%</span>
      </div>
    </motion.div>
  );
};

// ==================== SNAKE GAME (Enhanced) ====================
const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const gameRef = useRef({});

  const startGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = 10;

    let snake = [{ x: 140, y: 100 }];
    let food = { x: 0, y: 0 };
    let powerUp = null;
    let dx = gridSize;
    let dy = 0;
    let currentScore = 0;
    let speed = 100;

    const placeFood = () => {
      food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
      food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

      // Randomly place power-up
      if (Math.random() > 0.7 && !powerUp) {
        powerUp = {
          x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
          y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
        };
      }
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
      // Clear with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw food with pulse effect
      const pulseSize = Math.sin(Date.now() / 200) * 2 + gridSize;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff0040';
      ctx.fillStyle = '#ff0040';
      ctx.beginPath();
      ctx.arc(food.x + gridSize/2, food.y + gridSize/2, pulseSize/2, 0, Math.PI * 2);
      ctx.fill();

      // Draw power-up
      if (powerUp) {
        ctx.shadowColor = '#ffb000';
        ctx.fillStyle = '#ffb000';
        ctx.beginPath();
        ctx.arc(powerUp.x + gridSize/2, powerUp.y + gridSize/2, gridSize/2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Draw snake with gradient
      snake.forEach((segment, index) => {
        const alpha = 1 - (index / snake.length) * 0.5;
        ctx.fillStyle = index === 0 ? '#00ff41' : `rgba(0, 170, 42, ${alpha})`;
        ctx.fillRect(segment.x, segment.y, gridSize - 1, gridSize - 1);

        // Glow on head
        if (index === 0) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ff41';
          ctx.fillRect(segment.x, segment.y, gridSize - 1, gridSize - 1);
          ctx.shadowBlur = 0;
        }
      });

      // Move snake
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Check collisions
      if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
          snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        clearInterval(gameLoop);
        document.removeEventListener('keydown', handleKey);
        setGameActive(false);
        if (currentScore > highScore) setHighScore(currentScore);

        // Game over animation
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff0040';
        ctx.font = 'bold 20px "Fira Code"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 15);
        ctx.fillStyle = '#00ff41';
        ctx.font = '14px "Fira Code"';
        ctx.fillText(`Score: ${currentScore}`, canvas.width / 2, canvas.height / 2 + 15);
        return;
      }

      snake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        setScore(currentScore);
        placeFood();
        speed = Math.max(50, speed - 2);
      } else if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
        currentScore += 50;
        setScore(currentScore);
        powerUp = null;
      } else {
        snake.pop();
      }
    }, speed);

    gameRef.current.interval = gameLoop;
  };

  useEffect(() => {
    return () => {
      if (gameRef.current.interval) clearInterval(gameRef.current.interval);
      if (gameRef.current.handleKey) document.removeEventListener('keydown', gameRef.current.handleKey);
    };
  }, []);

  return (
    <TiltCard className="game-card">
      <div className="game-screen">
        <canvas ref={canvasRef} width="280" height="200" />
      </div>
      <div className="game-score">
        Score: {score} | High: {highScore}
      </div>
      <div className="game-info">
        <h3 className="game-title">🐍 Snake.exe</h3>
        <p className="game-desc">Collect food, avoid walls!</p>
        <p className="game-controls">⌨️ Arrow Keys / WASD</p>
      </div>
      <MagneticButton
        className="game-btn"
        onClick={startGame}
      >
        {gameActive ? '🎮 PLAYING...' : '▶️ START GAME'}
      </MagneticButton>
    </TiltCard>
  );
};

// ==================== PONG GAME ====================
const PongGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameActive, setGameActive] = useState(false);
  const gameRef = useRef({});

  const startGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 3, dy: 2, radius: 5 };
    let playerPaddle = { y: canvas.height / 2 - 25, height: 50, width: 5 };
    let aiPaddle = { y: canvas.height / 2 - 25, height: 50, width: 5 };
    let playerScore = 0;
    let aiScore = 0;

    setScore({ player: 0, ai: 0 });
    setGameActive(true);

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      playerPaddle.y = e.clientY - rect.top - playerPaddle.height / 2;
    };

    canvas.addEventListener('mousemove', handleMouse);
    gameRef.current.handleMouse = handleMouse;

    const gameLoop = setInterval(() => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw center line
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#333';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw paddles
      ctx.fillStyle = '#00ff41';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff41';
      ctx.fillRect(10, playerPaddle.y, playerPaddle.width, playerPaddle.height);

      ctx.fillStyle = '#ff0040';
      ctx.shadowColor = '#ff0040';
      ctx.fillRect(canvas.width - 15, aiPaddle.y, aiPaddle.width, aiPaddle.height);
      ctx.shadowBlur = 0;

      // Draw ball
      ctx.fillStyle = '#00d4ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00d4ff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with top/bottom
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
      }

      // Ball collision with paddles
      if (ball.x - ball.radius < 15 && ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx *= -1.1;
        ball.dy += (Math.random() - 0.5) * 2;
      }
      if (ball.x + ball.radius > canvas.width - 15 && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
        ball.dx *= -1.1;
      }

      // AI movement
      const aiCenter = aiPaddle.y + aiPaddle.height / 2;
      if (aiCenter < ball.y - 10) aiPaddle.y += 3;
      if (aiCenter > ball.y + 10) aiPaddle.y -= 3;

      // Score
      if (ball.x < 0) {
        aiScore++;
        setScore({ player: playerScore, ai: aiScore });
        ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 3, dy: 2, radius: 5 };
      }
      if (ball.x > canvas.width) {
        playerScore++;
        setScore({ player: playerScore, ai: aiScore });
        ball = { x: canvas.width / 2, y: canvas.height / 2, dx: -3, dy: 2, radius: 5 };
      }

      // Limit speed
      ball.dx = Math.max(-8, Math.min(8, ball.dx));
      ball.dy = Math.max(-5, Math.min(5, ball.dy));
    }, 16);

    gameRef.current.interval = gameLoop;
  };

  useEffect(() => {
    return () => {
      if (gameRef.current.interval) clearInterval(gameRef.current.interval);
      if (gameRef.current.handleMouse && canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', gameRef.current.handleMouse);
      }
    };
  }, []);

  return (
    <TiltCard className="game-card">
      <div className="game-screen">
        <canvas ref={canvasRef} width="280" height="200" />
      </div>
      <div className="game-score">
        You: {score.player} | AI: {score.ai}
      </div>
      <div className="game-info">
        <h3 className="game-title">🏓 Pong.exe</h3>
        <p className="game-desc">Beat the AI!</p>
        <p className="game-controls">🖱️ Move mouse</p>
      </div>
      <MagneticButton className="game-btn" onClick={startGame}>
        {gameActive ? '🎮 PLAYING...' : '▶️ START GAME'}
      </MagneticButton>
    </TiltCard>
  );
};

// ==================== MEMORY GAME (Enhanced) ====================
const MemoryGame = () => {
  const symbols = ['⚛️', '🔷', '🟢', '⭐', '🔶', '💜', '🔴', '💎'];
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
    <TiltCard className="game-card">
      <div className="game-screen" style={{ padding: '10px' }}>
        <div className="memory-grid">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className={`memory-card ${matched.includes(card.id) ? 'matched' : ''}`}
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                rotateY: flipped.includes(card.id) || matched.includes(card.id) ? 180 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">{card.symbol}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="game-score">Moves: {moves} | Pairs: {matched.length / 2}/8</div>
      <div className="game-info">
        <h3 className="game-title">🧠 Memory.exe</h3>
        <p className="game-desc">Match the pairs!</p>
      </div>
      <MagneticButton className="game-btn" onClick={startGame}>
        {cards.length ? '🔄 RESTART' : '▶️ START GAME'}
      </MagneticButton>
    </TiltCard>
  );
};

// ==================== REACTION TIME GAME ====================
const ReactionGame = () => {
  const [state, setState] = useState('waiting'); // waiting, ready, go, result
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);
  const startTimeRef = useRef(0);
  const timeoutRef = useRef(null);

  const startGame = () => {
    setState('ready');
    const delay = Math.random() * 3000 + 1000;
    timeoutRef.current = setTimeout(() => {
      setState('go');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'ready') {
      clearTimeout(timeoutRef.current);
      setState('waiting');
      setReactionTime(-1); // Too early
    } else if (state === 'go') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      if (time < bestTime) setBestTime(time);
      setState('result');
    } else {
      startGame();
    }
  };

  return (
    <TiltCard className="game-card">
      <motion.div
        className="game-screen reaction-screen"
        onClick={handleClick}
        animate={{
          backgroundColor: state === 'ready' ? '#ff4444' : state === 'go' ? '#44ff44' : '#111',
        }}
      >
        <div className="reaction-text">
          {state === 'waiting' && 'Click to Start'}
          {state === 'ready' && 'Wait...'}
          {state === 'go' && 'CLICK NOW!'}
          {state === 'result' && (
            reactionTime === -1 ? 'Too early!' : `${reactionTime}ms`
          )}
        </div>
      </motion.div>
      <div className="game-score">
        Best: {bestTime === Infinity ? '---' : `${bestTime}ms`}
      </div>
      <div className="game-info">
        <h3 className="game-title">⚡ Reaction.exe</h3>
        <p className="game-desc">Test your reflexes!</p>
      </div>
    </TiltCard>
  );
};

// ==================== PROJECT CARD ====================
const ProjectCard = ({ title, description, tech, icon, color }) => {
  return (
    <TiltCard className="project-card">
      <motion.div
        className="project-preview"
        style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}
      >
        <motion.div
          className="project-icon"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {icon}
        </motion.div>
        <motion.div
          className="project-particles"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="particle-dot" style={{ '--i': i }} />
          ))}
        </motion.div>
      </motion.div>
      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tech">
          {tech.map((t, i) => (
            <motion.span
              key={i}
              className="tech-tag"
              whileHover={{ scale: 1.1, y: -2 }}
            >
              {t}
            </motion.span>
          ))}
        </div>
        <div className="project-actions">
          <MagneticButton className="project-btn demo">
            🚀 Live Demo
          </MagneticButton>
          <MagneticButton className="project-btn">
            📁 Source
          </MagneticButton>
        </div>
      </div>
    </TiltCard>
  );
};

// ==================== MAIN APP ====================
const App = () => {
  const [booting, setBooting] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [cmdOutput, setCmdOutput] = useState([]);
  const [showCmdOutput, setShowCmdOutput] = useState(false);
  const [easterEggCount, setEasterEggCount] = useState(0);

  const sections = ['home', 'about', 'skills', 'experience', 'projects', 'games', 'achievements', 'contact'];

  // Konami Code Easter Egg
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setEasterEggCount(prev => prev + 1);
          alert('🎮 KONAMI CODE ACTIVATED! You found a secret!');
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = e.target.value.trim().toLowerCase();
      let response = '';

      const commands = {
        help: `📋 Available commands:
  help     - Show this menu
  about    - About me
  skills   - My skills
  contact  - Get in touch
  projects - My work
  clear    - Clear terminal
  matrix   - 🔴🟢 Toggle matrix
  hack     - 💀 Hack the planet
  sudo hire - 🚀 Special command`,
        about: `👤 Chiliveri Arunkumar
━━━━━━━━━━━━━━━━━━━
🎓 ECE Student @ MLRIT
💻 Full-Stack Developer
🤖 Robotics Engineer
📍 Hyderabad, India`,
        skills: `🛠️ Technical Skills:
━━━━━━━━━━━━━━━━━━━
⚛️ React, Node.js, MongoDB
🔧 IoT, Arduino, Sensors
🤖 AI/ML, n8n Automation
🎨 Figma, Illustrator`,
        contact: `📬 Contact Info:
━━━━━━━━━━━━━━━━━━━
📧 Chiliveriarunkumar27@gmail.com
📱 +91 6304707047
🌍 Hyderabad, Telangana`,
        matrix: '🔴 Matrix mode toggled!',
        hack: `💀 INITIATING HACK SEQUENCE...
[████████████████████] 100%
ACCESS GRANTED!
Just kidding 😄`,
        'sudo hire': `🎉 ACCESS GRANTED! 🎉
━━━━━━━━━━━━━━━━━━━
Excellent choice! I'm available for:
✅ Full-time positions
✅ Freelance projects
✅ Collaborations

📧 Chiliveriarunkumar27@gmail.com`,
        clear: 'CLEAR',
      };

      if (cmd === 'clear') {
        setCmdOutput([]);
        setShowCmdOutput(false);
        e.target.value = '';
        return;
      }

      response = commands[cmd] || `❌ Command not found: ${cmd}\nType 'help' for available commands.`;

      setCmdOutput(prev => [...prev, { cmd, response }]);
      setShowCmdOutput(true);
      e.target.value = '';
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -50, rotateX: 10 }
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
      <CustomCursor />
      <MatrixRain />
      <GlowingOrb />
      <div className="scanlines" />

      <motion.div
        className="terminal-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-header">
          <div className="terminal-btn red" />
          <div className="terminal-btn yellow" />
          <div className="terminal-btn green" />
          <div className="terminal-title">
            arunkumar@portfolio:~ {easterEggCount > 0 && `[🏆 ${easterEggCount}]`}
          </div>
        </div>

        <div className="terminal-body">
          {/* Navigation */}
          <nav className="nav-bar">
            {sections.map((section) => (
              <MagneticButton
                key={section}
                className={`nav-cmd ${activeSection === section ? 'active' : ''}`}
                onClick={() => setActiveSection(section)}
              >
                ./{section}
              </MagneticButton>
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
                        '0 0 30px #00ff41',
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

                  <ScrambleText
                    text="CHILIVERI ARUNKUMAR"
                    className="hero-name"
                  />

                  <motion.p
                    className="hero-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    [ Full-Stack Developer | Robotics Engineer | AI Specialist ]
                  </motion.p>

                  <motion.div className="hero-stats">
                    <AnimatedCounter target={200} label="Students Mentored" icon="👨‍🏫" />
                    <AnimatedCounter target={500} label="Event Attendees" icon="🎯" />
                    <AnimatedCounter target={10} label="Projects" icon="🚀" />
                    <AnimatedCounter target={2} label="Awards" icon="🏆" />
                  </motion.div>

                  <motion.div
                    className="scroll-indicator"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span>Scroll to explore</span>
                    <div className="scroll-arrow">↓</div>
                  </motion.div>
                </div>
              </motion.section>
            )}

            {/* Skills Section with 3D Visualization */}
            {activeSection === 'skills' && (
              <motion.section
                key="skills"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">
                  <ScrambleText text="Technical Skills" className="title-text" />
                </h2>

                <div className="skills-3d-container">
                  <motion.div
                    className="skills-orbit"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  >
                    {[
                      ['React', 90], ['Node.js', 85], ['MongoDB', 80], ['IoT', 90],
                      ['Python', 85], ['Robotics', 88], ['AI/ML', 80], ['Figma', 80]
                    ].map(([skill, level], i, arr) => (
                      <SkillOrb key={skill} skill={skill} level={level} index={i} total={arr.length} />
                    ))}
                  </motion.div>
                  <div className="skills-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💻
                    </motion.div>
                  </div>
                </div>

                <div className="skills-grid">
                  {[
                    { title: '// Web Development', skills: [['React.js', 90], ['Node.js', 85], ['MongoDB', 80], ['Express', 85], ['HTML/CSS', 95]] },
                    { title: '// IoT & Robotics', skills: [['IoT Systems', 90], ['Arduino', 88], ['Robotics', 85], ['Sensors', 82]] },
                    { title: '// AI & Automation', skills: [['n8n', 85], ['AI Integration', 80], ['Python', 85]] },
                    { title: '// Design', skills: [['Figma', 80], ['Illustrator', 75], ['Canva', 90]] }
                  ].map((category, catIdx) => (
                    <TiltCard key={category.title} className="skill-category">
                      <h3>{category.title}</h3>
                      {category.skills.map(([name, level], i) => (
                        <SkillBar key={name} name={name} level={level} delay={catIdx * 5 + i} />
                      ))}
                    </TiltCard>
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
                <h2 className="section-title">
                  <ScrambleText text="Key Projects" className="title-text" />
                </h2>
                <div className="projects-grid">
                  <ProjectCard
                    title="Project Medha"
                    description="Semi-humanoid robot with autonomous navigation and real-time interaction"
                    tech={['Robotics', 'IoT', 'AI', 'Python']}
                    icon="🤖"
                    color="#00ff41"
                  />
                  <ProjectCard
                    title="E-commerce Platform"
                    description="Full-stack MERN application with payment integration"
                    tech={['React', 'Node.js', 'MongoDB', 'Stripe']}
                    icon="🛒"
                    color="#00d4ff"
                  />
                  <ProjectCard
                    title="AI Workflows"
                    description="Automated business processes with AI integration"
                    tech={['n8n', 'GPT-4', 'APIs']}
                    icon="⚡"
                    color="#bf00ff"
                  />
                  <ProjectCard
                    title="Gas Detection IoT"
                    description="Real-time environmental safety monitoring system"
                    tech={['ESP32', 'Sensors', 'Firebase']}
                    icon="🔬"
                    color="#ffb000"
                  />
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
                <h2 className="section-title">
                  <ScrambleText text="Interactive Games" className="title-text" />
                </h2>
                <p className="section-subtitle">
                  > Test your skills with these interactive games! 🎮
                </p>
                <div className="games-grid">
                  <SnakeGame />
                  <PongGame />
                  <MemoryGame />
                  <ReactionGame />
                </div>
              </motion.section>
            )}

            {/* Other sections remain similar but with enhanced animations */}
            {activeSection === 'about' && (
              <motion.section
                key="about"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">
                  <ScrambleText text="About Me" className="title-text" />
                </h2>
                <div className="about-content">
                  <motion.div className="about-text">
                    {[
                      '> Electronics & Communication Engineering student passionate about innovation',
                      '> Expertise in robotics, MERN stack, and AI automation',
                      '> Led 2+ national events and mentored 200+ students',
                      '> Technical Chair Person at MLRIT CIE E-Cell'
                    ].map((text, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {text}
                      </motion.p>
                    ))}
                  </motion.div>
                  <TiltCard className="info-card">
                    <h3>// System Info</h3>
                    {[
                      ['Name', 'Chiliveri Arunkumar'],
                      ['Location', 'Hyderabad, India'],
                      ['Education', 'B.Tech ECE'],
                      ['GPA', '7.4'],
                      ['Status', '🟢 Available']
                    ].map(([label, value], i) => (
                      <motion.div
                        key={label}
                        className="info-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <span className="info-label">{label}:</span>
                        <span className="info-value">{value}</span>
                      </motion.div>
                    ))}
                  </TiltCard>
                </div>
              </motion.section>
            )}

            {activeSection === 'experience' && (
              <motion.section
                key="experience"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">
                  <ScrambleText text="Experience" className="title-text" />
                </h2>
                <div className="timeline">
                  {[
                    {
                      date: 'July 2025 - Present',
                      title: 'Technical Chair Person',
                      company: 'MLRIT CIE E-Cell',
                      points: ['Lead technical strategy', 'Organize workshops', 'Guide teams']
                    },
                    {
                      date: 'Dec 2024 - July 2025',
                      title: 'Technical Mentor',
                      company: 'MLRIT CIE E-Cell',
                      points: ['Mentored 200+ students', 'IoT workshops', '2x Innovation runner-up']
                    },
                    {
                      date: 'June 2023 - Dec 2024',
                      title: 'Technical Member',
                      company: 'MLRIT CIE E-Cell',
                      points: ['Project development', 'Meta Loop Hackathon']
                    }
                  ].map((exp, i) => (
                    <motion.div
                      key={exp.title}
                      className="timeline-item"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className="timeline-date">{exp.date}</div>
                      <div className="timeline-title">{exp.title}</div>
                      <div className="timeline-company">{exp.company}</div>
                      <ul className="timeline-desc">
                        {exp.points.map((point, j) => (
                          <li key={j}>{point}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeSection === 'achievements' && (
              <motion.section
                key="achievements"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">
                  <ScrambleText text="Achievements" className="title-text" />
                </h2>
                <div className="achievements-grid">
                  {[
                    { icon: '🏆', title: 'Event Management', desc: '2+ national events, 500+ attendees' },
                    { icon: '🥈', title: 'Innovation Awards', desc: '2x runner-up in Innovation Challenge' },
                    { icon: '👨‍🏫', title: 'Mentorship', desc: 'Guided 200+ students' },
                    { icon: '🤖', title: 'Project Medha', desc: 'Semi-humanoid robot' },
                    { icon: '🎯', title: 'Hackathon Lead', desc: 'Meta Loop Hackathon' },
                    { icon: '💡', title: 'IoT Workshop', desc: 'Comprehensive training' }
                  ].map((achievement, i) => (
                    <TiltCard key={achievement.title} className="achievement-card">
                      <motion.div
                        className="achievement-icon"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {achievement.icon}
                      </motion.div>
                      <h3 className="achievement-title">{achievement.title}</h3>
                      <p className="achievement-desc">{achievement.desc}</p>
                    </TiltCard>
                  ))}
                </div>
              </motion.section>
            )}

            {activeSection === 'contact' && (
              <motion.section
                key="contact"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="section"
              >
                <h2 className="section-title">
                  <ScrambleText text="Contact Me" className="title-text" />
                </h2>
                <div className="contact-container">
                  <TiltCard className="contact-info">
                    {[
                      { icon: '📧', label: 'Email', value: 'Chiliveriarunkumar27@gmail.com', href: 'mailto:Chiliveriarunkumar27@gmail.com' },
                      { icon: '📱', label: 'Phone', value: '+91 6304707047', href: 'tel:+916304707047' },
                      { icon: '📍', label: 'Location', value: 'Hyderabad, India' },
                      { icon: '💼', label: 'LinkedIn', value: 'Connect', href: '#' },
                      { icon: '🐙', label: 'GitHub', value: 'View repos', href: '#' }
                    ].map((contact, i) => (
                      <motion.div
                        key={contact.label}
                        className="contact-item interactive"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 10, backgroundColor: 'rgba(0, 255, 65, 0.1)' }}
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
                  </TiltCard>

                  <TiltCard className="contact-form">
                    <form onSubmit={(e) => { e.preventDefault(); alert('✅ Message sent!'); }}>
                      {['Name', 'Email', 'Subject'].map((field) => (
                        <div key={field} className="form-group">
                          <label>{field}:</label>
                          <motion.input
                            type={field === 'Email' ? 'email' : 'text'}
                            required
                            placeholder={`Enter ${field.toLowerCase()}`}
                            whileFocus={{ borderColor: '#00d4ff', scale: 1.02 }}
                          />
                        </div>
                      ))}
                      <div className="form-group">
                        <label>Message:</label>
                        <motion.textarea
                          required
                          placeholder="Your message"
                          whileFocus={{ borderColor: '#00d4ff', scale: 1.02 }}
                        />
                      </div>
                      <MagneticButton className="submit-btn">
                        🚀 Send Message
                      </MagneticButton>
                    </form>
                  </TiltCard>
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
                placeholder="Type 'help' for commands..."
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
                    <div className="cmd-line">visitor@arunkumar:~$ {item.cmd}</div>
                    <pre className="cmd-response">{item.response}</pre>
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

// ==================== SKILL BAR ====================
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
          transition={{ duration: 1, delay: delay * 0.05, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default App;
