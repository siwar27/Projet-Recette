const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');

exports.newLike = async (req, res) => {
  fetch(`http://localhost:3030/api/likeRecette/${req.params.id}`, {
      
      // Adding method type
      method: "POST",
      headers: {
          Authorization: localStorage.getItem('token'),// Token à récupérer 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
  })

// Converting to JSON
.then(response => response.json())
// Displaying results to console
.then(json => { 
  console.log("like front",json)
  res.redirect(`/recette/${req.params.id}`);
})
};

exports.unLike = async (req, res) => {
  await fetch(`http://localhost:3030/api/unlikeRecette/${ req.params.id}`,
    {
      // Adding method type
      method: "POST",

      // Adding headers to the request
      headers: {
        Authorization: localStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    // Converting to JSON
    .then(response => response.json())
    // Displaying results to console
    .then(json => { 
      console.log("like front",json)
      res.redirect(`/recette/${req.params.id}`);
    })
};