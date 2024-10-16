import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';


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
    const { name, description, responsibilities, qualifications, reports_to } = newPosition;
    

    const { rows } = await sql`
      INSERT INTO positions (label, description, responsibilities, qualifications, reports_to)
      VALUES (${name}, ${description}, ${responsibilities}, ${qualifications}, ${reports_to.length>0? reports_to : null})
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

