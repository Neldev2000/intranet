"use server"
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const positionSchema = z.object({
    label: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    responsibilities: z.array(z.object({
      descripcion:z.string()
    }
      
    )).min(1, "Al menos una responsabilidad es requerida"),
    qualifications: z.array(z.object({
      descripcion:z.string()
    })).min(1, "Al menos una calificación es requerida"),
    reports_to: z.string()
  });
  

export async function actionCreatePosition(data: z.infer<typeof positionSchema>) {
    
    const { label, description, responsibilities, qualifications, reports_to } = data;
    const responsabilitiesList = responsibilities.map(r=>r.descripcion) as any
    const qualificationsList = qualifications.map(q=>q.descripcion) as any
    console.log(data)
    const { rows } = await sql`
      INSERT INTO positions (label, description, responsibilities, qualifications, reports_to)
      VALUES (${label}, ${description}, ${responsabilitiesList}, ${qualificationsList}, ${reports_to.length > 0 ? reports_to : null})
      RETURNING *
    `;
    revalidatePath('/')
}