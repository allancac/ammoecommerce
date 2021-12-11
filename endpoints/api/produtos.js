const express = require('express');
const router = express.Router();


// @route   GET api/produtos/
// @desc    Teste
// @access  Publico
router.get('/',(req, res)=>{
 
    res.json({msg:"Rota api/produtos funcionando."})
});


module.exports = router;