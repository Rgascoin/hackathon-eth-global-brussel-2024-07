import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

interface MasterNodeProps extends NodeProps {
  data: {
    label: string;
    balance?: number;
    id?: number;
  };
}

const MasterNode: React.FC<MasterNodeProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center gap-x-4 rounded-t-lg border-2 border-b border-gray-900/5 bg-gray-50 p-6">
        <div className="text-center text-sm font-medium leading-6 text-gray-900">{data.label}</div>
      </div>
      <dl className="divide-y divide-gray-100 rounded-b-lg border-x-2 border-b-2 px-6 py-4 text-sm leading-6 ">
        <div className="flex justify-between">
          <dt className="text-White">Balance</dt>
          <dd className="text-White">
            <span>{data.balance ? data.balance.toFixed(2) : 0} Circle</span>
          </dd>
        </div>
      </dl>

      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} isConnectable={true} />
    </>
  );
};

export default MasterNode;
