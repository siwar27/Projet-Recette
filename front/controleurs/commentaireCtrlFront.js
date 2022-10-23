const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');


exports.addComment= async (req, res) => {
    console.log('----------body----',req.body)
    fetch(`http://localhost:3030/api/createComment/${req.params.id}`, {
        
        // Adding method type
        method: "POST",
        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        // Adding body or contents to sen
        body: JSON.stringify({
            comment: req.body.comment,      
        }),
    })

// Converting to JSON
.then(response => response.json())
// Displaying results to console
.then(json => { 
    console.log(json)
  res.redirect(`/recette/${req.params.id}`)
})
}


exports.getAllComment = async (req,res) => {
    const posts= await fetch(`http://localhost:3030/api/getAllComment/${req.params.id}`,{

        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer
        },

    })
    const comments = await posts.json()
    if(comments){
        console.log(comments)
        res.render('CommentairesAll',comments)
    }
    
}

exports.getAllcommentaire = async (req,res) => {
    const posts= await fetch("http://localhost:3030/api/getcommentaire",{

        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer
        },

    })
    const myJson = await posts.json();
    console.log('----data---',myJson)
    res.render('post', { success: myJson });
    return next();
    
}

exports.deleteComment = async (req, res) => {
    console.log('-----id--------',req.params.id)
    const response = await fetch(`http://localhost:3030/api/recette/${req.params.recetteeId}/deleteComment/${req.params.commentId}`, {
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
       res.redirect('/')
    })
}

