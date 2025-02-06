import { useState } from 'react';
import type { Board } from '../lib/db';
import { updateBoard } from '../lib/db';

interface Props {
  board: Board;
}

export function BoardSetup({ board }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [maxSquares, setMaxSquares] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName || !maxSquares) {
      setError('Please fill in all fields');
      return;
    }

    const max = parseInt(maxSquares);
    if (isNaN(max) || max < 1 || max > 100) {
      setError('Maximum squares must be between 1 and 100');
      return;
    }

    const updatedBoard: Board = {
      ...board,
      displayName,
      maxSquaresPerContestant: max,
      state: 'choosing',
    };

    await updateBoard(board.id, updatedBoard);
    window.location.reload();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8">Set Up Your Board</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Board Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Super Bowl Party 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Squares per Person
          </label>
          <input
            type="number"
            value={maxSquares}
            onChange={(e) => setMaxSquares(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            min="1"
            max="100"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Create Board
        </button>
      </form>
    </div>
  );
}
