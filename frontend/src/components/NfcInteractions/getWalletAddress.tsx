import React, {useEffect, useState} from 'react';

import { useWeb3Context } from '@/contexts/WalletContext';
import useWristBand from '@/hooks/useWristBand';
import { getKey, storeKey } from '@/utils/api-redis';

const GetWalletAddress = () => {
	const { account } = useWeb3Context();
	const { callWristband } = useWristBand();
	const [redisData, setRedisData] = useState<string | undefined>(undefined);

	const scan = async () => {
		const res = await callWristband('get_pkeys');
		const personalStorage = await getKey(account.value);

		if (!personalStorage.error)
			await storeKey(account.value, { ...personalStorage.value, wristBandAddress: res.etherAddresses['1'] });
		else await storeKey(account.value, { wristBandAddress: res.etherAddresses['1'] });
		await setKey();
	};

	const setKey = async () => {
		const personalStorage = await getKey(account.value);
		if (personalStorage.value && !personalStorage.error) {
			const data = personalStorage.value.wristBandAddress;
			setRedisData(`${data.slice(0, 6)}...${data.slice(-4)}`)
		}
	}

	useEffect(() => {
		if (!account.value || !!redisData) return;
		setKey();
	}, [account, redisData])


	return (
		<div className={'p-3'}>
		{account.value ? <div className={'flex flex-col space-y-2 text-center'}>
			{!redisData ? <button onClick={scan} className=" rounded-lg bg-grey p-2 transition-all duration-150 ease-in-out hover:bg-secondGrey">Register Personal Address</button> :
				<button onClick={scan}>your wristband: {redisData}</button>}

		</div> : <></>}

		</div>
	);
};

export default GetWalletAddress;
