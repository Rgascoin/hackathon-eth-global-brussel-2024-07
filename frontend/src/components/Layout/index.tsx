import React, { ReactNode } from 'react';

import Header from '../Header/Header';

interface LayoutProps {
	children: ReactNode;
}

function Layout({ children }: LayoutProps) {
	return (
		<div className="flex h-screen w-screen flex-col bg-Black text-White">
			<div className="flex flex-1">
				<Header />
			</div>
			<div className="flex flex-[7_2_0%]">{children}</div>
		</div>
	);
}

export default Layout;
