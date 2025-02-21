import type { APIRoute } from 'astro';
import { getBoard, updateBoard } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { boardId, position, name, remove } = await request.json();

    if (!boardId || !position || !name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const board = await getBoard(boardId);
    if (!board) {
      return new Response(JSON.stringify({ error: 'Board not found' }), { status: 404 });
    }

    if (board.state !== 'choosing') {
      return new Response(JSON.stringify({ error: 'Board is not in choosing state' }), {
        status: 400,
      });
    }

    // If we're removing a square, verify it belongs to the current user
    if (remove) {
      if (board.squares[position] !== name) {
        return new Response(JSON.stringify({ error: "Cannot remove another player's square" }), {
          status: 400,
        });
      }
    } else {
      // Adding a square - check limits and availability
      const currentSquares = Object.entries(board.squares).filter(([_, owner]) => owner === name);
      if (currentSquares.length >= board.max_squares_per_contestant) {
        return new Response(
          JSON.stringify({
            error: `Maximum squares (${board.max_squares_per_contestant}) reached`,
          }),
          { status: 400 },
        );
      }

      if (board.squares[position]) {
        return new Response(JSON.stringify({ error: 'Square is already taken' }), { status: 400 });
      }
    }

    const updatedBoard = {
      ...board,
      squares: {
        ...board.squares,
      },
    };

    if (remove) {
      delete updatedBoard.squares[position];
    } else {
      updatedBoard.squares[position] = name;
    }

    await updateBoard(board.id, updatedBoard);

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update square' }), { status: 500 });
  }
};
