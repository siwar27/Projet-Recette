const express = require('express');
const LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
const route = express.Router();
const userCtrlFront = require('../controleurs/userCtrlFront');
const recetteCtrlFront = require('../controleurs/recetteCtrlFront');
const demandeCtrlFront = require('../controleurs/demandeCtrlFront');
const ingredientsCtrlFront = require('../controleurs/ingredientsCtrlFront');
const preparationsCtrlFront = require('../controleurs/preparationsCtrlFront');
const likeCtrlFront = require('../controleurs/likeCtrlFront')
const commentaireCtrlFront = require('../controleurs/commentaireCtrlFront')

const multer = require ('multer');

    
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
           callback(null, 'public/img/');
       },
       filename: function(req, file, callback)  {
           callback(null, file.originalname);
       }
    })

var upload = multer({ storage: storage });

route.post('/new',upload.single('attachement') ,recetteCtrlFront.addRecette);


//LOGIN
route.get('/login', (req,res) => {res.render('../views/login')});
route.post('/login', userCtrlFront.logUser);

//RIGISTER
route.get('/register',(req,res) => {
    res.render('../views/register')
});
route.get('/Cuisine-Si',(req,res) => {
    res.render('../views/CuisineSi')
});
route.post('/register', userCtrlFront.addUser);

//HOME
route.get('/',userCtrlFront.byToken,recetteCtrlFront.getRecetteAllS);
//admin
route.get('/admin',userCtrlFront.loggedIn, recetteCtrlFront.getRecetteAll);

//profil
route.get('/VosCoordonneesAdmin' ,userCtrlFront.loggedIn,userCtrlFront.getAdminByToken,)
route.get('/VosCoordonnees' ,userCtrlFront.byToken,userCtrlFront.getUserByToken,)
route.post('/VosCoordonnees',userCtrlFront.updateUser)
//logout
route.get('/logout', userCtrlFront.logOut);
//recette

route.post('/new', recetteCtrlFront.addRecette);
route.post('/deleteRecette/:id', recetteCtrlFront.deleteRecette);
route.get('/modifierRecette/:id',recetteCtrlFront.getRecetteByToken);
route.post('/putRecette/:id',recetteCtrlFront.updateRecette)
//like
route.post("/likeRecette/:id",likeCtrlFront.newLike)
route.post("/unlikeRecette/:id",likeCtrlFront.unLike)

//post
route.get('/recette/:id' ,userCtrlFront.byToken,recetteCtrlFront.getRecette)
route.get('/creerIng/:id' ,userCtrlFront.loggedIn,recetteCtrlFront.getIng)
route.get('/creerPrepa/:id' ,userCtrlFront.loggedIn,recetteCtrlFront.getPrepa)

//utilisateur
route.get('/utilisateur',userCtrlFront.loggedIn,userCtrlFront.getUserAll);
route.post('/deleteUser/:id',userCtrlFront.deleteUser);

//proposition
route.get('/Demandes',(req,res) => {
    if(localStorage.getItem('token'))
        res.render('../views/Demandes')
    else
        res.redirect('/login')
});

route.post('/Demandes', demandeCtrlFront.addDemande);
route.get('/DemandesAll',userCtrlFront.loggedIn,demandeCtrlFront.getDemandeAll)
route.get('/VosDemandes',userCtrlFront.byToken,demandeCtrlFront.getAlldemande)
route.get('/VosCommentaires',userCtrlFront.byToken,commentaireCtrlFront.getAllcommentaire)
route.get('/modifierDemande/:id',userCtrlFront.byToken,demandeCtrlFront.getdemandeByToken);
route.post('/putDemande/:id',demandeCtrlFront.updateDemande);
route.post('/deleteDemandebyUser/:id',demandeCtrlFront.deleteDemandebyUser);
route.post('/deleteDemandebyAdmin/:id',demandeCtrlFront.deleteDemandebyAdmin);

//Commentaire
route.post('/createComment/:id',commentaireCtrlFront.addComment);
route.get('/CommentaireAll/:id',userCtrlFront.loggedIn,commentaireCtrlFront.getAllComment)
route.post('/recette/:recetteeId/deleteComment/:commentId').delete(commentaireCtrlFront.deleteComment);

//ingredients
route.get('/AjouterIngredient',(req,res) => {
    res.render('../views/AjouterIngredient')
});
route.post('/addIngredient/:id', ingredientsCtrlFront.addIngredient);
//preparation
route.get('/AjouterPreparation',(req,res) => {
    res.render('../views/AjouterPreparation')
});
route.post('/addPreparation/:id', preparationsCtrlFront.addPreparation);


module.exports = route;

