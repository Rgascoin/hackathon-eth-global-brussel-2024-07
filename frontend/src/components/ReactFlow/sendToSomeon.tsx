import React, { FC, useState } from 'react';

import useWristBand from '@/hooks/useWristBand';
import { getKey } from '@/utils/api-redis';

type SendToSomeoneProps = {
	myAvatar: any;
};

const SendToSomeone: FC<SendToSomeoneProps> = ({ myAvatar }) => {
	const { callWristband } = useWristBand();

	const [amount, setAmount] = useState<string>('10');

	if (!myAvatar) return null;
	const sendToSomeone = async () => {
		const res = await callWristband('get_pkeys');
		const allWristband = await getKey(); // wristBandAddress === res.etherAddresses['1']

		const userWristband = (allWristband.value as any[]).find(
			(w: any) => JSON.parse(w.value).wristBandAddress === res.etherAddresses['1'],
		).key;

		await myAvatar.transfer(userWristband, parseInt(amount));
	};

	return (
		<div className="bg-blue-600">
			<input
				type="number"
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				className={'w-11 text-black'}
			/>
			<button onClick={sendToSomeone}>Send</button>
		</div>
	);
};

export default SendToSomeone;
