'use client'

import React, { useState, useEffect } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MarkerType,
  BackgroundVariant,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import NodeModal from './NodeModal';
import AddPositionModal from './AddPositionModal';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function OrganizationChart({
  positions
}: {positions:any[]}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const organizedData = organizeHierarchy(positions);
        setNodes(organizedData.nodes);
        setEdges(organizedData.edges);
  }, [positions]);

  const organizeHierarchy = (data: any[]) => {
    const nodeMap = new Map();
    const nodes: any[] = [];
    const edges: { id: string; source: string; target: string; type: string; }[] = [];

    // Create nodes
    data.forEach(position => {
      const node = {
        id: position.id.toString(),
        data: { 
          label: position.label,
          description: position.description,
          currentFunctions: position.current_functions,
          adquiredResposibilities: position.adquired_responsabilities,
          qualifications: position.qualifications,
        },
        position: { x: 0, y: 0 },
      };
      console.log(node)
      nodes.push(node);
      nodeMap.set(position.id.toString(), node);
    });

    // Create edges
    data.forEach(position => {
      if (position.reports_to) {
        edges.push({
          id: `e${position.reports_to}-${position.id}`,
          source: position.reports_to.toString(),
          target: position.id.toString(),
          type: 'smoothstep',  // This creates a curved line
        });
      }
    });

    // Position nodes in a tree structure
    const levelWidth = 300;
    const levelHeight = 150;

    const positionNode = (nodeId: string, level = 0, horizontalIndex = 0) => {
      const node = nodeMap.get(nodeId);
      if (!node) return;

      node.position = {
        x: horizontalIndex * levelWidth,
        y: level * levelHeight
      };

      const children = data.filter(p => p.reports_to?.toString() === nodeId);
      children.forEach((child, index) => {
        positionNode(child.id.toString(), level + 1, horizontalIndex + index);
      });
    };

    // Find root nodes and position the tree
    const rootNodes = data.filter(p => !p.reports_to);
    rootNodes.forEach((rootNode, index) => {
      positionNode(rootNode.id.toString(), 0, index);
    });

    // Center the tree horizontally
    const minX = Math.min(...nodes.map(node => node.position.x));
    const maxX = Math.max(...nodes.map(node => node.position.x));
    const centerX = (minX + maxX) / 2;
    nodes.forEach(node => {
      node.position.x -= centerX;
    });

    return { nodes, edges };
  };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    console.log("Hi", node)
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const handleAddPosition = () => {
    if (nodes.length >= 10) {
      toast.error('No se pueden agregar más de 10 cargos.');
      return;
    }
    setIsAddModalOpen(true);
  };

  const onAddPosition = (newPosition: { reports_to: any; }) => {
    fetch('/api/positions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPosition),
    })
      .then(response => response.json())
      .then(data => {
        const newNode = {
          id: data.id,
          data: { 
            label: data.label,
            description: data.description,
            responsibilities: data.responsibilities,
            qualifications: data.qualifications,
          },
          position: { x: Math.random() * 500, y: Math.random() * 300 },
        };
        setNodes((nds) => nds.concat(newNode));

        if (newPosition.reports_to) {
          const newEdge = {
            id: `e${newPosition.reports_to}-${data.id}`,
            source: newPosition.reports_to,
            target: data.id,
            markerEnd: { type: MarkerType.ArrowClosed },
          };
          setEdges((eds) => eds.concat(newEdge));
        }

        toast.success('Nuevo cargo agregado con éxito');
      })
      .catch(error => {
        console.error('Error al agregar nuevo cargo:', error);
        toast.error('Error al agregar nuevo cargo');
      });

    setIsAddModalOpen(false);
  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    // Handle edge click
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    // También deberías eliminar las aristas conectadas a este nodo
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/*Floating header*/}
      <div className='absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-4'>
        <div className=' px-4 py-2 bg-white rounded-lg shadow-md flex justify-start items-center'>
          <h1 className="text-xl md:text-3xl font-medium  text-gray-600 ">Organigrama de 1Click</h1>

        </div>
      
      <Button onClick={handleAddPosition} className="bg-blue-700">Agregar Cargo</Button>
      </div>
          
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => onNodeClick(event, node as unknown as Node)}
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      
      {selectedNode && (
        <NodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          node={selectedNode}
          onDelete={handleDeleteNode}
          positions = {positions}
        />
      )}
      <AddPositionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddPosition}
        existingNodes={nodes}
      />
      <Toaster />
    </div>
  );
}

export default OrganizationChart;