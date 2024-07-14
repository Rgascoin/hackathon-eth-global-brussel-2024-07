import React, {FC, useEffect, useState} from 'react';

import { useWeb3Context } from '@/contexts/WalletContext';
import {getKey} from "@/utils/api-redis";

type CreateNewAccountProps = {
	haveAccount?: boolean;
};

const CreateNewAccount: FC<CreateNewAccountProps> = ({ haveAccount }) => {
	const { circlesSdk, account} = useWeb3Context();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const registerNewAvatar = async () => {
		if (!circlesSdk) return;

		try {
		setIsLoading(true);
		await circlesSdk.registerHuman();
		setIsLoading(false);
			} catch (e) {
			setIsLoading(false);
		}
	};

	const [redisData, setRedisData] = useState<boolean>(false);

	const setKey = async () => {
		const personalStorage = await getKey(account.value);
		if (personalStorage.value && !personalStorage.error) setRedisData(true)
	}

	useEffect(() => {
		if (!account.value || !!redisData) return;

		const interval = setInterval(async () => {
			if (!account.value || !!redisData) return;
			setKey();
		}, 6000);
		return () => clearInterval(interval);
	}, [account, redisData])


	if (haveAccount || !redisData) return null;
	return (
		<div className={'flex justify-center'}>
			{isLoading ? (
				<button className="animate-pulse bg-grey hover:bg-secondGrey">Loading...</button>
			) : (
				<button onClick={registerNewAvatar} className="rounded-lg bg-grey p-2 transition-all duration-150 ease-in-out hover:bg-secondGrey">
					Create new Account
				</button>
			)}
		</div>
	);
};

export default CreateNewAccount;
