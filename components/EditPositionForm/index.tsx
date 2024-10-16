import React from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { actionUpdatePosition } from "./actions";

const formSchema = z.object({
  label: z.string().min(1, "El nombre es requerido"),
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

type FormValues = z.infer<typeof formSchema>;

interface EditPositionFormProps {
  node: {
    id: string;
    data: {
      label: string;
      description: string;
      currentFunctions: string[];
      adquiredResposibilities: string[];
      qualifications: string[];
    };
  };
  existingPositions: { id: string; label: string, description: string }[];
  onComplete: (updatedData: any) => void;
  onCancel: () => void;
}

export function EditPositionForm({ node, existingPositions, onComplete, onCancel }: EditPositionFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: node.data.label,
      description: node.data.description,
      currentFunctions: node.data.currentFunctions ? node.data.currentFunctions.map(func => ({ description: func })) : [],
      acquiredResponsibilities: node.data.adquiredResposibilities ? node.data.adquiredResposibilities.map(resp => ({ description: resp })) : [],
      qualifications: node.data.qualifications ? node.data.qualifications.map(qual => ({ description: qual })) : [],
      reports_to: "",  // Asume que no tenemos esta información en el nodo
    },
  });

  const { fields: currentFunctionsFields, append: appendCurrentFunction, remove: removeCurrentFunction } = useFieldArray({
    control: form.control,
    name: "currentFunctions",
  });

  const { fields: acquiredResponsibilitiesFields, append: appendAcquiredResponsibility, remove: removeAcquiredResponsibility } = useFieldArray({
    control: form.control,
    name: "acquiredResponsibilities",
  });

  const { fields: qualificationFields, append: appendQualification, remove: removeQualification } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });

  async function onSubmit(data: FormValues) {
    const formData = new FormData();
    formData.append('id', node.id);
    formData.append('label', data.label);
    formData.append('description', data.description);
    formData.append('currentFunctions', JSON.stringify(data.currentFunctions.map(f => f.description)));
    formData.append('acquiredResponsibilities', JSON.stringify(data.acquiredResponsibilities.map(r => r.description)));
    formData.append('qualifications', JSON.stringify(data.qualifications.map(q => q.description)));
    formData.append('reports_to', data.reports_to);

    const result = await actionUpdatePosition(formData);
    if (result.success) {
      onComplete(data);
    } else {
      // Manejar el error
      console.error(result.message);
    }
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
                <Input {...field} />
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
                <Textarea {...field} />
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
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendCurrentFunction({ description: "" })}>
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
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendAcquiredResponsibility({ description: "" })}>
            Agregar Responsabilidad Adquirida
          </Button>
          <FormMessage>{form.formState.errors.acquiredResponsibilities?.message}</FormMessage>
        </div>

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
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendQualification({ description: "" })}>
            Agregar Calificación
          </Button>
          <FormMessage>{form.formState.errors.qualifications?.message}</FormMessage>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" className='bg-blue-600 text-white'>Guardar Cambios</Button>
        </div>
      </form>
    </Form>
  );
}
