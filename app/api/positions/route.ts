import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// Datos hardcodeados para los cargos iniciales
const initialPositions = [
  {
    id: '1',
    label: 'CEO',
    description: 'Líder ejecutivo de la empresa',
    responsibilities: ['Definir la estrategia de la empresa', 'Tomar decisiones clave'],
    qualifications: ['MBA', '10+ años de experiencia en liderazgo'],
  },
  {
    id: '2',
    label: 'CTO',
    description: 'Líder tecnológico de la empresa',
    responsibilities: ['Definir la estrategia tecnológica', 'Supervisar el desarrollo de productos'],
    qualifications: ['Grado en Informática', 'Experiencia en liderazgo técnico'],
  },
  {
    id: '3',
    label: 'CFO',
    description: 'Líder financiero de la empresa',
    responsibilities: ['Gestionar las finanzas de la empresa', 'Elaborar informes financieros'],
    qualifications: ['Grado en Finanzas', 'Experiencia en gestión financiera'],
  },
];

let positions = [...initialPositions];

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM positions`;
    console.log(rows)
    return NextResponse.json(rows.map(r => (
      {
        ...r,
      id: `${r.id}`
      }
    )));
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json({ error: 'Error fetching positions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newPosition = await request.json();
    console.log(newPosition)
    const { name, description, responsibilities, qualifications, reportsTo } = newPosition;
    

    const { rows } = await sql`
      INSERT INTO positions (label, description, responsibilities, qualifications, reports_to)
      VALUES (${name}, ${description}, ${responsibilities}, ${qualifications}, ${reportsTo.length>0? reportsTo : null})
      RETURNING *
    `;
    
    // Convertir de vuelta a arrays para la respuesta
    const result = {
      ...rows[0],
      responsibilities: JSON.parse(rows[0].responsibilities),
      qualifications: JSON.parse(rows[0].qualifications)
    };
    revalidatePath('/');
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json({ error: 'Error creating position' }, { status: 500 });
  }
}
