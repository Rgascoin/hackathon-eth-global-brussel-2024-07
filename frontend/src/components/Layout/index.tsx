import React, { ReactNode } from 'react';

import Header from '../Header/Header';

interface LayoutProps {
	children: ReactNode;
}

function Layout({ children }: LayoutProps) {
	return (
		<div className="flex h-screen w-screen flex-1 bg-Black text-White">
			{/* <Sidebar /> */}
			<div className="flex min-w-96 flex-[6_2_0%] flex-col">
				<Header />
				<div className="flex flex-[7_2_0%]">{children}</div>
			</div>
		</div>
	);
}

export default Layout;
