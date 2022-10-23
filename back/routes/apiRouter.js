const express = require ('express');
const commentaireCtrl = require('../controlleurs/commentaireCtrl');
const demandeCtrl = require('../controlleurs/demandeCtrl');
const ingredientsCtrl = require('../controlleurs/ingredientsCtrl');
const likeCtrl = require('../controlleurs/likeCtrl');
const preparationsCtrl = require('../controlleurs/preparationsCtrl');
const recetteCtrl = require('../controlleurs/recetteCtrl');
const userCtrl = require('../controlleurs/userCtrl');

exports.router = (function() {
    var apiRouter = express.Router();



//route user
apiRouter.route('/register').post(userCtrl.addUser);
apiRouter.route('/login').post(userCtrl.login)
apiRouter.route('/user/:id').get(userCtrl.getUser);
apiRouter.route('/allusers').get(userCtrl.getAllUsers);
apiRouter.route('/updateUser').put(userCtrl.putUser);
apiRouter.route('/deleteUser/:id').delete(userCtrl.deleteUser);

//route recette
apiRouter.route('/createRecette').post(recetteCtrl.CreateRecette);
apiRouter.route('/getAllRecette').get(recetteCtrl.getAllRecette);
apiRouter.route('/getAllRecetteS').get(recetteCtrl.getAllRecetteS);
apiRouter.route('/deleteRecette/:id').delete(recetteCtrl.deleteRecette);
apiRouter.route('/recette/:id').get(recetteCtrl.getrecette);
apiRouter.route('/putRecette/:id').put(recetteCtrl.putRecette);

//route ingredients
apiRouter.route('/createIngredient/:id').post(ingredientsCtrl.createIngredient);
apiRouter.route('/getAllIngredient/:id').get(ingredientsCtrl.listIngredient);

//route preparations
apiRouter.route('/createPreparation/:id').post(preparationsCtrl.createPreparation);
apiRouter.route('/getAllPreparation/:id').get(preparationsCtrl.listPreparation);

//route proposition
apiRouter.route('/createDemande').post(demandeCtrl.CreateDemande);
apiRouter.route('/getAllDemande').get(demandeCtrl.getAllDemande);
apiRouter.route('/getdemande').get(demandeCtrl.getDemande);
apiRouter.route('/getdemandebytoken/:id').get(demandeCtrl.getdemandebytoken);
apiRouter.route('/deletedemande/:id').delete(demandeCtrl.deleteDemande);
apiRouter.route('/putdemande/:id').put(demandeCtrl.putDemande);

//route commentaire
apiRouter.route('/createComment/:id').post(commentaireCtrl.createComment);
apiRouter.route('/getcommentaire').get(commentaireCtrl.getComment);
apiRouter.route('/getAllComment/:id').get(commentaireCtrl.listComments);
apiRouter.route('/recette/:recetteeId/deleteComment/:commentId').delete(commentaireCtrl.deleteComment);

//route like
apiRouter.route('/likeRecette/:id').post(likeCtrl.like);
apiRouter.route('/unlikeRecette/:id').post(likeCtrl.unlike);


    return apiRouter;

})();