import { useEffect, useState } from 'react';
import { HiArrowRightStartOnRectangle } from 'react-icons/hi2';

import WalletConnectSignal from '@/assets/WalletConnectSignal.svg';
import { useWeb3Context } from '@/contexts/WalletContext';

function WalletButon() {
	const { account, isLogged, web3Service } = useWeb3Context();
	const [balance, setBalance] = useState<string>('0');

	// TODO: remove just for testing
	// function uiConsole(...args: any[]): void {
	// 	const el = document.querySelector('#console>p');
	// 	if (el) {
	// 		el.innerHTML = JSON.stringify(args || {}, null, 2);
	// 	}
	// 	console.log(...args);
	// }

	const handleBalance = async () => {
		const b = await web3Service.getBalance();
		setBalance(b);
		// uiConsole(ok);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			handleBalance();
		}, 10000);

		return () => clearInterval(interval);
	}, []);

	const handleLogin = async () => {
		if (!isLogged.setValue) return;

		const isConnected = await web3Service.login();
		isLogged.setValue(isConnected);

		if (isConnected) {
			const c = await web3Service.getAccounts();
			if (account.setValue) {
				account.setValue(c[0]);
			}
		}
		handleBalance();
	};

	const handleDisconnect = async () => {
		if (!isLogged.setValue) return;

		await web3Service.logout();
		isLogged.setValue(false);
		// setBalance('0');
		if (account.setValue) {
			account.setValue('');
		}
		console.log(account.value);
	};

	// const handleSign = async () => {
	// 	const ok = await web3Service.signMessage('ok');
	// 	uiConsole(ok);
	// };

	// const handleGetUserInfo = async () => {
	// 	const ok = await web3Service.getUserInfo();
	// 	uiConsole(ok);
	// };

	const loggedInView = (
		<>
			<div className="flex flex-col items-center">
				<div className="m-0.5 flex truncate text-xs">{balance} xDAI</div>
				<button onClick={handleDisconnect} className="flex items-center justify-center p-px">
					<div className="m-px  flex size-full items-center justify-center rounded-lg bg-grey p-2 text-sm italic text-white hover:bg-black">
						Disconnect
						<HiArrowRightStartOnRectangle className="ml-1 size-5 fill-White" aria-hidden="true" />
					</div>
				</button>
			</div>
		</>
	);

	// const unloggedInView = (
	// 	<button onClick={login} className="card">
	// 		Login
	// 	</button>
	// );

	return (
		<>
			{/* <div id="console" style={{ whiteSpace: 'pre-line' }}>
				<p style={{ whiteSpace: 'pre-line' }}></p>
			</div> */}

			{isLogged.value ? (
				<>{loggedInView}</>
			) : (
				<button
					type="button"
					onClick={handleLogin}
					className="flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-purple-500 p-px"
				>
					<div className="m-px flex size-full items-center justify-center rounded-xl bg-black p-2 text-lg  text-white hover:bg-grey">
						<WalletConnectSignal className="mr-1 size-7 fill-White" aria-hidden="true" />
						Wallet
					</div>
				</button>
			)}
		</>
	);
}

export default WalletButon;
