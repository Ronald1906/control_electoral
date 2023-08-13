import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Validacion = () => {

  const router= useRouter()

  useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/login',{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{
      //Si el rol es el de administrador
      if(result.data.token.data.id_rol === 1){
        router.push('/dashboard')
        //Si el rol es de supervisor
      }else if(result.data.token.data.id_rol === 2){
        router.push('/usuarios')
        //Si el rol es de coordinador
      }else if(result.data.token.data.id_rol === 3){
        router.push('/dashboard')
        //Si el rol es de veedor
      }else if(result.data.token.data.id_rol === 4){
        router.push('/inicio')
      }
    })
  })
}

export default Validacion
