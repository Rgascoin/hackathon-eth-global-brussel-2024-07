'use client';

import '@xyflow/react/dist/style.css';

import React, { useEffect, useMemo, useState} from 'react';
import { Background, Controls, ReactFlow, ReactFlowProvider } from 'reactflow';

import { useFlowContext } from '@/contexts/FlowContext';

import TrustSomeone from "@/components/ReactFlow/TrustSomeon";
import MasterNode from './CustomNodes/MasterNode';
import PeopleNode from './CustomNodes/PeopleNode';

export type PeopleDataArray = {
	subjectAvatar: string;
	relation: 'trustedBy'| 'trusts' | 'mutuallyTrusts';
	objectAvatar: string;
	timestamp: number;
}


type TestProps = {
	masterNode: any;
	masterNodeBalance: number;
	relatedAvatars: PeopleDataArray[];
}

export default function Test({masterNode, masterNodeBalance, relatedAvatars}: TestProps) {
	const { nodes, setNodes, handleNodesChange, edges, onEdgesChange, initializeMasterNode, addPeopleNodesFromJSON } =
		useFlowContext();
	const [isMasterNodeInitialized, setIsMasterNodeInitialized] = useState(false);
	const [arePeopleNodesInitialized, setArePeopleNodesInitialized] = useState(false);

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
			initializeMasterNode(masterNode.address);
			setIsMasterNodeInitialized(true);
		}
	}, [initializeMasterNode, isMasterNodeInitialized]);

	useEffect(() => {
		if (isMasterNodeInitialized && !arePeopleNodesInitialized) {
			addPeopleNodesFromJSON(relatedAvatars, masterNode.address);
			setArePeopleNodesInitialized(true);
		}
	}, [isMasterNodeInitialized, arePeopleNodesInitialized, addPeopleNodesFromJSON]);

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
				<TrustSomeone myAvatar={masterNode}/>

			</div>
		</div>
	);
}
