import axios, { AxiosInstance } from 'axios';

export interface ExecutionResult {
	x: number;
	post_state_digest: string;
	seal: string;
}

export default class BackendSDK {
	private client: AxiosInstance;

	private readonly baseURL = 'http://localhost:8000';

	constructor() {
		this.client = axios.create({
			baseURL: this.baseURL,
			timeout: 3000_000,
			withCredentials: false,
		});
	}

	async execute(zkscript: string): Promise<ExecutionResult | null> {
		try {
			const res = await this.client.post<ExecutionResult>('/execute', {
				code: zkscript,
			});

			return res.data;
		} catch (e) {
			console.error(e);

			return null;
		}
	}
}
