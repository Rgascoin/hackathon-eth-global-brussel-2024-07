import '../styles/globals.css';

import { AppProps } from 'next/app';

import { FlowProvider } from '@/contexts/FlowContext';
import { WalletProvider } from '@/contexts/WalletContext';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<WalletProvider>
			<FlowProvider>
				<Component {...pageProps} />
			</FlowProvider>
		</WalletProvider>
	);
}

export default MyApp;
