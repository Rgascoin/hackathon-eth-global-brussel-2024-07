import React, { useEffect } from 'react';

import { useWeb3Context } from '@/contexts/WalletContext';

import WalletButton from './WalletButton';

function Header() {
	const { account } = useWeb3Context();

	useEffect(() => {}, [account]);

	return (
		<div className="mx-2 flex flex-1 border-b border-grey">
			<div className=" flex items-center border border-grey text-xl font-bold">BraceBuddy</div>

			<div className=" flex flex-1 flex-col justify-center ">
				<div className="flex  ">
					<p className="text-xs text-secondGrey">Hi, {account.value}</p>
				</div>
			</div>
			<div className="m-2 flex max-h-24 flex-1 overflow-y-auto ">
				{/* DEBUG UiConsole */}
				<div id="console" style={{ whiteSpace: 'pre-line' }}>
					<p style={{ whiteSpace: 'pre-line' }}></p>
				</div>
			</div>
			<div className=" flex flex-1 items-center justify-end  ">
				<WalletButton />
			</div>
		</div>
	);
}

export default Header;
