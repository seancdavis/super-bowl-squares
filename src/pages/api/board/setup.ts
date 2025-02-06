import type { APIRoute } from 'astro';
import { getBoard, updateBoard } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id, display_name, maxSquares } = await request.json();

    if (!id || !display_name || !maxSquares) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const board = await getBoard(id);
    if (!board) {
      return new Response(JSON.stringify({ error: 'Board not found' }), { status: 404 });
    }

    const updatedBoard = {
      ...board,
      display_name,
      max_squares_per_contestant: maxSquares,
      state: 'choosing' as const,
    };

    await updateBoard(board.id, updatedBoard);

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update board' }), { status: 500 });
  }
};
