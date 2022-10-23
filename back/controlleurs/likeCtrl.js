// Imports

var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwtUtils');

// Routes

module.exports = {
    like: function(req, res) {
        
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let recetteeId = req.params.id;
        console.log('-----------idRecette-----',recetteeId)

        if (recetteeId <= 0) {
            return res.status(400).json({ error: "invalid parameters" });
        }

        models.user.findOne({
            attributes: ['id', 'nom','prenom','email'],
            where: { id : userId }
        })
        
        .then(function(userFound) {
            if (userFound) {
                models.recettee.findOne({
                    attributes: [ 'id', 'userId','titre','attachement','choix',"likesCount"],   
                    where: { id : recetteeId }
                })
                .then(function(recetteFound) {
                    if (recetteFound) {
                        models.like.findOne({
                            attributes: ['id', 'userId','recetteeId'],
                            where: {
                                userId: userFound.id,
                                recetteeId: recetteeId,
                            }
                        
                        })
                        .then(function(likeFound){
                            if (!likeFound) {
                                models.like.create({
                                        userId: userFound.id,
                                        recetteeId: recetteeId
                                })
                                recetteFound.update({
                                    likesCount: recetteFound.likesCount + 1
                                })
                                
                                return res.status(201).json({ succes : "you liked the post" });
                                // postFound.addUser(userFound)
                            } else {
                                return res.status(409).json({ error: "post already liked" });
                            }
                        })
                        .catch(function(error){
                            res.status(500).json({ error: "unable to find likes" });
                        })
                    } else {
                        return res.status(403).json({ error: "invalid user" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ error: "unable to verify user" });
                })
            } else {
                return res.status(404).json({ error: "post not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to find post" });
        })
    },
    
    unlike: function(req, res) {
        
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let recetteeId = req.params.id;
        console.log('-----------idRecette-----',recetteeId)

        if (recetteeId <= 0) {
            return res.status(400).json({ error: "invalid parameters" });
        }

        models.user.findOne({
            attributes: ['id', 'nom','prenom','email'],
            where: { id : userId }
        })
        
        .then(function(userFound) {
            if (userFound) {
                models.recettee.findOne({
                    attributes: [ 'id', 'userId','titre','attachement','choix',"likesCount"],   
                    where: { id : recetteeId }
                })
                .then(function(recetteFound) {
                    if (recetteFound) {
                        models.like.findOne({
                            attributes: ['id', 'userId','recetteeId'],
                            where: {
                                userId: userFound.id,
                                recetteeId: recetteeId,
                            }
                        })
                        .then(function(likeFound){
                            if (likeFound.dataValues.userId === userFound.id) {
                                models.like.destroy({
                                    where: {
                                        recetteeId: recetteeId,
                                    }
                                })
                                recetteFound.update({
                                    likesCount: recetteFound.likesCount - 1,
                                })
                                
                                return res.status(201).json({ succes : "you unliked the post" });
                            } else {
                                return res.status(409).json({ error: "post already liked" });
                            }
                        })
                        .catch(function(error){
                            res.status(500).json({ error: "unable to find likes" });
                        })
                    } else {
                        return res.status(403).json({ error: "invalid user" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ error: "unable to verify user" });
                })
            } else {
                return res.status(404).json({ error: "post not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to find post" });
        })
    },
}