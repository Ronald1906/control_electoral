import Sidebar from '@/components/Sidebar'
import axios from 'axios'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'

const Reporte = () => {

  const [Listas, setListas]= useState([])

  useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'registros/totales',{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{
      const datos=result.data
      const ordenado= datos.sort((a,b)=>b.total - a.total)
      setListas(ordenado)
      console.log(ordenado)
    })
  },[])

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(Listas);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
      saveAsExcelFile(excelBuffer, 'total');
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };


  const HeaderTable=(()=>{
    return(
      <div>
        <Button type="button" icon="pi pi-file-excel" severity="success" onClick={exportExcel}   data-pr-tooltip="XLS" />
      </div>
    )
  })

  return (
    <Sidebar>
      <DataTable value={Listas} header={HeaderTable} >
        <Column field='nombre' header='Grupo Politico' />
        <Column field='total' header='Total Votos' />
      </DataTable>
    </Sidebar>
  )
}

export default Reporte
