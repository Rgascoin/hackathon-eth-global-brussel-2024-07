import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'redis';

const redisClient = createClient({
	url: process.env.REDIS_URL || 'redis://localhost:6379',
	password: process.env.REDIS_PASSWORD || 'redis',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
	if (!redisClient.isOpen) {
		await redisClient.connect();
	}
};

type Data = {
	message?: string;
	error?: string;
	value?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	// Connect to Redis
	await connectRedis();

	if (req.method === 'POST') {
		const { key, value } = req.body;

		if (!key || !value) {
			res.status(400).json({ error: 'Key and value are required' });
			return;
		}

		// Store the key-value pair in Redis
		await redisClient.set(key, JSON.stringify(value));

		res.status(200).json({ message: 'Key stored successfully' });
	} else if (req.method === 'GET') {
		const { key } = req.query;

		if (!key || typeof key !== 'string') {
			res.status(400).json({ error: 'Key is required and must be a string' });
			return;
		}

		// Retrieve the value for the given key from Redis
		const value = await redisClient.get(key);

		if (value) {
			res.status(200).json({ value: JSON.parse(value) });
		} else {
			res.status(404).json({ error: 'Key not found' });
		}
	} else {
		res.setHeader('Allow', ['POST', 'GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
