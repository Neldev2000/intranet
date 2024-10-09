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

function OrganizationChart() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Cargar los cargos iniciales
    fetch('/api/positions')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const newNodes = data.map((position: { id: any; label: any; description: any; responsibilities: any; qualifications: any; }) => ({
          id: position.id,
          data: { 
            label: position.label,
            description: position.description,
            responsibilities: position.responsibilities,
            qualifications: position.qualifications,
          },
          position: { x: Math.random() * 500, y: Math.random() * 300 },
        }));
        setNodes(newNodes);

        // Crear edges basados en la estructura jerárquica (asumiendo que el CEO es el nodo raíz)
        const newEdges = data
          .filter((position: { id: string; }) => position.id !== '1')
          .map((position: { id: any; }) => ({
            id: `e1-${position.id}`,
            source: '1',
            target: position.id,
            markerEnd: { type: MarkerType.ArrowClosed },
          }));
        setEdges(newEdges);
      });
  }, []);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    // Aquí deberías abrir el NodeModal
    // Por ejemplo:
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

  const onAddPosition = (newPosition: { reportsTo: any; }) => {
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

        if (newPosition.reportsTo) {
          const newEdge = {
            id: `e${newPosition.reportsTo}-${data.id}`,
            source: newPosition.reportsTo,
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

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <Button onClick={handleAddPosition} className="mt-4 bg-blue-700">Agregar Cargo</Button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => onNodeClick(event, node as unknown as Node)}
        fitView
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