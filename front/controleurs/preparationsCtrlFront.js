const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');


exports.addPreparation= async (req, res) => {
    console.log('----------body----',req.body)
    fetch(`http://localhost:3030/api/createPreparation/${req.params.id}`, {
        
        // Adding method type
        method: "POST",
        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        // Adding body or contents to sen
        body: JSON.stringify({
            duree: req.body.duree,
            etape1: req.body.etape1,      
            etape2: req.body.etape2,      
            etape3: req.body.etape3,           
      
        }),
    })

// Converting to JSON
.then(response => response.json())
// Displaying results to console
.then(json => { 
    //res.render('home',json)
    console.log(json)
  //res.redirect('/admin')
  res.render('AjouterPreparation',json)

})
}

