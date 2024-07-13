'use client';

import { CHAIN_NAMESPACES } from '@web3auth/base';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import Web3AuthService from '@/services/web3Auth';

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

interface IWalletContext {
	account: SetStateContext<string>;
	isLogged: SetStateContext<boolean>;
	web3Service: Web3AuthService;
}

const WalletContext = createContext<IWalletContext>({
	account: {
		value: '',
	},
	isLogged: {
		value: false,
	},
	web3Service: new Web3AuthService(CLIENT_ID, CHAIN_CONFIG),
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [account, setAccount] = useState<string>('');
	const [isLogged, setIsLogged] = useState<boolean>(false);

	const [web3Service] = useState(() => new Web3AuthService(CLIENT_ID, CHAIN_CONFIG));

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
				if (setAccount) {
					setAccount(c[0]);
				}
			}
		};

		handleLogin();
	}, [web3Service]);

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
			}}
		>
			{children}
		</WalletContext.Provider>
	);
};

export const useWeb3Context = () => useContext(WalletContext);
