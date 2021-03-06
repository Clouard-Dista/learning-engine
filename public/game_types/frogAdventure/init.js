define(['event_bus',
        'modules/collisionEngine',
        'modules/simpleWall',
        'modules/gravityEngine',
        'modules/cameraRender',
        'modules/canvas',
        'game_types/frogAdventure/loadLevel',
        'game_types/frogAdventure/hero',
        'game_types/frogAdventure/config',
        'game_types/frogAdventure/soundList',
        ],
function(eventBus, collisionEngine, wall, gravityEngine, cameraRender, Canvas, loadLevel, initHero, config, soundList){
    var init = function(game){

        game.frame = 0;
        game.finish = false,

        game.gravityEngine = gravityEngine;
        game.gravityEngine.acceleration = config.gravity.acceleration;
        game.gravityEngine.maxSpeed = config.gravity.maxSpeed;

        game.canvas = Canvas.create({"width" : 1280, "height" : 720});
        game.canvas.width = 1280;
        game.canvas.height = 720;
        game.canvas.context.fillStyle = "rgba(30,30,30,0.8)";

        game.cameraRender = cameraRender;
        game.cameraRender.init(game.canvas, true);
        game.cameraRender.backgroundParralax("/images/games_library/landscape/background.png", 20, 1, "botAlign");
        game.cameraRender.backgroundParralax("/images/games_library/landscape/cloud1.png", 14, 0.5, "unique");
        game.cameraRender.backgroundParralax("/images/games_library/landscape/cloud2.png", 16, 0.5, "unique");
        game.cameraRender.backgroundParralax("/images/games_library/landscape/cloud1.png", 8, 0.5, "unique");
        game.cameraRender.backgroundParralax("/images/games_library/landscape/cloud2.png", 4, 0.5, "unique");
        game.cameraRender.backgroundParralax("/images/games_library/landscape/cloud1.png", 10, 0.5, "unique");
        game.cameraRender.backgroundParralax("/images/games_library/landscape/cloud2.png", 12, 0.5, "unique");
        game.cameraRender.addSprite("hero", "/images/games_library/sprite_sheet/cube_platform.png", config.heroSprite);
        game.cameraRender.addSprite("collectible", "/images/games_library/sprite_sheet/star.png", config.collectibleSprite);
        game.cameraRender.addImage("fly", "/images/games_library/flat/fly.png");
        game.cameraRender.addImage("ending1", "/images/games_library/flat/portal_end0.png");
        game.cameraRender.addImage("ending0", "/images/games_library/flat/portal_end1.png");

        console.log(config.collectibleSprite);
            


        game.collisionEngine = collisionEngine;
        game.collisionEngine.addGroup("wall", false, false, false);
        game.collisionEngine.addGroup("bonus", ["hero"], false, false);
        game.collisionEngine.addGroup("hero", ["wall"], false, false);
        game.collisionEngine.addGroup("fly", ["hero"], false, false);
        game.collisionEngine.addGroup("ending", ["hero"], false, false);

        initHero(game);
        loadLevel(game);

        soundList.music.play();
        soundList.step.play();

        eventBus.on("ending", function(){
            game.finish = true;            
        })
}

    return init;

});     