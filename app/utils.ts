import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

interface Response {
    id: string;
    label: string;
    description: string;
    responsabilities: string[];
    qualifications: string[];
    reports_to: string;
}

export async function getPositions() {
    noStore();
    
    try {
        const { rows } = await sql`SELECT * FROM positions`;
        console.log(rows)
        return {
            error: false,
            message: "Se obtuvieron los puestos",
            data: rows.map(r => ({
                ...r,
                id: `${r.id}`
            })) as Response[]
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
        return {
            error: true,
            message: "No se obtuvieron los cargos",
            data: null
        }
    }
}