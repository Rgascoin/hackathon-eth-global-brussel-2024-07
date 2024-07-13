import React, { useState } from 'react';

import { useWeb3Context } from '@/contexts/WalletContext';
import useWristBand from '@/hooks/useWristBand';
import { getKey, storeKey } from '@/utils/api-redis';

const GetWalletAddress = () => {
	const { account } = useWeb3Context();
	const { callWristband } = useWristBand();
	const [redisData, setRedisData] = useState<string>('none');

	const scan = async () => {
		const res = await callWristband('get_pkeys');
		const personalStorage = await getKey(account.value);
		if (!personalStorage.error)
			await storeKey(account.value, { ...personalStorage.value, wristBandAddress: res.etherAddresses['1'] });
		else await storeKey(account.value, { wristBandAddress: res.etherAddresses['1'] });
	};

	const debug = async () => {
		const res = await getKey(account.value);
		setRedisData(JSON.stringify(res.value));
	};

	return (
		<div className={'flex flex-col space-y-2'}>
			<button onClick={scan}>Register Personal Address</button>
			<button onClick={debug}>data: {redisData}</button>
		</div>
	);
};

export default GetWalletAddress;
