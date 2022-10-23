const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');


exports.addRecette= async (req, res) => {
    console.log('----------body----',req.body)
    fetch("http://localhost:3030/api/createRecette", {
        
        // Adding method type
        method: "POST",
        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        // Adding body or contents to sen
        body: JSON.stringify({
            titre: req.body.titre,
            attachement: req.body.attachement,
            choix:req.body.choix,
           }),
    })

// Converting to JSON
.then(response => response.json())
// Displaying results to console
.then(json => { 
    //res.render('home',json)
   res.redirect('/admin')
})
}

exports.getRecetteAll = async (req,res) => {
    const posts= await fetch("http://localhost:3030/api/getAllRecette",{
        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer
        },

    })
    const userPost = await posts.json()
    if(userPost){
        console.log(userPost)
        res.render('admin', userPost)
    }
    
}

exports.getRecetteByToken = async (req, res, next) => {
    // console.log('---toto---', req.params.id)
    console.log('---zak---', req.params.id)
    // il faut recuperer le id depuis le token 
    const response = await fetch(`http://localhost:3030/api/recette/${ req.params.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')// Token à récupérer 
        }
    });
    const myJson = await response.json();
    res.render('modifierRecette', { success: myJson });
    return next();
}

exports.getRecette = async (req, res, next) => {
    // console.log('---toto---', req.params.id)
    console.log('---iciIdrecette---', req.params.id)
    // il faut recuperer le id depuis le token 
    const response = await fetch(`http://localhost:3030/api/recette/${ req.params.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')// Token à récupérer 
        }
    });
    const myJson = await response.json();
    console.log('----data---',myJson)
    res.render('post', { success: myJson });
    return next();
}

exports.getIng = async (req, res, next) => {
    // console.log('---toto---', req.params.id)
    console.log('---iciIdrecette---', req.params.id)
    // il faut recuperer le id depuis le token 
    const response = await fetch(`http://localhost:3030/api/recette/${ req.params.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')// Token à récupérer 
        }
    });
    const myJson = await response.json();
    console.log('----data---',myJson)
    res.render('AjouterIngredient', { success: myJson });
    return next();
}

exports.getPrepa = async (req, res, next) => {
    // console.log('---toto---', req.params.id)
    console.log('---iciIdrecette---', req.params.id)
    // il faut recuperer le id depuis le token 
    const response = await fetch(`http://localhost:3030/api/recette/${ req.params.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')// Token à récupérer 
        }
    });
    const myJson = await response.json();
    console.log('----data---',myJson)
    res.render('AjouterPreparation', { success: myJson });
    return next();
}

exports.deleteRecette = async (req, res) => {
    console.log('-----id--------',req.params.id)
    const response = await fetch(`http://localhost:3030/api/deleteRecette/${req.params.id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            },
            body: JSON.stringify ({
                'Authorization': localStorage.getItem('token')// Token à récupérer 
            })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
       res.redirect('/admin')
    })
}

exports.updateRecette = async (req, res, next) => {
    console.log('---bcdh---',req);
    const response = await fetch(`http://localhost:3030/api/putRecette/${req.params.id}`, {
       // Adding method type
    method: "PUT",

    // Adding body or contents to send
    body: JSON.stringify({
        titre: req.body.titre,
        choix:req.body.choix,
        attachement: req.body.attachement,
      
    }),

    // Adding headers to the request
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      Authorization: localStorage.getItem("token"), //Token à récupérer
    },
  })
    // Converting to JSON
    .then((response) => response.json())

    // Displaying results to console
    .then((json) => {
      res.redirect("/admin");
    });
};

exports.getRecetteAllS = async (req,res) => {
    const posts= await fetch("http://localhost:3030/api/getAllRecetteS",{
        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer
        },

    })
    const userres = await posts.json()
    if(userres){
        console.log('---------------------------------getAll',userres)
        res.render('Accueil', userres)
    }
    
}