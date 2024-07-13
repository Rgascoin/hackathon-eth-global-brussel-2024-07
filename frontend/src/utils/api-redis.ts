/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

interface StoreKeyResponse {
	message?: string;
	error?: string;
}

interface GetKeyResponse {
	value?: any;
	error?: string;
}

export const storeKey = async (key: string, value: any): Promise<StoreKeyResponse> => {
	try {
		const response = await axios.post('/api/store-key', {
			key,
			value,
		});
		return response.data;
	} catch (error) {
		console.error('Error storing the key:', error);
		return { error: 'Error storing the key' };
	}
};

export const getKey = async (key?: string): Promise<GetKeyResponse> => {
	try {
		const response = await axios.get('/api/store-key', {
			params: { key },
		});
		return response.data;
	} catch (error) {
		console.error('Error retrieving the key:', error);
		return { error: 'Error retrieving the key' };
	}
};
