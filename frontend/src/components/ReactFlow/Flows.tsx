import { ChainConfig, Sdk, SdkContractRunner } from '@circles-sdk/sdk';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import { useWeb3Context } from '@/contexts/WalletContext';
import useWristBand from '@/hooks/useWristBand';
import { getKey } from '@/utils/api-redis';

const chainConfig: ChainConfig = {
	circlesRpcUrl: 'https://chiado-rpc.aboutcircles.com',
	v1HubAddress: '0xdbf22d4e8962db3b2f1d9ff55be728a887e47710',
	v2HubAddress: '0x2066CDA98F98397185483aaB26A89445addD6740',
	migrationAddress: '0x2A545B54bb456A0189EbC53ed7090BfFc4a6Af94',
};

function Flows() {
	const { web3Service, account, isLogged } = useWeb3Context();

	const [sdk, setSDK] = useState<any>(undefined);
	const [myAvatar, setMyAvatar] = useState<any>('none');
	const [myRelation, setMyRelation] = useState<any>('none');

	const { callWristband } = useWristBand();
	const [debug, setDebug] = useState<any>();

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
		const relation = await avatar.getTrustRelations();
		setMyAvatar(avatar);
		setMyRelation(relation);
		return avatar;
	};

	async function getSdk() {
		const runner = await getRunner();
		const newSDK = new Sdk(chainConfig, runner);

		if (newSDK) setSDK(newSDK);
	}

	const scan = async () => {
		const res = await callWristband('get_pkeys');
		const allWristband = await getKey(); // wristBandAddress === res.etherAddresses['1']

		const userWristband = (allWristband.value as any[]).find(
			(w: any) => JSON.parse(w.value).wristBandAddress == res.etherAddresses['1'],
		).key;

		const userAvatar = await fetchMyAvatar();
		const trustedRes = await userAvatar.trust(userWristband);
		await fetchMyAvatar();
		setDebug(userWristband);
	};

	useEffect(() => {
		if (!account.value || !isLogged || !web3Service || !web3Service.web3) return;
		getSdk();
	}, [account, isLogged, web3Service?.web3]);

	return (
		<div className="flex size-full flex-col gap-12 bg-red-500">
			<button className="bg-blue-600" onClick={registerNewAvatar} disabled={!sdk}>
				CreateAvatar
			</button>
			<button className="bg-blue-600" onClick={fetchMyAvatar} disabled={!sdk}>
				FetchAvatar
			</button>
			<button className="bg-blue-600">my avatar: {myAvatar.address}</button>
			<button className="bg-blue-600">my relation: {JSON.stringify(myRelation)}</button>

			<button className="bg-blue-600" onClick={scan}>
				Link To someone
			</button>
			<button className="bg-blue-600">gg {JSON.stringify(debug)}</button>
			{/* {JSON.stringify(sdk)} */}
		</div>
	);
}

export default Flows;
