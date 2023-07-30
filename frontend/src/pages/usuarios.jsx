import Sidebar from '@/components/Sidebar'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'

const Usuarios = () => {
  const HeaderUsuarios=(()=>{
    return(
      <div>
        <h2>INGRESAR USUARIOS</h2>
        <Button label='Registrar Usuarios'  />
      </div>
    )
  })  
  return (
    <Sidebar>
      <DataTable header={HeaderUsuarios}>
        <Column field='' header='Tipo' />
        <Column field='' header='Nombre' />
        <Column field='' header='Apellido' />
        <Column field='' header='Sectores' />
      </DataTable>
    </Sidebar>
  )
}

export default Usuarios
