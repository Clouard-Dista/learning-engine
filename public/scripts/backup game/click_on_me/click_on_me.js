/*

@name 
    Click on me
@endName

@description
    Simple game. Click on the bonus to win points, you loose points if you click on the malus.
@endDescription

*/

define([
    'event_bus',
    'modules/score',
    'modules/bonus_chooser',
    'modules/bonus_fader'
], function(eventBus) {

    return function(params) {
        var bonusPoints = parseInt($("#bonusPoints")[0].value, 10) || 1;
        var malusPoints = parseInt($("#malusPoints")[0].value, 10) || 3;

        for (var i = params.bonus.length - 1; i >= 0; i--) {
            eventBus.emit('init bonus', true, params.bonus[i]);
        };
        for (var i = params.malus.length - 1; i >= 0; i--) {
            eventBus.emit('init bonus', false, params.malus[i]);
        };

        eventBus.on('add bonus', function(good, url) {
            var htmlClass = good ? 'good' : 'bad';
            var bonus = $('<img class="' + htmlClass + '" src="' + url + '" />');

            bonus.css({
                left: Math.random() * 500 + 'px',
                top: Math.random() * 300 + 'px'
            });

            container.append(bonus);

            eventBus.emit('bonus added', bonus);

        });

        function gameLoop() {
            eventBus.emit('need new bonus');
            setTimeout(gameLoop, 200 + Math.random() * 300);
        }

        var container;
        eventBus.on('init', function(_container) {

            container = _container;

            gameLoop();

            $('body').on('mousedown', '.good, .bad', function(e) {
                e.preventDefault();
            });

            $('body').on('click', '.good, .bad', function() {
                $(this).remove();
                if ($(this).hasClass('good')) {
                    eventBus.emit('add points', bonusPoints);
                } else {
                    eventBus.emit('add points', -malusPoints);
                }
            });

        });
    };

});