const express = require('express');
const bodyParser  = require('body-parser');
const path = require('path');
//const logCtrl = require('../ProjetBack/server/controleurs/logCtrl')
//const postCtrl = require('../ProjetBack/server/controleurs/postCtrl')
//const userCtrl = require('../ProjetBack/server/controleurs/userCtrl')
//const userCtrlFront = require('./controleurs/userCtrlFront')
// Instantiate server
var server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());


// config view engine
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.set('/img', path.join(__dirname + 'public/img'));
server.use(express.static(path.join(__dirname + '/public')));




// Declare API routes
server.use('/', require('./routes/apiRouter'));

server.listen(3000, function() {
    console.log('Server ----- FRONT ------ en écoute :)');
})

