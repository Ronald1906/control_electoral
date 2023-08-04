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

const Usuarios = () => {

  const [DlgRegisterI, setDlgRegisterI]= useState(false)
  const [DlgSlcUser, setDlgSlcUser]= useState(false)
  const [DlgRegisterAdm, setDlgRegisterAdm]= useState(false)
  const [InpCedula, setInpCedula]= useState('')
  const [InpNombres, setInpNombres]= useState('')
  const [InpApellidos, setInpApellidos]= useState('')
  const [DrpCanton, setDrpCanton]= useState([])
  const [SlcCanton, setSlcCanton]= useState('')
  const [SlcTUsuario, setSlcTUsuario]= useState('')
  const [InpUsuario, setInpUsuario]= useState('')
  const [InpPass, setInpPass]= useState('')
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
      console.log(result.data)
    })
  })


  const consulta2=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios').then((result)=>{
      setUsuariosRegistrados(result.data)
    })
  })


  useEffect(()=>{
    consulta1()
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

  const SelectTUsuario=(()=>{
    if(SlcTUsuario !== ''){
      setDlgSlcUser(false)
      if(SlcTUsuario == 'Administrador del Sistema'){
        setDlgRegisterAdm(true)
      }
    }
  })

  const CDlgRegisterAdm=(()=>{
    setInpUsuario('')
    setInpPass('')
    setDlgRegisterAdm(false)
    setSlcTUsuario('')
    setDlgSlcUser(true)
  })

  const RegistrarAdmin=(e)=>{
    e.preventDefault()
    axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/add_admin',{
      user: InpUsuario,
      pass: InpPass
    }).then(()=>{

    })
  }

  return (
    <Sidebar>
      <DataTable header={HeaderUsuarios} value={UsuariosRegistrados}>
        <Column field='' header='Tipo' />
        <Column field='' header='Nombre' />
        <Column field='' header='Apellido' />
        <Column field='' header='Sectores' />
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
          <InputText type='text' placeholder='Usuario' value={InpUsuario} onChange={(e)=>{setInpUsuario(e.target.value)}}  />
          <InputText type='password' placeholder='Contraseña' value={InpPass} onChange={(e)=>{setInpPass(e.target.value)}}  />
          <Button label='Registrar' />
        </form>
      </Dialog>
    </Sidebar>
  )
}

export default Usuarios
