'use client'

import React from 'react';

import { DialogNode } from './Dialog';
import { DrawerNode } from './Drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';

function NodeModal({ isOpen, onClose, node, onDelete }: { isOpen: boolean; onClose: () => void; node: any; onDelete: (nodeId: string) => void }) {
  if (!node) return null;
  const isMobile = useMediaQuery('(max-width: 767px)');


  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/delete-position?id=${node.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete position');
      }

      onDelete(node.id);
      onClose();
    } catch (error) {
      console.error('Error deleting position:', error);
      // Aquí puedes agregar una notificación de error si lo deseas
    }
  };
  const NodeComponent = isMobile ? DrawerNode : DialogNode;
  return (
    <NodeComponent
      isOpen={isOpen}
      onClose={onClose}
      node={node}
      handleDelete={handleDelete}
    />
  );
}

export default NodeModal;