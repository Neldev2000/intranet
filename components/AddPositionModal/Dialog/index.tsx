import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddPositionForm } from '../AddPositionForm';

interface DialogAddPositionProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (position: {
    name: string;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    reports_to: string;
  }) => void;
  existingNodes: any[];
}

export function DialogAddPosition({ isOpen, onClose, onAdd, existingNodes }: DialogAddPositionProps) {
    console.log(existingNodes)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-auto max-h-[700px] text-gray-600">
        <DialogHeader>
          <DialogTitle>Nuevo Cargo</DialogTitle>
        </DialogHeader>
        <AddPositionForm  existingPositions={existingNodes} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}