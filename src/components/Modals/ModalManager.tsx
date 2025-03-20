import Modal from './Modal';
import RegisterForm from './RegisterForm';
import styles from './Modals.module.css';

interface ModalManagerProps {
  activeModal: string | null;
  onClose: () => void;
  participantCount: number;
  onRegister: (email: string) => void;
}

export default function ModalManager({ activeModal, onClose, participantCount, onRegister }: ModalManagerProps) {
  if (!activeModal) return null;

  const renderModalContent = () => {
    switch (activeModal) {
      case 'register':
        return <RegisterForm onSubmit={onRegister} />;
      
      case 'tweets':
        return (
          <div className={styles.tweetsContainer}>
            <p>Loading tweets...</p>
          </div>
        );
      
      case 'participants':
        return <p>Current participants: {participantCount}</p>;
      
      case 'faq':
        return (
          <div className={styles.faqContainer}>
            <div className={styles.faqItem}>
              <h3>What is a hackathon?</h3>
              <p>A hackathon is an event where people come together to collaborate on computer programming projects.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Who can participate?</h3>
              <p>Anyone with an interest in technology and problem-solving can participate!</p>
            </div>
            <div className={styles.faqItem}>
              <h3>How to register?</h3>
              <p>Type "register" in the terminal and follow the instructions</p>
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div className={styles.aboutContainer}>
            <p>World&apos;s Largest Hackathon by Bolt.new</p>
            <p>100,000 participants</p>
            <p>Prize pool: $1M+</p>
            <p>Date: TBD, Virtual</p>
          </div>
        );
      
      case 'prizes':
        return (
          <div className={styles.prizesContainer}>
            <p>Total Prize Pool: $1M+</p>
            <p>First Prize: $500,000</p>
            <p>Second Prize: $300,000</p>
            <p>Third Prize: $200,000</p>
          </div>
        );
      
      case 'judges':
        return (
          <div className={styles.judgesContainer}>
            <p>Judges: @levelsio, @OfficialLoganK, @saranormous, @theo, @youyuxi, @thisiskp_, @alexalbert__, @bentossell</p>
          </div>
        );
      
      case 'sponsors':
        return (
          <div className={styles.sponsorsContainer}>
            <p>Sponsors: @Supabase, @Netlify, @CloudflareDev, @GetSentry, @Loops, @AlgoFoundation, @ExaAILabs, @hsrhackerhouse</p>
          </div>
        );
      
      default:
        return <p>Modal content not found</p>;
    }
  };

  const getModalTitle = () => {
    const titles: Record<string, string> = {
      register: 'Register',
      tweets: 'Tweets',
      participants: 'Participants',
      faq: 'Frequently Asked Questions',
      about: 'About Bolt.new Hackathon',
      prizes: 'Prizes',
      judges: 'Judges',
      sponsors: 'Sponsors'
    };
    
    return titles[activeModal] || 'Modal';
  };

  return (
    <Modal title={getModalTitle()} onClose={onClose}>
      {renderModalContent()}
    </Modal>
  );
} 