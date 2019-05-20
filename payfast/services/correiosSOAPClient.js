var clienteSOAP = require('soap');

function CorreiosSOAPClient() {
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

CorreiosSOAPClient.prototype.calculaPrazo= function(args, callback){
    clienteSOAP.createClient(this._url, function(erro, cliente){
           console.log('SOAP client created...');
    
            cliente.CalcPrazo(args,callback);
        });
}

module.exports = function(){
    return CorreiosSOAPClient;
}