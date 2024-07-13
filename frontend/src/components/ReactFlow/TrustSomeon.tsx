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
		alert(`ToTrust: ${userWristband}`)

		const tsx = await myAvatar.trust(userWristband);
		alert(JSON.stringify(tsx));
	};

	return (
		<button onClick={addSomeone} className="flex items-center justify-center p-px">
			<div
				className="m-px flex size-full items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-purple-500 p-4 text-sm italic text-white hover:from-purple-500 hover:to-orange-500">
				+
			</div>
		</button>
	);
};

export default TrustSomeone;
