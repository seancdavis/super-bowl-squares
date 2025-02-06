import { createClient } from '@supabase/supabase-js';
import type { Board } from '../lib/db';
import dotenv from 'dotenv';

// Get environment variables
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface WinnerEnv {
  quarter: 'q1' | 'q2' | 'q3' | 'q4';
  scores: [number, number];
}

async function getWinnersFromEnv(): Promise<WinnerEnv[]> {
  const winners: WinnerEnv[] = [];
  const quarters = ['q1', 'q2', 'q3', 'q4'] as const;

  for (const quarter of quarters) {
    const envValue = process.env[`WINNER_${quarter.toUpperCase()}`];
    if (envValue) {
      const [score1, score2] = envValue.split(',').map(Number);
      if (!isNaN(score1) && !isNaN(score2)) {
        winners.push({
          quarter,
          scores: [score1, score2],
        });
      }
    }
  }

  return winners;
}

async function findWinningSquare(
  board: Board,
  scores: [number, number],
): Promise<[number, number] | null> {
  if (!board.teams) return null;

  // Find the row (first team's score)
  const team1Index = board.teams.axis1.team === 'Chiefs' ? 0 : 1;
  const team2Index = 1 - team1Index;

  const score1 = scores[team1Index];
  const score2 = scores[team2Index];

  // Find the positions in the number arrays
  const row = board.teams.axis2.numbers.findIndex((n) => n === score2);
  const col = board.teams.axis1.numbers.findIndex((n) => n === score1);

  if (row === -1 || col === -1) return null;

  return [row, col];
}

async function updateBoardWinners() {
  try {
    // Get winners from environment variables
    const winners = await getWinnersFromEnv();
    if (winners.length === 0) {
      console.log('No winners found in environment variables');
      return;
    }

    // Get all locked boards
    const { data: boards, error } = await supabase.from('boards').select('*').eq('state', 'locked');

    if (error) {
      throw error;
    }

    if (!boards || boards.length === 0) {
      console.log('No locked boards found');
      return;
    }

    console.log(`Processing ${boards.length} boards...`);

    // Process each board
    for (const board of boards) {
      const updatedWinners = { ...board.winners } as Board['winners'];

      // Process each winner
      for (const winner of winners) {
        const winningSquare = await findWinningSquare(board, winner.scores);
        if (winningSquare) {
          updatedWinners[winner.quarter] = winningSquare;
        }
      }

      // Update the board if winners changed
      if (JSON.stringify(updatedWinners) !== JSON.stringify(board.winners)) {
        const { error: updateError } = await supabase
          .from('boards')
          .update({ winners: updatedWinners })
          .eq('id', board.id);

        if (updateError) {
          console.error(`Error updating board ${board.id}:`, updateError);
        } else {
          console.log(`Updated winners for board ${board.id}`);
        }
      }
    }

    console.log('Winner update complete');
  } catch (error) {
    console.error('Error updating winners:', error);
    process.exit(1);
  }
}

// Run the update
updateBoardWinners();
