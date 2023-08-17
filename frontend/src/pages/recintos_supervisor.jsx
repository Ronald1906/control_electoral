import Sidebar from '@/components/Sidebar'
import axios from 'axios'
import { DataTable } from 'primereact/datatable'
import React, { useEffect } from 'react'

const Recintos_supervisor = () => {


  return (
    <Sidebar>
      <DataTable header='Parroquias Supervisadas'>
        
      </DataTable>
    </Sidebar>
  )
}

export default Recintos_supervisor
