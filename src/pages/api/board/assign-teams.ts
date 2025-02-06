import type { APIRoute } from 'astro';
import { getBoard, updateBoard, type Board } from '../../../lib/db';
import { shuffleArray } from '../../../lib/utils';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { boardId } = await request.json();

    if (!boardId) {
      return new Response(JSON.stringify({ error: 'Board ID is required' }), { status: 400 });
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

    if (Object.keys(board.squares).length !== 100) {
      return new Response(
        JSON.stringify({ error: 'All squares must be filled before assigning teams' }),
        { status: 400 },
      );
    }

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

    await updateBoard(board.id, updatedBoard as Board);

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to assign teams' }), { status: 500 });
  }
};
