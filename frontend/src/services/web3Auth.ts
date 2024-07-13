import { CHAIN_NAMESPACES, CustomChainConfig, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import { Web3Auth } from '@web3auth/modal';
import Web3 from 'web3';

export default class Web3AuthService {
	private web3Auth: Web3Auth;

	public web3: Web3 | null = null;

	constructor(
		private clientId: string,
		private chainConfig: CustomChainConfig,
	) {
		const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
		const metamaskAdapter = new MetamaskAdapter({
			clientId,
			sessionTime: 3600,
			web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
			chainConfig: {
				...chainConfig,
				chainNamespace: CHAIN_NAMESPACES.EIP155,
			},
		});

		this.web3Auth = new Web3Auth({
			clientId,
			web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
			privateKeyProvider,
		});

		// @ts-expect-error TODO
		this.web3Auth.configureAdapter(metamaskAdapter);
	}

	async initWeb3Auth() {
		try {
			await this.web3Auth.initModal();
			if (this.web3Auth.provider) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				this.web3 = new Web3(this.web3Auth.provider as any);
			}
		} catch (error) {
			// console.error('Initialization error:', error);
		}
	}

	async login() {
		try {
			const provider = await this.web3Auth.connect();

			return this.web3Auth.connected;
		} catch (error) {
			// console.error('Login error:', error);
			return false;
		}
	}

	async logout() {
		await this.web3Auth.logout();
	}

	async getUserInfo() {
		if (!this.web3Auth) {
			// console.error('Web3Auth not initialized');
			return null;
		}
		try {
			const userInfo = await this.web3Auth.getUserInfo();
			return userInfo;
		} catch (error) {
			// console.error('Failed to get user info:', error);
			return null;
		}
	}

	async getAccounts() {
		if (!this.web3) {
			// console.error('Web3 not initialized');
			return [];
		}
		return this.web3.eth.getAccounts();
	}

	async getBalance() {
		if (!this.web3) {
			// console.error('Web3 not initialized');
			return '0';
		}
		const accounts = await this.getAccounts();
		if (accounts.length === 0) {
			return '0';
		}
		const balance = await this.web3.eth.getBalance(accounts[0]);
		return this.web3.utils.fromWei(balance, 'ether');
	}
}
