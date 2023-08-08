import Sidebar from '@/components/Sidebar'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import BarListas from '@/components/BarListas';


const Dashboard = () => {

  const [Listas, setListas] = useState([]);

  useEffect(()=>{
    const consulta=(()=>{
      /*axios.get(process.env.NEXT_PUBLIC_BACKEND+'registros').then((result)=>{
        const datos=result.data
        const ordenado= datos.sort((a,b)=>b.total - a.total)
        setListas(ordenado)
      })*/
    })

    consulta()

    // Configurar el intervalo para obtener los datos cada 5 minutos
    const interval = setInterval(consulta, 5 * 60 * 1000);

    // Limpieza del intervalo cuando se desmonte el componente
    return () => clearInterval(interval);

  },[])

  return (
    <Sidebar>
      <h2>Dashboard</h2>
      <div>
        <h2 style={{color:'navy'}}>TOTAL DE VOTOS</h2>
        <BarListas data={Listas} />
      </div>
      <h2 style={{color:'navy'}}>Candidatos</h2>

    </Sidebar>
  )
}

export default Dashboard
