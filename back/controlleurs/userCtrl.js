const bcrypt    = require('bcrypt');
const jwtUtils  = require('../utils/jwtUtils');
const models = require('../models');
const asyncLib  = require('async');

// constants
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@gmail.com+$/;
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$/;
//mot de passe de 4 caracteres 

//Routes
module.exports = {
    addUser: (req, res) => {
        console.log('BACK BODY ', req.body);
        let nom = req.body.nom;
        let prenom = req.body.prenom;
        let email = req.body.email;
        let password = req.body.password;
        let isAdmin = req.body.isAdmin;

        if (email == "" || nom == "" || prenom == "" || password == "") {
          return res.status(400).json({'error': 'Parametres manquantes'})
      }

      if(!EMAIL_REGEX.test(email)) {
          return res.status(400).json({'error': 'Email est non valide'})
      }

      if(!PASSWORD_REGEX.test(password)) {
          return res.status(400).json({'error': 'le mot de passe  doit comporter au moins 4 caractères  : une lettre majuscule,une lettre minuscule,un chiffre et un caractère spéciale'})
      }
    //Verifier si le user exist sinon créer un user
        asyncLib.waterfall([
            (done) => {
                models.user.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                .then((userFound) => {
                    done(null, userFound)
                })
                .catch((err) => {
                  console.log(err)
                    return res.status(409).json({'error': 'An error occurred'})
                })
            },
            (userFound, done) => {
                if(!userFound) {
                    bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                        done(null, userFound, bcryptedPassword)
                    })
                }
                else {
                    return res.status(409).json({'error': 'Email est déjà existant.'})
                }
            },
            (userFound, bcryptedPassword, done) => {
                
                let newUser = models.user.create({
                    nom: nom,
                    prenom: prenom,
                    email: email,
                    password: bcryptedPassword,
                    isAdmin: 0
                })
                .then((newUser) => {
                    done(newUser)
                })
                .catch((err) => {
                  console.log(err)
                    res.status(400).json({'error': 'An error occurred'})
                    return;
                })
            }
        ], (newUser) => {
            if(newUser){               
               return res.status(201).json({'success': 'user successfuly created'})
            }
            else {
                return res.status(400).json({ 'error': 'An error occurred'})
            }
        })
    },
    getUser:(req, res)=> {

        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        console.log(headerAuth, '-----ici---', userId)
        
        if (userId < 0)
        
            return res.status(400).json({ 'error': 'wrong token' });
        
        models.user.findOne({
            attributes: [ 'id','nom','prenom','email','isAdmin'],
             where: { id: userId }
        }).then((user) =>{
            if (user) {
            res.status(201).json(user);
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        }).catch((err) =>{
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
    },

    getAllUsers: (request, response) => {
        models.user.findAll({
            attributes: [ 'id','nom','prenom','email','isAdmin']
            })
        .then(data => {
            if (data) {
                response.status(200).send(data);
            }
        })
        .catch(err => {
            response.status(400).send({
                message: "An error occurred : while retrieving Users."
            });
        });
    },

    login: function (req, res){

        // params
        var email = req.body.email;
        var password = req.body.password;

        if (email == '' || password == '') {
            return res.status(400).json({ 'error': 'missing parameters'});
        }

        // verify  var
        asyncLib.waterfall([
            function(done) {
            models.user.findOne({
                where: { email: email }
            })
            .then(function(userFound) {
                done(null, userFound);
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
            },
            function(userFound, done) {
            if (userFound) {
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                done(null, userFound, resBycrypt);
                });
            } else {
                return res.status(404).json({ 'error': 'user not exist in DB' });
            }
            },
            function(userFound, resBycrypt, done) {
            if(resBycrypt) {
                done(userFound);
            } else {
                return res.status(403).json({ 'error': 'invalid password' });
            }
            }
        ], function(userFound) {
            if (userFound) {
            return res.status(201).json({
                'userId': userFound.id,
                'token': jwtUtils.generateTokenForUser(userFound)
            });
            } else {
            return res.status(500).json({ 'error': 'cannot log on user' });
            }
        });
    },
   
    putUser: function(req, res) {

    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
    
    // Params
   
    let nom = req.body.nom;
    let prenom = req.body.prenom;
    
    asyncLib.waterfall([
        function(done) {
        models.user.findOne({
            attributes: ['id', 'nom','prenom','email'],
            where: { id: userId }
        }).then(function (userFound) {
            done(null, userFound);
        }).catch(function(err) {
            console.log(err)
            return res.status(500).json({ 'error': 'unable to verify user' });
        });
    },
        function(userFound, done) {
        if(userFound) {
            userFound.update({
           
            nom : (nom ? nom : userFound.nom),
            prenom : (prenom ? prenom : userFound.prenom),
           
            }).then(function() {
                done(userFound);
            }).catch(function(err) {
                res.status(500).json({ 'error': 'cannot update user' });
            });
        } else {
            res.status(404).json({ 'error': 'user not found' });
        }
        },
    ], function(userFound) {
        if (userFound) {
            return res.status(200).json({ 'message': 'User successfully updated' });
        } else {
            return res.status(500).json({ 'error': 'cannot update user profile' });
        }
    });
    },

    deleteUser:(req, res)=> {

    let userId = req.params.id;

    asyncLib.waterfall([
        (done) => {
        models.user.destroy({
            attributes: ['id', 'nom','prenom','email'],
                where: { id: userId }
        })
        .then((userFound) => {
            done(userFound)
        })
        .catch((err) => {
            return res.status(400).json({ 'error': 'An error occurred' });
        });
    }],
    (userFound) => {
        if (userFound) {
            return res.status(200).json({'success':`User successfuly deleted`})
        }
        else {

            return res.status(404).json({ 'error': 'User was not found' });
        }
    });
    },
}
