const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');


exports.addUser = async (req, res) => {
    console.log('-------- toto -------', req.body); 
    const data = {
        nom : req.body.nom,
        prenom : req.body.prenom,
        email : req.body.email,
        password  : req.body.password,
    };
    fetch('http://localhost:3030/api/register', {
        // Adding method type
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // Adding body or contents to send
        body: JSON.stringify(data),
      
    })
    //Converting to JSON
    .then((res) => {  
        return res.json() 
    })
    // Displaying results to console
    .then(json => {
        console.log(json)
        if(!json.error)
            res.redirect('/login');
        else  
            res.render('register', json)
    })
}

exports.logUser = async (req, res, next) => {

    await fetch("http://localhost:3030/api/login", {
        // Adding method type
        method: "POST",
        // Adding headers to the request
        headers: {
            "Accept": 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        // Adding contents to send
        body: JSON.stringify({
            email: req.body.email,
            password: req.body.password,
        }),
    })
    // Converting to JSON
    .then((res) => {
        return res.json()
    })
    // Displaying results to console
    .then(json => {
        console.log('toto', json);
        localStorage.setItem('token', json.token);
        const tokenFromLocalStorage = localStorage.getItem('token')
        console.log(tokenFromLocalStorage);
        if (json.token && tokenFromLocalStorage)
            res.redirect('/')
        else
            res.render('login',json)
    })
    .catch((err) => {
        console.error(err);
    })
}

exports.getUserByTokenAdmin = async (req, res, next) => {

    const response = await fetch(`http://localhost:3030/api/user/${req.params.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')// Token à récupérer 
        }
    });
    const myJson = await response.json();
    console.log('-------- houna  ---  ', myJson);
    
    return myJson;
}

exports.getUserByToken = async (req, res, next) => {
    // console.log('---toto---', req.params.id)
    console.log('---zak---', req.params.id)
    // il faut recuperer le id depuis le token 
    // const idByToken = 

    const response = await fetch(`http://localhost:3030/api/user/${req.params.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')// Token à récupérer 
        }
    });
    const myJson = await response.json();
    console.log('--------toto  ---  ', myJson);
    res.render('VosCoordonnees', { user: myJson });
    
    return myJson;

}
exports.getAdminByToken = async (req, res, next) => {
    // console.log('---toto---', req.params.id)
    console.log('---zak---', req.params.id)
    // il faut recuperer le id depuis le token 
    // const idByToken = 

    const response = await fetch(`http://localhost:3030/api/user/${req.params.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')// Token à récupérer 
        }
    });
    const myJson = await response.json();
    console.log('--------toto  ---  ', myJson);
    res.render('VosCoordonneesAdmin', { user: myJson });
    
    return myJson;

}

exports.loggedIn = async (req, res, next) => {
    if(localStorage.getItem('token')) {
        const func = this.getUserByTokenAdmin(req,res,next)
        func.then(val => {
            console.log('hounaa ', val);
            if(val.isAdmin === true){
                next();
            }
            else{
            res.redirect('/')
            }
        })
    }
    else{
        res.redirect('/login')
    }
}

exports.byToken = async (req, res, next) => {
    if(localStorage.getItem('token')) {
        next();
    }
    else{
        res.redirect('/login')
    }     
}

exports.updateUser = async (req, res, next) => {
    console.log('---bcdh---',req);
    const response = await fetch('http://localhost:3030/api/updateUser', {
       // Adding method type
    method: "PUT",

    // Adding body or contents to send
    body: JSON.stringify({
      nom: req.body.nom,
      prenom: req.body.prenom,
      
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
      res.redirect('/VosCoordonnees');
    });
};

exports.getUserAll = async (req,res) => {
    const posts= await fetch("http://localhost:3030/api/allusers",{
        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer
        },

    })
    const userPost = await posts.json()
    if(userPost){
        console.log(userPost)
        res.render('utilisateur', {user:userPost})
    }   
}

exports.logOut  = async(req, res, next) => {
    localStorage.clear();
    res.redirect('/login')
}
exports.deleteUser = async (req, res) => {
    const response = await fetch(`http://localhost:3030/api/deleteUser/${req.params.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("token"), // Token à récupérer
        },
      }
    );
  
    const myJson = await response.json();
    console.log("delete-----user",myJson)
  
    res.redirect("/utilisateur");
};



