module.exports = function(app){

app.get('/pagamentos',(req,res)=>{
    console.log('Received request on port 3000.');
    res.send('Request OK...');
});

app.get('/pagamentos/pagamento/:id',(req,res)=>{
    const paramId = req.params.id
    console.log("Fetching payment with id: "+paramId)
  
    req.assert("id","Obrigatorio informar o id do pagamento.").notEmpty();

    var erros =  req.validationErrors();

    if(erros){
        console.log('Validation errors found...');
        res.status(400).send(erros);
        return;
    }

    var dbConnection = app.data.connection();
    var PagamentoDAO = new app.data.PagamentoDAO(dbConnection);

    PagamentoDAO.buscaPorId(paramId,function(erro, resultado){
            if(erro){
                console.log(erro);
                res.status(500).send(erro);
            }else{
                console.log('Fetched payment succesfully...');
                res.status(200).json(resultado);
            }
    });

});

app.put('/pagamentos/pagamento/:id',(req,res)=>{
    
    var pagamento ={};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status= 'CONFIRMADO';

    var connection= app.data.connection();
    var pagamentoDAO = new app.data.PagamentoDAO(connection);

    pagamentoDAO.atualiza(pagamento,function(erro){
        if (erro){
            console.log('An Error ocurred during payment update...');
            res.status(500).send(erro);
            return;
        }
        console.log('Payment updated, new status: CONFIRMADO');
        res.send(pagamento);
    });
});

app.delete('/pagamentos/pagamento/:id',(req,res)=>{

    var pagamento ={};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status= 'CANCELADO';

    var connection= app.data.connection();
    var pagamentoDAO = new app.data.PagamentoDAO(connection);

    pagamentoDAO.atualiza(pagamento,function(erro){
        if (erro){
            console.log('An Error ocurred during payment update...');
            res.status(500).send(erro);
            return;
        }
        console.log('Payment updated, new status: CANCELADO');
        res.status(204).send(pagamento);
    });

});

app.post('/pagamentos/pagamento', (req,res)=>{

    req.assert("pagamento.forma_de_pagamento","Obrigatorio informar a forma de pagamento.").notEmpty();
    req.assert("pagamento.valor","Obrigatorio informar um valor decimal para o campo 'valor'.").notEmpty().isFloat();

    var erros =  req.validationErrors();

    if(erros){
        console.log('Validation errors found...');
        res.status(400).send(erros);
        return;
    }

    var pagamento = req.body["pagamento"];

    console.log('processing a payment request...');
    pagamento.status = 'CRIADO';
    pagamento.data = new Date;

    var dbConnection = app.data.connection();
    var PagamentoDAO = new app.data.PagamentoDAO(dbConnection);

    PagamentoDAO.salva(pagamento,function(erro, resultado){
       if(erro){
           console.log(erro);
           res.status(500).send(erro);
       }
       
       else{
        pagamento.id = resultado.insertId;
        console.log('Payment created sucessfully...');

        if (pagamento.forma_de_pagamento == 'cartao'){
            var cartao = req.body["cartao"];
            console.log(cartao);

            var clienteCartoes =  new app.services.clienteCartoes();
            
            clienteCartoes.autoriza(cartao, 
                function(exception,request, response,retorno){
                    if (exception){
                        console.log(exception);
                        res.status(400).send('An error ocurred while authorizing the credit card...');
                        return;
                    }
                    else{
                        console.log(retorno);
                        
                        res.location('/pagamentos/pagamento/'+pagamento.id);

            var response = {
                dados_do_pagamento: pagamento,
                cartao:retorno,
                links: [
                    {
                        href:"http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                        rel:"confirmar",
                        method:"PUT"
                    },
                    {
                        href:"http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                        rel:"cancelar",
                        method:"DELETE" 
                    },
                    {
                        href:"http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                        rel:"veificar",
                        method:"GET" 
                    }
                ]
            };
            res.status(201).json(response);

                     return;
                    }
            });  

        }else{
            res.location('/pagamentos/pagamento/'+pagamento.id);

            var response = {
                dados_do_pagamento: pagamento,
                links: [
                    {
                        href:"http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                        rel:"confirmar",
                        method:"PUT"
                    },
                    {
                        href:"http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                        rel:"cancelar",
                        method:"DELETE" 
                    },
                    {
                        href:"http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                        rel:"veificar",
                        method:"GET" 
                    }
                ]
            };
            res.status(201).json(response);
        }
      
       }
    });
});

}

