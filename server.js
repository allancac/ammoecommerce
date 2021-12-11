const express = require('express');
const app = express();
const mongoose = require('mongoose')


// configuração do banco de dados MongoDB
const db = require('./config/chaves').URIMongo
//Conexão com o Banco de Dados MongoDB
mongoose
    .connect(db)
    .then(()=>{
        console.log("Conectado ao Banco de Dados MongoDB") 
    })
    .catch(erro=> console.log(erro))


// Importação dos arquivos com os Endpoints
const produtos = require('./endpoints/api/produtos') 
// Aplicação do uso do Endpoint na instância do ExpressJS app
app.use('/api/produtos', produtos)

const porta = 5000 || process.env.PORT;

app.listen(porta, ()=>{
    console.log(`Servidor Ammo E-Commerce está online na porta ${porta}`)
})
