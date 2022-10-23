// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwtUtils');


// Constants
//const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT   = 50;

// Routes
module.exports = {
    CreateRecette: (req, res) => {
  // Getting auth header
  var headerAuth   = req.headers['authorization'];
  //decrypt token and get user id
  var userId  = jwtUtils.getUserId(headerAuth);
  // Params
  let titre = req.body.titre;
  let attachement = req.body.attachement;
  let choix = req.body.choix;


  if (titre == '' || attachement == '' || choix == '') {
    return res.status(400).json({ 'error': 'Paramètres manquants'});
}
  asyncLib.waterfall([ 
    (done) => {
        models.recettee.create({
          userId : userId,
          titre: titre,
          attachement:attachement,
          choix:choix,
          likesCount: 0,
          unlikesCount: 0,
        })
        .then((newRecette) => {
          done(newRecette);
        });
      } 
  ], (newRecette) => {
    if (newRecette) {
      return res.status(200).json({success: 'Publication successfuly posted', newRecette});
    } else {
      return res.status(500).json({ error: 'cannot post publication ' });
    }
  });
 },

    getAllRecette: (req, res) => {

          models.recettee.findAll({
              attributes: [ 'id', 'userId','titre','attachement','choix',"likesCount","unlikesCount","createdAt"]
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

    getAllRecetteS: (req, res) => {

      models.recettee.findAll({
        attributes: [ 'id', 'userId','titre','attachement','choix',"likesCount","unlikesCount","createdAt"],
      
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
    getrecette:(req, res)=> {
      let recetteId = req.params.id
      
      models.recettee.findOne({
        where: { id: recetteId },
        include :[ 
          {model:models.ingredients},
          {model:models.preparations},
          {model:models.commentaire},
          {model:models.user},
        ],
      }).then((post) =>{
          if (post) {
          res.status(201).json(post);
          } else {
              res.status(404).json({ 'error': 'post not found' });
          }
      }).catch((err) =>{
          res.status(500).json({ 'error': 'cannot fetch post' });
      });
  },

    deleteRecette:(req, res)=> {

    let recetteId = req.params.id;
  
    asyncLib.waterfall([
        (done) => {
        models.recettee.destroy({
            attributes: ['id'],
            where: { id: recetteId }
        })
        .then((recetteFound) => {
            done(recetteFound)
        })
        .catch((err) => {
            return res.status(400).json({ 'error': 'An error occurred' });
        });
    }],
    (recetteFound) => {
        if (recetteFound) {
            return res.status(200).json({'success':`recette successfuly deleted`})
        }
        else {
  
            return res.status(404).json({ 'error': 'User was not found' });
        }
    });
  },

    putRecette: function (req, res) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
  
    let titre = req.body.titre;
    let attachement = req.body.attachement;
    let choix = req.body.choix;
    let recetteId = req.params.id;
  
    models.user.findOne({
        where: { id : userId }
    })
    .then(function(userFound) {
        if (userFound) {
            models.recettee.findOne({
                attributes: ["id", "userId", "choix", "titre"],
                where: { id : recetteId }
            })
            .then(function(recetteFound) {
                if (userFound.id == recetteFound.dataValues.userId) {
                  recetteFound.update({
                      titre: ( titre ? titre : recetteFound.titre ),
                      choix: ( choix ? choix : recetteFound.choix ),
                      attachement: ( attachement ? attachement : recetteFound.attachement ),
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