import { NextRequest } from 'next/server';
import client from "@/lib/mongodb";
 
export async function GET(request: NextRequest) {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db('pokemon');
    const collection = db.collection('pokemons');

    const searchParams = request.nextUrl.searchParams;
    
    if (!searchParams.has('q')) {
      return new Response(
        JSON.stringify({ error: 'Query parameter "q" is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
    const results = await collection
      .find({ name: { $regex: searchParams.get('q'), $options: 'i' } })
      .project({ _id: 0, id: 1, apiTypes: 1, name: 1, image: 1, selected: 1})
      .limit(15)
      .toArray();
    return new Response(
      JSON.stringify(results),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }), {status: 500 });
  }
}