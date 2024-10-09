import { NextResponse } from 'next/server';

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
  return NextResponse.json(positions);
}

export async function POST(request: Request) {
  const newPosition = await request.json();
  
  // Asignar un nuevo ID
  newPosition.id = (positions.length + 1).toString();
  
  // Agregar la nueva posición al array
  positions.push(newPosition);
  console.log(positions)
  return NextResponse.json(newPosition, { status: 201 });
}