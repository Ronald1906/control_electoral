import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import Navbar from './Navbar'
import axios from 'axios'
import SideMenu from './SideMenu'
import {FaAngleDoubleLeft, FaHome,
   FaUser, FaClipboardList, FaClipboard,
  FaFolderMinus, FaUserClock, FaBook} from "react-icons/fa"
import {RiFeedbackFill} from 'react-icons/ri'

const Sidebar = ({children}) => {
//   const [NombreLog, setNombreLog]= useState('')

  const MenuSAdmin=[
    {id: 1, label:'Inicio', icon: FaHome , link:'/dashboard'},
    {id: 2, label:'Usuarios', icon: FaUser, link:'/usuarios'},
    {id: 3, label:'Recintos', icon: FaClipboardList, link:'/recintos'}
  ]

  /*useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'user/log_in',{
      headers:{
        token_stodgo: localStorage.getItem('token_stodgo')
      }
    }).then((result)=>{
        setNombreLog(result.data.token.data.nombre)        
    })
  },[])*/

  return (
    <div className={styles.contenedorglobal}>
      <div className={styles.newsidebar} >
      <div style={{borderBottom:'1px solid white', padding:'15px', textAlign:'center'}}>
        <h2>CONTROL ELECTORAL</h2>
      </div> 
        <SideMenu valor={{menu:MenuSAdmin}} />
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
