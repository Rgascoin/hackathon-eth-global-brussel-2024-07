import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

interface PeopleNodeProps extends NodeProps {
	data: {
		name: string;
		photoUrl: string;
		departmentId: string;
	};
}

const PeopleNode: React.FC<PeopleNodeProps> = ({ data }) => {
	return (
		<>
			<div className="flex items-center gap-x-4 rounded-lg border-2 border-b border-gray-900/5 bg-gray-50 p-6">
				<div className="text-center text-sm font-medium leading-6 text-gray-900">{data.name}</div>
			</div>
			<Handle type="target" position={Position.Top} style={{ background: '#555' }} isConnectable={true} />
		</>
	);
};

export default PeopleNode;
