import React, { useEffect, useRef, useState } from 'react'
import styles from '@/styles/Home.module.css'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {InputTextarea} from 'primereact/inputtextarea'
import Navbar from '@/components/Navbar'
import axios from 'axios'
import { useRouter } from 'next/router'  
import Swal from 'sweetalert2'
import { InputNumber } from 'primereact/inputnumber'
import Webcam from 'react-webcam';

const Inicio = () => {
  const router= useRouter()
  const [DlgNovedades, setDlgNovedades]= useState(false)
  const [DlgIntalacion, setDlgIntalacion]= useState(false)
  const [DlgVotacion, setDlgVotacion]= useState(false)
  const [DlgCaptureVotacion, setDlgCaptureVotacion]= useState(false)
  const [Juntas, setJuntas]= useState([])
  const [Listas, setListas]= useState([])
  const [Usuario, setUsuario]= useState('')
  const [JuntaInst, setJuntaInst]= useState([])
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [InpNovedad, setInpNovedad]= useState('')

  const consulta = async () => {
    try {
      const result = await axios.get(process.env.NEXT_PUBLIC_BACKEND + 'candidatos/votacion');
      setListas(result.data);
    } catch (error) {
      console.error('Error en consulta:', error);
      // Puedes mostrar un mensaje de error o tomar medidas adicionales aquí
    }
  };
  
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
      console.error('Error en consulta2:', error);
      // Puedes mostrar un mensaje de error o tomar medidas adicionales aquí
    }
  };
  

  const CDlgNovedades=(()=>{
    setDlgNovedades(false)
    setCapturedImage(null)
    setInpNovedad('')
  })

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
  },[])

  const HeaderTable=(()=>{
    return(
      <div>
        <Button label='Registrar Novedades' onClick={()=>{setDlgNovedades(true)}} />
      </div>
    )
  })

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
    if(intfecha >=17){
      if(dato.ejecutado == 0){
        consulta()
        setJuntaInst(dato)
        setDlgVotacion(true)
      }else if(dato.ejecutado == 1){
        Swal.fire({
          title: '¡Error!',
          icon: 'error',
          text: 'Esta Junta ya ha sido registrada'
        })
      }
    }else{
      Swal.fire({
        title:'¡Error!',
        icon: 'error',
        text: 'El proceso de ingreso de la votación es pasada las 17:00'
      })
    }
  }

  const IniciarInstalacion=(e)=>{
    let dato=e
    if(dato.instalacion == 0){
      setJuntaInst(dato)
      setDlgIntalacion(true)
    }else if(dato.instalacion == 1){
      Swal.fire({
        title:'¡Error!',
        icon: 'error',
        text: 'Esta junta electoral ya fue instalada'
      })
    }
  }

  const CDlgIntalacion=(()=>{
    setDlgIntalacion(false)
    setCapturedImage(null)
  })

  const CDlgVotacion=(()=>{
    setDlgVotacion(false)
    setJuntaInst([])
  })

  const onRowEditComplete = (e) => {
    let _products = [...Listas];
    let { newData, index } = e;

    _products[index] = newData;

    setListas(_products);
  };

  const votosEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  };

  const HeaderTableVotos=(()=>{
    return(
      <div>
        <Button label='Registrar Votos' onClick={RegistrarVotos}  />
      </div>
    )
  })

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const generateUniqueFileName = (username) => {
    const timestamp = Date.now();
    return `${username}_${timestamp}.jpg`; // Ejemplo de formato de nombre único
  };

  const handleUpload=(()=>{
    setDlgIntalacion(false)
    if (!capturedImage) {
      Swal.fire({
        title:'¡Error!',
        icon: 'warning',
        text: 'Tome una Foto de la acta de instalación de la mesa'
      })
    }else{
      const uniqueFileName = generateUniqueFileName(Usuario); // Genera un nombre único
      let token= localStorage.getItem('token_eleccion_2023_app')

      axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/instalacion',{
        usuario: Usuario,
        imagen: uniqueFileName,
        fecha: new Date().toISOString().substring(0,10),
        hora: new Date().toLocaleTimeString(),
        junta: JuntaInst
      },{
        headers:{
          token_eleccion_2023_app: token
        }
      }).then((result)=>{
        if(result.data.registrado == true){
          if(result.data.actualizado == false){
            CDlgIntalacion()
            const formData = new FormData();
            const blob = dataURItoBlob(capturedImage); // Convierte la imagen capturada de base64 a Blob
            formData.append('file', blob, uniqueFileName);
      
            axios.post(process.env.NEXT_PUBLIC_BACKEND + 'usuarios/instalacion_foto', formData,{
              headers:{
                token_eleccion_2023_app: token
              }
            }).then((results)=>{
              consulta2(Usuario)
              Swal.fire({
                title: results.data.title,
                icon: results.data.icon,
                text: results.data.text
              })
            })
          }else if(result.data.actualizado == true){
            consulta2(Usuario)
            CDlgIntalacion()
            Swal.fire({
              title: result.data.title,
              icon: result.data.icon,
              text: result.data.text
            })
          }
        }
      })
    }
  })

  const handleUpload3=(()=>{
    setDlgCaptureVotacion(false)
    if (!capturedImage) {
      Swal.fire({
        title:'¡Error!',
        icon: 'warning',
        text: 'Tome una Foto de la acta de instalación de la mesa'
      })
    }else{
      const uniqueFileName = generateUniqueFileName(Usuario); // Genera un nombre único
      let token= localStorage.getItem('token_eleccion_2023_app')

      axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/temp_votacion',{
        usuario: Usuario,
        imagen: uniqueFileName,
        fecha: new Date().toISOString().substring(0,10),
        hora: new Date().toLocaleTimeString(),
        junta: JuntaInst,
        votos: Listas
      },{
        headers:{
          token_eleccion_2023_app: token
        }
      }).then((result)=>{
        consulta2(Usuario)
        if(result.data.nuevo == true){
          const formData = new FormData();
          const blob = dataURItoBlob(capturedImage); // Convierte la imagen capturada de base64 a Blob
          formData.append('file', blob, uniqueFileName);
        
          axios.post(process.env.NEXT_PUBLIC_BACKEND + 'usuarios/foto_votos', formData,{
            headers:{
              token_eleccion_2023_app: token
            }
          }).then((results)=>{
              CDlgCaptureVotacion()
              Swal.fire({
                title: results.data.title,
                icon: results.data.icon,
                text: results.data.text
             })
          })
        }else if(result.data.nuevo == false){
          CDlgCaptureVotacion()
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
         })
        }
      })
    }
  })

  // Convierte una imagen en formato data URI a Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  //Metodo para subir las novedades
  const handleUpload2=(()=>{
    setDlgNovedades(false)
    if (!capturedImage) {
      Swal.fire({
        title:'¡Error!',
        icon: 'warning',
        text: 'Tome una foto de la novedad que desea registrar'
      })
    }else{
      if(InpNovedad !== ''){
        const uniqueFileName = generateUniqueFileName(Usuario); // Genera un nombre único
        let token= localStorage.getItem('token_eleccion_2023_app')

        axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/novedades',{
          usuario: Usuario,
          imagen: uniqueFileName,
          fecha: new Date().toISOString().substring(0,10),
          hora: new Date().toLocaleTimeString(),
        },{
          headers:{
            token_eleccion_2023_app: token
          }
        }).then((result)=>{
          if(result.data.registro == false){
            Swal.fire({
              title: result.data.title,
              icon: result.data.icon,
              text: result.data.text
            }).then((resp)=>{
              if(resp.isConfirmed){
                setDlgNovedades(true)
              }
            })
          }else if(result.data.registro == true){
            CDlgNovedades()
            const formData = new FormData();
            const blob = dataURItoBlob(capturedImage); // Convierte la imagen capturada de base64 a Blob
            formData.append('file', blob, uniqueFileName);
        
            axios.post(process.env.NEXT_PUBLIC_BACKEND + 'usuarios/novedades_foto', formData,{
              headers:{
                token_eleccion_2023_app: token
              }
            }).then((results)=>{
              Swal.fire({
                title: results.data.title,
                icon: results.data.icon,
                text: results.data.text
              })
            })
          }
        })
      }else{
        Swal.fire({
          title: '¡Advertencia!',
          icon: 'warning',
          text: 'Por favor ingrese el contenido de la novedad'
        }).then((result)=>{
          if(result.isConfirmed){
            setDlgNovedades(true)
          }
        })
      }
    }
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
        setDlgCaptureVotacion(true)
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

  const CDlgCaptureVotacion=(()=>{
    setDlgCaptureVotacion(false)
    setCapturedImage(null)
    CDlgVotacion()
  })

  return (
    <div className={styles.contenedorglobal}>
      <div className={styles.contenedorveedor}>
        <Navbar/>
        <div style={{textAlign:'center', overflowY: 'auto'}}>
          <DataTable header={HeaderTable} value={Juntas} paginator 
          stripedRows rows={5}>
            <Column field='nombre_recinto' header='Recinto' />
            <Column field='num_junta' header='Junta' />
            <Column body={BtnInstalacion} header='Instalación' align='center' exportable={false} style={{minWidth: '8rem' }} />
            <Column body={BtnVotacion} header='Votación' align='center' exportable={false} style={{minWidth: '8rem' }} />
          </DataTable>
        </div>
      </div>
      {/* Dialogo para registrar las novedades */}
      <Dialog visible={DlgNovedades} onHide={CDlgNovedades} header='Ingrese la novedad' style={{width:'100%'}} >
        <div style={{display:'flex', flexDirection: 'column'}}>
          <Webcam audio={false} ref={webcamRef} style={{marginBottom:'10px'}} />
          <Button label='Capturar Foto' onClick={handleCapture} style={{marginBottom:'10px'}} />
          {capturedImage && (
            <div style={{display:'flex', flexDirection: 'column'}}>
              <img src={capturedImage} alt="Capturada"  style={{marginBottom:'10px'}} />
              <InputTextarea placeholder='Ingrese la novedad' value={InpNovedad} onChange={(e)=>{setInpNovedad(e.target.value)}} style={{marginBottom:'10px'}} />
              <Button label='Subir Foto' onClick={handleUpload2} /> 
            </div>
          )}
        </div>
      </Dialog>
      <Dialog visible={DlgIntalacion} style={{width:'100%'}} onHide={CDlgIntalacion}>
        <div style={{display:'flex', flexDirection:'column'}}>
          <Webcam audio={false} ref={webcamRef} style={{marginBottom:'10px'}} />
          <Button label='Capturar Foto' onClick={handleCapture} />
          {capturedImage && (
            <div>
              <img src={capturedImage} alt="Capturada"  style={{marginBottom:'10px'}} />
              <Button label='Subir Foto' onClick={handleUpload} />
            </div>
          )}
        </div>
      </Dialog>
      {/* Dialogo para registrar los votos */}
      <Dialog visible={DlgVotacion} onHide={CDlgVotacion} style={{width:'100%'}}>
        <DataTable value={Listas} header={HeaderTableVotos} editMode="row" onRowEditComplete={onRowEditComplete} >
          <Column field='nombre' header='Listas' />
          <Column field='total' header='Votos' editor={(options) => votosEditor(options)} />
          <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
        </DataTable>
      </Dialog>
      <Dialog visible={DlgCaptureVotacion} onHide={CDlgCaptureVotacion} style={{width:'100%'}} >
        <div style={{display:'flex', flexDirection:'column'}}>
          <Webcam audio={false} ref={webcamRef} style={{marginBottom:'10px'}} />
          <Button label='Capturar Foto' onClick={handleCapture} />
          {capturedImage && (
            <div>
              <img src={capturedImage} alt="Capturada"  style={{marginBottom:'10px'}} />
              <Button label='Registrar votacion' onClick={handleUpload3} />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  )
}

export default Inicio