var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwtUtils');

// Routes

module.exports = {
    createIngredient: function(req, res) {
        let recetteeId = req.params.id;
        let sucre = req.body.sucre;
        let viandes = req.body.viandes;
        let liquides = req.body.liquides;
        let fruits = req.body.fruits;
        let epices = req.body.epices;
        let legumes = req.body.legumes;


        asyncLib.waterfall([ 
            (done) => {
            models.ingredients.create({
                recetteeId: recetteeId,
                sucre: sucre,
                viandes: viandes,
                liquides: liquides,
                fruits: fruits,
                epices: epices,
                legumes: legumes,

            })
            .then((newIngredient) => {
                done(newIngredient);
              });
            } 
        ], (newIngredient) => {
          if (newIngredient) {
            return res.status(200).json({success: 'Publication successfuly posted', newIngredient});
          } else {
            return res.status(500).json({ error: 'cannot post publication ' });
          }
        });
       },

    listIngredient: function(req, res) {
        
        let recetteeId = req.params.id;

        if (recetteeId <= 0) {
            return res.status(400).json({ "error (400)": "invalid parameters" });
        }
        models.recettee.findOne({
            attributes: ["id", "userId"],
            where: { id: recetteeId }
        })
        .then(function(recetteeFound) {
            if (recetteeFound) {
                 models.ingredients.findOne({
                            attributes: ["id", "recetteeId", "sucre","legumes","liquides","fruits","epices","viandes"],
                            where: { recetteeId: recetteeId }
                        })
                        .then(function(ingredientFound) {
                            console.log(ingredientFound);
                            if (ingredientFound) {
                                    return res.status(201).json({ ingredientFound });
                            } else {
                                return res.status(404).json({ "error (404)": "ingredients not found" });
                            }
                        })
                        .catch(function(error) {
                            return res.status(500).json({ "error (500)": "unable to find ingredients" });
                        })
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ "error (500)": "unable to verify post" });
                })
            }
    }