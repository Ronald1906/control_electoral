const express = require('express');
const router = express.Router();
const conexion = require('../Database/database');
const verifyTokenMiddleware= require('../index')

//Registrar los datos de las mesas
router.post('/', async(req,res)=>{
    try {
        const datos= req.body

    } catch (error) {
        console.log('Error en RegistrosController en el metodo post /: '+ error)
    }
})

//prueba
router.get('/prueba', async(req,res)=>{
    try {
        await conexion.query('DELETE FROM tbl_resultados');
        const datos= await conexion.query('SELECT * FROM tbl_listas')

        for(let i=0; i<datos.rowCount; i++){

            const query= 'INSERT INTO tbl_resultados (nombre_lista, num_lista, total) VALUES ($1, $2, $3)'
            
            function getRandomNumber() {
                // Generar un número aleatorio entre 1 y 500
                const randomNumber = Math.floor(Math.random() * 500) + 1;
                return randomNumber;
            }
              
              // Llamar a la función para obtener un número aleatorio del 1 al 500
            const randomNum = getRandomNumber();
            
            const values= [datos.rows[i].nombre_lista, datos.rows[i].num_lista  ,randomNum]

            try{
                await conexion.query(query, values);
  
            }catch (error) {
                console.error('Error al insertar en la base de datos:', error);
            }

        }

        const consulta= await conexion.query('SELECT * FROM tbl_resultados')

        res.send(consulta.rows)
        

    } catch (error) {
        console.log('Error en RegistrosController en el metodo get /: '+ error)
    }
})


router.get('/', async(req,res)=>{
    try {
        res.send((await conexion.query('SELECT * FROM tbl_resultados')).rows)
    } catch (error) {
        console.log('Error en RegistrosController en el metodo get /: '+ error)
    }
})

router.get('/totales', verifyTokenMiddleware, async(req,res)=>{
    try {
        const consulta= await conexion.query('SELECT * FROM tbl_listas')
        const array=[]

        for(let i=0; i<consulta.rowCount; i++){
            array.push(
                {nombre: consulta.rows[i].nombre_lista, total:0, num_lista: consulta.rows[i].num_lista}
            )
        }

        const consulta2= await conexion.query("SELECT * FROM tbl_votos")

        const resultado={}

        for(let i=0; i<consulta2.rowCount; i++){
            for (const item of array.concat(consulta2.rows[i].votos)) {
                if (!resultado[item.nombre] && item.num_lista !== undefined) {
                    resultado[item.nombre] = {
                        total: 0,
                        nombre: item.nombre,
                        num_lista: item.num_lista
                    };
                }
                if (resultado[item.nombre]) {
                    resultado[item.nombre].total += item.total;
                }
            }
        }

        const resultadoFinal = Object.values(resultado);

        res.send(resultadoFinal)

    } catch (error) {
        console.log('Error en totales: '+ error)
    }
})

router.get('/totalesp', async(req,res)=>{
    try {
        const consulta= await conexion.query('SELECT * FROM tbl_listas')
        const array=[]

        for(let i=0; i<consulta.rowCount; i++){
            array.push(
                {nombre: consulta.rows[i].nombre_lista, total:0, num_lista: consulta.rows[i].num_lista}
            )
        }

        const consulta2= await conexion.query("SELECT * FROM tbl_votos")

        const resultado={}

        for(let i=0; i<consulta2.rowCount; i++){
            for (const item of array.concat(consulta2.rows[i].votos)) {
                if (!resultado[item.nombre] && item.num_lista !== undefined) {
                    resultado[item.nombre] = {
                        total: 0,
                        nombre: item.nombre,
                        num_lista: item.num_lista
                    };
                }
                if (resultado[item.nombre]) {
                    resultado[item.nombre].total += item.total;
                }
            }
        }

        const resultadoFinal = Object.values(resultado);

        res.send(resultadoFinal)

    } catch (error) {
        console.log('Error en totales: '+ error)
    }
})


module.exports = router