import React, { useEffect, useState } from 'react';

import CreateNewAccount from '@/components/ReactFlow/CreateNewAccount';
import { useWeb3Context } from '@/contexts/WalletContext';
import Test from "@/components/ReactFlow/Test";



function Flows() {
	const { account, circlesSdk } = useWeb3Context();

	const [myAvatar, setMyAvatar] = useState<unknown>('none');
	const [myBalance, setMyBalance] = useState<unknown>('none');
	const [myRelation, setMyRelation] = useState<unknown>('none');

	const fetchMyAvatar = async (): Promise<any> => {
		if (!account.value || !circlesSdk) return undefined;

		const avatar = await circlesSdk.getAvatar(account.value);
		const relations = await avatar.getTrustRelations();
		const balance = await avatar.getTotalBalance();

		const relationsWithBalances = [];
		for (const relation of relations) {
			try {
			const relationAvatarAddress = relations.subjectAvatar === avatar.address ? relation.subjectAvatar : relation.objectAvatar
			const relationAvatar = await circlesSdk.getAvatar(relationAvatarAddress);
			const relationBalance = await relationAvatar.getTotalBalance();
			relationsWithBalances.push({...relation, balance: relationBalance})
				} catch {
				relationsWithBalances.push({...relation, balance: 0})
			}
		}
		setMyAvatar(avatar);
		setMyRelation(relationsWithBalances);
		setMyBalance(balance);
		return avatar;
	};

	// FETCH AVATAR EVERY X SECONDS (actualize on successful transaction)
	useEffect(() => {
		if (!circlesSdk || !account.value || account.value.length < 16) return undefined;

		const interval = setInterval(async () => {
			if (!circlesSdk || !account.value || account.value.length < 16) return undefined;
			fetchMyAvatar();
		}, 6000);
		return () => clearInterval(interval);
	}, [account.value, circlesSdk, fetchMyAvatar]);

	return (
		<div className="flex size-full flex-col gap-12">
			{account.value ? (
				<>
					{myAvatar?.address ? (
						<div className={'flex w-full flex-1 flex-col gap-12'}>
							<Test masterNode={myAvatar} masterNodeBalance={myBalance} relatedAvatars={myRelation} />
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
