// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwtUtils');


// Routes
module.exports = {
CreateDemande: (req, res) => {
  // Getting auth header
  var headerAuth   = req.headers['authorization'];
  console.log('-------HEADER--------', req.user)
  //decrypt token and get user id
  var userId  = jwtUtils.getUserId(headerAuth);
   
console.log('---------------', userId)
  // Params
  let proposition = req.body.proposition;
  let choix = req.body.choix;

  if (choix == '' || proposition == '') {
    return res.status(400).json({ 'error': 'missing parameters'});
}

  
  asyncLib.waterfall([ 
    (done) => {
        models.proposition.create({
          userId : userId,
          proposition: proposition,
          choix:choix,
        })
        .then((newProposition) => {
          done(newProposition);
        });
      } 
  ], (newProposition) => {
    if (newProposition) {
      return res.status(200).json({success: 'Publication successfuly posted', newProposition});
    } else {
      return res.status(500).json({ error: 'cannot post publication ' });
    }
  });
 },


getAllDemande: (req, res) => {

    models.proposition.findAll({
        attributes: [ 'id', 'userId','choix','proposition']
    })
    .then((posts) => {
        res.status(200).json({success:posts})
        //res.render('home', {data : posts})
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json({ error: 'An error occurred' });
    });
},

getDemande:(req, res)=> {
  var headerAuth   = req.headers['authorization'];
  var userId  = jwtUtils.getUserId(headerAuth);

 
  models.proposition.findAll({
      attributes: [ 'id','userId','choix','proposition'],
       where: {userId:userId}
  }).then((posts) => {
    res.status(200).json({success:posts})
    //res.render('home', {data : posts})
})
.catch((err) => {
    console.log(err);
    res.status(400).json({ error: 'An error occurred' });
});
},


getdemandebytoken:(req, res)=> {
  let propositionId = req.params.id

 
  models.proposition.findOne({
      attributes: [ 'id','userId','choix','proposition'],
       where: { id: propositionId }
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

deleteDemande:(req, res)=> {

  let propositionId = req.params.id;

  asyncLib.waterfall([
      (done) => {
      models.proposition.destroy({
          attributes: ['id', 'nom','prenom','email'],
              where: { id: propositionId }
      })
      .then((propositionFound) => {
          done(propositionFound)
      })
      .catch((err) => {
          return res.status(400).json({ 'error': 'An error occurred' });
      });
  }],
  (propositionFound) => {
      if (propositionFound) {
          return res.status(200).json({'success':`User successfuly deleted`})
      }
      else {

          return res.status(404).json({ 'error': 'User was not found' });
      }
  });
},

putDemande: function (req, res) {
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth);

  let choix = req.body.choix;
  let proposition = req.body.proposition;
  let propositionId = req.params.id;

  models.user.findOne({
      where: { id : userId }
  })
  .then(function(userFound) {
      if (userFound) {
          models.proposition.findOne({
              attributes: ["id", "userId", "choix", "proposition"],
              where: { id : propositionId }
          })
          .then(function(propositionFound) {
              if (userFound.id == propositionFound.dataValues.userId) {
                propositionFound.update({
                      choix: ( choix ? choix : propositionFound.choix ),
                      proposition: ( proposition ? proposition : propositionFound.proposition )
                  })
                  return res.status(200).json({ "success (200)": "your post has been updated" });
              } else {
                  return res.status(403).json({ "error (403)": "you don't have the rights to update this post" });
              }
          })
          .catch(function(error) {
              return res.status(404).json({ "error (404)": "post not found" });
          })
      } else {
          return res.status(403).json({ "error (403)": "invalid user" });
      }
  })
  .catch(function(error) {
      return res.status(500).json({ "error (500)": "unable to verify user" });
  })
},
}