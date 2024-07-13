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
		<>
			{isLoading ? (
				<button className="animate-pulse bg-blue-600">Loading...</button>
			) : (
				<button onClick={registerNewAvatar} className="bg-blue-600">
					Create new Account
				</button>
			)}
		</>
	);
};

export default CreateNewAccount;
