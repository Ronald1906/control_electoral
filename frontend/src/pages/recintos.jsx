import Sidebar from '@/components/Sidebar'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import * as XLSX from 'xlsx'
import Swal from "sweetalert2"
import axios from 'axios'


const Recintos = () => {

  const [DlgRegister, setDlgRegister]= useState(false)
  const [FileDatos, setFileDatos]= useState([])
  const [Datos, setDatos]= useState([])

  const consulta=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'recintos').then((result)=>{
      setDatos(result.data)
    })
  })

  useEffect(()=>{
    consulta()
  },[])

  const HeaderTable=(()=>{
    return(
      <div>
        <h2>Registro de Recintos</h2>
        <Button label='Registrar' onClick={()=>{setDlgRegister(true)}} />
      </div>
    )
  })  

  const CDlgRegister=(()=>{
    setDlgRegister(false)
    setFileDatos([])
  })


  const handleFile=async(e)=>{
    const file =e.target.files[0] 
    const data= await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    

    //Se obtiene todos los datos del excel
    const jsonData = XLSX.utils.sheet_to_json(worksheet,{header:1})
  
    jsonData.shift()

    let arrayD=[]

    for(let i=0; i<jsonData.length;i++){
      arrayD.push({
        codigo_canton: jsonData[i][1],
        nombre_canton: jsonData[i][2].trim(),
        codigo_parroquia: jsonData[i][3],
        nombre_parroquia: jsonData[i][4].trim(),
        nombre_zona: jsonData[i][5].trim(),
        codigo_recinto: jsonData[i][6],
        nombre_recinto: jsonData[i][7],
        direccion: jsonData[i][8],
        juntas_fem: jsonData[i][9],
        juntas_mas: jsonData[i][10]
      })
    }
    
    const resultadoAgrupado = arrayD.reduce((acumulador, actual) => {
      const {
        codigo_canton,
        nombre_canton,
        codigo_parroquia,
        nombre_parroquia,
        nombre_zona,
        codigo_recinto,
        nombre_recinto,
        direccion,
        juntas_fem,
        juntas_mas,
      } = actual;
    
      const cantonExistente = acumulador.find(
        (item) => item.codigo_canton === codigo_canton && item.nombre_canton === nombre_canton
      );
    
      if (cantonExistente) {
        const parroquiaExistente = cantonExistente.parroquias.find(
          (item) => item.codigo_parroquia === codigo_parroquia && item.nombre_parroquia === nombre_parroquia
        );
    
        if (parroquiaExistente) {
          const zonaExistente = parroquiaExistente.zonas.find(
            (item) => item.nombre_zona === nombre_zona
          );
    
          if (zonaExistente) {
            zonaExistente.recintos.push({
              codigo_recinto,
              nombre_recinto,
              direccion,
              juntas_fem,
              juntas_mas,
            });
          } else {
            parroquiaExistente.zonas.push({
              nombre_zona,
              recintos: [
                {
                  codigo_recinto,
                  nombre_recinto,
                  direccion,
                  juntas_fem,
                  juntas_mas,
                },
              ],
            });
          }
        } else {
          cantonExistente.parroquias.push({
            codigo_parroquia,
            nombre_parroquia,
            zonas: [
              {
                nombre_zona,
                recintos: [
                  {
                    codigo_recinto,
                    nombre_recinto,
                    direccion,
                    juntas_fem,
                    juntas_mas,
                  },
                ],
              },
            ],
          });
        }
      } else {
        acumulador.push({
          codigo_canton,
          nombre_canton,
          parroquias: [
            {
              codigo_parroquia,
              nombre_parroquia,
              zonas: [
                {
                  nombre_zona,
                  recintos: [
                    {
                      codigo_recinto,
                      nombre_recinto,
                      direccion,
                      juntas_fem,
                      juntas_mas,
                    },
                  ],
                },
              ],
            },
          ],
        });
      }
    
      return acumulador;
    }, []);
    

    setFileDatos(resultadoAgrupado)

  }


  const RegistrarDatos=(e)=>{
    e.preventDefault()
    if(FileDatos.length == 0){
      setDlgRegister(false)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error, no se encontraron datos de registrar'
      }).then((result)=>{
        if(result.isConfirmed){
          setDlgRegister(true)
        }
      })
    }else{
      axios.post(process.env.NEXT_PUBLIC_BACKEND+'recintos',{
        datos: FileDatos   
      }).then((result)=>{
        CDlgRegister()
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
      <DataTable header={HeaderTable} value={Datos} paginator 
      stripedRows rows={10}>
        <Column field='codigo_canton' header='COD CANTON' align='center' />
        <Column field='nombre_canton' header='CANTON' align='center' />
        <Column field='codigo_parroquia' header='COD PARROQUIA' align='center' />
        <Column field='nombre_parroquia' header='PARROQUIA' align='center' />
        <Column field='nombre_zona' header='ZONA' align='center' />
        <Column field='codigo_recinto' header='COD RECINTO' align='center' />
        <Column field='nombre_recinto' header='RECINTO' align='center' />
        <Column field='direccion' header='DIRECCIÓN' align='center' />
        <Column field='juntas_fem' header='TOTAL JUNTAS F' align='center' />
        <Column field='juntas_mas' header='TOTAL JUNTAS M' align='center' />
      </DataTable>
      <Dialog visible={DlgRegister} onHide={CDlgRegister} style={{width:'30%'}} 
      header='Registro de Recintos'>
        <form className={styles.registros} onSubmit={RegistrarDatos}> 
          <InputText type='file' className={styles.filesinp} onChange={(e)=>handleFile(e)} />
          <Button label='Registrar' />
        </form>
      </Dialog>
    </Sidebar>
  )
}

export default Recintos
