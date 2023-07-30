const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const cors = require('cors')

app.use(express.json())

//Seteando las cookies
app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}))

app.use(cors({
    origin:['http://localhost:7000'], //Direccion de origen de donde provienen las peticiones
    methods: ['GET', 'POST'],
    credentials: true
}))

