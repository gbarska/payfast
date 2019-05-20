module.exports = function(app){

app.post('/cartoes/autoriza', (req,res)=>{
    console.log('Processing a payment with credit card...');
   
    var cartao = req.body;
   
    req.assert("numero","Obrigatorio informar o numero do cartão com 16 caracteres.").notEmpty().len(16,16);
    req.assert("bandeira","Obrigatorio informar a bandeira.").notEmpty();
    req.assert("ano_de_expiracao","Obrigatorio informar o ano de expiração  com 4 caracteres.").notEmpty().len(4,4);
    req.assert("mes_de_expiracao","Obrigatorio informar o mês de expiração com 2 caracteres.").notEmpty().len(2,2);
    req.assert("cvv","Obrigatorio informar o CVV de 3 caracteres.").notEmpty().len(3,3);

    var erros =  req.validationErrors();

    if(erros){
        console.log('Validation errors found...');
        res.status(400).send(erros);
        return;
    }
    else{
        cartao.status = 'AUTORIZADO';

        var response = {
            dados_do_cartao: cartao
        };
        
        res.status(200).json(response);
    }
});

}

