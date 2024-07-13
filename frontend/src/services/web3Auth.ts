import { CHAIN_NAMESPACES, CustomChainConfig, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import { Web3Auth } from '@web3auth/modal';
import Web3 from 'web3';

export default class Web3AuthService {
	private web3Auth: Web3Auth;

	private web3: Web3 | null = null;

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
			await this.web3Auth.connect();
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

	async signMessage(message: string): Promise<string | null> {
		if (!this.web3) {
			// console.error('Web3 not initialized');
			return null;
		}

		try {
			const accounts = await this.web3.eth.getAccounts();
			if (accounts.length === 0) {
				// console.error('No accounts available');
				return null;
			}
			const signedMessage = await this.web3.eth.personal.sign(message, accounts[0], ''); // Assuming no password needed.
			return signedMessage;
		} catch (error) {
			// console.error('Failed to sign message:', error);
			return null;
		}
	}

	async interactWithContract(
		contractAddress: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		abi: any,
		methodName: string,
		parameters: string[] = [],
		transactionOptions = {},
		sendTransaction = false,
	) {
		if (!this.web3) {
			console.error('Web3 not initialized');

			return null;
		}

		const contract = new this.web3.eth.Contract(abi, contractAddress);

		const accounts = await this.web3.eth.getAccounts();
		if (sendTransaction && accounts.length === 0) {
			console.error('No accounts available for sending transaction');

			return null;
		}

		if (sendTransaction) {
			// Send a transaction to the contract
			const receipt = await contract.methods[methodName](...parameters).send({
				from: accounts[0],
				...transactionOptions,
			});
			return receipt; // Returns the transaction receipt
		}
		// Call a view/read-only method of the contract
		const result = await contract.methods[methodName](...parameters).call();
		return result; // Returns the result of the read operation
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async deployContract(abi: any, bytecode: string) {
		if (!this.web3) {
			console.error('Web3 not initialized');
			return null;
		}

		try {
			// Create the contract instance with the ABI
			const contract = new this.web3.eth.Contract(abi);

			// Get accounts
			const accounts = await this.web3.eth.getAccounts();
			if (accounts.length === 0) {
				console.error('No accounts available');
				return null;
			}

			console.log(bytecode);

			// Deploy the contract using the provided bytecode and constructor arguments
			const deployment = contract.deploy({
				data: `0x${bytecode}`, // Ensure bytecode is prefixed with '0x'
				arguments: [],
			});

			// Send the transaction from the first account with a specified gas limit and gas price
			const deployedContract = await deployment.send({
				from: accounts[0],
				gas: '1500000', // Set gas limit - adjust according to your needs
				gasPrice: '30000000000', // Set gas price - adjust according to current network conditions
			});

			return deployedContract.options.address; // Returns the deployed contract address
		} catch (error) {
			console.error('Failed to deploy contract:', error);
			return null;
		}
	}
}
