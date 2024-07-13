import React, { useEffect, useState } from 'react';

import CreateNewAccount from '@/components/ReactFlow/CreateNewAccount';
import TrustSomeone from '@/components/ReactFlow/TrustSomeon';
import { useWeb3Context } from '@/contexts/WalletContext';

function Flows() {
	const { account, circlesSdk } = useWeb3Context();

	const [myAvatar, setMyAvatar] = useState<unknown>('none');
	const [myRelation, setMyRelation] = useState<unknown>('none');

	const fetchMyAvatar = async (): Promise<any> => {
		if (!account.value || !circlesSdk) return undefined;
		const avatar = await circlesSdk.getAvatar(account.value);
		const relation = await avatar.getTrustRelations();
		setMyAvatar(avatar);
		setMyRelation(relation);
		return avatar;
	};

	// FETCH AVATAR EVERY X SECONDS (actualize on successful transaction)
	useEffect(() => {
		if (!circlesSdk || !account.value || account.value.length < 16) return undefined;

		const interval = setInterval(async () => fetchMyAvatar(), 6000);
		return () => clearInterval(interval);
	}, [account.value, circlesSdk, fetchMyAvatar]);

	return (
		<div className="flex size-full flex-col gap-12 bg-red-500">
			{account.value ? (
				<>
					{myAvatar?.address ? (
						<div className={'flex flex-col gap-12'}>
							<button className="bg-blue-600" onClick={fetchMyAvatar}>
								my avatar: {myAvatar?.address}
							</button>

							<TrustSomeone myAvatar={myAvatar} />
							<text className="bg-blue-600">Number of relation: {JSON.stringify(myRelation)}</text>

							{/* PUT REACT FLOW HERE */}
						</div>
					) : (
						<div>
							<CreateNewAccount haveAccount={!!myAvatar} />
						</div>
					)}
				</>
			) : (
				<>
					<div className="flex size-full flex-col gap-12 bg-red-500">Please login</div>
				</>
			)}
		</div>
	);
}

export default Flows;
