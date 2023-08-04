const express = require('express');
const router = express.Router();
const conexion = require('../Database/database');

//Ruta para agregar los candidatos
router.post('/', async(req,res)=>{
    try {
        const datos= req.body.datos
        await conexion.query('DELETE FROM tbl_listas');

        for(let i=0;i<datos.length; i++){
            const { nombre_lista, num_lista ,candidatos } = datos[i];

            const query = 'INSERT INTO tbl_listas (nombre_lista, num_lista, candidatos) VALUES ($1, $2, $3)';
            const values = [nombre_lista, num_lista, candidatos];

            try{
                await conexion.query(query, values);
  
            }catch (error) {
                console.error('Error al insertar en la base de datos:', error);
            }
        }

        res.send({
            title: '¡Registro Éxitoso!',
            icon: 'success',
            text: 'Se registraron los datos correctamente'
        })

        
    } catch (error) {
        console.log('Error en CandidatoController en el metodo post: /: '+ error)
    }
})

//Ruta para visualizar los candidatos
router.get('/', async(req,res)=>{
    try {
        const consulta= await conexion.query('SELECT * FROM tbl_listas')

        let array=[]

        for(let i=0; i<consulta.rowCount; i++){
            array.push({
                nombre_lista: consulta.rows[i].nombre_lista,
                num_lista: consulta.rows[i].num_lista,
                candidato_1: consulta.rows[i].candidatos[0].candidato,
                candidato_2: consulta.rows[i].candidatos[1].candidato,
                candidato_3: consulta.rows[i].candidatos[2].candidato,
                candidato_4: consulta.rows[i].candidatos[3].candidato,
            })
        }

        res.send(array)

    } catch (error) {
        console.log('Error en CandidatoController en el metodo get: /: '+ error)
    }
})

//Ruta para visualizar los candidatos y demas datos a sumar en las elecciones
router.get('/votacion', async(req,res)=>{
    try {
        const consulta= await conexion.query('SELECT * FROM tbl_listas')
        const array=[]
        array.push(
            {nombre: 'TOTAL VOTOS', total:''},
            {nombre:'VOTOS EN BLANCO', total:''},
            {nombre: 'VOTOS NULOS', total:''}
        )

        for(let i=0; i<consulta.rowCount; i++){
            array.push(
                {nombre: consulta.rows[i].nombre_lista, total:''}
            )
        }

        res.send(array)

    } catch (error) {
        console.log('Error en CandidatoController en el metodo post /votacion: '+ error)
    }
})


module.exports = router