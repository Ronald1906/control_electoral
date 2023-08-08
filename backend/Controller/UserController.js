const express = require('express');
const router = express.Router();
const conexion = require('../Database/database');
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const verifyTokenMiddleware= require('../index')


//Ruta para obtener los usuarios
router.get('/', async(req,res)=>{
    try {
        const consulta= await conexion.query('SELECT * FROM tbl_users')

        //Excluimos los usuarios administradores
        const filtro= consulta.rows.filter((e)=>e.id_rol != 1)

        //array a mostrar
        let array=[]

        for(let i=0; i<filtro.length; i++){
            
            const consulta2= await conexion.query("SELECT * FROM tbl_personas WHERE cedula = '"+ filtro[i].id_persona+"'")
            
            const consulta3= await conexion.query("SELECT * FROM tbl_recintos WHERE codigo_canton = '"+ filtro[i].cod_canton+"'")

            const consulta4= await conexion.query("SELECT * FROM tbl_rol WHERE _id = '" + filtro[i].id_rol+"'")

            const filtro2= consulta3.rows[0].parroquias.filter((e)=>e.codigo_parroquia == filtro[i].cod_parroquia)

            array.push({
                cedula: consulta2.rows[0].cedula,
                nombre: consulta2.rows[0].nombres + ' '+ consulta2.rows[0].apellidos,
                celular: consulta2.rows[0].celular,
                correo: consulta2.rows[0].correo,
                canton: consulta3.rows[0].nombre_canton,
                parroquia: filtro2[0].nombre_parroquia,
                recintos: filtro[i].recintos,
                rol: consulta4.rows[0].nombre_rol
            })

        }

        res.send(array)

    } catch (error) {
        console.log('Error en UserController en el metodo get /: '+error)
    }
})


//Ruta para Agregar Usuarios Administradores
router.post('/add_admin', async(req,res)=>{
    try {
        const datos= req.body

        const consulta1= await conexion.query("SELECT * FROM tbl_rol WHERE nombre_rol = 'SuperAdm' ")

        
        const query= 'INSERT INTO tbl_users (users, passw, id_rol) VALUES ($1, $2, $3)'

        const pass= await bcryptjs.hash(datos.pass,8)

        const values= [datos.user, pass  ,consulta1.rows[0]._id]

        try{
            await conexion.query(query, values);

            res.send({
                title:'¡Registro Éxitoso!',
                icon: 'success',
                text: 'Usuario Administrador creado con éxito'
            })

        }catch (error) {
            res.send({
                title:'¡Error!',
                icon: 'error',
                text:'Ocurrio un error de: '+ error+' comuniquese con el desarrollador'
            })
        }

    } catch (error) {
        console.log('Error en UserController en el metodo post /add_admin')
    }
})

//Ruta para agregar usuarios supervisores
router.post('/add_superv', async(req,res)=>{
    try {
        const datos= req.body

        //Iniciamos ingresando la persona en la tabla persona
        const query= "INSERT INTO tbl_personas (cedula, nombres, apellidos, celular, correo) VALUES ($1, $2, $3, $4, $5)"
        const values= [datos.cedula, datos.nombres, datos.apellidos, datos.celular, datos.correo]

        try {
            //Se procede a registrar a la persona
            await conexion.query(query,values)

            //Se consulta los recintos
            const consulta= await conexion.query('SELECT * FROM tbl_recintos')

            const filtro= consulta.rows.filter((e)=>e.codigo_canton == datos.cod_canton)
            
            const filtro2= filtro[0].parroquias.filter((e)=>e.codigo_parroquia == datos.cod_parroquia)

            let array_recintos=[]

            //Se recorre los recintos para inicializar en 0 y mostrar todas las juntas masculinas como femeninas
            for(let i=0; i<filtro2[0].zonas.length; i++){
                for(let j=1; j<=filtro2[0].zonas[i].recintos[0].juntas_fem; j++){
                    array_recintos.push({
                        nombre_zona: filtro2[0].zonas[i].nombre_zona,
                        nombre_recinto: filtro2[0].zonas[i].recintos[0].nombre_recinto,
                        direccion: filtro2[0].zonas[i].recintos[0].direccion,
                        cod_recinto: filtro2[0].zonas[i].recintos[0].codigo_recinto,
                        num_junta: j+'F',
                        ejecutado: 0
                    })
                }
                for(let j=1; j<=filtro2[0].zonas[i].recintos[0].juntas_mas; j++){
                    array_recintos.push({
                        nombre_zona: filtro2[0].zonas[i].nombre_zona,
                        nombre_recinto: filtro2[0].zonas[i].recintos[0].nombre_recinto,
                        direccion: filtro2[0].zonas[i].recintos[0].direccion,
                        cod_recinto: filtro2[0].zonas[i].recintos[0].codigo_recinto,
                        num_junta: j+'M',
                        ejecutado: 0
                    })
                }
            }

            //Se ordena el array de recintos por el nombre del recinto
            array_recintos.sort((a, b) => a.nombre_recinto.localeCompare(b.nombre_recinto));

            //Se encripta la contraseña
            const pass = await bcryptjs.hash(datos.cedula,8)
            

            //Se procede a realizar el ingreso del usuario
            const query2= "INSERT INTO tbl_users (users, passw, id_rol, id_persona, cod_canton, cod_parroquia, recintos) VALUES ($1, $2, $3, $4, $5, $6, $7)"
            const values2= [datos.cedula, pass, 2, datos.cedula, datos.cod_canton, datos.cod_parroquia, array_recintos]

            try {
                await conexion.query(query2, values2).then((resp)=>{
                    if(resp.rowCount>0){
                        res.send({
                            title: '¡Usuario Registrado!',
                            icon: 'success',
                            text: 'Se registro correctamente el usuario'
                        })
                    }
                })

            } catch (error) {
                res.send({
                    title: '¡Error!',
                    icon: 'warning',
                    text: 'Exite el siguente error al crear el usuario: '+ error
                })
            }
            
            
        } catch (error) {
            res.send({
                title: '¡Error!',
                icon: 'warning',
                text: 'El usuario que esta intentando ingresar ya existe: '
            })
        }

    } catch (error) {
        console.log('Error en UserController en el metodo post /add_superv: '+error)
    }
})

//Ruta para agregar usuarios coordinador
router.post('/add_coord', async(req,res)=>{
    try {
        const datos= req.body

        //Iniciamos ingresando la persona en la tabla persona
        const query= "INSERT INTO tbl_personas (cedula, nombres, apellidos, celular, correo) VALUES ($1, $2, $3, $4, $5)"
        const values= [datos.cedula, datos.nombres, datos.apellidos, datos.celular, datos.correo]
        
        try {

            //Se procede a registrar a la persona
            await conexion.query(query,values)

            //Se consulta los recintos
            const consulta= await conexion.query('SELECT * FROM tbl_recintos')
            
            const filtro= consulta.rows.filter((e)=>e.codigo_canton == datos.cod_canton)
                        
            const filtro2= filtro[0].parroquias.filter((e)=>e.codigo_parroquia == datos.cod_parroquia)

            const filtro3= filtro2[0].zonas.filter((e)=>e.nombre_zona == datos.nombre_zona)

            let array_recintos=[]

            for(let i=1; i<filtro3[0].recintos[0].juntas_fem; i++){
                array_recintos.push({
                    nombre_zona: datos.nombre_zona,
                    nombre_recinto: filtro3[0].recintos[0].nombre_recinto,
                    direccion: filtro3[0].recintos[0].direccion,
                    cod_recinto: filtro3[0].recintos[0].codigo_recinto,
                    num_junta: i+'F',
                    ejecutado: 0
                })
            }

            for(let i=1; i<filtro3[0].recintos[0].juntas_mas; i++){
                array_recintos.push({
                    nombre_zona: datos.nombre_zona,
                    nombre_recinto: filtro3[0].recintos[0].nombre_recinto,
                    direccion: filtro3[0].recintos[0].direccion,
                    cod_recinto: filtro3[0].recintos[0].codigo_recinto,
                    num_junta: i+'M',
                    ejecutado: 0
                })
            }

            //Se ordena el array de recintos por el nombre del recinto
            array_recintos.sort((a, b) => a.nombre_recinto.localeCompare(b.nombre_recinto));

            //Se encripta la contraseña
            const pass = await bcryptjs.hash(datos.cedula,8)

            //Se procede a realizar el ingreso del usuario
            const query2= "INSERT INTO tbl_users (users, passw, id_rol, id_persona, cod_canton, cod_parroquia, recintos) VALUES ($1, $2, $3, $4, $5, $6, $7)"
            const values2= [datos.cedula, pass, 3, datos.cedula, datos.cod_canton, datos.cod_parroquia, array_recintos]

            try {
                await conexion.query(query2, values2).then((resp)=>{
                    if(resp.rowCount>0){
                        res.send({
                            title: '¡Usuario Registrado!',
                            icon: 'success',
                            text: 'Se registro correctamente el usuario'
                        })
                    }
                })

            } catch (error) {
                res.send({
                    title: '¡Error!',
                    icon: 'warning',
                    text: 'Exite el siguente error al crear el usuario: '+ error
                })   
            }
            
            
        } catch (error) {
            res.send({
                title: '¡Error!',
                icon: 'warning',
                text: 'El usuario que esta intentando ingresar ya existe: '
            })
        }

    } catch (error) {
        console.log('Error UserController en el metodo post /add_coord: '+error)
    }
})

//Ruta para agregar usuarios veedor
router.post('/add_veedor', async(req,res)=>{
    try {
        const datos= req.body

        //Iniciamos ingresando la persona en la tabla persona
        const query= "INSERT INTO tbl_personas (cedula, nombres, apellidos, celular, correo) VALUES ($1, $2, $3, $4, $5)"
        const values= [datos.cedula, datos.nombres, datos.apellidos, datos.celular, datos.correo]

        try {
            //Se procede a registrar a la persona
            await conexion.query(query,values)
            
            //Se encripta la contraseña
            const pass = await bcryptjs.hash(datos.cedula,8)

            //Se procede a realizar el ingreso del usuario
            const query2= "INSERT INTO tbl_users (users, passw, id_rol, id_persona, cod_canton, cod_parroquia, recintos) VALUES ($1, $2, $3, $4, $5, $6, $7)"
            const values2= [datos.cedula, pass, 4, datos.cedula, datos.cod_canton, datos.cod_parroquia, datos.recintos]

            try {
                await conexion.query(query2, values2).then((resp)=>{
                    if(resp.rowCount>0){
                        res.send({
                            title: '¡Usuario Registrado!',
                            icon: 'success',
                            text: 'Se registro correctamente el usuario'
                        })
                    }
                })

            } catch (error) {
                res.send({
                    title: '¡Error!',
                    icon: 'warning',
                    text: 'Exite el siguente error al crear el usuario: '+ error
                })   
            }

        } catch (error) {
            res.send({
                title: '¡Error!',
                icon: 'warning',
                text: 'El usuario que esta intentando ingresar ya existe '
            })
        }
        
    } catch (error) {
        console.log('Error en UserController en el metodo post /add_veedor: '+error )
    }
})

router.post('/delete', async(req,res)=>{
    try {
        const datos= req.body

        //Eliminamos el Usuario que tiene como id_usuario la cedula
        await conexion.query("DELETE FROM tbl_users WHERE id_persona = '"+ datos.cedula+"'")
        await conexion.query("DELETE FROM tbl_personas WHERE cedula = '"+ datos.cedula+"'")

        res.send({
            title: '¡Usuario Eliminado!',
            icon: 'success',
            text: 'Se elimino el usuario correctamente'
        })


    } catch (error) {
        console.log('Error en UserController en el metodo post /delete: '+ error)
    }
})

//Rutra para iniciar sesion
router.post('/login', async(req,res)=>{
    try {
        const datos= req.body

        const consulta= await conexion.query("SELECT * FROM tbl_users WHERE users = '"+ datos.user+"'")

        if(consulta.rowCount >0){
            const validar_pass= await bcryptjs.compare(datos.pass, consulta.rows[0].passw)
            
            if(validar_pass == true && datos.user == consulta.rows[0].users){
            
                const expiracion = Math.floor(Date.now() / 1000) + (60 * 60 * 12); // 12 horas de expiración

                let objeto={
                    users: consulta.rows[0].users,
                    id_rol: consulta.rows[0].id_rol,
                }

                const token= jwt.sign({
                    exp: expiracion,
                    data:objeto
                },process.env.CLVSECRET)

                res.send({token: token, auth: true, expiracion: expiracion})


            }else{
                res.send({
                    title: '¡Advertencia!',
                    icon: 'warning',
                    text: 'Usuario y/o contraseña erroneos',
                    auth: false
                })
            }

        }else{
            res.send({
                title: '¡Advertencia!',
                icon: 'warning',
                text: 'El usuario ingresado no existe',
                auth: false
            })
        }


    } catch (error) {
        console.log('Error en UserController en el metodo post /login: '+ error)
    }
})

//Ruta para obtener el usuario logueado
router.get('/login', verifyTokenMiddleware, async(req,res)=>{
    try {
        res.send({token: req.valtoken, auth: true})
    } catch (error) {
        console.log('Error en UserController en el metodo get /login: '+ error)
    }
})

//Ruta para visualizar los datos del usuarios
router.post('/datos', verifyTokenMiddleware, async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('Error en UserController en el metodo get /datos: '+error)
    }
})



module.exports = router