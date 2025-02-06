import { useState, useEffect } from 'react';
import type { Board } from '../lib/db';
import { updateBoard } from '../lib/db';
import { shuffleArray } from '../lib/utils';

interface Props {
  board: Board;
}

export function SquareBoard({ board }: Props) {
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [selectedSquares, setSelectedSquares] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem(`squares-name-${board.id}`);
    if (storedName) {
      setName(storedName);
      setShowNameInput(false);
    }
  }, [board.id]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    localStorage.setItem(`squares-name-${board.id}`, name);
    setShowNameInput(false);
    setError('');
  };

  const handleSquareClick = async (position: string) => {
    if (board.state !== 'choosing') return;
    if (showNameInput) {
      setError('Please enter your name first');
      return;
    }

    const currentSquares = Object.entries(board.squares).filter(([_, owner]) => owner === name);
    const isSelected = board.squares[position] === name;

    if (isSelected) {
      const updatedBoard = {
        ...board,
        squares: {
          ...board.squares,
        },
      };
      delete updatedBoard.squares[position];
      await updateBoard(board.id, updatedBoard);
      window.location.reload();
      return;
    }

    if (currentSquares.length >= board.maxSquaresPerContestant) {
      setError(`You can only select up to ${board.maxSquaresPerContestant} squares`);
      return;
    }

    if (board.squares[position]) {
      setError('This square is already taken');
      return;
    }

    const updatedBoard = {
      ...board,
      squares: {
        ...board.squares,
        [position]: name,
      },
    };
    await updateBoard(board.id, updatedBoard);
    window.location.reload();
  };

  const handleAssignTeams = async () => {
    const teams = ['Chiefs', 'Eagles'] as const;
    const shuffledTeams = shuffleArray([...teams]);
    const numbers = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const numbers2 = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const updatedBoard = {
      ...board,
      state: 'locked',
      teams: {
        axis1: {
          team: shuffledTeams[0],
          numbers,
        },
        axis2: {
          team: shuffledTeams[1],
          numbers: numbers2,
        },
      },
    };

    await updateBoard(board.id, updatedBoard);
    window.location.reload();
  };

  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSquare = (x: number, y: number) => {
    const position = `${x},${y}`;
    const owner = board.squares[position];
    const isSelected = owner === name;
    const winners = board.winners || {};
    const winningQuarters = Object.entries(winners)
      .filter(([_, coords]) => coords && coords[0] === x && coords[1] === y)
      .map(([quarter]) => quarter);

    return (
      <div
        key={position}
        onClick={() => handleSquareClick(position)}
        className={`
          aspect-square border border-gray-300 p-2 flex flex-col items-center justify-center
          ${board.state === 'choosing' && !owner ? 'cursor-pointer hover:bg-gray-50' : ''}
          ${isSelected ? 'bg-black text-white' : owner ? 'bg-gray-100' : ''}
        `}
      >
        {owner && (
          <>
            <span className="text-sm">{owner}</span>
            {winningQuarters.map((q) => (
              <span key={q} className="text-lg">
                {q === 'q1' ? '1️⃣' : q === 'q2' ? '2️⃣' : q === 'q3' ? '3️⃣' : '4️⃣'}
              </span>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{board.displayName}</h1>
        <button
          onClick={handleShare}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {copied ? 'Copied!' : 'Share Board'}
        </button>
      </div>

      {showNameInput ? (
        <form onSubmit={handleNameSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            Continue
          </button>
        </form>
      ) : (
        <div className="space-y-8">
          {board.state === 'choosing' && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p>
                You have selected {Object.values(board.squares).filter((n) => n === name).length} of{' '}
                {board.maxSquaresPerContestant} squares
              </p>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          )}

          <div className="bg-white p-8 rounded-lg shadow-md">
            {board.teams ? (
              <div className="grid grid-cols-[auto_repeat(10,1fr)]">
                <div className="col-span-1"></div>
                {board.teams.axis1.numbers.map((n, i) => (
                  <div key={i} className="p-4 font-bold text-center">
                    {n}
                  </div>
                ))}
                {board.teams.axis2.numbers.map((n, i) => (
                  <React.Fragment key={i}>
                    <div className="p-4 font-bold text-right">{n}</div>
                    {board.teams.axis1.numbers.map((_, j) => renderSquare(i, j))}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-[auto_repeat(10,1fr)]">
                <div className="col-span-1"></div>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="p-4 font-bold text-center">
                    ?
                  </div>
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="p-4 font-bold text-right">?</div>
                    {Array.from({ length: 10 }).map((_, j) => renderSquare(i, j))}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {board.state === 'choosing' && Object.keys(board.squares).length === 100 && (
            <div className="flex justify-center">
              <button
                onClick={handleAssignTeams}
                className="bg-black text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-800"
              >
                Assign Teams & Numbers
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
