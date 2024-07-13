'use client';

import { ChainConfig, Sdk, SdkContractRunner } from '@circles-sdk/sdk';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { ContractRunner, ethers } from 'ethers';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import Web3AuthService from '@/services/web3Auth';
import { getKey, storeKey } from '@/utils/api-redis';

interface SetStateContext<T> {
	value: T;
	setValue?: React.Dispatch<React.SetStateAction<T>>;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID ?? '';
const CHAIN_CONFIG = {
	chainId: '0x27d8',
	rpcTarget: 'https://rpc.chiadochain.net',
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	displayName: 'Chiado',
	blockExplorerUrl: 'https://gnosis-chiado.blockscout.com/',
	ticker: 'xDAI',
	tickerName: 'xDAI',
	logo: 'https://images.toruswallet.io/dai.svg',
};

const circlesChainConfig: ChainConfig = {
	circlesRpcUrl: 'https://chiado-rpc.aboutcircles.com',
	v1HubAddress: '0xdbf22d4e8962db3b2f1d9ff55be728a887e47710',
	v2HubAddress: '0x2066CDA98F98397185483aaB26A89445addD6740',
	migrationAddress: '0x2A545B54bb456A0189EbC53ed7090BfFc4a6Af94',
};

interface IWalletContext {
	account: SetStateContext<string>;
	isLogged: SetStateContext<boolean>;
	web3Service: Web3AuthService;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	circlesSdk: any;
}

const WalletContext = createContext<IWalletContext>({
	account: {
		value: '',
	},
	isLogged: {
		value: false,
	},
	web3Service: new Web3AuthService(CLIENT_ID, CHAIN_CONFIG),
	circlesSdk: undefined,
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [account, setAccount] = useState<string>('');
	const [isLogged, setIsLogged] = useState<boolean>(false);

	const [web3Service] = useState(() => new Web3AuthService(CLIENT_ID, CHAIN_CONFIG));
	const [circlesSdk, setCirclesSDK] = useState<unknown>(undefined);

	// GET A CIRCLE RUNNER
	async function getRunner(): Promise<SdkContractRunner> {
		const web3authProvider = web3Service.web3;

		const ethersProvider = new ethers.BrowserProvider(web3authProvider?.provider as any);
		const signer = await ethersProvider.getSigner();
		const address = await signer.getAddress();

		return { runner: signer, address };
	}

	useEffect(() => {
		const init = async () => {
			await web3Service.initWeb3Auth();
		};

		init();

		const handleLogin = async () => {
			const isConnected = await web3Service.login();
			setIsLogged(isConnected);
			if (isConnected) {
				const c = await web3Service.getAccounts();

				// create new account if there is not already one
				const redisAccount = await getKey(c[0]);
				if (redisAccount.error) await storeKey(c[0], {});

				if (setAccount) {
					setAccount(c[0]);
				}
			}
		};

		handleLogin();
	}, [web3Service]);

	// Instantiate Circles SDK
	useEffect(() => {
		if (!isLogged || !!circlesSdk) return;
		const initSDK = async () => {
			const runner = await getRunner();
			const newSDK = new Sdk(circlesChainConfig, runner);
			setCirclesSDK(newSDK);
		};

		initSDK();
	}, [isLogged, circlesSdk, getRunner]);

	return (
		<WalletContext.Provider
			value={{
				account: {
					value: account,
					setValue: setAccount,
				},
				isLogged: {
					value: isLogged,
					setValue: setIsLogged,
				},
				web3Service,
				circlesSdk,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
};

export const useWeb3Context = () => useContext(WalletContext);
