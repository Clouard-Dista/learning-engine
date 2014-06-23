define([], function(){
    "use strict";
    
    function createImageChooser(data) {
        var display = "";
        for(var i=data.length-1; i>=0; i--){
            display += '<option value="' + data[i].url + '" data-img-src="' + data[i].url + '">' + data[i].name + '</option>';
        }

        $("#bonusImg").html(display).imagepicker();
        $("#malusImg").html(display).imagepicker();
    }

    function injectCSS(url) {
        $("head").append("<link rel='stylesheet' type='text/css' href='" + url+ "'>");
    }

    //TODO: Refactor
    function replaceOptionTemplate(html) {
        $("#modelParams").empty();
        $("#modelParams").append(html);
    }


    function createGameSelection(infos) {
        console.log(infos)
        var $gamelist = $("#modelList");
        $gamelist.empty();
        for (var i = 0; i < infos.length; i++) {(function(i) {
            console.log($gamelist)
            var $game = $('<option value="'+infos[i].name+'">'+infos[i].name+'</option>');
            $gamelist.change(function() {
                if ($gamelist.val()===infos[i].name) {
                    showGameInfo(infos[i])
                }
            });
            $gamelist.append($game);
        })(i)}
        $gamelist.change();
    }

    function showGameInfo(game) {
        $("#modelDescription").html(game.gameDescription);
    }

    function createSessionsButtons(sessions) {
        var display = "";
        $.each(sessions,function(name,value) {
            display += '<li><a href="/?session=' + name + '" >' + value.game + ' : '+ value.question +'</a></li>';
        });
        $("#gameSessions ul").html(display);
    }

    return {
        createImageChooser: createImageChooser,
        injectCSS: injectCSS,
        createGameSelection: createGameSelection,
        createSessionsButtons: createSessionsButtons
    }
});
