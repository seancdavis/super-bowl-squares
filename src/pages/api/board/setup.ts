import type { APIRoute } from 'astro';
import { getBoard, updateBoard } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id, displayName, maxSquares } = await request.json();

    if (!id || !displayName || !maxSquares) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const board = await getBoard(id);
    if (!board) {
      return new Response(JSON.stringify({ error: 'Board not found' }), { status: 404 });
    }

    const updatedBoard = {
      ...board,
      displayName,
      maxSquaresPerContestant: maxSquares,
      state: 'choosing',
    };

    await updateBoard(board.id, updatedBoard);

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update board' }), { status: 500 });
  }
};
