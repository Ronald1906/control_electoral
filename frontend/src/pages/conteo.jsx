import BarListas from '@/components/BarListas'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'

const Conteo = () => {
  const [Listas, setListas]= useState([])

  useEffect(()=>{
    const consulta=(()=>{

      axios.get(process.env.NEXT_PUBLIC_BACKEND+'registros/totalesp').then((result)=>{
        const datos=result.data
        const ordenado= datos.sort((a,b)=>b.total - a.total)
        setListas(ordenado)
      })
    })

    consulta()

    // Configurar el intervalo para obtener los datos cada 5 minutos
    const interval = setInterval(consulta, 5* 60 * 1000);

    // Limpieza del intervalo cuando se desmonte el componente
    return () => clearInterval(interval);

  },[])

  return (
    <div className={styles.pageconteo}>
      <div style={{margin:'20px'}}>
        <h2 style={{color:'navy'}}>TOTAL DE VOTOS</h2>
        <BarListas data={Listas} />
      </div>
    </div>
  )
}

export default Conteo
