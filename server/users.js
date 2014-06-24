
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


//Ici on recoie les inout du formulaire d'inscrption
	//si les deux mot de passe correspondet
		//on ajoute dans le json
			//On lance une seession du user

//ici on s'occupe des connections
	//si le user existe
		//si le mot de passe correspond avec celui du user
			//on lance une session du user

var fs = require('fs');

function findUser(name, callback){
	var file = __dirname+"/../bdd/userList.json";
    console.log("aaaaa");
	fs.readFile(file, 'utf8', function (err, data) {
        console.log("ejeje");
		if (err) {
			console.log('Error: ' + err);
			return;
		}
	 
		data = JSON.parse(data);
		console.dir(data, name);

		if (data[name]){
			return callback(data[name]);
		}
		else{
			return callback(false);
		}
	});		
}

function saveUser(name,password,callback) {
    var file = __dirname+"/../bdd/userList.json";
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
     
        data = JSON.parse(data);
        console.dir(data, name);

        if (data[name]){
            return callback(new Error("username allready exist"));
        } else {
            data[name] = password;
            fs.writeFile(file,JSON.stringify(data,null,4),function(){});

            var userFile = {
                "img" : [],
                "game" : []
            };

            pathUser = __dirname+"/../bdd/user/"+name+".json";
            fs.writeFile(pathUser, JSON.stringify(userFile, null, 4), callback);
        }
    }); 
}

var file = __dirname + '/test.json';


passport.use(new LocalStrategy(
  function(username, password, done) {
    findUser(username , function(mdp) {
        console.log("hey");
        console.log(mdp,password)
      if (!mdp) {
        return done(null, false, { message: 'Pseudo incorrect.' } );
      }
      if (mdp !== password) {
        return done(null, false, { message: 'Mot de passe inccorect.' });
      }
      console.log("----------------")
      return done(null, username);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(username, done) {
    done(null, username);
});

function registerUserRoute(app) {
    app.get('/login',function(req,res) {
        res.render("login.html");
    });
    app.post('/login',
        passport.authenticate('local', { 
            successRedirect: '/',
            failureRedirect: '/login'
        })
    );
    app.post('/signup',function(req,res) {
        saveUser(req.body.username,req.body.password,function(err) {
            if (err) {
                res.send("Error : " + err.message);
            } else {
                res.redirect("/login");
            }
        });
    });
}

module.exports.registerUserRoute = registerUserRoute;