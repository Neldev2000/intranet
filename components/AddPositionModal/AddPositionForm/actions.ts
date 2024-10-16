"use server"

import { createClient } from '@/utils/supabase/server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function actionCreatePosition(formData: FormData) {
  try {
    // Extraer datos del formulario
    const label = formData.get('label') as string;
    const description = formData.get('description') as string;
    const currentFunctions = JSON.parse(formData.get('currentFunctions') as string) as string[];
    const acquiredResponsibilities = JSON.parse(formData.get('acquiredResponsibilities') as string) as string[];
    const qualifications = JSON.parse(formData.get('qualifications') as string) as string[];
    const reports_to = formData.get('reports_to') as string;
    const files = formData.getAll('files') as File[];

    // Validación básica
    if (!label || !description || !Array.isArray(currentFunctions) || !Array.isArray(acquiredResponsibilities) || !Array.isArray(qualifications)) {
      throw new Error('Faltan campos requeridos o tienen un formato incorrecto');
    }

    // Insertar en la base de datos
    const { rows } = await sql`
      INSERT INTO positions (label, description, current_functions, acquired_responsabilities, qualifications, reports_to)
      VALUES (${label}, ${description}, ${currentFunctions as any}, ${acquiredResponsibilities as any}, ${qualifications as any}, ${reports_to || null})
      RETURNING id
    `;

    const positionId = rows[0].id;

    // Cargar archivos a Supabase
    if (files.length > 0) {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const fileName = `${positionId}/${file.name}`;

        const { error } = await supabase.storage
          .from('archivos')
          .upload(fileName, fileBuffer, {
            contentType: file.type,
          });

        if (error) {
          console.error('Error al cargar el archivo:', error);
          // Considera si quieres lanzar un error aquí o simplemente loguearlo
        }
      }
    }

    revalidatePath('/');
    return { success: true, message: 'Posición creada con éxito' };
  } catch (error) {
    console.error('Error al crear la posición:', error);
    return { success: false, message: 'Error al crear la posición' };
  }
}
