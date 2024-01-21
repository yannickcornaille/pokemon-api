import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function(request:NextApiRequest, response:NextApiResponse) {
  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db('pokemon');
    const collection = db.collection('pokemons');
    const results = await collection
      .aggregate([{ $sample: { size: 15 } }])
      .project({ _id: 0, id: 1, apiTypes: 1, name: 1, image: 1, selected: 1})
      .toArray()
    return response.status(200).json(results);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
}