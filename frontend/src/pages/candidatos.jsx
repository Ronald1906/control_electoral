import Sidebar from '@/components/Sidebar'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
import axios from 'axios'

const candidatos = () => {
  const [DlgRegistrar, setDlgRegistrar]= useState(false)
  const [FileDatos, setFileDatos]= useState([])
  const [Datos, setDatos]= useState([])

  const consulta=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'candidatos').then((result)=>{
      setDatos(result.data)
    })
  })

  useEffect(()=>{
    consulta()
  },[])

  const HeaderTable=(()=>{
    return(
      <div>
        <h2>Registro de Candidatos</h2>
        <Button label='Registrar' onClick={()=>{setDlgRegistrar(true)}} />
      </div>
    )
  }) 
  
  const CDlgRegistrar=(()=>{
    setDlgRegistrar(false)
  })
  
  const handleFile=async(e)=>{
    const file =e.target.files[0] 
    const data= await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    

    //Se obtiene todos los datos del excel
    const jsonData = XLSX.utils.sheet_to_json(worksheet,{header:1})

    //Se obtiene los nombres de las columnas 
    var ncolum= jsonData[0]

    jsonData.shift()

    var numlistas= jsonData[0]

    jsonData.shift()

    let arrayf=[]

    for(let i=0; i<ncolum.length; i++){
        let array_candidatos=[]
        for(let j=0; j<jsonData.length; j++){
            for(let k=0; k<jsonData[j].length; k++){
                let filtro= array_candidatos.filter(el=>el.candidato == jsonData[j][i])
                if(filtro.length == 0){
                    array_candidatos.push({candidato: jsonData[j][i]})
                }
            }
        }
        arrayf.push({
            nombre_lista: ncolum[i],
            num_lista: numlistas[i],
            candidatos: array_candidatos
        })
    }

    setFileDatos(arrayf)

  }

  const RegistrarDatos=(e)=>{
    e.preventDefault()
    if(FileDatos.length==0){
      setDlgRegistrar(false)
      Swal.fire({
        title:'¡Error!',
        icon: 'error',
        text: 'No se encontro ningun dato en el archivo'
      }).then((result)=>{
        if(result.isConfirmed){
          setDlgRegistrar(true)
        }
      })
    }else{
      axios.post(process.env.NEXT_PUBLIC_BACKEND+'candidatos',{
        datos: FileDatos
      }).then((result)=>{
        CDlgRegistrar()
        consulta()
        Swal.fire({
          title: result.data.title,
          icon: result.data.icon,
          text: result.data.text
        })
      })
    }
  }

  return (
    <Sidebar>
      <DataTable header={HeaderTable} value={Datos}>
        <Column field='nombre_lista' header='LISTA' alignHeader='center' />
        <Column field='num_lista' header='NUM LISTA' align='center' />
        <Column field='candidato_1' header='CANDIDATO 1' align='center' />
        <Column field='candidato_2' header='CANDIDATO 2' align='center' />
        <Column field='candidato_3' header='CANDIDATO 3' align='center' />
        <Column field='candidato_4' header='CANDIDATO 4' align='center' />
      </DataTable>
      <Dialog visible={DlgRegistrar} style={{width:'auto'}} onHide={CDlgRegistrar} header='Ingresar Candidatos'>
        <form className={styles.registros} onSubmit={RegistrarDatos}>
          <InputText type='file' className={styles.filesinp} onChange={(e)=>handleFile(e)} />  
          <Button label='Registrar' />
        </form>
      </Dialog>  
    </Sidebar>
  )
}

export default candidatos
