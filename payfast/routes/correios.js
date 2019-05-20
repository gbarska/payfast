module.exports  = function(app){
    app.post('/correios/calculo-prazo',(req,res)=>{
        var  dadosDaEntrega  =  req.body;

        var correiosSOAPClient = new  app.services.correiosSOAPClient(); 
        correiosSOAPClient.calculaPrazo(dadosDaEntrega,
                function(erro,resultado){
                    if (erro){
                        console.log(erro);
                        res.status(500).send(erro);
                        return;
                    }
                    console.log('Prazo calculado...');
                    res.json(resultado);
                });
    });
}