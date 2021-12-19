const express = require('express');
const router = express.Router();
//Middelware Multer para carregar arquivos no NodeJs
const multer = require('multer')    
// Objeto com Estratégia de armazenamento que é aplicado ao método upload() 
const estrategiaArmazenamento = multer.diskStorage({
    destination: function(req,file, callbackFunction){
        callbackFunction(null,'./uploads/');
    },

    filename: function(req,file, callbackFunction){
        callbackFunction(null, new Date().toISOString() + file.originalname);
    }
});

const filtroImagem = (req,file, callbackFunction)=>{
    if (file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        callbackFunction(null,true);
    }
    else{
        callbackFunction(null,false);
    }
}

//Instância Middleware do método multer(). Com aplicação das estratégias de armazenamento
//filtro de imagem e limite de tamanho do arquivo
const upload = multer(
    {
        storage:estrategiaArmazenamento,
        limits:{fileSize:1024* 1024* 5},
        fileFilter: filtroImagem
    }
)
// Carregar o modelo Produtos
const Produto = require('../models/Produto');


// @route   GET api/produtos/
// @desc    Lista todos os produtos
// @access  Publico
router.get('/',(req, res, next)=>{
    Produto.find({})
        .then(produtos=>{
            res.status(200).json(produtos)
        })
        .catch(erro=>{
            res.status(500).json({
                erro:erro
            })
        })
});

// @route   POST api/produtos/
// @desc    Cadastrar ou alterar produtos no Banco de Dados
// @access  Publico
router.post('/', upload.single('imagem') ,(req, res, next) =>{
    
    //Objeto com Dados do Produto
    const camposProduto = {};
    refProdutoCampos = ["refProduto", "descricao", "categoria", "quantidade"];
    refProdutoCampos.forEach(element => { 
        if(req.body[element]){
            camposProduto[element] = req.body[element] ;
        }
    });

    //Cria um array que conterá objetos com informações de preços 
    camposProduto.precos = [];
    //Adiciona um preço(valor e data de alteração) ao array
    if(req.body.valor){
        camposProduto.precos.push({valor:req.body.valor, dataPreco:Date.now()})
    }

    //Cria um array que conterá imagens do produto
    camposProduto.album = [];
    if(req.file){
        camposProduto.album.push({imagem:`https://api-ammo-interview.herokuapp.com/${req.file.path}`})
    }
   
    Produto.findOne({refProduto:req.body.refProduto})
        .then(produto=>{
            if(!produto){
                // Cria  o Produto
                new Produto(camposProduto)
                    .save()
                    .then(produto=>{
                        res.status(201).json({
                            mensagem:"Produto criado com sucesso.",
                            produtoCriado:produto
                        })
                    })
            }else{
                res.status(400).json({
                    error: "Produto já cadastrado."
                })
            }
        })
        .catch(erro=>{
            console.log(erro)
            res.status(500).json({
                erro:erro
            })
        })

});

// @route   GET api/produtos/{refProduto}
// @desc    Busca um produto no banco de Dados
// @access  Publico
router.get('/:produto',(req, res, next)=>{
    const buscaProduto = req.params.produto;

    Produto.find(
        {$or:[
            {refProduto:buscaProduto},
            {descricao:{$regex:buscaProduto, $options: '-i'}}
          ]
        })
        .then(produto=>{
            if(produto){
                res.status(200).json(produto)
            }else{
                res.status(404).json({
                    mensagem: "Produto não encontrado"
                })
            }
        })
        .catch(erro=>{
            console.log(erro);
            res.status(500).json({erro:erro})
        })
   
});

// @route   PATCH api/produtos//{refProduto}
// @desc    Altera um produto no banco de Dados
// @access  Publico
router.patch('/:refProduto',(req, res, next)=>{


    //Produto a ser alterado
    const refProduto = req.params.refProduto;  

    Produto.findOne({refProduto:refProduto})
        .then(produto=>{

            //Objeto com Dados do Produto
            const camposProduto = {};
            refProdutoCampos = ["refProduto", "descricao", "categoria", "quantidade"];
            refProdutoCampos.forEach(element => { 
                if(req.body[element]){
                    camposProduto[element] = req.body[element] ;
                }
            });

            //Adiciona um preço(valor e data de alteração) ao array
            if(req.body.valor){
                camposProduto.precos=produto.precos
                camposProduto.precos.push({valor:req.body.valor, dataPreco:Date.now()})
            }

            if(req.body.imagem){
                camposProduto.album=[]
                camposProduto.album.push({imagem:req.body.imagem})
            }

            if(produto){
                // Altera o Produto
                Produto.findOneAndUpdate(
                    {refProduto:refProduto}, //Filtro
                    {$set:camposProduto}, //Campos
                    {new:true}  
                ).then(res.status(200).json({
                    mensagem:"Produto alterado.",
                    produtoalterado:camposProduto
                }))
            }else{
                res.status(404).json({
                    erro: "Produto não encontrado"
                })
            }
        }).catch(erro=>{
            console.log(erro)
            res.status(500).json({
                erro:erro
            })
        
        })


});

// @route   DELETE api/produtos//{refProduto}
// @desc    Remove um produto do banco de Dados
// @access  Publico
router.delete('/:refProduto',(req, res, next)=>{
    const refProduto = req.query.refProduto;  
    Produto.findOneAndRemove({refproduto:refProduto})
        .then(resultado=>{
            res.status(200).json({
                mensagem: "Produto excluído",
                resultado:resultado
            })
        })
        .catch(erro=>{
            console.log(erro)
            res.status(500).json({
                erro:erro
        })


    })

});

module.exports = router;