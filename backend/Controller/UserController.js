const express = require('express');
const router = express.Router();
const conexion = require('../Database/database');

//Ruta para obtener los usuarios
router.get('/', async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('Error en UserController en el metodo get /: '+error)
    }
})


//Ruta para Agregar Usuarios Administradores
router.post('/add_admin', async(req,res)=>{
    try {
        const datos= req.body
    } catch (error) {
        console.log('Error en UserController en el metodo post /add_admin')
    }
})

//Ruta para agregar usuarios supervisores
router.post('/add_superv', async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('Error en UserController en el metodo post /add_superv: '+error)
    }
})

//Ruta para agregar usuarios coordinador
router.post('/add_coord', async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('Error UserController en el metodo post /add_coord: '+error)
    }
})

//Ruta para agregar usuarios veedor
router.post('/add_veedor', async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('Error en UserController en el metodo post /add_veedor: '+error )
    }
})

//Rutra para iniciar sesion
router.post('/login', async(req,res)=>{
    try {
        const datos= req.body

    } catch (error) {
        console.log('Error en UserController en el metodo get /login: '+ error)
    }
})

//Ruta para obtener el usuario logueado
router.get('/login', async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('Error en UserController en el metodo get /login: '+ error)
    }
})




module.exports = router