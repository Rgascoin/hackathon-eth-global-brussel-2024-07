'use client';

import React, { createContext, ReactNode, useContext as useReactContext } from 'react';
import { addEdge, Edge, Node, OnNodesChange, useEdgesState, useNodesState } from 'reactflow';

interface FlowStateContext {
	nodes: Node[];
	setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
	handleNodesChange: any;
	edges: Edge[];
	setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
	onEdgesChange: any;
	initializeMasterNode: (masterNodeId: string) => void;
	addPeopleNodesFromJSON: (peopleDataArray: any[], masterNodeId: string) => void;
}

const FlowContext = createContext<FlowStateContext | undefined>(undefined);

export const FlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	const initializeMasterNode = (masterNodeId: string) => {
		const masterNode: Node = {
			id: 'master-node',
			type: 'master',
			position: { x: window.innerWidth / 2 - 50, y: 25 },
			data: { label: masterNodeId, id: 0.1 },
		};

		setNodes((nds) => [masterNode]);
	};

	const addPeopleNodesFromJSON = (peopleDataArray: any[], masterNodeId: string) => {
		const existingNodes = new Set(nodes.map((node) => node.id));
		const newNodes: Node[] = [];
		const newEdges: Edge[] = [];

		peopleDataArray.forEach((data) => {
			const { subjectAvatar, relation, objectAvatar } = data;

			const subjectNodeId = `people-${subjectAvatar}`;
			const objectNodeId = `people-${objectAvatar}`;

			if (!existingNodes.has(subjectNodeId) && subjectAvatar !== masterNodeId) {
				newNodes.push({
					id: subjectNodeId,
					type: 'people',
					position: { x: Math.random() * 800, y: Math.random() * 600 },
					data: { name: subjectAvatar, photoUrl: '', departmentId: masterNodeId },
				});
				existingNodes.add(subjectNodeId);
			}

			if (!existingNodes.has(objectNodeId) && objectAvatar !== masterNodeId) {
				newNodes.push({
					id: objectNodeId,
					type: 'people',
					position: { x: Math.random() * 800, y: Math.random() * 600 },
					data: { name: objectAvatar, photoUrl: '', departmentId: masterNodeId },
				});
				existingNodes.add(objectNodeId);
			}

			let edgeColor = '';
			let sourceId = subjectNodeId;
			let targetId = objectNodeId;

			if (subjectAvatar === masterNodeId) {
				sourceId = 'master-node';
			} else if (objectAvatar === masterNodeId) {
				targetId = 'master-node';
			}

			if (relation === 'trustedBy') {
				edgeColor = 'orange';
				newEdges.push({
					id: `e-${sourceId}-to-${targetId}`,
					source: targetId,
					target: sourceId,
					type: 'straight',
					style: { stroke: edgeColor },
				});
			} else if (relation === 'trusts') {
				edgeColor = 'blue';
				newEdges.push({
					id: `e-${sourceId}-to-${targetId}`,
					source: sourceId,
					target: targetId,
					type: 'straight',
					style: { stroke: edgeColor },
				});
			} else if (relation === 'mutuallyTrusts') {
				edgeColor = 'green';
				newEdges.push({
					id: `e-${sourceId}-to-${targetId}`,
					source: sourceId,
					target: targetId,
					type: 'default',
					animated: true,
					style: { stroke: edgeColor },
				});
			}
		});

		setNodes((nds) => [...nds, ...newNodes]);
		setEdges((eds) => [...eds, ...newEdges]);
	};

	const handleNodesChange: OnNodesChange = (changes) => {
		onNodesChange(changes);
	};

	return (
		<FlowContext.Provider
			value={{
				nodes,
				setNodes,
				handleNodesChange,
				edges,
				setEdges,
				onEdgesChange,
				initializeMasterNode,
				addPeopleNodesFromJSON,
			}}
		>
			{children}
		</FlowContext.Provider>
	);
};

export const useFlowContext = () => {
	const context = useReactContext(FlowContext);
	if (context === undefined) {
		throw new Error('useFlowContext must be used within a FlowProvider');
	}
	return context;
};
