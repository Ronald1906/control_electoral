const express = require('express');
const router = express.Router();
const conexion = require('../Database/database');

//Ruta para agregar los recintos
router.post('/', async(req,res)=>{
    try {
        const datos= req.body.datos
        await conexion.query('DELETE FROM tbl_recintos');

        for (let i = 0; i < datos.length; i++) {
            const { codigo_canton, nombre_canton, parroquias } = datos[i];
          
            const query = 'INSERT INTO tbl_recintos (codigo_canton, nombre_canton, parroquias) VALUES ($1, $2, $3)';
            const values = [codigo_canton, nombre_canton, parroquias];
          
            try {
              await conexion.query(query, values);

            } catch (error) {
              console.error('Error al insertar en la base de datos:', error);
            }
        }

        res.send({
            title: '¡Registro Éxitoso!',
            icon: 'success',
            text: 'Se registraron los datos correctamente'
        })


    } catch (error) {
        console.log('Error en RecintoController en el metodo post /: '+ error)
    }
})

//Ruta para visualizar los datos
router.get('/', async(req, res) => {
    try {
        const consulta= await conexion.query('SELECT * FROM tbl_recintos')
        let array1=[]
        //Recorriendo los cantones
        for(let i=0; i<consulta.rowCount; i++){
            //Recorriendo las parroquias
            for(let j=0; j<consulta.rows[i].parroquias.length; j++){
                for(let k=0; k<consulta.rows[i].parroquias[j].zonas.length; k++){
                    for(let l=0; l<consulta.rows[i].parroquias[j].zonas[k].recintos.length; l++){
                        array1.push({
                            codigo_canton: consulta.rows[i].codigo_canton,
                            nombre_canton: consulta.rows[i].nombre_canton,
                            codigo_parroquia: consulta.rows[i].parroquias[j].codigo_parroquia,
                            nombre_parroquia: consulta.rows[i].parroquias[j].nombre_parroquia,
                            nombre_zona: consulta.rows[i].parroquias[j].zonas[k].nombre_zona,
                            codigo_recinto: consulta.rows[i].parroquias[j].zonas[k].recintos[l].codigo_recinto,
                            nombre_recinto: consulta.rows[i].parroquias[j].zonas[k].recintos[l].nombre_recinto,
                            direccion: consulta.rows[i].parroquias[j].zonas[k].recintos[l].direccion,
                            juntas_fem: consulta.rows[i].parroquias[j].zonas[k].recintos[l].juntas_fem,
                            juntas_mas: consulta.rows[i].parroquias[j].zonas[k].recintos[l].juntas_mas
                        })
                    }
                }
            }
        }

        res.send(array1)
      
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
});
  
//Ruta para visualizar los datos para los dropdown en el frontend
router.get('/recintos',async(req,res)=>{
    try {
        const consulta = await conexion.query('SELECT * FROM tbl_recintos')

        res.send(consulta.rows)
        
    } catch (error) {
        console.log('Error en CandidatoController en el metodo get /candidatos: '+ error)
    }
})
  

  
module.exports = router