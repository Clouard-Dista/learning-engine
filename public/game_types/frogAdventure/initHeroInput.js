define(['event_bus', 'game_types/frogAdventure/config', 'game_types/frogAdventure/soundList'
], function(eventBus, config, soundList){
	var init = function(game){
	    eventBus.on("keys still pressed " + config.heroInput.right, function(){
	        game.hero.speedX += game.hero.acceleration;
	        game.hero.sens = "Left";
	    });

	    eventBus.on("keys still pressed " + config.heroInput.left, function(){
	        game.hero.speedX -= game.hero.acceleration;
	        game.hero.sens = "Right";
	    });

	    eventBus.on("keys still pressed " + config.heroInput.up, function(){
	        if (game.hero.canJump && game.hero.currentJumpFrame > 0){

	        	if (game.hero.currentJumpFrame === config.hero.nbFrameJump){
	        		game.hero.changeAnimation("jump");
	        		soundList.jump.play();
	        	}

	            game.hero.currentJumpFrame--;
	            game.hero.speedY -= game.hero.pxJump;
	            game.hero.y -= 0.1;
	        }
	        else{
	            game.hero.canJump = false;
	        }
	    });
	    eventBus.on("keys up " + config.heroInput.up, function(){
	        game.hero.canJump = false;
	    });

	    eventBus.on("keys still pressed " + config.heroInput.down, function(){
	        game.hero.wallGrip = false;
	        game.hero.noGravity = false;
	    });
	}
	return init;
});    	