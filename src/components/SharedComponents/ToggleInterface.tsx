interface ToggleInterfaceProps {
  currentInterface: 'developer' | 'non-developer';
  onToggle: () => void;
}

export default function ToggleInterface({ currentInterface, onToggle }: ToggleInterfaceProps) {
  return (
    <button 
      onClick={onToggle}
      className="fixed top-4 right-4 bg-black text-green-500 border border-green-500 hover:bg-green-900 font-mono py-2 px-4 rounded z-50"
    >
      Switch to {currentInterface === 'developer' ? 'Non-Developer' : 'Developer'} Interface
    </button>
  );
} 