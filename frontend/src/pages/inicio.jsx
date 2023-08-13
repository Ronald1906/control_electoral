import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {Dropdown} from 'primereact/dropdown'
import {InputTextarea} from 'primereact/inputtextarea'
import {InputText} from 'primereact/inputtext'
import Navbar from '@/components/Navbar'
import axios from 'axios'

const Inicio = () => {
  const [Nombre, setNombre]= useState('Ronald')
  const [DlgNovedades, setDlgNovedades]= useState(false)

  const CDlgNovedades=(()=>{
    setDlgNovedades(false)
  })

  /*useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/datos',{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{
      console.log(result.data)
    })
  },[])*/

  return (
    <div className={styles.bodyusers}>
      <Navbar />
      <div className={styles.contenedor}>
        <h2> Bienvenido {Nombre} </h2>
        <Button label='Registrar Novedades' onClick={()=>{setDlgNovedades(true)}} />
        <DataTable>
          <Column field='mesa' header='MESA' alignHeader='center' />
          <Column field='mesa' header='INICIAR' />
        </DataTable>
      </div>
      <Dialog visible={DlgNovedades} onHide={CDlgNovedades} header='Ingrese la novedad' >
        <div className={styles.dlgnovedad}>
          <Dropdown placeholder='Seleccione la Junta' className={styles.slcs} />
          <InputTextarea placeholder='Ingrese la novedad' className={styles.txtarea} />
          <InputText type='file' accept='.jpg, .png' />
        </div>
      </Dialog>
    </div>
  )
}

export default Inicio
