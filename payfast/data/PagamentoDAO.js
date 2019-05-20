function PagamentoDAO(connection) {
    this._connection = connection;
}

PagamentoDAO.prototype.salva = function(pagamento,callback) {
    this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
}

PagamentoDAO.prototype.atualiza = function(pagamento,callback) {
    this._connection.query('UPDATE pagamentos SET status = ? where id = ?',[pagamento.status,pagamento.id], callback);
}

PagamentoDAO.prototype.lista = function(callback) {
    this._connection.query('select * from pagamentos',callback);
}

PagamentoDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from pagamentos where id = ?",[id],callback);
}

module.exports = function(){
    return PagamentoDAO;
};