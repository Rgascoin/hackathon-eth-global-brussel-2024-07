import React from 'react';

import GetWalletAddress from "@/components/NfcInteractions/getWalletAddress";
import Flows from '../ReactFlow/Flows';
import Sidebar from '../Sidebar/Sidebar';

function Dashboard() {
	return (
		<div className="flex size-full flex-1 flex-col">
			<GetWalletAddress />
			<Flows />
		</div>
	);
}

export default Dashboard;
