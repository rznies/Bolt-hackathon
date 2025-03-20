'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Terminal.module.css';
import { commandsList } from '@/utils/commands';
import ModalManager from '@/components/Modals/ModalManager';

export default function Terminal() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [participantCount, setParticipantCount] = useState(12345);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
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
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;
    
    // Add to command history
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(commandHistory.length);
    
    // Show command in terminal
    setOutput(prev => prev + `> ${trimmedCmd}\n`);
    
    // Process commands
    switch (trimmedCmd) {
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
        typeResponse(commandsList.faq + '\n');
        break;
      case 'surprise':
        typeResponse(commandsList.surprise + '\n');
        break;
      case 'clear':
        setOutput('');
        break;
      case 'hack':
        const secret = Math.floor(Math.random() * 10) + 1;
        typeResponse(`Guess a number (1-10): ${secret} (Answer revealed for demo)\n`);
        break;
      default:
        typeResponse(`Command not found: ${trimmedCmd}. Type "help" for options.\n`);
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
      <div className={styles.terminal}>
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
    </>
  );
} 