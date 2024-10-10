import { NextResponse, NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: 'Position ID is required' }, { status: 400 });
    }

    // Primero, actualizar los nodos que reportan a este nodo
    await sql`
        UPDATE positions
        SET reports_to = NULL
        WHERE reports_to = ${id}
      `;

    // Luego, eliminar el nodo
    const { rowCount } = await sql`
        DELETE FROM positions
        WHERE id = ${id}
      `;

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    // Listar todos los archivos con el prefijo del ID de la posición
    const { data: files, error: listError } = await supabase.storage
      .from('archivos')
      .list(id);

    if (listError) {
      console.error('Error listing files:', listError);
      throw new Error('Error listing files');
    }

    if (files && files.length > 0) {
      // Crear un array con las rutas completas de los archivos
      const filePaths = files.map(file => `${id}/${file.name}`);

      // Eliminar los archivos
      const { data, error: deleteError } = await supabase.storage
        .from('archivos')
        .remove(filePaths);

      if (deleteError) {
        console.error('Error deleting files:', deleteError);
        throw new Error('Error deleting files');
      }
    }
    return NextResponse.json({ message: 'Position deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting position:', error);
    return NextResponse.json({ success: false, message: (error as Error).message || 'Error deleting position' });
  }
}
