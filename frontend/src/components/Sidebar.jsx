import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import Navbar from './Navbar'
import axios from 'axios'
import SideMenu from './SideMenu'
import {FaUser, FaClipboardList, FaHome, FaThList} from 'react-icons/fa'

const Sidebar = ({children}) => {
  const [NombreLog, setNombreLog]= useState('')
  const [MenuArray, setMenuArray]= useState([])

  useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/login',{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{
      //Si el rol es el de administrador
      if(result.data.token.data.id_rol === 1){
        setMenuArray([
          {id: 1, label:'Dashboard', icon: FaHome, link:'/dashboard'},
          {id: 2, label:'Usuarios', icon: FaUser, link:'/usuarios'},
          {id: 3, label:'Recintos', icon: FaClipboardList, link:'/recintos'},
          {id: 4, label:'Candidatos', icon: FaThList, link:'/candidatos'},
        ])
        //Si el rol es de supervisor
      }else if(result.data.token.data.id_rol === 2){
        setMenuArray([
          {id: 1, label:'Coordinadores', icon: FaHome, link:'/coordinador'},
          {id: 2, label:'Veedores', icon: FaUser, link:'/veedor'},
          {id: 3, label:'Recintos', icon: FaClipboardList, link:'/recintos'},
        ])
        //Si el rol es de coordinador
      }else if(result.data.token.data.id_rol === 3){
        setMenuArray([
          {id: 1, label:'Veedores', icon: FaUser, link:'/veedor'},
          {id: 2, label:'Recintos', icon: FaClipboardList, link:'/recintos'},
        ])
        //Si el rol es de veedor
      }else if(result.data.token.data.id_rol === 4){
        
      }
    })
  },[])  

  return (
    <div className={styles.contenedorglobal}>
      <div className={styles.newsidebar} >
      <div style={{borderBottom:'1px solid white', padding:'15px', textAlign:'center'}}>
        <h2>CONTROL ELECTORAL</h2>
      </div> 
        <SideMenu valor={{menu:MenuArray}} />
      </div>
      <div className={styles.contenedorsecun}>
        <Navbar/>
        <div className={styles.contenedorpages} >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
