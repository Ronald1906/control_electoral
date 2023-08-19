import Sidebar from '@/components/Sidebar'
import axios from 'axios'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'
import React, { useEffect, useState } from 'react'
import { FileUpload } from 'primereact/fileupload';
import { useRouter } from 'next/router'

const Revision_sufragio = () => {
  const [Juntas, setJuntas]= useState([])
  const [DlgRevision, setDlgRevision]= useState(false)
  const [Votos, setVotos]= useState([])
  const [DlgImg, setDlgImg]= useState(false)
  const [FileImg, setFileImg]= useState(null)
  const [Usuario, setUsuario]= useState('')
  const [IdVoto, setIdVoto]= useState(null)
  const router= useRouter()

  const consulta= (()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/revision',{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app'),
      }
    }).then((result)=>{
      setJuntas(result.data)
    })
  })

  useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/login',{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{
      if(result.data.token.data.id_rol !== 1){
        router.push('/')
      }else{
        setUsuario(result.data.token.data.users)
      }
    })
  },[router])

  useEffect(()=>{
    consulta()
  },[])

  const BtnRevision = (rowData) => {
    return (
      <div>
        <Button label='Revisión'  className="p-button p-button-success mr-2" onClick={() => IniciarRevision(rowData)}   />
      </div>
    )
  }

  const IniciarRevision=(e)=>{
    let dato= e
    setVotos(dato.votos)
    setIdVoto(dato._id)
    setDlgRevision(true)
  }

  const CDlgRevision=(()=>{
    setDlgRevision(false)
    setVotos([])
  })

  const onRowEditComplete = (e) => {
    let _products = [...Votos];
    let { newData, index } = e;

    _products[index] = newData;

    setVotos(_products);
  };
  

  const votosEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  };

  const HeaderTable=(()=>{
    return(
      <div>
        <Button label='Registrar la imagen' onClick={()=>{setDlgImg(true)}} />
      </div>
    )
  })

  const CDlgImg=(()=>{
    setDlgImg(false)
    setFileImg(null)
  })

  const generateUniqueFileName = (username) => {
    const timestamp = Date.now();
    return `${username}_${timestamp}.jpg`; // Ejemplo de formato de nombre único
  };

  const Actualizar=(()=>{
    const uniqueFileName = generateUniqueFileName(Usuario);
    axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/validado',{
      nombre_img: uniqueFileName,
      id_junta: IdVoto
    },{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app'),
      }
    }).then((result)=>{
      console.log(result.data)
    })
  })

  return (
    <Sidebar>
      {/* Tabla de mostrar las juntas */}
      <DataTable value={Juntas}>
        <Column field='nombre_recinto' header='Recinto' />
        <Column field='nombre_zona' header='Zona' />
        <Column field='num_junta' header='Junta' />
        <Column body={BtnRevision} header='Votación' align='center' exportable={false} style={{minWidth: '8rem' }} />
      </DataTable>
      {/* Dialogo para mostrar los valores ingresados */}
      <Dialog visible={DlgRevision} onHide={CDlgRevision}>
        <DataTable header={HeaderTable} value={Votos} editMode="row" onRowEditComplete={onRowEditComplete}  >
          <Column field='nombre' header='Titulo' />
          <Column field='total' header='Cantidad' editor={(options) => votosEditor(options)} />
          <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
        </DataTable>
      </Dialog>
      <Dialog visible={DlgImg} onHide={CDlgImg} style={{width:'auto'}}>
        <div style={{display:'flex', flexDirection:'column'}}>
          <FileUpload  chooseLabel="Seleccionar" mode="basic" name="image" onSelect={FileImg} style={{marginBottom:'10px'}}  />
          <Button label="Subir Imagen" onClick={Actualizar} />
        </div>
      </Dialog>
    </Sidebar>
  )
}

export default Revision_sufragio
