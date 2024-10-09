import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { AddPositionForm } from '../AddPositionForm';

interface DrawerAddPositionProps {
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

export function DrawerAddPosition({ isOpen, onClose, onAdd, existingNodes }: DrawerAddPositionProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="text-gray-500 px-4 max-h-[600px] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>Nuevo Cargo</DrawerTitle>
        </DrawerHeader>
        <AddPositionForm onAdd={onAdd} existingNodes={existingNodes} onClose={onClose} />
      </DrawerContent>
    </Drawer>
  );
}