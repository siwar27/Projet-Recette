var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwtUtils');

// Routes

module.exports = {
    createComment: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let recetteeId = req.params.id;
        let comment = req.body.comment;

        if (comment == "") {
            return res.status(400).json({ error: "missing info" });
        }
        models.user.findOne({
            where: { id: userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.commentaire.create({
                    recetteeId: recetteeId,
                    userId: userFound.id,
                    comment: comment
                })
                .then(function(newComment) {
                    return res.status(201).json( {comment: "bravo valider" });
                })
                .catch(function(error){
                    return res.status(500).json({ error: "cannot create comment" });
                })
            } else {
                return res.status(403).json({ error: "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to verify user" });
        })

    },

    getComment:(req, res)=> {
        var headerAuth   = req.headers['authorization'];
        var userId  = jwtUtils.getUserId(headerAuth);
      
        
        models.recettee.findAll({
          include :[ 
            {model:models.commentaire, where: { userId:userId}},
           
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
  

    listComments: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

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
                models.user.findOne({
                    attributes: ["id", "nom"],
                    where: { id: userId }
                })
                .then(function(userFound) {
                    if (userFound) {
                        models.commentaire.findAll({
                            attributes: ["id", "userId", "recetteId", "comment"],
                            where: { recetteeId: recetteeId }
                        })
                        .then(function(commentFound) {
                            console.log(commentFound);
                            if (commentFound) {
                                    return res.status(201).json({ commentFound });
                            } else {
                                return res.status(404).json({ "error (404)": "comment not found" });
                            }
                        })
                        .catch(function(error) {
                            return res.status(500).json({ "error (500)": "unable to find comment" });
                        })
                    } else {
                        return res.status(403).json({ "error (403)": "invalid user" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ "error (500)": "unable to verify user" });
                })
            } else {
                return res.status(404).json({ "error (404)": "post not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error (500)": "unable to find post" });
        })
    },

    deleteComment : function (req, res) {

        let headerAuth = req.headers['authorization'];
        console.log(headerAuth)
        let userId = jwtUtils.getUserId(headerAuth);


        const recetteeId = req.params.recetteeId
        const commentId = req.params.commentId

        models.user.findOne({
            where : {id : userId}
        })

        .then((userFound) =>{
            if (userFound) {
                models.recettee.findOne({
                    where : {id : recetteeId}
                })

            .then((recetteFound) => {
                if (recetteFound) {
                    models.commentaire.findOne({
                        where : { id : commentId,
                                recetteeId : recetteFound.id,
                                userId : userFound.id }
                    }) 
                    .then((commentFound) => {
                        if (commentFound) {
                            console.log("------------- commentaire trouvé --------------", commentFound)  
                            if (commentFound.dataValues.userId === userFound.id)
                            models.commentaire.destroy({
                                where : { id : commentId}
                            })
                                return res.status(200).json({ succes : 'Commentaire supprimé' });
                        } else {
                            return res.status(400).json({ 'error': 'Commentaire introuvable' });
                        }
                    })
                        .catch()
                    } else {
                        return res.status(400).json({ 'error': 'Post introuvable' });
                    }
                })
                .catch((err) =>{
                    console.log(err)
                })
                } else {
                    return res.status(400).json({ 'error': 'Utilisateur introuvable' });
                }
            })
                .catch((err) =>{
                    console.log(err)
                })

    }, 
    updateComment: function(req,res) {

        let headerAuth =req.headers['authorization'];
        let userId =jwtUtils.getUserId(headerAuth);
    

        let recetteeId =req.params.recetteeId;
        let commentId =req.params.commentId;
        let comment = req.body.comment;
    

        if(recetteeId <= 0){
            return res.status(400).json({error: "Paramètres invalides" });  
        } 
        models.recettee.findOne({
            where: { id: recetteeId }
        })
        .then(function(recetteFound){
            if(recetteFound) {
                models.user.findOne({
                    where: { id: userId }
                })
                .then(function(userFound){
                    if(userFound) {
                        models.commentaire.findOne({
                            where: {
                                id: commentId,
                                recetteeId: recetteeId
                             }
                        })
                        .then(function(commentFound){
                            if(commentFound) {
                              console.log("---------------- COMMENT FOUND ----------------", commentFound)
                                if(commentFound.dataValues.userId == userFound.id){
                                    commentFound.update({
                                        comment : ( comment ? comment : commentFound.comment)
                                    })
                                    return res.status(200).json({success: "Votre commentaire a été mit à jour" });
                                }else {
                                    return res.status(403).json({error: "Vous n'avez pas les droits de modifier ce commentaire" });
                                }
                            }else {
                                return res.status(404).json({error: "Commentaire introuvable" });
                            }
                        })
                        .catch(function(error){
                            return res.status(500).json({error: "Impossible de trouver le commentaire" });
                        })
                    }else {
                        return res.status(403).json({error: "Utilisateur invalide" });
                    }
                })
                .catch(function(error){
                  return res.status(500).json({error: "unable to verify user" });
              })
            }else {
                return res.status(404).json({error: "Publication introuvable" });
            }
      
        })
        .catch(function(error){
            return res.status(500).json({error: "Impossible de trouver la publication" });
        })
    },
}