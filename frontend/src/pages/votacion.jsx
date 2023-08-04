import axios from 'axios'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputNumber } from 'primereact/inputnumber'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const votacion = () => {

  const [Listas, setListas]= useState([])
  
  const consulta= (()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'candidatos/votacion').then((result)=>{
      setListas(result.data)
    })
  })  
  
  useEffect(()=>{
    consulta()
  },[])



  const votosEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  };

  const HeaderTable=(()=>{
    return(
      <div>
        <Button label='Registrar Votos' onClick={Registrar} />
      </div>
    )
  })

  const Registrar=(()=>{
    let vacias=0
    for(let i=0; i<Listas.length; i++){
      if(Listas[i].total==='' || Listas[i].total === null){
        vacias+=1
      }
    }

    if(vacias>0){
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Existen listas vacias, ingrese todo los datos'
      })
    }else{

      // Calcula la sumatoria de los valores de los objetos a partir de la posición 1
      const sumatoria = Listas.slice(1).reduce((acumulador, objeto) => {
        const valor = objeto.total; // Obtiene el valor numérico del objeto
        return acumulador + valor;
      }, 0);

      let total= Listas[0].total

      if(sumatoria === total){
        Swal.fire({
          title: '¡Registro Éxitoso!',
          icon: 'success',
        })
      }else{
        Swal.fire({
          title:'¡Advertencia!',
          icon: 'warning',
          text: 'El valor ingresado como total de votos es: '+total+ ' y el valor de la sumatoria de los votos es: '+ sumatoria
        })
      }

    }

  })

  const onRowEditComplete = (e) => {
    let _products = [...Listas];
    let { newData, index } = e;

    _products[index] = newData;

    setListas(_products);
  };

  return (
    <div>
      <DataTable value={Listas} editMode="row" onRowEditComplete={onRowEditComplete}
      header={HeaderTable}>
        <Column field='nombre' header='Listas' />
        <Column field='total' header='Votos' editor={(options) => votosEditor(options)} />
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
      </DataTable>
    </div>
  )
}

export default votacion