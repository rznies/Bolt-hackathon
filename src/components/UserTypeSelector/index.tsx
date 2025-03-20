interface UserTypeSelectorProps {
  onSelect: (type: 'developer' | 'non-developer') => void;
}

export default function UserTypeSelector({ onSelect }: UserTypeSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-green-500">
      <div className="bg-black border border-green-500 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-6 text-center">Are you a developer?</h2>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => onSelect('developer')}
            className="bg-black hover:bg-green-900 text-green-500 font-bold py-2 px-4 rounded border border-green-500"
          >
            Yes
          </button>
          <button 
            onClick={() => onSelect('non-developer')}
            className="bg-black hover:bg-green-900 text-green-500 font-bold py-2 px-4 rounded border border-green-500"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
} 