'use client';

import { useState, useEffect } from 'react';
import ToggleInterface from '@/components/SharedComponents/ToggleInterface';
import styles from './LandingPage.module.css';
import Image from 'next/image';

interface LandingPageProps {
  onToggle: () => void;
}

export default function LandingPage({ onToggle }: LandingPageProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [participantCount, setParticipantCount] = useState(0);
  const [activeRegions, setActiveRegions] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<{region: string, count: number, time: Date}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleTimelineItems, setVisibleTimelineItems] = useState<number[]>([]);

  // Simulate real-time participant updates
  useEffect(() => {
    const updateParticipants = () => {
      const increase = Math.floor(Math.random() * 5) + 1;
      setParticipantCount(prev => prev + increase);
      
      const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      
      setActiveRegions(prev => [
        randomRegion,
        ...prev.slice(0, 4)
      ]);
      
      // Add to notifications
      setNotifications(prev => [
        { region: randomRegion, count: increase, time: new Date() },
        ...prev.slice(0, 19) // Keep only the 20 most recent notifications
      ]);
    };
    
    const interval = setInterval(updateParticipants, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle mouse movement for particle effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  // Timeline animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const timelineItems = document.querySelectorAll(`.${styles.timelineItem}`);
      
      timelineItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8) {
          setVisibleTimelineItems(prev => {
            if (!prev.includes(index)) {
              return [...prev, index];
            }
            return prev;
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono overflow-x-hidden">
      {/* Notification Sidebar */}
      <div className={`${styles.notificationSidebar} ${showNotifications ? styles.visible : ''}`}>
        <div className={styles.notificationHeader}>
          <h3>Recent Participants</h3>
          <button onClick={() => setShowNotifications(false)} aria-label="Close notifications">
            ✕
          </button>
        </div>
        {notifications.map((notification, index) => (
          <div key={index} className={styles.notificationItem}>
            <div className={styles.notificationIcon}>👤</div>
            <div>
              <div>{notification.count} new {notification.count === 1 ? 'participant' : 'participants'} from {notification.region}</div>
              <div className="text-xs opacity-70">{notification.time.toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Notification Toggle Button */}
      <button 
        className={styles.notificationToggle} 
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Toggle notifications"
      >
        🔔
      </button>
      {/* Toggle Interface */}
      <ToggleInterface 
        currentInterface="non-developer" 
        onToggle={onToggle} 
      />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <span className="text-xl">🌍 Active Participants: {participantCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div></div> {/* Empty div for flex spacing */}
          <div className={styles.languageSelector}>
            <button 
              className={styles.languageButton}
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              aria-label="Select language"
            >
              {language} <span>▼</span>
            </button>
            <div className={`${styles.languageDropdown} ${showLanguageDropdown ? styles.visible : ''}`}>
              <div className={styles.languageOption} onClick={() => {
                setLanguage('English');
                setShowLanguageDropdown(false);
              }}>English</div>
              <div className={styles.languageOption} onClick={() => {
                setLanguage('Español');
                setShowLanguageDropdown(false);
              }}>Español</div>
              <div className={styles.languageOption} onClick={() => {
                setLanguage('Français');
                setShowLanguageDropdown(false);
              }}>Français</div>
              <div className={styles.languageOption} onClick={() => {
                setLanguage('中文');
                setShowLanguageDropdown(false);
              }}>中文</div>
              <div className={styles.languageOption} onClick={() => {
                setLanguage('日本語');
                setShowLanguageDropdown(false);
              }}>日本語</div>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center">Bolt.new Hackathon</h1>
        <p className="text-xl text-center mt-2">World's Largest Hackathon</p>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className={`text-center mb-16 ${styles.heroSection}`}>
          <div className={styles.heroInteractive}>
            {/* Particle effect that follows mouse */}
            <div 
              className={styles.mouseCursor} 
              style={{ 
                left: `${mousePosition.x}px`, 
                top: `${mousePosition.y}px`,
                boxShadow: `0 0 20px var(--theme-text, #00FF00), 0 0 40px var(--theme-text, #00FF00), 0 0 60px var(--theme-text, #00FF00)`
              }}
            />
          </div>
          <div className={styles.heroContent}>
            <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Be part of history in the making as we bring together 100,000+ developers 
              to build the future of technology.
            </p>
            <button className={`bg-black text-green-500 border border-green-500 hover:bg-green-900 font-bold py-3 px-6 rounded-lg ${styles.glowButton}`}>
              Register Now
            </button>
            <div className={styles.countdownTimer}>
              <div className={styles.countdownItem}>
                <div className={styles.countdownNumber}>{timeLeft.days}</div>
                <div className={styles.countdownLabel}>Days</div>
              </div>
              <div className={styles.countdownItem}>
                <div className={styles.countdownNumber}>{timeLeft.hours}</div>
                <div className={styles.countdownLabel}>Hours</div>
              </div>
              <div className={styles.countdownItem}>
                <div className={styles.countdownNumber}>{timeLeft.minutes}</div>
                <div className={styles.countdownLabel}>Minutes</div>
              </div>
              <div className={styles.countdownItem}>
                <div className={styles.countdownNumber}>{timeLeft.seconds}</div>
                <div className={styles.countdownLabel}>Seconds</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Prize Showcase */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className={`border border-green-500 p-6 rounded-lg ${styles.featureCard} ${styles.mainPrize}`}>
            <h3 className="text-2xl font-bold mb-3">$3,000 Grand Prize</h3>
            <p className={styles.prizeAmount}>$3K</p>
            <p>Take home the grand prize and earn global recognition in the tech community.</p>
          </div>
          <div className={`border border-green-500 p-6 rounded-lg ${styles.featureCard}`}>
            <h3 className="text-xl font-bold mb-3">Expert Mentorship</h3>
            <p>Get personalized guidance from industry leaders and tech innovators throughout the competition.</p>
          </div>
          <div className={`border border-green-500 p-6 rounded-lg ${styles.featureCard}`}>
            <h3 className="text-xl font-bold mb-3">Global Networking</h3>
            <p>Join an exclusive community of innovators from 100+ countries and build lasting connections.</p>
          </div>
        </section>

        {/* Hackathon Tracks */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Hackathon Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`border border-green-500 p-6 rounded-lg ${styles.trackCard}`}>
              <div className={styles.trackIcon}>
                <div className={styles.iconPlaceholder}>🌐</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Web3 & Blockchain</h3>
              <p className="mb-4">Build decentralized applications, smart contracts, or blockchain solutions that solve real-world problems.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>DeFi applications</li>
                <li>NFT platforms</li>
                <li>DAO governance tools</li>
                <li>Cross-chain solutions</li>
              </ul>
            </div>
            <div className={`border border-green-500 p-6 rounded-lg ${styles.trackCard}`}>
              <div className={styles.trackIcon}>
                <div className={styles.iconPlaceholder}>🤖</div>
              </div>
              <h3 className="text-xl font-bold mb-3">AI & Machine Learning</h3>
              <p className="mb-4">Create innovative AI-powered applications that demonstrate the potential of machine learning.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Generative AI tools</li>
                <li>Computer vision applications</li>
                <li>Natural language processing</li>
                <li>Predictive analytics</li>
              </ul>
            </div>
            <div className={`border border-green-500 p-6 rounded-lg ${styles.trackCard}`}>
              <div className={styles.trackIcon}>
                <div className={styles.iconPlaceholder}>🌱</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Climate Tech</h3>
              <p className="mb-4">Develop solutions that address climate change and environmental challenges.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Carbon footprint trackers</li>
                <li>Renewable energy optimizers</li>
                <li>Sustainable supply chain tools</li>
                <li>Environmental data visualization</li>
              </ul>
            </div>
            <div className={`border border-green-500 p-6 rounded-lg ${styles.trackCard}`}>
              <div className={styles.trackIcon}>
                <div className={styles.iconPlaceholder}>🎮</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Gaming & Metaverse</h3>
              <p className="mb-4">Build immersive gaming experiences or metaverse applications that push boundaries.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Web-based games</li>
                <li>Virtual reality experiences</li>
                <li>Metaverse infrastructure</li>
                <li>Game development tools</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Prize Breakdown */}
        <section className="mb-16 border border-green-500 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Prize Breakdown</h2>
          <div className={styles.prizeContainer}>
            <div className={styles.prizeCard}>
              <div className={styles.prizeAmount}>$250,000</div>
              <div className={styles.prizeTitle}>Grand Prize</div>
              <p className="mt-2">For the most innovative and impactful project across all tracks</p>
            </div>
            <div className={styles.prizeCard}>
              <div className={styles.prizeAmount}>$100,000</div>
              <div className={styles.prizeTitle}>Track Winners</div>
              <p className="mt-2">$25,000 for each track winner (4 tracks)</p>
            </div>
            <div className={styles.prizeCard}>
              <div className={styles.prizeAmount}>$150,000</div>
              <div className={styles.prizeTitle}>Runner-ups</div>
              <p className="mt-2">$15,000 for each runner-up (10 projects)</p>
            </div>
            <div className={styles.prizeCard}>
              <div className={styles.prizeAmount}>$500,000+</div>
              <div className={styles.prizeTitle}>Sponsor Prizes</div>
              <p className="mt-2">Special prizes from our sponsors for specific challenges</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <button className={`bg-black text-green-500 border border-green-500 hover:bg-green-900 font-bold py-3 px-6 rounded-lg ${styles.glowButton}`}>
              View Full Prize Details
            </button>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Event Timeline</h2>
          <div className={styles.timeline}>
            <div className={`${styles.timelineItem} ${visibleTimelineItems.includes(0) ? styles.visible : ''}`}>
              <div className={styles.timelineDate}>June 1, 2023</div>
              <div className={styles.timelineContent}>
                <h3 className="text-xl font-bold">Registration Opens</h3>
                <p>Early bird registration begins with special perks for the first 10,000 participants</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} ${visibleTimelineItems.includes(1) ? styles.visible : ''}`}>
              <div className={styles.timelineDate}>July 15, 2023</div>
              <div className={styles.timelineContent}>
                <h3 className="text-xl font-bold">Kickoff Event</h3>
                <p>Virtual opening ceremony with keynote speakers and track announcements</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} ${visibleTimelineItems.includes(2) ? styles.visible : ''}`}>
              <div className={styles.timelineDate}>July 16-30, 2023</div>
              <div className={styles.timelineContent}>
                <h3 className="text-xl font-bold">Hacking Period</h3>
                <p>Two weeks of intense building, with daily workshops and mentor sessions</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} ${visibleTimelineItems.includes(3) ? styles.visible : ''}`}>
              <div className={styles.timelineDate}>July 31, 2023</div>
              <div className={styles.timelineContent}>
                <h3 className="text-xl font-bold">Submission Deadline</h3>
                <p>All projects must be submitted by 11:59 PM UTC</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} ${visibleTimelineItems.includes(4) ? styles.visible : ''}`}>
              <div className={styles.timelineDate}>August 1-7, 2023</div>
              <div className={styles.timelineContent}>
                <h3 className="text-xl font-bold">Judging Period</h3>
                <p>Projects reviewed by our panel of expert judges</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} ${visibleTimelineItems.includes(5) ? styles.visible : ''}`}>
              <div className={styles.timelineDate}>August 15, 2023</div>
              <div className={styles.timelineContent}>
                <h3 className="text-xl font-bold">Winners Announced</h3>
                <p>Live-streamed awards ceremony and project showcases</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Sponsors</h2>
          <div className={styles.sponsorTiers}>
            <div className={styles.sponsorTier}>
              <h3 className="text-xl font-bold mb-4">Platinum Sponsors</h3>
              <div className={styles.sponsorGrid}>
                <div className={styles.sponsorLogo}>
                  <div className={styles.logoPlaceholder}>Sponsor 1</div>
                </div>
                <div className={styles.sponsorLogo}>
                  <div className={styles.logoPlaceholder}>Sponsor 2</div>
                </div>
                <div className={styles.sponsorLogo}>
                  <div className={styles.logoPlaceholder}>Sponsor 3</div>
                </div>
              </div>
            </div>
            <div className={styles.sponsorTier}>
              <h3 className="text-xl font-bold mb-4">Gold Sponsors</h3>
              <div className={styles.sponsorGrid}>
                <div className={styles.sponsorLogo}>
                  <div className={styles.logoPlaceholder}>Sponsor 4</div>
                </div>
                <div className={styles.sponsorLogo}>
                  <div className={styles.logoPlaceholder}>Sponsor 5</div>
                </div>
                <div className={styles.sponsorLogo}>
                  <div className={styles.logoPlaceholder}>Sponsor 6</div>
                </div>
                <div className={styles.sponsorLogo}>
                  <div className={styles.logoPlaceholder}>Sponsor 7</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="mb-4">Interested in sponsoring the world's largest hackathon?</p>
            <button className={`bg-black text-green-500 border border-green-500 hover:bg-green-900 font-bold py-3 px-6 rounded-lg ${styles.glowButton}`}>
              Become a Sponsor
            </button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className={styles.faqContainer}>
            <div className={styles.faqItem}>
              <h3 className="text-xl font-bold mb-2">Who can participate?</h3>
              <p>Anyone over the age of 13 can participate, regardless of experience level. We welcome beginners, students, professionals, and hobbyists from all around the world.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className="text-xl font-bold mb-2">Is there an entry fee?</h3>
              <p>No, participation in the Bolt.new Hackathon is completely free of charge.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className="text-xl font-bold mb-2">Can I participate as a team?</h3>
              <p>Yes! You can participate solo or in teams of up to 5 people. We encourage collaboration and team formation through our community channels.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className="text-xl font-bold mb-2">What resources will be provided?</h3>
              <p>Participants will have access to workshops, mentorship, technical resources, and API credits from our sponsors to help build their projects.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className="text-xl font-bold mb-2">How will projects be judged?</h3>
              <p>Projects will be evaluated based on innovation, technical complexity, design, practicality, and alignment with the chosen track's objectives.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className="text-xl font-bold mb-2">Do I need to be a developer to participate?</h3>
              <p>Not necessarily! We welcome designers, product managers, and other non-technical participants. Diverse teams often create the most innovative solutions.</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <button className={`bg-black text-green-500 border border-green-500 hover:bg-green-900 font-bold py-3 px-6 rounded-lg ${styles.glowButton}`}>
              View All FAQs
            </button>
          </div>
        </section>
        
        {/* Community Showcase */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Community Showcase</h2>
          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseCard}>
              <div className={styles.showcaseImage} style={{ background: 'rgba(0, 255, 0, 0.1)' }}></div>
              <div className={styles.showcaseContent}>
                <h3 className="text-xl font-bold mb-2">AI-Powered Climate Monitor</h3>
                <p>A machine learning solution that predicts climate change impacts on local ecosystems.</p>
                <div className={styles.showcaseAuthor}>
                  <div className={styles.authorAvatar} style={{ background: 'rgba(0, 255, 0, 0.2)' }}></div>
                  <span>Sarah Johnson</span>
                </div>
              </div>
            </div>
            <div className={styles.showcaseCard}>
              <div className={styles.showcaseImage} style={{ background: 'rgba(0, 255, 0, 0.1)' }}></div>
              <div className={styles.showcaseContent}>
                <h3 className="text-xl font-bold mb-2">Decentralized Education Platform</h3>
                <p>Blockchain-based platform connecting students with educators worldwide.</p>
                <div className={styles.showcaseAuthor}>
                  <div className={styles.authorAvatar} style={{ background: 'rgba(0, 255, 0, 0.2)' }}></div>
                  <span>Miguel Rodriguez</span>
                </div>
              </div>
            </div>
            <div className={styles.showcaseCard}>
              <div className={styles.showcaseImage} style={{ background: 'rgba(0, 255, 0, 0.1)' }}></div>
              <div className={styles.showcaseContent}>
                <h3 className="text-xl font-bold mb-2">AR Gaming Experience</h3>
                <p>Augmented reality game that transforms your surroundings into an interactive playground.</p>
                <div className={styles.showcaseAuthor}>
                  <div className={styles.authorAvatar} style={{ background: 'rgba(0, 255, 0, 0.2)' }}></div>
                  <span>Aisha Patel</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <button className={`bg-black text-green-500 border border-green-500 hover:bg-green-900 font-bold py-3 px-6 rounded-lg ${styles.glowButton}`}>
              View All Projects
            </button>
          </div>
        </section>
        
        {/* Gamification Elements */}
        <section className="mb-16 border border-green-500 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Achievement Badges</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className={styles.achievementBadge} title="Early Bird">
              🐦
            </div>
            <div className={styles.achievementBadge} title="Team Builder">
              👥
            </div>
            <div className={styles.achievementBadge} title="Code Ninja">
              🥷
            </div>
            <div className={styles.achievementBadge} title="Innovation Star">
              ⭐
            </div>
          </div>
        </section>

        <section className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Hack?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            The hackathon starts soon. Join today and prepare to build something amazing.
          </p>
          <div className="flex justify-center space-x-4">
            <button className={`bg-black text-green-500 border border-green-500 hover:bg-green-900 font-bold py-3 px-6 rounded-lg ${styles.glowButton}`}>
              Register
            </button>
            <button className={`bg-green-500 text-black hover:bg-green-600 font-bold py-3 px-6 rounded-lg ${styles.glowButton}`}>
              Learn More
            </button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-green-500 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Bolt.new Hackathon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}