import React, { useState } from 'react';

import useWristBand from '@/hooks/useWristBand';

const GetWalletAddress = () => {
	const { callWristband } = useWristBand();
	const [statusText, setStatusText] = useState('Click on the button');

	const scan = async () => {
		const res = await callWristband('get_pkeys');
		setStatusText(res.etherAddresses['1']);
	};

	return <button onClick={scan}>Get Wristband address {statusText}</button>;
};

export default GetWalletAddress;
