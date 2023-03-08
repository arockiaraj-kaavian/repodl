const mongoose = require('mongoose');

const gitUser = new mongoose.Schema({
    Token: { type : String, unique : true }
},
{ collection: 'Tokens' });


const Tokens = mongoose.model('Tokens', gitUser);


module.exports =  Tokens ;
