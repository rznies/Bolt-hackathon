import React from 'react';
import styles from './ToggleInterface.module.css';

interface ToggleInterfaceProps {
  currentInterface: 'developer' | 'non-developer';
  onToggle: () => void;
}

export default function ToggleInterface({ currentInterface, onToggle }: ToggleInterfaceProps) {
  return (
    <div className={styles.toggleContainer}>
      <button 
        className={styles.toggleButton} 
        onClick={onToggle}
        aria-label={`Switch to ${currentInterface === 'developer' ? 'Visual' : 'Terminal'} Interface`}
      >
        <span className={styles.toggleIcon}>
          {currentInterface === 'developer' ? '🖥️' : '💻'}
        </span>
        <span className={styles.toggleText}>
          Switch to {currentInterface === 'developer' ? 'Visual' : 'Terminal'} Interface
        </span>
      </button>
    </div>
  );
}