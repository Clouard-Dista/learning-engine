
var display = require(__dirname + "/../controller/defaultDisplay.js");
var games = require(__path.model+"/game");
var mamm = require(__path.model+"/multiple_action_model_manageur");
var users = require(__path.model+"/users");


module.exports = {
    "get" : function(req, res){
        var gameName = req.params.gameName;
        var userName = req.session.userName;

        if (userName){
            users.haveGame(userName, gameName, function(have){
                if (have){
                    mamm.getCreateGameInfos(userName, function(spec){
                        games.get(gameName, function(gameInfo){
                            spec.gameInfos = gameInfo;
                            display(req, res, "game_edit", spec);
                        });
                    });
                }
                else{
                    res.redirect("/my_game");
                }
            });
        }
        else{
            res.redirect("/login");
        }
    },

    "post" : function(req, res){
        var gameName = req.params.gameName;
        var userName = req.session.userName;
        if (userName){
            users.haveGame(userName, gameName, function(have){
                if (have){
                    games.modify(gameName, req.body, function(){
                        res.redirect("/game/"+gameName);
                    });
                }
                else{
                    res.redirect("/my_game");
                }
            });
        }
    }
};