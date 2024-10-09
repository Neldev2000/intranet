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
import { X } from 'lucide-react'; // Assuming you're using lucide-react for icons

function AddPositionModal({ isOpen, onClose, onAdd, existingNodes }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState(['']);
  const [qualifications, setQualifications] = useState(['']);
  const [reportsTo, setReportsTo] = useState('');

  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, '']);
  };

  const handleAddQualification = () => {
    setQualifications([...qualifications, '']);
  };

  const handleResponsibilityChange = (index, value) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[index] = value;
    setResponsibilities(newResponsibilities);
  };

  const handleQualificationChange = (index, value) => {
    const newQualifications = [...qualifications];
    newQualifications[index] = value;
    setQualifications(newQualifications);
  };

  const handleDeleteResponsibility = (index) => {
    const newResponsibilities = responsibilities.filter((_, i) => i !== index);
    setResponsibilities(newResponsibilities);
  };

  const handleDeleteQualification = (index) => {
    const newQualifications = qualifications.filter((_, i) => i !== index);
    setQualifications(newQualifications);
  };

  const handleSubmit = () => {
    onAdd({
      name,
      description,
      responsibilities: responsibilities.filter(r => r.trim() !== ''),
      qualifications: qualifications.filter(q => q.trim() !== ''),
      reportsTo,
    });
    // Reset form
    setName('');
    setDescription('');
    setResponsibilities(['']);
    setQualifications(['']);
    setReportsTo('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-auto max-h-[700px] text-gray-600">
        <DialogHeader>
          <DialogTitle>Nuevo Cargo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col justify-start items-start gap-4">
            <Label htmlFor="name" className="text-right text-xl font-medium">
              Nombre
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 border-2 border-gray-300"
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-4">
            <Label htmlFor="reportsTo" className="text-right text-xl font-medium">
              Reporta a
            </Label>
            <Select onValueChange={setReportsTo} value={reportsTo}>
              <SelectTrigger className="col-span-3 border-2 border-gray-300">
                <SelectValue placeholder="Seleccione un cargo" />
              </SelectTrigger>
              <SelectContent>
                {existingNodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.data.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-start items-start gap-4">
            <Label htmlFor="description" className="text-right text-xl font-medium">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 col-span-3 border-2 border-gray-300"
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-4">
            <Label className="text-right text-xl font-medium">Responsabilidades</Label>
            <div className="col-span-3 space-y-2 w-full">
              {responsibilities.map((responsibility, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={responsibility}
                    className='flex-grow border-2 border-gray-300'
                    onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                  />
                  <Button 
                    onClick={() => handleDeleteResponsibility(index)} 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500"
                  >
                    <X size={20} />
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddResponsibility} variant="outline" size="sm">
                + Agregar Responsabilidad
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-4 ">
            <Label className="text-right text-xl font-medium">Calificaciones</Label>
            <div className="col-span-3 space-y-2 w-full">
              {qualifications.map((qualification, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={qualification}
                    className='flex-grow border-2 border-gray-300'
                    onChange={(e) => handleQualificationChange(index, e.target.value)}
                  />
                  <Button 
                    onClick={() => handleDeleteQualification(index)} 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500"
                  >
                    <X size={20} />
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddQualification} variant="outline" size="sm">
                + Agregar Calificación
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className='bg-blue-700'>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddPositionModal;