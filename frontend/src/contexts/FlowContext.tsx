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
    initializeMasterNode: (masterNodeId: string, balance: number) => void;
    addPeopleNodesFromJSON: (peopleDataArray: any[], masterNodeId: string) => void;
    updateNodeBalance: (nodeId: string, newBalance: number) => void;
}

const FlowContext = createContext<FlowStateContext | undefined>(undefined);

export const FlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const initializeMasterNode = (masterNodeId: string, balance: number) => {
        const masterNode: Node = {
            id: 'master-node',
            type: 'master',
            position: { x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50 },
            data: { label: masterNodeId, balance },
        };

        setNodes((nds) => [masterNode]);
    };

    const addPeopleNodesFromJSON = (peopleDataArray: any[], masterNodeId: string) => {
        const existingNodes = new Set(nodes.map(node => node.id));
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        const masterNode = nodes.find(node => node.id === 'master-node');
        if (!masterNode) return;

        const centerX = masterNode.position.x;
        const centerY = masterNode.position.y;

        const radius = 100;
        const angleStep = Math.PI / (peopleDataArray.length - 1);

        peopleDataArray.forEach((data, index) => {
            const { subjectAvatar, relation, objectAvatar, balance } = data;

            const subjectNodeId = `people-${subjectAvatar}`;
            const objectNodeId = `people-${objectAvatar}`;

            const angle = Math.PI + index * angleStep;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const newNode = (id: string, avatar: string, balance: number) => ({
                id,
                type: 'people',
                position: { x, y },
                data: { name: avatar, balance },
            });

            if (!existingNodes.has(subjectNodeId) && subjectAvatar !== masterNodeId) {
                newNodes.push(newNode(subjectNodeId, subjectAvatar, balance));
                existingNodes.add(subjectNodeId);
            }

            if (!existingNodes.has(objectNodeId) && objectAvatar !== masterNodeId) {
                newNodes.push(newNode(objectNodeId, objectAvatar, balance));
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
                    source: sourceId,
                    target: targetId,
                    type: 'straight',
                    style: { stroke: edgeColor, strokeWidth: 2 },
                    markerEnd: 'url(#arrowhead)',
                });
            } else if (relation === 'trusts') {
                edgeColor = 'blue';
                newEdges.push({
                    id: `e-${sourceId}-to-${targetId}`,
                    source: sourceId,
                    target: targetId,
                    type: 'straight',
                    style: { stroke: edgeColor, strokeWidth: 2 },
                    markerEnd: 'url(#arrowhead)',
                });
            } else if (relation === 'mutuallyTrusts') {
                edgeColor = 'green';
                newEdges.push({
                    id: `e-${sourceId}-to-${targetId}`,
                    source: sourceId,
                    target: targetId,
                    type: 'default',
                    animated: true,
                    style: { stroke: edgeColor, strokeWidth: 2 },
                    markerEnd: 'url(#arrowhead)',
                    markerStart: 'url(#arrowhead)',
                });
            }
        });

        setNodes((nds) => [...nds, ...newNodes]);
        setEdges((eds) => [...eds, ...newEdges]);
    };

    const updateNodeBalance = (nodeId: string, newBalance: number) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, balance: newBalance } } : node
            )
        );
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
                updateNodeBalance,
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
