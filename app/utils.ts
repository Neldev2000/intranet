import { sql } from '@vercel/postgres';

export const obtenerPosiciones = async () => {
    try {
        const { rows } = await sql`SELECT * FROM positions`;
        console.log(rows)
        return {
            error: false,
            message: "Se obtuvieron los puestos",
            data: rows.map(r => ({
                ...r,
                id: `${r.id}`
            }))
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