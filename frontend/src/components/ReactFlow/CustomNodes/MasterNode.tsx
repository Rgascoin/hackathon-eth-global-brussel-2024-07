import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

interface MasterNodeProps extends NodeProps {
	data: {
		label: string;
		budget?: number;
		id?: number;
	};
}

const MasterNode: React.FC<MasterNodeProps> = ({ data }) => {
	return (
		<>
			{/*  */}

			<div className="flex items-center  gap-x-4 rounded-lg border-2 border-b border-gray-900/5 bg-gray-50 p-6">
				<div className="text-centerfont-medium  text-sm leading-6 text-gray-900">{data.label}</div>
			</div>

			<Handle type="source" position={Position.Bottom} style={{ background: '#555' }} isConnectable={true} />
		</>
	);
};

export default MasterNode;
