const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const cors = require('cors')
const pool =require('./Database/database');

app.use(express.json())

//Creamos un middleware para la validacion del token
const verifyTokenMiddleware = (req, res, next) => {
    const token = req.headers['token_eleccion_2023_app'];
    if (token) {
      jwt.verify(token, process.env.CLVSECRET, (err, decoded) => {
        if (err) {
          res.send({ auth: false, message: 'Fallo al autenticar el token' });
        } else {
          let objeto = {
            exp: decoded.exp,
            data: decoded.data
          };
          req.valtoken = objeto;
          next();
        }
      });
    }
};


//Seteando las cookies
app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}))

app.use(cors({
    origin:['http://localhost:7000'], //Direccion de origen de donde provienen las peticiones
    methods: ['GET', 'POST'],
    credentials: true
}))

const recintoRouter= require('./Controller/RecintoController')
app.use('/recintos', recintoRouter)

const candidatoRouter= require('./Controller/CandidatoController')
app.use('/candidatos', candidatoRouter)

const usuarioRouter= require('./Controller/UserController')
app.use('/usuarios', usuarioRouter)

const registroRouter= require('./Controller/RegistrosController')
app.use('/registros', registroRouter)

//Verificamos si existe conexion a la base de datos e inicializamos el server
pool.connect((error, client, release) => {
    if (error) {
      console.error('Error al conectar a la base de datos:', error);
      return;
    }else{
      console.log('Conexion exitosa ')
      release()
      //estableciendo el puerto con el que trabajara nodejs
      let puerto_api=7001
      app.listen(puerto_api,()=>{
        console.log('Servidor iniciado en: http//:localhost:'+puerto_api)
      })
    }
});

