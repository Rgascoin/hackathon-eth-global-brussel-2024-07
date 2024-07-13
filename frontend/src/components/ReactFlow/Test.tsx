'use client';

import '@xyflow/react/dist/style.css';

import React, { useEffect, useMemo, useState } from 'react';
import { Background, Controls, ReactFlow, ReactFlowProvider } from 'reactflow';

import { useFlowContext } from '@/contexts/FlowContext';
import MasterNode from './CustomNodes/MasterNode';
import PeopleNode from './CustomNodes/PeopleNode';
import TrustSomeone from './TrustSomeon';

export type PeopleDataArray = {
  subjectAvatar: string;
  relation: 'trustedBy' | 'trusts' | 'mutuallyTrusts';
  objectAvatar: string;
  balance: number;
  timestamp: number;
}

type TestProps = {
  masterNode: any;
  masterNodeBalance: number;
  relatedAvatars: PeopleDataArray[];
}

export default function Test({ masterNode, masterNodeBalance, relatedAvatars }: TestProps) {
  const { nodes, setNodes, handleNodesChange, edges, onEdgesChange, initializeMasterNode, addPeopleNodesFromJSON, updateNodeBalance } = useFlowContext();
  const [isMasterNodeInitialized, setIsMasterNodeInitialized] = useState(false);
  const [arePeopleNodesInitialized, setArePeopleNodesInitialized] = useState(false);
  const [balance, setBalance] = useState(masterNodeBalance);

  const nodeTypes = useMemo(
    () => ({
      master: MasterNode,
      people: PeopleNode,
    }),
    [],
  );
  const edgeTypes = useMemo(() => ({}), []);

  useEffect(() => {
    if (!isMasterNodeInitialized) {
      initializeMasterNode(masterNode.address, masterNodeBalance);
      setIsMasterNodeInitialized(true);
    }
  }, [initializeMasterNode, isMasterNodeInitialized]);

  useEffect(() => {
    if (isMasterNodeInitialized && !arePeopleNodesInitialized) {
      addPeopleNodesFromJSON(relatedAvatars, masterNode.address);
      setArePeopleNodesInitialized(true);
    }
  }, [isMasterNodeInitialized, arePeopleNodesInitialized, addPeopleNodesFromJSON]);

  // Example of dynamic balance update for master node only
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prevBalance) => {
        const newBalance = prevBalance + Math.random() * 10;
        updateNodeBalance('master-node', newBalance);
        return newBalance;
      });
    }, 5000); // Update balance every 5 seconds

    return () => clearInterval(interval);
  }, [updateNodeBalance]);

  return (
    <div className="relative flex w-full flex-1 flex-col">
      <div className="flex flex-1">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      <div className="absolute bottom-2 right-2 z-10 flex flex-col items-center">
        <TrustSomeone myAvatar={masterNode} />
      </div>
    </div>
  );
}
