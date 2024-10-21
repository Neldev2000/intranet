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
import { ActionData } from './interface';
// Define el esquema de validación con Zod
const formSchema = z.object({
  label: z.string().min(1, "El nombre es requerido"),
  files: z.array(z.any()).optional(), // Cambiado de z.instanceof(File) a z.any()
  description: z.string().min(1, "La descripción es requerida"),
  currentFunctions: z.array(z.object({
    description: z.string()
  })).min(1, "Al menos una función es requerida"),
  acquiredResponsibilities: z.array(z.object({
    description: z.string()
  })).min(1, "Al menos una responsabilidad adquirida es requerida"),
  qualifications: z.array(z.object({
    description: z.string()
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
    currentFunctions: { description: string }[];
    acquiredResponsibilities: { description: string }[];
    qualifications: { description: string }[];
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
      currentFunctions: [],
      acquiredResponsibilities: [],
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




  const { fields: qualificationFields, append: appendQualification, remove: removeQualification } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });

  const { fields: currentFunctionsFields, append: appendCurrentFunction, remove: removeCurrentFunction } = useFieldArray({
    control: form.control,
    name: "currentFunctions",
  });

  const { fields: acquiredResponsibilitiesFields, append: appendAcquiredResponsibility, remove: removeAcquiredResponsibility } = useFieldArray({
    control: form.control,
    name: "acquiredResponsibilities",
  });

  async function onSubmit(data: FormValues) {
    const formData = new FormData();
    formData.append('label', data.label);
    formData.append('description', data.description);
    formData.append('currentFunctions', JSON.stringify(data.currentFunctions.map(f => f.description)));
    formData.append('acquiredResponsibilities', JSON.stringify(data.acquiredResponsibilities.map(r => r.description)));
    formData.append('qualifications', JSON.stringify(data.qualifications.map(q => q.description)));
    formData.append('reports_to', data.reports_to);
    
    // Agregar archivos
    if (data.files) {
      data.files.forEach(file => formData.append('files', file));
    }
  
    const result = await actionCreatePosition(formData);
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
          <FormLabel>Calificaciones</FormLabel>
          {qualificationFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`qualifications.${index}.description`}
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
            description:""
          })}>
            Agregar Calificación
          </Button>
          <FormMessage>{form.formState.errors.qualifications?.message}</FormMessage>
        </div>

        <div>
          <FormLabel>Funciones Actuales</FormLabel>
          {currentFunctionsFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`currentFunctions.${index}.description`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mt-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeCurrentFunction(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendCurrentFunction({
            description:""
          })}>
            Agregar Función Actual
          </Button>
          <FormMessage>{form.formState.errors.currentFunctions?.message}</FormMessage>
        </div>

        <div>
          <FormLabel>Responsabilidades Adquiridas</FormLabel>
          {acquiredResponsibilitiesFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`acquiredResponsibilities.${index}.description`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mt-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeAcquiredResponsibility(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendAcquiredResponsibility({
            description:""
          })}>
            Agregar Responsabilidad Adquirida
          </Button>
          <FormMessage>{form.formState.errors.acquiredResponsibilities?.message}</FormMessage>
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
