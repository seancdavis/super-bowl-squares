import type { APIRoute } from 'astro';
import { createBoard } from '../../../lib/db';
import { generateBoardId } from '../../../lib/utils';
import type { Board } from '../../../lib/db';

export const POST: APIRoute = async () => {
  try {
    const boardId = generateBoardId();
    const board: Board = {
      id: boardId,
      display_name: '',
      max_squares_per_contestant: 0,
      state: 'setup',
      squares: {},
    };

    await createBoard(board);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/board/${boardId}`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create board' }), { status: 500 });
  }
};
