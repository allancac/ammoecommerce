const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Criação de um modelo para a entidade produto
const ProdutosSchema = new Schema({
    
    refProduto:{type:String, required:true},
    descricao:{type:String, required:true},
    categoria:{type:String, required:true},
    quantidade:{type:Number, required:true},
    precos:[
        {
            valor:{type:Number, required:true},
            dataPreco:{type:Date, default:Date.now},
        }
    ],
    album:[
        {
            imagem:{type:String}
        }
    ]

});

const Produto = mongoose.model('produtos', ProdutosSchema)
module.exports = Produto 