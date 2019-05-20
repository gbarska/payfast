var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function(){
    var app = express();
    
    //the parser
    // app.use(bodyParser.urlencoded({extended: true}));for http url requests
    app.use(bodyParser.json());

    //app validator
    app.use(expressValidator());

    consign()
    .include('routes')
    // .then('data')
    .into(app);

    return app;
}