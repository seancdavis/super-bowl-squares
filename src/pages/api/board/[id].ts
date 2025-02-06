import type { APIRoute } from 'astro';
import { getBoard } from '../../../lib/db';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Board ID is required' }), {
      status: 400,
    });
  }

  const board = await getBoard(id.toUpperCase());
  if (!board) {
    return new Response(JSON.stringify({ error: 'Board not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(board));
};