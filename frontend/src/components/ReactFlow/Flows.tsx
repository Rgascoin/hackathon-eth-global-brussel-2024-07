import { ChainConfig, Sdk, SdkContractRunner } from '@circles-sdk/sdk';
import { BrowserProvider, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import { useWeb3Context } from '@/contexts/WalletContext';

const chainConfig: ChainConfig = {
	circlesRpcUrl: 'https://chiado-rpc.aboutcircles.com',
	v1HubAddress: '0xdbf22d4e8962db3b2f1d9ff55be728a887e47710',
	v2HubAddress: '0x2066CDA98F98397185483aaB26A89445addD6740',
	migrationAddress: '0x2A545B54bb456A0189EbC53ed7090BfFc4a6Af94',
};

function Flows() {
	const { web3Service, account, isLogged } = useWeb3Context();

	const [sdk, setSDK] = useState<any>('none');
	const [myAvatar, setMyAvatar] = useState<any>('none');

	async function getRunner(): Promise<SdkContractRunner> {
		const web3authProvider = web3Service.web3;

		const ethersProvider = new ethers.BrowserProvider(web3authProvider?.provider as any);
		const signer = await ethersProvider.getSigner();
		const address = await signer.getAddress();

		return { runner: signer, address };
	}

	const registerNewAvatar = async () => {
		if (!sdk) return;

		const avatar = await sdk.registerHuman();
		console.log(avatar.avatarInfo);
	};

	const fetchMyAvatar = async () => {
		if (!account || !sdk) return;

		const avatar = await sdk.getAvatar(account.value);
		setMyAvatar(avatar);
		console.log(avatar.avatarInfo);
	};

	async function getSdk() {
		const runner = await getRunner();
		const newSDK = new Sdk(chainConfig, runner);
		setSDK(newSDK);
	}

	useEffect(() => {
		if (!account || !isLogged || !web3Service || !web3Service.web3) return;

		getSdk();
	}, [account, isLogged, web3Service]);

	return (
		<div className="flex size-full flex-col bg-red-500">
			<button onClick={getRunner}>GetRunner</button>
			<button onClick={registerNewAvatar}>CreateAvatar</button>
			<button onClick={fetchMyAvatar}>FetchAvatar</button>
			<button onClick={registerNewAvatar}>my avatar: {myAvatar.address}</button>
			{/* {JSON.stringify(sdk)} */}
		</div>
	);
}

export default Flows;
