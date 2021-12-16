const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Aplicação do Middleware para o pacote de Logs Morgan
app.use(morgan('dev')); 

// Aplicação do MiddleWare para o Body-Parser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// configuração do banco de dados MongoDB
const db = require('./api/config/chaves').URIMongo
//Conexão com o Banco de Dados MongoDB
mongoose
    .connect(db)
    .then(()=>{
        console.log("Conectado ao Banco de Dados MongoDB") 
    })
    .catch(erro=> console.log(erro))

// Tratamentos de erros CORS - Cross-Origin Resource Sharing
app.use((req,res,next)=>{
    //Configuração de origens das requisições
    res.header(
        'Access-Control-Allow-Origin', 
        '*'
    );
    //Configuração de cabeçalhos da resposta HTTP
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    //Configuração de Métodos permitidos
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
        return res.status(200).json({})
    }
    next()
})

// Importação dos arquivos com os Endpoints
const produtos = require('./api/rotas/produtos') 
// Direcionamento de requisições de /api/rotas/produtos para "/api/produtos"
app.use('/api/produtos', produtos)
app.use('/uploads', express.static('uploads'))

// Tratamento para requisições inválidas
app.use((req,res,next)=>{
    const erro = new Error('Rota não encontrada ou inexistente');
    erro.status = 404;
    next(erro);


})

// Tratamento de erros para erros vindos do MongoDB
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})

const porta = process.env.PORT || 5000;

app.listen(porta, ()=>{
    console.log(`Servidor Ammo E-Commerce está online na porta ${porta}`)
})
