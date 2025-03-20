import ToggleInterface from '@/components/SharedComponents/ToggleInterface';

interface LandingPageProps {
  onToggle: () => void;
}

export default function LandingPage({ onToggle }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      {/* Toggle Interface */}
      <ToggleInterface 
        currentInterface="non-developer" 
        onToggle={onToggle} 
      />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center">Bolt.new Hackathon</h1>
        <p className="text-xl text-center mt-2">World's Largest Hackathon</p>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Be part of history in the making as we bring together 100,000+ developers 
            to build the future of technology.
          </p>
          <button className="bg-black text-green-500 border border-green-500 hover:bg-green-900 font-bold py-3 px-6 rounded-lg">
            Register Now
          </button>
        </section>
        
        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="border border-green-500 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">$1M+ in Prizes</h3>
            <p>Compete for massive prizes and recognition in the tech community.</p>
          </div>
          <div className="border border-green-500 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Top Judges</h3>
            <p>Get your projects reviewed by industry leaders and tech luminaries.</p>
          </div>
          <div className="border border-green-500 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Global Community</h3>
            <p>Connect with developers and creators from around the world.</p>
          </div>
        </section>
        
        {/* CTA */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Hack?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            The hackathon starts soon. Join today and prepare to build something amazing.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-black text-green-500 border border-green-500 hover:bg-green-900 font-bold py-3 px-6 rounded-lg">
              Register
            </button>
            <button className="bg-green-500 text-black hover:bg-green-600 font-bold py-3 px-6 rounded-lg">
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