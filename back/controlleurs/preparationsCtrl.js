var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwtUtils');

// Routes

module.exports = {
    createPreparation: function(req, res) {
        let recetteeId = req.params.id;
        let duree = req.body.duree;
        let etape1 = req.body.etape1;
        let etape2 = req.body.etape2;
        let etape3 = req.body.etape3;


        asyncLib.waterfall([ 
            (done) => {
            models.preparations.create({
                recetteeId: recetteeId,
                duree: duree,
                etape1: etape1,
                etape2: etape2,
                etape3: etape3,
            })
            .then((newPreparation) => {
                done(newPreparation);
              });
            } 
        ], (newPreparation) => {
          if (newPreparation) {
            return res.status(200).json({success: 'Publication successfuly posted', newPreparation});
          } else {
            return res.status(500).json({ error: 'cannot post publication ' });
          }
        });
       },

    listPreparation: function(req, res) {
        
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
                 models.preparations.findOne({
                            attributes: ["id", "recetteeId", "duree","etape1","etape2","etape3"],
                            where: { recetteeId: recetteeId }
                        })
                        .then(function(preparationFound) {
                            console.log(preparationFound);
                            if (preparationFound) {
                                    return res.status(201).json({ preparationFound });
                            } else {
                                return res.status(404).json({ "error (404)": "preparations not found" });
                            }
                        })
                        .catch(function(error) {
                            return res.status(500).json({ "error (500)": "unable to find preparations" });
                        })
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ "error (500)": "unable to verify post" });
                })
            }
    }