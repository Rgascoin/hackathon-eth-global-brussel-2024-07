import React, { FC } from 'react';

import useWristBand from '@/hooks/useWristBand';
import { getKey } from '@/utils/api-redis';

type TrustSomeoneProps = {
	myAvatar: any;
};

const TrustSomeone: FC<TrustSomeoneProps> = ({ myAvatar }) => {
	const { callWristband } = useWristBand();

	if (!myAvatar) return null;
	const addSomeone = async () => {
		const res = await callWristband('get_pkeys');
		const allWristband = await getKey(); // wristBandAddress === res.etherAddresses['1']

		const userWristband = (allWristband.value as any[]).find(
			(w: any) => JSON.parse(w.value).wristBandAddress === res.etherAddresses['1'],
		).key;

		await myAvatar.trust(userWristband);
	};

	return (
		<button className="bg-blue-600" onClick={addSomeone}>
			+
		</button>
	);
};

export default TrustSomeone;
