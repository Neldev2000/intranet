'use client'

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DrawerAddPosition } from './Drawer';
import { DialogAddPosition } from './Dialog';

interface AddPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (position: {
    name: string;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    reports_to: string;
  }) => void;
  existingNodes: any[]; // Replace 'any' with a more specific type if possible
}

function AddPositionModal({ isOpen, onClose, onAdd, existingNodes }: AddPositionModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    const AddPositionComponent = isMobile ? DrawerAddPosition : DialogAddPosition;

  return (
    <AddPositionComponent 
        isOpen={isOpen}
        onClose={onClose}
        onAdd={onAdd}
        existingNodes={existingNodes}
    />
  );
}

export default AddPositionModal;