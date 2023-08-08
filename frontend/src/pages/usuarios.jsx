import Sidebar from '@/components/Sidebar'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import Swal from 'sweetalert2'
import { MultiSelect } from 'primereact/multiselect';
        

const Usuarios = () => {

  const [DlgRegisterI, setDlgRegisterI]= useState(false)
  const [DlgSlcUser, setDlgSlcUser]= useState(false)
  const [DlgRegisterAdm, setDlgRegisterAdm]= useState(false)
  const [DlgSupervisor, setDlgSupervisor]= useState(false)
  const [DlgCoordinador, setDlgCoordinador]= useState(false)
  const [DlgVeedor, setDlgVeedor]= useState(false)
  const [InpCedula, setInpCedula]= useState('')
  const [InpNombres, setInpNombres]= useState('')
  const [InpApellidos, setInpApellidos]= useState('')
  const [DrpCanton, setDrpCanton]= useState([])
  const [DrpParroquia, setDrpParroquia]= useState([])
  const [DrpZona, setDrpZona]= useState([])
  const [DrpJuntas, setDrpJuntas]= useState([])
  const [SlcCanton, setSlcCanton]= useState('')
  const [SlcTUsuario, setSlcTUsuario]= useState('')
  const [InpUsuario, setInpUsuario]= useState('')
  const [InpPass, setInpPass]= useState('')
  const [InpCelular, setInpCelular]= useState('')
  const [InpCorreo, setInpCorreo]= useState('')
  const [SlcParroquia, setSlcParroquia]= useState('')
  const [SlcZona, setSlcZona]= useState('')
  const [SlcJuntas, setSlcJuntas] = useState([]);
  const [Recintos, setRecintos]= useState([])
  const [DlgViewRecintos, setDlgViewRecintos]= useState(false)
  const [UsuariosRegistrados, setUsuariosRegistrados]= useState([])

  const arrayUser=[
    {id: 1, usuario: 'Administrador del Sistema'},
    {id: 2, usuario: 'Supervisor'},
    {id: 3, usuario: 'Coordinador'},
    {id: 4, usuario: 'Veedor'}
  ]

  const consulta1=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'recintos/recintos').then((result)=>{
      setDrpCanton(result.data)
    })
  })


  const consulta2=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios').then((result)=>{
      setUsuariosRegistrados(result.data)
    })
  })


  useEffect(()=>{
    consulta1()
    consulta2()
  },[])


  const HeaderUsuarios=(()=>{
    return(
      <div>
        <h2>INGRESAR USUARIOS</h2>
        <Button label='Registrar Usuarios'  onClick={()=>{setDlgSlcUser(true)}} />
      </div>
    )
  })  

  const CDlgRegister=(()=>{
    setDlgRegisterI(false)
    setSlcCanton('')

  })

  const CDlgSlcUser=(()=>{
    setDlgSlcUser(false)
    setSlcTUsuario('')
  })

  //Para abrir la ventana dependiendo de lo que se elige
  const SelectTUsuario=(()=>{
    if(SlcTUsuario !== ''){
      setDlgSlcUser(false)
      if(SlcTUsuario == 'Administrador del Sistema'){
        setDlgRegisterAdm(true)
      }else if(SlcTUsuario == 'Supervisor'){
        setDlgSupervisor(true)
      }else if(SlcTUsuario == 'Coordinador'){
        setDlgCoordinador(true)
      }else if(SlcTUsuario == 'Veedor'){
        setDlgVeedor(true)
      }
    }
  })

  //Limpiar el Dlg de registro de administrador
  const CDlgRegisterAdm=(()=>{
    setInpUsuario('')
    setInpPass('')
    setDlgRegisterAdm(false)
    setSlcTUsuario('')
    setDlgSlcUser(true)
  })

  //Registrar Usuarios Administrador
  const RegistrarAdmin=(e)=>{
    e.preventDefault()
    axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/add_admin',{
      user: InpUsuario,
      pass: InpPass
    }).then((result)=>{
      if(result.data.icon == 'error'){
        setDlgRegisterAdm(false)
        Swal.fire({
          title:result.data.title,
          icon: result.data.icon,
          text: result.data.text
        }).then((resp)=>{
          if(resp.isConfirmed){
            setDlgRegisterAdm(true)
          }
        })
      }else{
        CDlgRegisterAdm()
        setDlgSlcUser(false)
        Swal.fire({
          title:result.data.title,
          icon: result.data.icon,
          text: result.data.text
        })
      }
    })
  }

  //Limpiar el Dlg de registro de supervisores
  const  CDlgSupervisor=(()=>{
    setInpCedula('')
    setInpNombres('')
    setInpApellidos('')
    setInpCelular('')
    setInpCorreo('')
    setSlcCanton('')
    setSlcParroquia('')
    setDrpParroquia([])
    setDlgSupervisor(false)
    setSlcTUsuario('')
    setDlgSlcUser(true)
  })

  //Limpiar el Dlg de registro de coordinadores
  const CDlgCoordinador=(()=>{
    setInpCedula('')
    setInpNombres('')
    setInpApellidos('')
    setInpCelular('')
    setInpCorreo('')
    setSlcCanton('')
    setSlcParroquia('')
    setSlcZona('')
    setDrpParroquia([])
    setDrpZona([])
    setDlgCoordinador(false)
    setSlcTUsuario('')
    setDlgSlcUser(true)
  })

  
  //Limpiar el Dlg de registro de veedores
  const CDlgVeedor=(()=>{
    setInpCedula('')
    setInpNombres('')
    setInpApellidos('')
    setInpCelular('')
    setInpCorreo('')
    setSlcCanton('')
    setSlcParroquia('')
    setSlcZona('')
    setDrpParroquia([])
    setDrpZona([])
    setDlgVeedor(false)
    setSlcTUsuario('')
    setDlgSlcUser(true)
  })

  //Para filtrar las parroquias acorde al canton seleccionado
  const SelectCanton=(()=>{
    if(SlcCanton !== ''){
      const filtro= DrpCanton.filter((e)=>e.codigo_canton === SlcCanton )
      setDrpParroquia(filtro[0].parroquias)
    }
  })

  //Registro de usuarios supervisores
  const RegistrarSuperv=(e)=>{
    e.preventDefault()
    if(SlcCanton !== '' && SlcParroquia !== ''){
      axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/add_superv',{
        cedula: InpCedula,
        nombres: InpNombres,
        apellidos: InpApellidos,
        celular: InpCelular,
        correo: InpCorreo,
        cod_canton: SlcCanton,
        cod_parroquia: SlcParroquia
      }).then((result)=>{
        if(result.data.icon === 'success'){
          CDlgSupervisor()
          setDlgSlcUser(false)
          consulta2()
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          })
        }else if(result.data.icon === 'warning'){
          setDlgSupervisor(false)
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          }).then((resp)=>{
            if(resp.isConfirmed){
              setDlgSupervisor(true)
            }
          })
        }
      })
    }else{
      setDlgSupervisor(false)
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Le falto ingresar datos'
      }).then((resp)=>{
        if(resp.isConfirmed){
          setDlgSupervisor(true)
        }
      })
    }
  }

  //Para filtrar las zonas acorde a la parroquia seleccionada
  const SelectParroquia=(()=>{
    if(SlcParroquia !== ''){
      const filtro= DrpParroquia.filter((e)=>e.codigo_parroquia === SlcParroquia )
      setDrpZona(filtro[0].zonas)
    }
  })

  //Registro de usuarios coordinadores
  const RegistrarCoord=(e)=>{
    e.preventDefault()
    if(SlcCanton !== '' && SlcParroquia !== '' && SlcZona !== ''){
      axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/add_coord',{
        cedula: InpCedula,
        nombres: InpNombres,
        apellidos: InpApellidos,
        celular: InpCelular,
        correo: InpCorreo,
        cod_canton: SlcCanton,
        cod_parroquia: SlcParroquia,
        nombre_zona: SlcZona
      }).then((result)=>{
        if(result.data.icon === 'success'){
          CDlgCoordinador()
          setDlgSlcUser(false)
          consulta2()
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          })
        }else if(result.data.icon === 'warning'){
          setDlgCoordinador(false)
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          }).then((resp)=>{
            if(resp.isConfirmed){
              setDlgCoordinador(true)
            }
          })
        }
      })
    }else{
      setDlgCoordinador(false)
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Le falto ingresar datos'
      }).then((resp)=>{
        if(resp.isConfirmed){
          setDlgCoordinador(true)
        }
      })
    }
  }

  //Registro de usuarios veedores
  const RegistrarVeedor=(e)=>{
    e.preventDefault()
    if(SlcCanton !== '' && SlcParroquia !== '' && SlcZona !== '' && SlcJuntas.length >0){
      axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/add_veedor',{
        cedula: InpCedula,
        nombres: InpNombres,
        apellidos: InpApellidos,
        celular: InpCelular,
        correo: InpCorreo,
        cod_canton: SlcCanton,
        cod_parroquia: SlcParroquia,
        recintos: SlcJuntas
      }).then((result)=>{
        if(result.data.icon === 'success'){
          CDlgVeedor()
          setDlgSlcUser(false)
          consulta2()
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          })
        }else if(result.data.icon === 'warning'){
          setDlgVeedor(false)
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          }).then((resp)=>{
            if(resp.isConfirmed){
              setDlgVeedor(true)
            }
          })
        }
      })
    }else{
      setDlgVeedor(false)
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Le falto ingresar datos'
      }).then((resp)=>{
        if(resp.isConfirmed){
          setDlgVeedor(true)
        }
      })
    }

  }

  //Metodo para cargar el dlg de recintos
  const ZonasRecintos =(e)=>{
    let dato=[e]
    setRecintos(dato[0].recintos)
    setDlgViewRecintos(true)
  }

  //Eliminar un Usuarios
  const EliminarUsuario=(e)=>{
    let dato=[e]
    Swal.fire({
      title: '¡Confirmación!',
      icon: 'question',
      text: '¿Está seguró de eliminar este usuario?',
      showConfirmButton: true,
      showCancelButton: true
    }).then((result)=>{
      if(result.isConfirmed){
        axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/delete',{
          cedula: dato[0].cedula
        }).then((result)=>{
          consulta2()
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          })
        })
      }
    })
  }

  //Metodo par ver los recintos asignados
  const Acciones = (rowData) => {
    return (
      <div>
        <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2"  onClick={() => ZonasRecintos(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"  onClick={() => EliminarUsuario(rowData)} />
      </div>
    )
  }

  const CDlgViewRecintos=(()=>{
    setDlgViewRecintos(false)
    setRecintos([])
  })

  const SelectZona=(()=>{
    if(SlcZona !== ''){
      const filtro= DrpZona.filter((e)=>e.nombre_zona === SlcZona)

      let array=[]

      for(let i=1; i<=filtro[0].recintos[0].juntas_fem; i++){
        array.push({
          nombre_zona: SlcZona,
          nombre_recinto: filtro[0].recintos[0].nombre_recinto,
          direccion: filtro[0].recintos[0].direccion,
          cod_recinto: filtro[0].recintos[0].codigo_recinto,
          num_junta: i+'F',
          ejecutado: 0
        })
      }

      for(let i=1; i<=filtro[0].recintos[0].juntas_mas; i++){
        array.push({
          nombre_zona: SlcZona,
          nombre_recinto: filtro[0].recintos[0].nombre_recinto,
          direccion: filtro[0].recintos[0].direccion,
          cod_recinto: filtro[0].recintos[0].codigo_recinto,
          num_junta: i+'M',
          ejecutado: 0
        })
      }

      array.sort((a, b) => a.nombre_recinto.localeCompare(b.nombre_recinto));

      setDrpJuntas(array)

    }
  })

  return (
    <Sidebar>
      <DataTable header={HeaderUsuarios} value={UsuariosRegistrados} paginator 
        stripedRows rows={10}>
        <Column field='rol' header='Rol' />
        <Column field='cedula' header='Cédula' />
        <Column field='nombre' header='Nombre' />
        <Column field='celular' header='Celular' />
        <Column field='correo' header='Correo' />
        <Column field='canton' header='Cantón' />
        <Column field='parroquia' header='Parroquia' />
        <Column body={Acciones} align='center' exportable={false} style={{minWidth: '8rem' }} />
      </DataTable>
      {/* Dialogo para elegir el tipo de usuario a ingresar */}
      <Dialog visible={DlgSlcUser} header='Tipo de Usuario a registrar' onHide={CDlgSlcUser} style={{width:'30%'}} >
        <div className={styles.registros}>
          <Dropdown options={arrayUser} optionLabel='usuario' optionValue='usuario' value={SlcTUsuario} onChange={(e)=>{setSlcTUsuario(e.target.value)}} placeholder='Tipo de Usuario' onSelect={SelectTUsuario} />
        </div>
      </Dialog>
      {/* Dialogo para registro de usuarios individualmente */}
      <Dialog visible={DlgRegisterI} onHide={CDlgRegister} style={{width:'30%'}} 
      header='Registro de usuarios'>
        <form className={styles.registros}>
          <InputText type='text' placeholder='Cédula' value={InpCedula} onChange={(e)=>{setInpCedula(e.target.value)}} />
          <InputText type='text' placeholder='Nombres' value={InpNombres} onChange={(e)=>{setInpNombres(e.target.value)}} />
          <InputText type='text' placeholder='Apellidos' value={InpApellidos} onChange={(e)=>{setInpApellidos(e.target.value)}} />
          <Dropdown options={DrpCanton} optionLabel='nombre_canton' optionValue='nombre_canton' value={SlcCanton} onChange={(e)=>{setSlcCanton(e.target.value)}} placeholder='Canton' />
          
        </form>
      </Dialog>
      {/* Dialogo para registrar los usuarios Administradores del sistema */}
      <Dialog visible={DlgRegisterAdm} onHide={CDlgRegisterAdm} header='Registrando un Administrador del Sistema' style={{width:'30%'}}>
        <form className={styles.registros} onSubmit={RegistrarAdmin}>
          <InputText type='text' placeholder='Usuario' value={InpUsuario} onChange={(e)=>{setInpUsuario(e.target.value)}} required />
          <InputText type='password' placeholder='Contraseña' value={InpPass} onChange={(e)=>{setInpPass(e.target.value)}} required />
          <Button label='Registrar' />
        </form>
      </Dialog>
      {/* Dialogo para registrar los usuarios Supervisores */}
      <Dialog visible={DlgSupervisor} onHide={CDlgSupervisor} header='Registrando un usuario Supervisor' style={{width:'30%'}} >
        <form className={styles.registros} onSubmit={RegistrarSuperv}>
          <InputText type='text' placeholder='Cédula' value={InpCedula} onChange={(e)=>{setInpCedula(e.target.value)}} required />
          <InputText type='text' placeholder='Nombres' value={InpNombres} onChange={(e)=>{setInpNombres(e.target.value)}} required />
          <InputText type='text' placeholder='Apellidos' value={InpApellidos} onChange={(e)=>{setInpApellidos(e.target.value)}} required />
          <InputText type='text' placeholder='Celular' value={InpCelular} onChange={(e)=>{setInpCelular(e.target.value)}} required />
          <InputText type='email' placeholder='Correo' value={InpCorreo} onChange={(e)=>{setInpCorreo(e.target.value)}} required />
          <Dropdown options={DrpCanton} optionLabel='nombre_canton' optionValue='codigo_canton' value={SlcCanton} onChange={(e)=>{setSlcCanton(e.target.value)}} placeholder='Canton' onSelect={SelectCanton} className={styles.drpdown} />
          <Dropdown options={DrpParroquia} optionLabel='nombre_parroquia' optionValue='codigo_parroquia' value={SlcParroquia} onChange={(e)=>{setSlcParroquia(e.target.value)}} placeholder='Parroquia'  className={styles.drpdown} />
          <Button label='Registrar' />
        </form>
      </Dialog>
      {/* Dialogo para registrar los usuarios coordinadores */}
      <Dialog visible={DlgCoordinador} onHide={CDlgCoordinador} header='Registrando un usuario Coordinador' style={{width:'30%'}} >
        <form className={styles.registros} onSubmit={RegistrarCoord} >
          <InputText type='text' placeholder='Cédula' value={InpCedula} onChange={(e)=>{setInpCedula(e.target.value)}} required />
          <InputText type='text' placeholder='Nombres' value={InpNombres} onChange={(e)=>{setInpNombres(e.target.value)}} required />
          <InputText type='text' placeholder='Apellidos' value={InpApellidos} onChange={(e)=>{setInpApellidos(e.target.value)}} required />
          <InputText type='text' placeholder='Celular' value={InpCelular} onChange={(e)=>{setInpCelular(e.target.value)}} required />
          <InputText type='email' placeholder='Correo' value={InpCorreo} onChange={(e)=>{setInpCorreo(e.target.value)}} required />
          <Dropdown options={DrpCanton} optionLabel='nombre_canton' optionValue='codigo_canton' value={SlcCanton} onChange={(e)=>{setSlcCanton(e.target.value)}} placeholder='Canton' onSelect={SelectCanton} className={styles.drpdown} />
          <Dropdown options={DrpParroquia} optionLabel='nombre_parroquia' optionValue='codigo_parroquia' value={SlcParroquia} onChange={(e)=>{setSlcParroquia(e.target.value)}} placeholder='Parroquia' onSelect={SelectParroquia}  className={styles.drpdown} />
          <Dropdown options={DrpZona} optionLabel='nombre_zona' optionValue='nombre_zona' value={SlcZona} onChange={(e)=>{setSlcZona(e.target.value)}} placeholder='Zona'  className={styles.drpdown} />
          <Button label='Registrar' />
        </form>
      </Dialog>
      {/* Dialogo para mostrar los recintos asignados a cada persona */}
      <Dialog visible={DlgViewRecintos} onHide={CDlgViewRecintos} style={{width: '50%'}} >
        <DataTable value={Recintos} paginator 
          stripedRows rows={5}>
          <Column field='nombre_zona' header='Zona' />
          <Column field='cod_recinto' header='Código Recinto' />
          <Column field='nombre_recinto' header='Recinto' />
          <Column field='direccion' header='Dirección' />
          <Column field='num_junta' header='Junta' />
        </DataTable>
      </Dialog>
      {/* Dialogo para registrar los usuarios veedores */}
      <Dialog visible={DlgVeedor} onHide={CDlgVeedor} header='Registrando un usuario Veedor' style={{width:'30%'}} >
        <form className={styles.registros}  onSubmit={RegistrarVeedor} >
          <InputText type='text' placeholder='Cédula' value={InpCedula} onChange={(e)=>{setInpCedula(e.target.value)}} required />
          <InputText type='text' placeholder='Nombres' value={InpNombres} onChange={(e)=>{setInpNombres(e.target.value)}} required />
          <InputText type='text' placeholder='Apellidos' value={InpApellidos} onChange={(e)=>{setInpApellidos(e.target.value)}} required />
          <InputText type='text' placeholder='Celular' value={InpCelular} onChange={(e)=>{setInpCelular(e.target.value)}} required />
          <InputText type='email' placeholder='Correo' value={InpCorreo} onChange={(e)=>{setInpCorreo(e.target.value)}} required />
          <Dropdown options={DrpCanton} optionLabel='nombre_canton' optionValue='codigo_canton' value={SlcCanton} onChange={(e)=>{setSlcCanton(e.target.value)}} placeholder='Canton' onSelect={SelectCanton} className={styles.drpdown} />
          <Dropdown options={DrpParroquia} optionLabel='nombre_parroquia' optionValue='codigo_parroquia' value={SlcParroquia} onChange={(e)=>{setSlcParroquia(e.target.value)}} placeholder='Parroquia' onSelect={SelectParroquia}  className={styles.drpdown} />
          <Dropdown options={DrpZona} optionLabel='nombre_zona' optionValue='nombre_zona' value={SlcZona} onChange={(e)=>{setSlcZona(e.target.value)}} placeholder='Zona'  className={styles.drpdown} onSelect={SelectZona} />
          <MultiSelect options={DrpJuntas} optionLabel='num_junta' placeholder='Juntas' value={SlcJuntas} onChange={(e)=>{setSlcJuntas(e.value)}} className={styles.drpdown} />
          <Button label='Registrar' />
        </form>
      </Dialog>
    </Sidebar>
  )
}

export default Usuarios
