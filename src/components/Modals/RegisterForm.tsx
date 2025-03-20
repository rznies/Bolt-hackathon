import { useState } from 'react';
import styles from './Modals.module.css';

interface RegisterFormProps {
  onSubmit: (email: string) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.trim() === '') {
      setError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="Enter your email"
          className={error ? styles.inputError : ''}
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <button type="submit" className={styles.submitButton}>
        Register
      </button>
    </form>
  );
} 