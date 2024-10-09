'use client'

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function NodeModal({ isOpen, onClose, node }: { isOpen: boolean; onClose: () => void; node: any }) {
  console.log(isOpen,node )
  if (!node) return null;

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
      </DialogContent>
    </Dialog>
  );
}

export default NodeModal;