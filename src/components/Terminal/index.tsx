'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Terminal.module.css';
import { commandsList } from '@/utils/commands';
import ModalManager from '@/components/Modals/ModalManager';
import ToggleInterface from '@/components/SharedComponents/ToggleInterface';

interface TerminalProps {
  onToggle: () => void;
}

interface Theme {
  background: string;
  text: string;
  accent: string;
  name: string;
}

const themes: Theme[] = [
  { name: 'Matrix', background: '#000', text: '#00FF00', accent: '#003300' },
  { name: 'Cyberpunk', background: '#2b213a', text: '#ff79c6', accent: '#bd93f9' },
  { name: 'Retro', background: '#2d2d2d', text: '#ff8833', accent: '#ffd700' },
  { name: 'Ocean', background: '#002b36', text: '#839496', accent: '#268bd2' }
];

export default function Terminal({ onToggle }: TerminalProps) {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [participantCount, setParticipantCount] = useState(12345);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gameState, setGameState] = useState<{number: number; attempts: number; hints: number} | null>(null);
  
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const typingSoundRef = useRef<HTMLAudioElement | null>(null);
  const enterSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize terminal with boot screen
  useEffect(() => {
    const bootScreen = `
[ Bolt.new Hackathon OS v1.0 ]
     Loading...
    
`;
    setOutput(bootScreen);
    
    // Simulate loading progress
    let progress = 0;
    const loading = setInterval(() => {
      progress += 10;
      setOutput(bootScreen + `[${'#'.repeat(progress / 10)}${' '.repeat(10 - progress / 10)}] ${progress}%`);
      
      if (progress >= 100) {
        clearInterval(loading);
        setTimeout(() => {
          setOutput('');
          typeWelcome("Welcome to Bolt.new Hackathon Terminal\nType \"help\" for commands.\n\n>");
        }, 500);
      }
    }, 100);

    // Load sound effects
    try {
      typingSoundRef.current = new Audio('/sounds/beep-01a.wav');
      enterSoundRef.current = new Audio('/sounds/beep-02.wav');
    } catch (error) {
      console.warn('Sound effects not available:', error);
    }
    
    // Update participant count occasionally
    const participantInterval = setInterval(() => {
      setParticipantCount(prev => prev + Math.floor(Math.random() * 10));
    }, 5000);

    return () => {
      clearInterval(loading);
      clearInterval(participantInterval);
    };
  }, []);

  // Auto-scroll terminal output
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input field on mount and when modal closes
  useEffect(() => {
    if (!activeModal && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [activeModal]);

  const typeWelcome = (text: string) => {
    let i = 0;
    function type() {
      if (i < text.length) {
        setOutput(prev => prev + text[i]);
        i++;
        setTimeout(type, 50);
      }
    }
    type();
  };

  const cycleTheme = () => {
    const currentIndex = themes.findIndex(t => t.name === currentTheme.name);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    setCurrentTheme(newTheme);
    document.documentElement.style.setProperty('--theme-bg', newTheme.background);
    document.documentElement.style.setProperty('--theme-text', newTheme.text);
    document.documentElement.style.setProperty('--theme-accent', newTheme.accent);
    typeResponse(`Switched to ${newTheme.name} theme\n`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    
    if (value.length > 0) {
      const matches = Object.keys(commandsList).filter(cmd =>
        cmd.startsWith(value.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    if (commandInputRef.current) {
      commandInputRef.current.focus();
    }
  };

  const typeResponse = (text: string) => {
    let i = 0;
    function type() {
      if (i < text.length) {
        setOutput(prev => prev + text[i]);
        i++;
        setTimeout(type, 20);
      }
    }
    type();
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;
    
    // Play enter sound
    if (enterSoundRef.current) {
      enterSoundRef.current.currentTime = 0;
      enterSoundRef.current.play().catch(console.error);
    }
    
    // Add to command history
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(commandHistory.length);
    
    // Show command in terminal
    setOutput(prev => prev + `> ${trimmedCmd}\n`);
    
    // Parse command and arguments
    const [command, ...args] = trimmedCmd.toLowerCase().split(' ');
    
    // Process commands
    switch (command) {
      case 'help':
        typeResponse(commandsList.help + '\n');
        break;
      case 'about':
        setActiveModal('about');
        typeResponse(commandsList.about + '\n');
        break;
      case 'register':
        setActiveModal('register');
        break;
      case 'prizes':
        setActiveModal('prizes');
        typeResponse(commandsList.prizes + '\n');
        break;
      case 'judges':
        setActiveModal('judges');
        typeResponse(commandsList.judges + '\n');
        break;
      case 'sponsors':
        setActiveModal('sponsors');
        typeResponse(commandsList.sponsors + '\n');
        break;
      case 'participants':
        setActiveModal('participants');
        typeResponse(`Current participants: ${participantCount}\n`);
        break;
      case 'tweets':
        setActiveModal('tweets');
        break;
      case 'faq':
        setActiveModal('faq');
        break;
      case 'hack':
        const difficulty = args[0] || 'normal';
        const gameConfig = (() => {
          switch(difficulty.toLowerCase()) {
            case 'easy':
              return { range: 50, hints: 5 };
            case 'hard':
              return { range: 200, hints: 2 };
            default:
              return { range: 100, hints: 3 };
          }
        })();
        
        const newTargetNumber = Math.floor(Math.random() * gameConfig.range) + 1;
        setGameState({
          number: newTargetNumber,
          attempts: 0,
          hints: gameConfig.hints
        });
        
        typeResponse(`🎮 Number Guessing Game - ${difficulty.toUpperCase()} MODE\n\nGuess a number between 1-${gameConfig.range}\nYou have ${gameConfig.hints} hints available!\nType 'hint' for a clue\n\n`);
        break;

      case 'hint':
        if (!gameState) {
          typeResponse('No active game! Type "hack" to start a new game.\n');
          break;
        }
        
        if (gameState.hints <= 0) {
          typeResponse('No hints left! Keep guessing!\n');
          break;
        }
        
        const target = gameState.number;
        const hintMessages = [
          `The number is ${target % 2 === 0 ? 'even' : 'odd'}`,
          `The number is ${target > 50 ? 'greater' : 'less'} than 50`,
          `The first digit is ${Math.floor(target / 10)}`,
          `The sum of digits is ${target.toString().split('').reduce((a, b) => a + parseInt(b), 0)}`,
          `It's a ${target.toString().length}-digit number`
        ];
        
        const randomHint = hintMessages[Math.floor(Math.random() * hintMessages.length)];
        setGameState(prev => prev ? { ...prev, hints: prev.hints - 1 } : null);
        typeResponse(`🎯 Hint (${gameState.hints - 1} left):\n${randomHint}\n`);
        break;
      
      case 'theme':
        if (args.length === 0) {
          cycleTheme();
        } else {
          const themeNumber = parseInt(args[0]);
          if (!isNaN(themeNumber) && themeNumber >= 1 && themeNumber <= themes.length) {
            setCurrentTheme(themes[themeNumber - 1]);
            typeResponse(`Switched to ${themes[themeNumber - 1].name} theme\n`);
          } else {
            typeResponse('Invalid theme number. Type "theme" to see available themes.\n');
          }
        }
        break;

      case 'surprise':
        const surpriseThemes = [
          'AI-powered Social Network',
          'Blockchain Gaming Platform', 
          'Climate Tech Solution',
          'Web3 Education Platform',
          'Healthcare AI Assistant',
          'Decentralized Finance App'
        ];
        const randomTheme = surpriseThemes[Math.floor(Math.random() * surpriseThemes.length)];
        typeResponse(`🎯 Your Hackathon Theme: ${randomTheme}\n\nGet coding! 🚀\n`);
        break;

      case 'clear':
        setOutput('');
        break;

      default:
        if (gameState && /^\d+$/.test(command)) {
          const guess = parseInt(command);
          const target = gameState.number;
          
          setGameState(prev => prev ? { ...prev, attempts: prev.attempts + 1 } : null);
          
          if (guess === target) {
            typeResponse(`🎉 Congratulations! You got it in ${gameState.attempts + 1} attempts!\n`);
            setGameState(null);
          } else {
            const hint = guess > target ? 'Too high!' : 'Too low!';
            typeResponse(`${hint} Try again...\n`);
          }
        } else {
          typeResponse(`Command not found: ${trimmedCmd}. Type "help" for options.\n`);
          typeResponse(commandsList.faq + '\n');
        }
        break;
    }
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(prev => prev - 1);
        setInput(commandHistory[historyIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(prev => prev + 1);
        setInput(commandHistory[historyIndex + 1]);
      } else {
        setInput('');
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (enterSoundRef.current) {
        enterSoundRef.current.play().catch(() => {
          // Silently fail if audio playback fails
        });
      }
      handleCommand(input);
    } else if (e.key === 'Escape') {
      setActiveModal(null);
    } else {
      if (typingSoundRef.current) {
        typingSoundRef.current.play().catch(() => {
          // Silently fail if audio playback fails
        });
      }
    }
  };

  const handleRegistration = (email: string) => {
    setOutput(prev => prev + `> register ${email}\n`);
    typeResponse(`Thank you for registering! We will send a confirmation to ${email}\n`);
    setActiveModal(null);
  };

  return (
    <>
      <div 
      className={styles.terminal} 
      data-theme={currentTheme.name}
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.text
      }}>
        <div className={styles.terminalOutput} ref={terminalOutputRef}>
          {output}
        </div>
        <div className={styles.inputLine}>
          <span>&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={commandInputRef}
            aria-label="Enter terminal command"
            className={styles.commandInput}
            style={{
              color: currentTheme.text,
              caretColor: currentTheme.text
            }}
          />
        </div>
      </div>

      {/* Modal Manager */}
      <ModalManager
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        participantCount={participantCount}
        onRegister={handleRegistration}
      />
      
      {/* Toggle Interface */}
      <ToggleInterface 
        currentInterface="developer" 
        onToggle={onToggle} 
      />
    </>
  );
}