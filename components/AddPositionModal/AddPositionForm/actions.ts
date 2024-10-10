"use server"
import { createClient } from '@/utils/supabase/server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';

type ActionData = {
    label: string;
    description: string;
    responsibilities: { descripcion: string }[];
    qualifications: { descripcion: string }[];
    reports_to: string;
    files:File[];
};


export async function actionCreatePosition(data:ActionData) {
    
    const { label, description, responsibilities, qualifications, reports_to, files } = data;
    const responsabilitiesList = responsibilities.map(r=>r.descripcion) as any
    const qualificationsList = qualifications.map(q=>q.descripcion) as any
    console.log(data)
    const { rows } = await sql`
      INSERT INTO positions (label, description, responsibilities, qualifications, reports_to)
      VALUES (${label}, ${description}, ${responsabilitiesList}, ${qualificationsList}, ${reports_to.length > 0 ? reports_to : null})
      RETURNING id
    `;

    const positionId = rows[0].id;

    // Cargar archivos a Supabase
    if (files && files.length > 0) {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
    
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
          }
        }
      }



    revalidatePath('/')
}