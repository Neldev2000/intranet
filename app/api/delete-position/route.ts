import { NextResponse, NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

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

      return NextResponse.json({ message: 'Position deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting position:', error);
      return NextResponse.json({ error: 'Error deleting position' }, { status: 500 });
    }
}
