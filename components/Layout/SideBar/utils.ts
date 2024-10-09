"use server"

import { sql } from "@vercel/postgres"
import { Employee } from "./interface"
import { unstable_noStore as noStore } from 'next/cache';

export async function getAllEmployees() {
    noStore();
    try {
        const { rows } = await sql`select
                                employees.id,
                                employees.name as name,
                                positions.label as position
                            from
                                employees
                            join
                                positions on (positions.id=employees.position_id)`
        console.log(rows)
        return {
            error: false,
            message: "Empleados encontrados correctamente",
            data: rows as Employee[]
        }
    } catch (error) {
        console.error(error)
        return {
            error: true,
            message: "Empleados no se pudieron encontrar",
            data: null
        }
    }
}