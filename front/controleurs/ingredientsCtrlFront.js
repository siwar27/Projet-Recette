const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');


exports.addIngredient= async (req, res) => {
    console.log('----------body----',req.body)
    fetch(`http://localhost:3030/api/createIngredient/${req.params.id}`, {
        
        // Adding method type
        method: "POST",
        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        // Adding body or contents to sen
        body: JSON.stringify({
            viandes: req.body.viandes,
            epices: req.body.epices,      
            sucre: req.body.sucre,      
            legumes: req.body.legumes,      
            fruits: req.body.fruits,      
            liquides: req.body.liquides,      
      
        }),
    })

// Converting to JSON
.then(response => response.json())
// Displaying results to console
.then(json => { 
    console.log(json)
  res.render('AjouterIngredient',json)

})
}


exports.getIngredient = async (req,res) => {
    const posts= await fetch(`http://localhost:3030/api/getAllIngredient/${req.params.id}`,{

        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer
        },

    })
    const ing = await posts.json()
    if(ing){
        console.log(ing)
        res.render('post',ing)
    }
    
}

