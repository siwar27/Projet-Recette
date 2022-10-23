const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');


exports.addDemande= async (req, res) => {
    console.log('----------body----',req.body)
    fetch("http://localhost:3030/api/createDemande", {
        
        // Adding method type
        method: "POST",
        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        // Adding body or contents to sen
        body: JSON.stringify({
            proposition: req.body.proposition,
            choix:req.body.choix       
        }),
    })

// Converting to JSON
.then(response => response.json())
// Displaying results to console
.then(json => { 
  res.render('Demandes',json)
})
}

exports.getDemandeAll = async (req,res) => {
    const posts= await fetch("http://localhost:3030/api/getAllDemande",{

        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer
        },

    })
    const userPost = await posts.json()
    if(userPost){
        console.log(userPost)
        res.render('DemandesAll',userPost)
    }
    
}

exports.getAlldemande = async (req,res) => {
    const posts= await fetch("http://localhost:3030/api/getdemande",{

        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer
        },

    })
    const userPost = await posts.json()
    if(userPost){
        console.log(userPost)
        res.render('mesDemandes',userPost);
    }
    
}

exports.getdemandeByToken = async (req, res, next) => {
  // console.log('---toto---', req.params.id)
  console.log('---zak---', req.params.id)
  // il faut recuperer le id depuis le token 
  const response = await fetch(`http://localhost:3030/api/getdemandebytoken/${ req.params.id}`, {
      headers: {
          'Authorization': localStorage.getItem('token')// Token à récupérer 
      }
  });
  const myJson = await response.json();
  res.render('modifierDemande', { success: myJson });
  return next();
}

exports.deleteDemandebyUser = async (req, res) => {
    const response = await fetch(`http://localhost:3030/api/deleteDemande/${req.params.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("token"), // Token à récupérer
        },
      }
    );
  
    const myJson = await response.json();
    console.log("delete-----demande",myJson)
  
    res.redirect("/VosDemandes");
};

exports.deleteDemandebyAdmin = async (req, res) => {
    const response = await fetch(`http://localhost:3030/api/deleteDemande/${req.params.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("token"), // Token à récupérer
        },
      }
    );
  
    const myJson = await response.json();
    console.log("delete-----demande",myJson)
  
    res.redirect("/DemandesAll");
};

exports.updateDemande = async (req, res, next) => {
    console.log('---bcdh---',req);
    const response = await fetch(`http://localhost:3030/api/putdemande/${req.params.id}`, {
       // Adding method type
    method: "PUT",

    // Adding body or contents to send
    body: JSON.stringify({
      choix:req.body.choix,
      proposition: req.body.proposition,
      
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
      res.redirect("/VosDemandes");
    });
};


