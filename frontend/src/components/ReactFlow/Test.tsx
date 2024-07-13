'use client';

import '@xyflow/react/dist/style.css';

import React, { useEffect, useMemo, useState } from 'react';
import { Background, Controls, ReactFlow, ReactFlowProvider } from 'reactflow';

import { useFlowContext } from '@/contexts/FlowContext';

import MasterNode from './CustomNodes/MasterNode';
import PeopleNode from './CustomNodes/PeopleNode';

const peopleDataArray = [
	{
		subjectAvatar: '0xcf70a83d70fbf1b786e40a6541ad30953f1da3f9',
		relation: 'trustedBy',
		objectAvatar: '0x882127ab24b776be5acb2d0dc6f63945ae81a202',
		timestamp: 1720888270,
	},
	{
		subjectAvatar: '0x882127ab24b776be5acb2d0dc6f63945ae81a202', // Moi
		relation: 'trusts',
		objectAvatar: '0xc2490a3e6d5f8398ad622778945e416d6cd80201', // l'autre
		timestamp: 1720887360,
	},
	{
		subjectAvatar: '0x882127ab24b776be5acb2d0dc6f63945ae81a202', // Moi
		relation: 'mutuallyTrusts',
		objectAvatar: '0xc24a0a3e6d5f8398ad622778945e416d6cd80201', // l'autre
		timestamp: 1720887361,
	},
	// Ajoutez d'autres objets de données ici si nécessaire
];

export default function Test() {
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
		const masterNodeId = '0x882127ab24b776be5acb2d0dc6f63945ae81a202';
		if (!isMasterNodeInitialized) {
			initializeMasterNode(masterNodeId);
			setIsMasterNodeInitialized(true);
		}
	}, [initializeMasterNode, isMasterNodeInitialized]);

	useEffect(() => {
		const masterNodeId = '0x882127ab24b776be5acb2d0dc6f63945ae81a202';
		if (isMasterNodeInitialized && !arePeopleNodesInitialized) {
			addPeopleNodesFromJSON(peopleDataArray, masterNodeId);
			setArePeopleNodesInitialized(true);
		}
	}, [isMasterNodeInitialized, arePeopleNodesInitialized, addPeopleNodesFromJSON]);

	return (
		<div className="relative flex flex-1 flex-col">
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
				<button onClick={() => {}} className="flex items-center justify-center p-px">
					<div className="m-px flex size-full items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-purple-500 p-2 text-sm italic text-white hover:from-purple-500 hover:to-orange-500">
						+
					</div>
				</button>
			</div>
		</div>
	);
}
