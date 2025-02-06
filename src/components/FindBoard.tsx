import { useState } from 'react';

export function FindBoard() {
  const [boardId, setBoardId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/board/${boardId.toUpperCase()}`);
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Board not found');
        return;
      }

      window.location.href = `/board/${boardId.toUpperCase()}`;
    } catch (err) {
      setError('Failed to find board');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={boardId}
          onChange={(e) => setBoardId(e.target.value.toUpperCase())}
          placeholder="Enter board code"
          className="w-full p-2 border border-gray-300 rounded"
          maxLength={6}
          disabled={isLoading}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:bg-gray-400"
        disabled={isLoading || !boardId}
      >
        {isLoading ? 'Finding Board...' : 'Find Board'}
      </button>
    </form>
  );
}
