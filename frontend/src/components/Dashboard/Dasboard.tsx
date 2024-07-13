import React from 'react';

import Flows from '../ReactFlow/Flows';
import Sidebar from '../Sidebar/Sidebar';

function Dashboard() {
	return (
		<div className="mx-2 flex size-full ">
			<div className="flex-1 border-r border-grey ">
				<div className="flex size-full flex-col">
					<Sidebar />
				</div>
			</div>

			<div className="flex flex-[3_2_0%] flex-col ">
				<div className="flex flex-[5_2_0%] ">
					<div className="flex-1 bg-blue-400">
						{/* Flows view */}
						<Flows />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
