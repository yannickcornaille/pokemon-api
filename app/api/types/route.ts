import { NextRequest } from 'next/server';
import client from "@/lib/mongodb";
 
export async function GET(request: NextRequest) {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db('pokemon');
    const collection = db.collection('types');
    const results = await collection
      .find()
      .project({ _id: 0, id: 1, name: 1, image: 1})
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