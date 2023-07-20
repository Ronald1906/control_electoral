import React, { useState } from 'react'
import styles from '@/styles/Home.module.css'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {Dropdown} from 'primereact/dropdown'
import {InputTextarea} from 'primereact/inputtextarea'
import {InputText} from 'primereact/inputtext'

const Inicio = () => {
  const [Nombre, setNombre]= useState('Ronald')
  const [Junta, setJunta]= useState('Unidad Educativa xxxxxx')
  const [DlgNovedades, setDlgNovedades]= useState(false)

  const CDlgNovedades=(()=>{
    setDlgNovedades(false)
  })

  return (
    <div className={styles.bodyusers}>
      <div className={styles.contenedor}>
        <h2> Bienvenido {Nombre} </h2>
        <h3> {Junta} </h3>
        <Button label='Registrar Novedades' onClick={()=>{setDlgNovedades(true)}} />
        <DataTable>
          <Column field='mesa' header='MESA' />
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
