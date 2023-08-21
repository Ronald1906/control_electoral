import Sidebar from '@/components/Sidebar'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'
import { FileUpload } from 'primereact/fileupload'
import Swal from 'sweetalert2'

const sufragar = () => {
  const [Juntas, setJuntas]= useState([])
  const [DlgVotacion, setDlgVotacion]= useState(false)
  const [DlgInstalacion, setDlgInstalacion]= useState(false)
  const [DlgImgV, setDlgImgV]= useState(false)
  const [Usuario, setUsuario]= useState('')
  const [JuntaV, setJuntaV]= useState([])
  const [Listas, setListas]= useState([])
  const [FileImg, setFileImg]= useState(null)

  const router= useRouter()
  

  //Consulta para mostrar los candidatos
  const consulta = async () => {
    try {
      const result = await axios.get(process.env.NEXT_PUBLIC_BACKEND + 'candidatos/votacion');
      setListas(result.data);
    } catch (error) {
      console.error('Error en consulta:', error);
      // Puedes mostrar un mensaje de error o tomar medidas adicionales aquí
    }
  };
  
  //Consulta para extraer las juntas asignadas al usuario
  const consulta2 = async (usuario) => {
    try {
      const resp = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND + 'usuarios/juntas',
        { user: usuario },
        {
          headers: {
            token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app'),
          },
        }
      );
      setJuntas(resp.data);
    } catch (error) {
      // Puedes mostrar un mensaje de error o tomar medidas adicionales aquí
    }
  };

  useEffect(()=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    if(token){
      axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/login',{
        headers:{
          token_eleccion_2023_app: token
        }
      }).then((result)=>{
        if(result.data.auth == false){
          router.push('/')
        }else if(result.data.auth == true){
          setUsuario(result.data.token.data.users)
          consulta2(result.data.token.data.users)
        }
      })
    }else{
      router.push('/')
    }
  },[router])


  const Estados = [
    { nombre: 'true', valor: 'true' },
    { nombre: 'false', valor: 'false' }
  ];
  
  const InstalacionTemplateFilter = (options) => {
    return (
      <Dropdown
        showClear
        options={Estados}
        optionLabel='nombre'
        optionValue='valor'
        onChange={(e) => {
          options.filterApplyCallback(e.value); // Utiliza e.value en lugar de e.target.value
        }}
        value={options.value}
        placeholder='Seleccione'
      />
    );
  };

  const EjecucionTemplateFilter = (options) => {
    return (
      <Dropdown
        showClear
        options={Estados}
        optionLabel='nombre'
        optionValue='valor'
        onChange={(e) => {
          options.filterApplyCallback(e.value); // Utiliza e.value en lugar de e.target.value
        }}
        value={options.value}
        placeholder='Seleccione'
      />
    );
  };
  
  const BtnInstalacion = (rowData) => {
    return (
      <div>
        <Button label='Instalación'  className="p-button p-button-success mr-2" onClick={() => IniciarInstalacion(rowData)}   />
      </div>
    )
  }

  const BtnVotacion = (rowData) => {
    return (
      <div>
        <Button label='Votación'  className="p-button p-button-success mr-2" onClick={() => IniciarVotacion(rowData)}   />
      </div>
    )
  }

  const IniciarVotacion=(e)=>{
    let dato= e
    let fecha= new Date().toLocaleTimeString().substring(0,2)
    let intfecha= parseInt(fecha)
      if(dato.ejecutado == false){
        consulta()
        setJuntaV(dato)
        setDlgVotacion(true)
      }else if(dato.ejecutado == true){
        Swal.fire({
          title: '¡Error!',
          icon: 'error',
          text: 'Esta Junta ya ha sido registrada'
        })
      }
  }

  const IniciarInstalacion=(e)=>{
    let dato= e
    if(dato.instalacion == false){
      setDlgInstalacion(true)
    }else{
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: '¡Junta ya instalada!'
      })
    }

  }

  const onRowEditComplete = (e) => {
    let _products = [...Listas];
    let { newData, index } = e;

    _products[index] = newData;

    setListas(_products);
  };

  const votosEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />    
  };

  const HeaderTableVotos=(()=>{
    return(
      <div>
        <Button label='Registrar Votos' onClick={RegistrarVotos}  />
      </div>
    )
  })

  //Metodo para registrar los votos
  const RegistrarVotos=(()=>{
    let vacias=0
    for(let i=0; i<Listas.length; i++){
      if(Listas[i].total==='' || Listas[i].total === null){
        vacias+=1
      }
    }
  
    if(vacias >0){
      setDlgVotacion(false)
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Existen listas vacias, ingrese todo los datos'
      }).then((result)=>{
        if(result.isConfirmed){
          setDlgVotacion(true)
        }
      })
    }else{
  
      // Calcula la sumatoria de los valores de los objetos a partir de la posición 1
      const sumatoria = Listas.slice(1).reduce((acumulador, objeto) => {
        const valor = objeto.total; // Obtiene el valor numérico del objeto
        return acumulador + valor;
      }, 0);
  
      let total= Listas[0].total
      
      if(sumatoria === total){
        setDlgVotacion(false)
        setDlgImgV(true)
      }else{
        setDlgVotacion(false)
        Swal.fire({
          title:'¡Advertencia!',
          icon: 'warning',
          text: 'El valor ingresado como total de votos es: '+total+ ' y el valor de la sumatoria de los votos es: '+ sumatoria
        }).then((result)=>{
          if(result.isConfirmed){
            setDlgVotacion(true)
          }
        })
      }
    }
  })

  const generateUniqueFileName = (username) => {
    const timestamp = Date.now();
    return `${username}_${timestamp}.jpg`; // Ejemplo de formato de nombre único
  };

  const GuardarVotos=(()=>{
    if(!FileImg){   
      setDlgImgV(false)
      Swal.fire({
        title:'¡Advertencia!',
        icon: 'warning',
        text: 'Ingrese la imagen por favor'
      }).then((result)=>{
        if(result.isConfirmed){
          setDlgImgV(true)
        }
      })
    }else{
      let token= localStorage.getItem('token_eleccion_2023_app')
      const uniqueFileName = generateUniqueFileName(Usuario);
      axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/registro_supervisor',{
        usuario: Usuario,          
        fecha: new Date().toISOString().substring(0,10),
        hora: new Date().toLocaleTimeString(),
        img_name: uniqueFileName,
        junta: JuntaV,
        votos: Listas
      },{
        headers:{
          token_eleccion_2023_app: token
        }
      }).then((result)=>{
        if(result.data.resultado= true){
          const formData = new FormData();
          formData.append('file', FileImg, uniqueFileName);
          axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/super_imgvot', formData,{
            headers:{
              token_eleccion_2023_app: token
            }
          }).then((results)=>{
            CDlgImgV()
            consulta2(Usuario)
            Swal.fire({
              title: results.data.title,
              icon: results.data.icon,
              text: results.data.text
            })
          })

        }else{
          setDlgImgV(false)
          Swal.fire({
            title: '¡Advertencia!',
            icon: 'error',
            text:'Ocurrio un error, intente de nuevo'
          }).then((result)=>{
            if(result.isConfirmed){
              setDlgImgV(true)
            }
          })
        }
      })
    }
  })


  const CDlgImgV=(()=>{
    setDlgImgV(false)
    setFileImg(null)
  })

  const onFileUpload = (event) => {
    setFileImg(event.files[0]); // Actualiza el estado con el archivo seleccionado
  };

  const CDlgInstalacion=(()=>{
    setDlgInstalacion(false)
    setFileImg(null)
  })

  return (
    <Sidebar>
      <DataTable value={Juntas} paginator stripedRows rows={10} filterDisplay='row' >
        <Column field='cod_recinto' header='Cod Recinto' align='center' />
        <Column field='nombre_recinto' header='Recinto' align='center' />
        <Column field='num_junta' header='Junta' align='center' />
        {/* <Column field='instalacion' header='Instaladas'align='center' filter filterField='instalacion' showClearButton={false} showFilterMenu={false}  style={{ minWidth: '5rem' }} filterElement={InstalacionTemplateFilter} /> */}
        <Column field='ejecutado' header='Sufragado' align='center' filter filterField='ejecutado' showClearButton={false} showFilterMenu={false}  style={{ minWidth: '5rem' }} filterElement={EjecucionTemplateFilter} />
        {/* <Column body={BtnInstalacion} header='Instalación' align='center' exportable={false} style={{minWidth: '8rem' }} />  */}
        <Column body={BtnVotacion} header='Votación' align='center' exportable={false} style={{minWidth: '8rem' }} />             
      </DataTable>
      {/* Dialogo para agregar la instalación */}
      <Dialog visible={DlgInstalacion} onHide={CDlgInstalacion}>
        <div style={{display:'flex', flexDirection: 'column'}}>
          <FileUpload mode="basic" chooseLabel="Selecciona" customUpload onSelect={onFileUpload} accept="image/*" />
          <Button label='Registrar'  />
        </div>
      </Dialog>
      {/* Dialogo para visualizar el datatable de los candidatos */}
      <Dialog visible={DlgVotacion} onHide={()=>{setDlgVotacion(false)}}>
        <DataTable value={Listas} header={HeaderTableVotos}  editMode="row" onRowEditComplete={onRowEditComplete} >
          <Column field='nombre' header='Listas' />
          <Column field='total' header='Votos' editor={(options) => votosEditor(options)} />
          <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
        </DataTable>
      </Dialog>
      {/* Dialogo para agregar la imagen de los candidatos */}
      <Dialog visible={DlgImgV} onHide={CDlgImgV}>
        <div style={{display:'flex', flexDirection:'column'}}>
        <FileUpload mode="basic" chooseLabel="Selecciona" customUpload onSelect={onFileUpload} accept="image/*" />
        <Button label='Registrar' onClick={GuardarVotos} />
        </div>
      </Dialog>
    </Sidebar>
  )
}

export default sufragar
