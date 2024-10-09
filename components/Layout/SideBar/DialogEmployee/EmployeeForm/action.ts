"use server"

import { sql } from "@vercel/postgres";

export async function actionCreateEmployee(values: {name: string; position: string}) {
    try {
        // Primero, verificamos si ya existe un empleado con ese nombre
        console.log(values)
        const existingEmployee = await sql`
            SELECT * FROM employees WHERE name = ${values.name}
        `;

        if (existingEmployee.rows.length > 0) {
            return {
                error: true,
                message: "Ya existe un empleado con ese nombre",
                data: null
            };
        }

        // Si no existe, procedemos a crear el nuevo empleado
        const result = await sql`
            INSERT INTO employees (name, position_id)
            VALUES (${values.name}, ${values.position})
            RETURNING id, name, position_id
        `;

        const newEmployee = result.rows[0];

        return {
            error: false,
            message: "Empleado creado exitosamente",
            data: newEmployee
        };

    } catch (error) {
        console.error('Error al crear el empleado:', error);
        return {
            error: true,
            message: "Error al crear el empleado",
            data: null
        };
    }
}