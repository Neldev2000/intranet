import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';
import { actionCreatePosition } from './actions';
import { useDropzone } from 'react-dropzone';
// Define el esquema de validación con Zod
const formSchema = z.object({
  label: z.string().min(1, "El nombre es requerido"),
  files: z.array(z.any()).optional(),
  description: z.string().min(1, "La descripción es requerida"),
  responsibilities: z.array(z.object({
    descripcion:z.string()
  })).min(1, "Al menos una responsabilidad es requerida"),
  qualifications: z.array(z.object({
    descripcion:z.string()
  })).min(1, "Al menos una calificación es requerida"),
  reports_to: z.string(),
});

// Tipo inferido del esquema

// Props del componente
interface AddPositionFormProps {
  existingPositions: { id: string; data: {label:string, description:string}}[];

  onClose: () => void;
}
type FormValues = {
    label: string;
    description: string;
    responsibilities: { descripcion: string }[];
    qualifications: { descripcion: string }[];
    reports_to: string;
    files: File[];
  };
  

export function AddPositionForm({ existingPositions, onClose }: AddPositionFormProps) {
  // Inicializar el formulario con React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      description: "",
      responsibilities: [],
      qualifications: [],
      reports_to: "",
      files: []
    },
  });
  // Configurar react-dropzone
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (acceptedFiles) => {
      form.setValue('files', acceptedFiles);
    },
  });


  // Configurar useFieldArray para responsabilidades y calificaciones
  const { fields: responsibilityFields, append: appendResponsibility, remove: removeResponsibility } = useFieldArray({
    control: form.control,
    name: "responsibilities",
  });

  const { fields: qualificationFields, append: appendQualification, remove: removeQualification } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });

  async function onSubmit(values: FormValues) {
    
  
      await actionCreatePosition(values);
      form.reset();
      onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del puesto</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Gerente de Ventas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción del puesto</FormLabel>
              <FormControl>
                <Textarea placeholder="Breve descripción de las responsabilidades generales..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reports_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reporta a</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un superior" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {existingPositions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.data.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Responsabilidades</FormLabel>
          {responsibilityFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`responsibilities.${index}.descripcion`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mt-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeResponsibility(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendResponsibility({
            descripcion:""
          })}>
            Agregar Responsabilidad
          </Button>
          <FormMessage>{form.formState.errors.responsibilities?.message}</FormMessage>
        </div>

        <div>
          <FormLabel>Calificaciones</FormLabel>
          {qualificationFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`qualifications.${index}.descripcion`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mt-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeQualification(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendQualification({
            descripcion:""
          })}>
            Agregar Calificación
          </Button>
          <FormMessage>{form.formState.errors.qualifications?.message}</FormMessage>
        </div>

        <div>
          <FormLabel>Archivos adjuntos</FormLabel>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-blue-500 duration-150">
            <input {...getInputProps()} />
            <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos.  </p>
          </div>
          {acceptedFiles.length > 0 && (
            <ul className="mt-2 text-sm grid grid-cols-2 gap-3">
              {acceptedFiles.map((file) => (
                <li key={file.name} className='p-3 bg-gray-300 font-medium rounded-md text-sm'>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" className='bg-blue-600 text-white'>Crear Posición</Button>
        </div>
      </form>
    </Form>
  );
}