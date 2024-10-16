"use server"

import { createClient } from '@/utils/supabase/server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function actionUpdatePosition(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const label = formData.get('label') as string;
    const description = formData.get('description') as string;
    const currentFunctions = JSON.parse(formData.get('currentFunctions') as string) as string[];
    const acquiredResponsibilities = JSON.parse(formData.get('acquiredResponsibilities') as string) as string[];
    const qualifications = JSON.parse(formData.get('qualifications') as string) as string[];
    const reports_to = formData.get('reports_to') as string;

    if (!id || !label || !description || !Array.isArray(currentFunctions) || !Array.isArray(acquiredResponsibilities) || !Array.isArray(qualifications)) {
      throw new Error('Faltan campos requeridos o tienen un formato incorrecto');
    }

    await sql`
      UPDATE positions
      SET label = ${label},
          description = ${description},
          current_functions = ${currentFunctions as any},
          acquired_responsibilities = ${acquiredResponsibilities as any},
          qualifications = ${qualifications as any},
          reports_to = ${reports_to || null}
      WHERE id = ${id}
    `;

    revalidatePath('/');
    return { success: true, message: 'Posición actualizada con éxito' };
  } catch (error) {
    console.error('Error al actualizar la posición:', error);
    return { success: false, message: 'Error al actualizar la posición' };
  }
}
