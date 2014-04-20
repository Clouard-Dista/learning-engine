define(['event_bus', 'modules/events_list'], function(eventBus) {

    var game = {};

    game.init = function(question) {
        $('body').append($('<h1>' + question + '</h1>'));
        var container = $('<div id="game_container"></div>');
        $('body').append(container);
        $('</br><button id="retour" class="button">Retour</button>').appendTo("body");
        $("#retour").click(function(e) {
        	location.reload();           
        });
        eventBus.emit('init', container);
    };

    return game;

});
