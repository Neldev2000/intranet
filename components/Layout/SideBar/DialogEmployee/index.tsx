import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { getPositions } from '@/app/utils'
import { EmployeeForm } from './EmployeeForm'

export async function DialogEmployee() {
  const positionsResult = await getPositions()
  let positions = (positionsResult.error || !positionsResult.data)? [] : positionsResult.data
  const propPositions = positions.map(p=>({
    id: p.id,
    name: p.label
  }))


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className='bg-blue-700 text-white'>Agregar Empleado</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
        </DialogHeader>
        <EmployeeForm positions={propPositions} />
      </DialogContent>
    </Dialog>
  )
}
