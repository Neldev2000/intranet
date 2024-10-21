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
      <DrawerContent className="text-gray-500">
        <div className="h-[calc(100vh-10rem)] flex flex-col">
          <DrawerHeader className="flex-shrink-0">
            <DrawerTitle>Nuevo Cargo</DrawerTitle>
          </DrawerHeader>
          <div className="flex-grow overflow-y-auto px-4">
            <AddPositionForm existingPositions={existingNodes} onClose={onClose}  />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
