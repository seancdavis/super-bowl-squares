import { useState } from 'react';

export function CreateBoard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/board/create', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error creating board');
        return;
      }

      const { id } = await response.json();
      window.location.href = `/board/${id}`;
    } catch (err) {
      setError('Error creating board');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleCreate}
        disabled={isLoading}
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isLoading ? 'Creating Board...' : 'Create New Board'}
      </button>
    </div>
  );
}