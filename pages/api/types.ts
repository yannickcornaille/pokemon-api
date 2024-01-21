import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function(request:NextApiRequest, response:NextApiResponse) {
  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db('pokemon');
    const collection = db.collection('types');
    const results = await collection
      .find()
      .project({ _id: 0, id: 1, name: 1, image: 1})
      .toArray()
    return response.status(200).json(results);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
}