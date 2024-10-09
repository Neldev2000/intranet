'use client'

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function NodeModal({ isOpen, onClose, node, onDelete }: { isOpen: boolean; onClose: () => void; node: any; onDelete: (nodeId: string) => void }) {
  if (!node) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{node.data.label}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Acerca del Cargo:</h3>
          <p>{node.data.description}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Responsabilidades:</h3>
          <ul className="list-disc pl-5">
            {node.data.responsibilities.map((resp: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Calificaciones:</h3>
          <ul className="list-disc pl-5">
            {node.data.qualifications.map((qual: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
              <li key={index}>{qual}</li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar Cargo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NodeModal;