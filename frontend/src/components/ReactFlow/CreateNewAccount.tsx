import React, { FC, useState } from 'react';

import { useWeb3Context } from '@/contexts/WalletContext';

type CreateNewAccountProps = {
	haveAccount?: boolean;
};

const CreateNewAccount: FC<CreateNewAccountProps> = ({ haveAccount }) => {
	const { circlesSdk } = useWeb3Context();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const registerNewAvatar = async () => {
		if (!circlesSdk) return;

		setIsLoading(true);
		await circlesSdk.registerHuman();
		setIsLoading(false);
	};

	if (haveAccount) return null;
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
