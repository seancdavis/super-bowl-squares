import { createClient } from '@supabase/supabase-js';

// Ensure we have the environment variables we need
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: SUPABASE_URL');
}
if (!supabaseKey) {
  throw new Error('Missing environment variable: SUPABASE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Board {
  id: string;
  display_name: string;
  max_squares_per_contestant: number;
  state: 'setup' | 'choosing' | 'teams' | 'locked';
  squares: {
    [key: string]: string; // position -> contestant name
  };
  teams?: {
    axis1: {
      team: 'Chiefs' | 'Eagles';
      numbers: number[];
    };
    axis2: {
      team: 'Chiefs' | 'Eagles';
      numbers: number[];
    };
  };
  winners?: {
    q1?: [number, number];
    q2?: [number, number];
    q3?: [number, number];
    q4?: [number, number];
  };
}

export async function getBoard(id: string): Promise<Board | null> {
  const { data, error } = await supabase.from('boards').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching board:', error);
    return null;
  }

  return data as Board;
}

export async function createBoard(board: Board): Promise<void> {
  const { error } = await supabase.from('boards').insert([board]);

  if (error) {
    console.error('Error creating board:', error);
    throw error;
  }
}

export async function updateBoard(id: string, board: Board): Promise<void> {
  const { error } = await supabase.from('boards').update(board).eq('id', id);

  if (error) {
    console.error('Error updating board:', error);
    throw error;
  }
}
