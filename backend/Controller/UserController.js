const express = require('express');
const router = express.Router();
const conexion = require('../Database/database');
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const verifyTokenMiddleware= require('../index')
const multer = require('multer');


// Configuración de multer para manejar la carga de archivos de la instalacion de la mesa
const storage = multer.diskStorage({
    destination: 'public/instalacion/', // Directorio donde se guardarán los archivos
    filename: (req, file, cb) => {            
      cb(null, file.originalname);
    },
});

// Configuración de multer para manejar la carga de archivos de la instalacion de las novedades
const storage2 = multer.diskStorage({
    destination: 'public/novedades/', // Directorio donde se guardarán los archivos
    filename: (req, file, cb) => {            
      cb(null, file.originalname);
    },
});

// Configuración de multer para manejar la carga de archivos del registro de votos
const storage3 = multer.diskStorage({
    destination: 'public/votacion/', // Directorio donde se guardarán los archivos
    filename: (req, file, cb) => {            
      cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const upload2= multer({ storage: storage2})

const upload3= multer({ storage: storage3})

//Ruta para obtener los usuarios
router.get('/', async(req,res)=>{
    try {
        const consulta= await conexion.query('SELECT * FROM tbl_users')

        //Excluimos los usuarios administradores
        const filtro= consulta.rows.filter((e)=>e.id_rol != 1)

        //array de personas
        let array=[]

        //Recorremos el filtro
        for(let i=0; i<filtro.length; i++){
            const consulta2= await conexion.query("SELECT * FROM tbl_personas WHERE cedula = '"+filtro[i].id_persona+"'")
            const consulta4= await conexion.query("SELECT * from tbl_rol WHERE _id = '"+ filtro[i].id_rol+"'")
            //Consultamos el canton
            const consulta3= await conexion.query("SELECT * FROM tbl_recintos WHERE codigo_canton = '"+filtro[i].cod_canton+"'")

            if(filtro[i].id_rol == 2){
                array.push({
                    cedula: consulta2.rows[0].cedula,
                    nombre: consulta2.rows[0].nombres+' '+ consulta2.rows[0].apellidos,
                    celular: consulta2.rows[0].celular,
                    rol: consulta4.rows[0].nombre_rol,
                    recintos: filtro[i].recintos,
                    id_rol: filtro[i].id_rol,
                    codigo_canton: filtro[i].cod_canton,
                    canton: consulta3.rows[0].nombre_canton
                })
            }else if(filtro[i].id_rol == 3){
                array.push({
                    cedula: consulta2.rows[0].cedula,
                    nombre: consulta2.rows[0].nombres+' '+ consulta2.rows[0].apellidos,
                    celular: consulta2.rows[0].celular,
                    rol: consulta4.rows[0].nombre_rol,
                    recintos: filtro[i].recintos,
                    id_rol: filtro[i].id_rol,
                    codigo_canton: filtro[i].cod_canton,
                    canton: consulta3.rows[0].nombre_canton
                })
            }else if(filtro[i].id_rol == 4){
                array.push({
                    cedula: consulta2.rows[0].cedula,
                    nombre: consulta2.rows[0].nombres+' '+ consulta2.rows[0].apellidos,
                    celular: consulta2.rows[0].celular,
                    rol: consulta4.rows[0].nombre_rol,
                    recintos: filtro[i].recintos,
                    id_rol: filtro[i].id_rol,
                    codigo_canton: filtro[i].cod_canton,
                    canton: consulta3.rows[0].nombre_canton
                })
            }
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
        const query= "INSERT INTO tbl_personas (cedula, nombres, apellidos, celular) VALUES ($1, $2, $3, $4)"
        const values= [datos.cedula, datos.nombres, datos.apellidos, datos.celular]
        

        try {
            //Se procede a registrar a la persona
            await conexion.query(query,values)

            //Se crea un array para almacenar todos los recintos
            let array=[]
            //Se recorren los datos para obtener la informacion de cada mesa por recinto
            for(let i=0; i<datos.recintos.length; i++){
                let recintos=[]
                for(let j=0; j<datos.recintos[i].zonas.length; j++){
                    for(let k=1; k<= datos.recintos[i].zonas[j].recintos[0].juntas_fem; k++){
                        recintos.push({
                            nombre_zona: datos.recintos[i].zonas[j].nombre_zona,
                            nombre_recinto: datos.recintos[i].zonas[j].recintos[0].nombre_recinto,
                            direccion: datos.recintos[i].zonas[j].recintos[0].direccion,
                            cod_recinto: datos.recintos[i].zonas[j].recintos[0].codigo_recinto,
                            num_junta: k+'F',
                            instalacion: 0,
                            img_instalacion: '',
                            ejecutado: 0,
                            img_ejecucion: '',
                            fecha_instalacion: '',
                            fecha_ejecucion: '',
                            hora_instalacion: '',
                            hora_ejecucion:''
                        })
                    }
    
                    for(let k=1; k<= datos.recintos[i].zonas[j].recintos[0].juntas_mas; k++){
                        recintos.push({
                            nombre_zona: datos.recintos[i].zonas[j].nombre_zona,
                            nombre_recinto: datos.recintos[i].zonas[j].recintos[0].nombre_recinto,
                            direccion: datos.recintos[i].zonas[j].recintos[0].direccion,
                            cod_recinto: datos.recintos[i].zonas[j].recintos[0].codigo_recinto,
                            num_junta: k+'M',
                            instalacion: 0,
                            img_instalacion: '',
                            ejecutado: 0,
                            img_ejecucion: '',
                            fecha_instalacion: '',
                            fecha_ejecucion: '',
                            hora_instalacion: '',
                            hora_ejecucion:''
                        })
                    }
    
                }
    
                array.push({
                    codigo_parroquia: datos.recintos[i].codigo_parroquia,
                    nombre_parroquia: datos.recintos[i].nombre_parroquia,
                    recintos: recintos
                })
            }

            //Se encripta la contraseña
            const pass = await bcryptjs.hash(datos.cedula,8)
            

            //Se procede a realizar el ingreso del usuario
            const query2= "INSERT INTO tbl_users (users, passw, id_rol, id_persona, cod_canton, recintos) VALUES ($1, $2, $3, $4, $5, $6)"
            const values2= [datos.cedula, pass, 2, datos.cedula, datos.cod_canton, array]

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
        const query= "INSERT INTO tbl_personas (cedula, nombres, apellidos, celular ) VALUES ($1, $2, $3, $4)"
        const values= [datos.cedula, datos.nombres, datos.apellidos, datos.celular]
        
        try {

            //Se procede a registrar a la persona
            await conexion.query(query,values)

            //Se consulta los recintos
            const consulta= await conexion.query("SELECT * FROM tbl_recintos WHERE codigo_canton = '"+ datos.cod_canton +"'")

            let filtro= consulta.rows[0].parroquias.filter((e)=>e.codigo_parroquia == datos.cod_parroquia)

            let array=[]
            
            for(let i=0; i<filtro[0].zonas.length; i++){
                let filtro2= filtro[0].zonas[i].recintos.filter((e)=>e.codigo_recinto == datos.cod_recinto)
                if(filtro2.length>0){
                    for(let j=0; j<filtro2.length; j++){
                        for(let k=1; k<=filtro2[j].juntas_fem; k++){
                            array.push({
                                nombre_zona: filtro[0].zonas[i].nombre_zona,
                                nombre_recinto: filtro2[j].nombre_recinto,
                                direccion: filtro2[j].direccion,
                                cod_recinto: filtro2[j].codigo_recinto,
                                num_junta: k+'F',
                                ejecutado: 0,
                                img_ejecucion: '',
                                img_instalacion: '',
                                instalacion: 0,
                                fecha_instalacion: '',
                                fecha_ejecucion: '',
                                hora_instalacion: '',
                                hora_ejecucion:''
                            })
                        }
                        for(let k=1; k<=filtro2[j].juntas_mas; k++){
                            array.push({
                                nombre_zona: filtro[0].zonas[i].nombre_zona,
                                nombre_recinto: filtro2[j].nombre_recinto,
                                direccion: filtro2[j].direccion,
                                cod_recinto: filtro2[j].codigo_recinto,
                                num_junta: k+'M',
                                ejecutado: 0,
                                img_ejecucion: '',
                                img_instalacion: '',
                                instalacion: 0,
                                fecha_instalacion: '',
                                fecha_ejecucion: '',
                                hora_instalacion: '',
                                hora_ejecucion:''
                            })
                        }
                    }
                }
            }            

            //Se encripta la contraseña
            const pass = await bcryptjs.hash(datos.cedula,8)

            //Se procede a realizar el ingreso del usuario
            const query2= "INSERT INTO tbl_users (users, passw, id_rol, id_persona, cod_canton, recintos) VALUES ($1, $2, $3, $4, $5, $6)"
            const values2= [datos.cedula, pass, 3, datos.cedula, datos.cod_canton, array]

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
                text: 'El usuario que esta intentando ingresar ya existe: '+ error
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
        const query= "INSERT INTO tbl_personas (cedula, nombres, apellidos, celular) VALUES ($1, $2, $3, $4)"
        const values= [datos.cedula, datos.nombres, datos.apellidos, datos.celular]

        try {
            //Se procede a registrar a la persona
            await conexion.query(query,values)
            
            //Se encripta la contraseña
            const pass = await bcryptjs.hash(datos.cedula,8)

            //Se procede a conseguuir los recintos asignados

            const consulta= await conexion.query("SELECT * FROM tbl_recintos WHERE codigo_canton = '"+ datos.cod_canton +"'")

            let filtro= consulta.rows[0].parroquias.filter((e)=>e.codigo_parroquia == datos.cod_parroquia)
            
            let array=[]
            for(let i=0; i<filtro.length; i++){
                for(let j=0; j<filtro[i].zonas.length; j++){
                    for(let k=0;k<filtro[i].zonas[j].recintos.length; k++){
                        for(l=1; l<filtro[i].zonas[j].recintos[k].juntas_fem; l++){
                            array.push({
                                nombre_zona: filtro[i].zonas[j].nombre_zona,
                                nombre_recinto: filtro[i].zonas[j].recintos[k].nombre_recinto,
                                direccion: filtro[i].zonas[j].recintos[k].direccion,
                                cod_recinto: filtro[i].zonas[j].recintos[k].codigo_recinto,
                                num_junta: l+'F',
                                ejecutado:0,
                                instalacion: 0,
                                img_ejecucion: '',
                                img_instalacion: '',
                                fecha_instalacion: '',
                                fecha_ejecucion: '',
                                hora_instalacion: '',
                                hora_ejecucion:''
                            })
                        }
                        for(l=1; l<filtro[i].zonas[j].recintos[k].juntas_mas; l++){
                            array.push({
                                nombre_zona: filtro[i].zonas[j].nombre_zona,
                                nombre_recinto: filtro[i].zonas[j].recintos[k].nombre_recinto,
                                direccion: filtro[i].zonas[j].recintos[k].direccion,
                                cod_recinto: filtro[i].zonas[j].recintos[k].codigo_recinto,
                                num_junta: l+'M',
                                ejecutado:0,
                                instalacion: 0,
                                img_ejecucion: '',
                                img_instalacion: '',
                                fecha_instalacion: '',
                                fecha_ejecucion: '',
                                hora_instalacion: '',
                                hora_ejecucion:''
                            })
                        }
                    }
                }
            }
            
            let array_recintos=[]

            for(let i=0; i<datos.recintos.length; i++){
                let filtro_r= array.filter((e)=>e.cod_recinto == datos.recintos[i].cod_recinto && e.num_junta == datos.recintos[i].num_junta)
                if(filtro_r.length >0){
                    array_recintos.push(filtro_r[0])
                }
            }


            //Se procede a realizar el ingreso del usuario
            const query2= "INSERT INTO tbl_users (users, passw, id_rol, id_persona, cod_canton, recintos) VALUES ($1, $2, $3, $4, $5, $6)"
            const values2= [datos.cedula, pass, 4, datos.cedula, datos.cod_canton, array_recintos]

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

//Ruta para eliminar los usuarios
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
router.post('/coordinadores', verifyTokenMiddleware, async(req,res)=>{
    try {
        const data = req.body

        //Se consulta el usuario para obtener el codigo de la parroquia
        const consulta= await conexion.query("SELECT * FROM tbl_users WHERE users= '"+data.user+"'")

        //Se consulta los usuarios coordinadores que tengan como codigo de parroquia el mismo codigo del usuario supervisor
        const consulta2= await conexion.query("SELECT * FROM tbl_users WHERE id_rol = 3 AND cod_parroquia = '"+ consulta.rows[0].cod_parroquia+"'")

        //Creamos un array para almacenar los usuarios
        let array_usuarios=[]

        //Recorremos los datos
        for(let i=0; i<consulta2.rowCount; i++){
            let consulta_user= await conexion.query("SELECT * FROM tbl_personas WHERE cedula = '"+ consulta2.rows[i].id_persona+"'")
            let array_nombre_zona=[]

            for(let j=0; j<consulta2.rows[i].recintos.length; j++){
                array_nombre_zona.filter((e)=>e == consulta2.rows[i].recintos[j].nombre_zona )
                if(array_nombre_zona.length == 0){
                    array_nombre_zona.push(consulta2.rows[i].recintos[j].nombre_zona)
                }
            }

            if(array_nombre_zona.length >0 && array_nombre_zona.length<2){
                array_usuarios.push({
                    cedula: consulta_user.rows[0].cedula,
                    nombre: consulta_user.rows[0].nombres +' '+ consulta_user.rows[0].apellidos,
                    nombre_zona: array_nombre_zona[0]
                })
            }
        }

        res.send(array_usuarios)
        

    } catch (error) {
        console.log('Error en UserController en el metodo get /datos: '+error)
    }
})

//Ruta para visualizar las juntas asignadas
router.post('/juntas', verifyTokenMiddleware, async(req,res)=>{
    try {
        const datos= req.body

        const consulta= await conexion.query("SELECT * FROM tbl_users WHERE users = '"+ datos.user+"'")

        let array=[]

        if(consulta.rows[0].id_rol == 4){
            array= consulta.rows[0].recintos
        }else if(consulta.rows[0].id_rol == 3){
            array= consulta.rows[0].recintos
        }else if(consulta.rows[0].id_rol == 2){
            for(let i=0; i<consulta.rows[0].recintos.length; i++){
                for(let j=0; j<consulta.rows[0].recintos[i].recintos.length; j++){
                    array.push(consulta.rows[0].recintos[i].recintos[j])
                }
            }
        }else if(consulta.rows[0].id_rol == 1){
            for(let i=0; i<consulta.rows[0].recintos.length; i++){
                for(let j=0; j<consulta.rows[0].recintos[i].recintos.length; j++){
                    array.push(consulta.rows[0].recintos[i].recintos[j])
                }
            }
        }

        res.send(array)

    } catch (error) {
        console.log('Error en UserController en el metodo post /juntas: '+ error)
    }
})

//Ruta para almacenar la foto de la instalacion de mesa
router.post('/instalacion_foto', verifyTokenMiddleware,upload.single('file'), async(req,res)=>{
    try {
        res.send({
            title: '¡Registro Exitoso!',
            icon: 'success',
            text: 'Instalacion completada'
        })
        
    } catch (error) {
        console.log('Error en UserController en el metodo post /instalacion_foto: '+ error)
    }
})

//Ruta para ingresar los datos de la instalación 
router.post('/instalacion', verifyTokenMiddleware, async(req,res)=>{
    try {
        const datos= req.body

        const consulta= await conexion.query("SELECT * FROM tbl_users WHERE users!= '"+ datos.usuario+"'")

        let filtro_usuarios= consulta.rows.filter((e)=> e.id_rol != 1 && e.id_rol != 2)

        let array=[]

        for(let i=0; i<filtro_usuarios.length; i++){
            const recintos= filtro_usuarios[i].recintos
            const filtro1= recintos.filter((e)=>e.nombre_zona== datos.junta.nombre_zona && e.nombre_recinto == datos.junta.nombre_recinto && e.num_junta == datos.junta.num_junta)
            if(filtro1.length >0){
                if(filtro1[0].instalacion == 1){
                    if(array.length == 0){
                        array.push(filtro1[0])
                    }
                }
            }
        }
        


        if(array.length>0){
            const consulta2= await conexion.query("SELECT * FROM tbl_users")
            let filtro_user= consulta2.rows.filter((e)=> e.id_rol != 1 && e.id_rol != 2)
            
            for(let i=0; i<filtro_user.length; i++){
                const recintos= filtro_user[i].recintos
                const filtro1= recintos.filter((e)=>e.nombre_zona== datos.junta.nombre_zona && e.nombre_recinto == datos.junta.nombre_recinto && e.num_junta == datos.junta.num_junta)
                
                if(filtro1.length >0){
                    if(filtro1[0].instalacion == 0 ){
                        filtro1[0].hora_instalacion= array[0].hora_instalacion
                        filtro1[0].fecha_instalacion= array[0].fecha_instalacion
                        filtro1[0].img_instalacion= array[0].img_instalacion
                        filtro1[0].instalacion=array[0].instalacion

                        await conexion.query("UPDATE tbl_users SET recintos = $1 WHERE users = $2",
                        [recintos, filtro_user[i].users])
                    }
                }      

            }
            res.send({
                registrado:true,
                actualizado: true,
                title: '¡Junta actualizada!',
                icon: 'info',
                text: 'La junta ya ha sido instalada antes, ya se actualizo su junta en base a la junta instalada de otro usuario'
            })    
        }else{
            const consulta2= await conexion.query("SELECT * FROM tbl_users")
            let filtro_user= consulta2.rows.filter((e)=> e.id_rol != 1 && e.id_rol != 2)
            for(let i=0; i<filtro_user.length; i++){                
                const recintos= filtro_user[i].recintos
                const filtro1= recintos.filter((e)=>e.nombre_zona== datos.junta.nombre_zona && e.nombre_recinto == datos.junta.nombre_recinto && e.num_junta == datos.junta.num_junta)
                if(filtro1.length >0){
                    if(filtro1[0].instalacion == 0 ){
                        filtro1[0].hora_instalacion= datos.hora
                        filtro1[0].fecha_instalacion= datos.fecha
                        filtro1[0].img_instalacion= datos.imagen
                        filtro1[0].instalacion=1
            
                        await conexion.query("UPDATE tbl_users SET recintos = $1 WHERE users = $2",
                        [recintos, filtro_user[i].users])
                    }
                }
            }

            res.send({
                registrado:true,
                actualizado: false
            })   
            
        }
    } catch (error) {
        console.log('Error en UserController en el metodo post /instalacion: '+ error)
    }
})

//Ruta para ingresar las novedades
router.post('/novedades', verifyTokenMiddleware, async(req,res)=>{
    try {
        const datos = req.body
        const consulta= await conexion.query("SELECT * FROM tbl_users WHERE users= '"+ datos.usuario+"'")
        
        const query= "INSERT INTO tbl_novedades (users, cod_canton, img_novedad, fecha_novedad, hora_novedad) VALUES ($1, $2, $3, $4, $5)"
        const values= [datos.usuario, consulta.rows[0].cod_canton, datos.imagen, datos.fecha, datos.hora]
        
        try {
            //Se procede a registrar a la persona
            await conexion.query(query,values)

            res.send({
                registro: true
            })

        } catch (error) {
            res.send({
                title: '¡Error!',
                icon: 'error',
                text: 'Ocurre un error de: '+ error+' comuniquese con el equipo informatico',
                registro: false
            })
        }


    } catch (error) {
        console.log('Error en UserController en el metodo post /novedades: '+ error)
    }
})

//Ruta para ingresar las imagenes de las novedades
router.post('/novedades_foto', verifyTokenMiddleware, upload2.single('file'), async(req,res)=>{
    try {
        res.send({
            title: '¡Registro Exitoso!',
            icon: 'success',
            text: 'Novedad ingresada'
        })
    } catch (error) {
        console.log('Error en UserController en el metodo post /novedades_foto: '+ error)
    }
})

//Ruta para ingresar las votaciones a la tabla temporal
router.post('/temp_votacion', verifyTokenMiddleware, async(req,res)=>{
    try {
        const datos= req.body
        const consulta= await conexion.query("SELECT * FROM tbl_users WHERE users!= '"+ datos.usuario+"'")

        let filtro_usuarios= consulta.rows.filter((e)=> e.id_rol != 1 && e.id_rol != 2)

        let array=[]

        for(let i=0; i<filtro_usuarios.length; i++){
            const recintos= filtro_usuarios[i].recintos
            const filtro1= recintos.filter((e)=>e.nombre_zona== datos.junta.nombre_zona && e.nombre_recinto == datos.junta.nombre_recinto && e.num_junta == datos.junta.num_junta)
            if(filtro1.length >0){
                if(filtro1[0].ejecutado == 1){
                    if(array.length == 0){
                        array.push(filtro1[0])
                    }
                }
            }
        }

        if(array.length>0){
            const consulta2= await conexion.query("SELECT * FROM tbl_users")
            let filtro_user= consulta2.rows.filter((e)=> e.id_rol != 1 && e.id_rol != 2)
            
            for(let i=0; i<filtro_user.length; i++){
                const recintos= filtro_user[i].recintos
                const filtro1= recintos.filter((e)=>e.nombre_zona== datos.junta.nombre_zona && e.nombre_recinto == datos.junta.nombre_recinto && e.num_junta == datos.junta.num_junta)
                
                if(filtro1.length >0){
                    if(filtro1[0].ejecutado == 0 ){
                        filtro1[0].hora_ejecucion= array[0].hora_ejecucion
                        filtro1[0].fecha_ejecucion= array[0].fecha_ejecucion
                        filtro1[0].img_ejecucion= array[0].img_ejecucion
                        filtro1[0].ejecutado=array[0].ejecutado

                        await conexion.query("UPDATE tbl_users SET recintos = $1 WHERE users = $2",
                        [recintos, filtro_user[i].users])
                    }
                }      
            }  
        }else{
            const consulta2= await conexion.query("SELECT * FROM tbl_users")
            let filtro_user= consulta2.rows.filter((e)=> e.id_rol != 1 && e.id_rol != 2)
            for(let i=0; i<filtro_user.length; i++){                
                const recintos= filtro_user[i].recintos
                const filtro1= recintos.filter((e)=>e.nombre_zona== datos.junta.nombre_zona && e.nombre_recinto == datos.junta.nombre_recinto && e.num_junta == datos.junta.num_junta)
                if(filtro1.length >0){
                    if(filtro1[0].ejecutado == 0 ){
                        filtro1[0].hora_ejecucion= datos.hora
                        filtro1[0].fecha_ejecucion=datos.fecha
                        filtro1[0].img_ejecucion= datos.imagen
                        filtro1[0].ejecutado=1

                        await conexion.query("UPDATE tbl_users SET recintos = $1 WHERE users = $2",
                        [recintos, filtro_user[i].users])
                    }
                }
            }
        }

        const consulta3= await conexion.query("SELECT * FROM tbl_users WHERE users= '"+ datos.usuario+"'")

        const recintos= consulta3.rows[0].recintos

        const filtro_junta= recintos.filter((e)=>e.nombre_zona== datos.junta.nombre_zona && e.nombre_recinto == datos.junta.nombre_recinto && e.num_junta == datos.junta.num_junta)

        const consultatempo= await conexion.query("SELECT * FROM tbl_temporal WHERE cod_recinto = '"+filtro_junta[0].cod_recinto+"' AND direccion =  '"+ filtro_junta[0].direccion +"' AND img_ejecucion = '"+ filtro_junta[0].img_ejecucion+"' AND nombre_recinto = '"+ filtro_junta[0].nombre_recinto+ "' AND nombre_zona = '"+ filtro_junta[0].nombre_zona +"' AND num_junta = '"+filtro_junta[0].num_junta+"'" )

        if(consultatempo.rowCount == 0){
            //Iniciamos ingresando los datos en la tabla temporal
            const query= "INSERT INTO tbl_temporal (cod_recinto, direccion, img_ejecucion, nombre_recinto, nombre_zona, num_junta, votos, valido) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
            const values= [filtro_junta[0].cod_recinto, filtro_junta[0].direccion, filtro_junta[0].img_ejecucion, filtro_junta[0].nombre_recinto, filtro_junta[0].nombre_zona, filtro_junta[0].num_junta, datos.votos, false]
            await conexion.query(query,values).then((resp)=>{
                if(resp.rowCount >0){
                    res.send({
                        nuevo: true,
                        title: '¡Registro Éxitoso!',
                        icon: 'success',
                        text: '¡Votos registrados!'
                    })
                }
            })
        }else{
            res.send({
                nuevo: false,
                title: '¡Registro Éxitoso!',
                icon: 'success',
                text: '¡Votos registrados!'
            })
        }
        

    } catch (error) {
        console.log('Error en UserController en el metodo postv/temp_votacion: '+ error)
    }
})

router.post('/foto_votos', verifyTokenMiddleware, upload3.single('file'), async(req,res)=>{
    try {
        res.send({
            title: '¡Registro Exitoso!',
            icon: 'success',
            text: '¡Votos registrados!'
        })
    } catch (error) {
        console.log('Error en UserController en el metodo post /foto_votos: '+ error)
    }
})

module.exports = router   