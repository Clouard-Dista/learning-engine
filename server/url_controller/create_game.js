
var display = require(__dirname + "/../controller/defaultDisplay.js");
var images = require(__path.model + "/img");
var games = require(__path.model+"/game");
var users = require(__path.model + "/users");
var mamm = require(__path.model + "/multiple_action_model_manageur");

function checkPostValue(post, callback){
    var error = [];
    if (!post.question)
        error.push("Vous n'avez pas entré de question");
    if (!post.bonus)
        error.push("Vous n'avez pas selectionné d'image bonus");
    if (!post.malus)
        error.push("Vous n'avez pas selectionné d'image malus");
    if (!post.game)
        error.push("Vous n'avez pas selectionné de jeu");
    callback(error);
};


module.exports = {
    "get" : function(req, res){
        var that = this;
        if (userName = req.session.userName){
            mamm.getCreateGameInfos(userName, function(spec){
                display(req, res, "create_game", spec);
            });
        }
        else{
            res.redirect("/login");
        }
    },

    "post" : function(req, res){
        if (userName = req.session.userName){
            checkPostValue(req.body, function(err){
                if (err.length > 0) res.send(err);
                else{
                    games.addGame(req.body, function(gameData){
                        users.addGame(userName, gameData.name, function(){
                            res.redirect("/game/"+gameData.name);
                        });
                    });
                }
            })
        }
        else{
            res.redirect("/login");
        }
    }
};