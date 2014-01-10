/*

@name 
    Learning shooter
@endName

@description
    Move with Q and D, shoot with space.
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/window_size',
    'modules/score',
    'modules/frames',
    'modules/key_listener',
    'modules/render',
    'modules/tools',
    'modules/mouse',
    'modules/particle_generator',
    'modules/gauge',
    'modules/color',
    'modules/bonus_chooser',
    'modules/bonus_fader'
], function (eventBus, canvasCreate, windowSize, score, frames, keyListener, Render, tools, mouse, particles, Gauge) {

    return function(params)
    {
    	var canvas,
    	ctx = "";
    	var img = new Image();
    	img.src = "./images/GDP2.png";

    	var callBonuses = 0;
    	var paramsCanvas = {
				id: "learningShooter",
				width: 800,
				height: 800
			};

        var mousePos = {
            x : 0,
            y : 0,
            isClicking : {}
        }

    	var gameContainer = {
    		answer : {},
    		key : "",
    		arrayArrows : [],
            arrayAnswer : [],
            points : 0,
            colorParticles : 'RGB(255,0,0);',
            gauge : {},
            seconds : 0,
    		imageGood : new Image(),
    		imageBad :  new Image()
    	};

	    eventBus.on('init', function () {
            particles();
            eventBus.emit('need new bonus');
			canvas = canvasCreate.create(paramsCanvas);
			ctx = canvas.context;

		   ctx.fillStyle = "black";
		   ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);

            gameContainer.gauge = new Gauge({
                context : ctx,
                size : {
                    x : 100,
                    y : 200
                },
                position : {
                    x : 700,
                    y : 600
                },
                valueMax : 3000,
            });
    });

/***************************************************************************************
* MAIN LOOP
***************************************************************************************/
		eventBus.on("new frame", function(){
		  		ctx.fillStyle = "black";
		  		ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);
			   	//Rendering and moving the paddle
                colliderObject(); 

                gameContainer.gauge.currentValue--;

                if(gameContainer.gauge <= 0){
                    //EndGame
                    alert('Terminé !');
                }

                callBonuses++;
                if(callBonuses%180 === 0)
                {  
                    createAnswers();
                }

                for(var j = 0; j < gameContainer.arrayAnswer.length; j++)
                {
                    gameContainer.arrayAnswer[j].update();
                    if( gameContainer.arrayAnswer[j].y > 800)
                    {
                       gameContainer.arrayAnswer.splice(j, 1);
                    }

                }
			});


/***************************************************************************************
* CREATING THE PATTERN FOR THE ANSWERS
***************************************************************************************/
        function createAnswers()
        {
            var paramsAnswer = {
                    x : Math.round(Math.random()*700), 
                    y : Math.round(Math.random()*100),
                    width : 80,
                    height : 80,
                    speed : Math.round(Math.random()*3)+1,
                    answer : "good"
                }
                    gameContainer.imageGood.src = params.bonusUrl;
                    gameContainer.answer = new FallingAnswer(paramsAnswer);
                    eventBus.emit('init render', {object : gameContainer.answer,
                          sprite : {x : 0, y : 0, width : 96, height : 96, img : gameContainer.imageGood}
                 })
                var answerArray = gameContainer.arrayAnswer.push(gameContainer.answer);
                createBadAnswer();
        }

        function createBadAnswer()
        {
                var paramsBadAnswer = {
                    x : Math.round(Math.random()*700), 
                    y : Math.round(Math.random()*100),
                    width : 80,
                    height : 80,
                    speed : Math.round(Math.random()*3)+1,
                    answer : "bad"
                }

                 gameContainer.imageBad.src = params.malusUrl;
                    gameContainer.answer = new FallingAnswer(paramsBadAnswer);
                    eventBus.emit('init render', {object : gameContainer.answer,
                          sprite : {x : 0, y : 0, width : 96, height : 96, img : gameContainer.imageBad}
                 })

                 var answerArray = gameContainer.arrayAnswer.push(gameContainer.answer);
        }

/***************************************************************************************
* Bonus/malus falling from the "sky"
***************************************************************************************/

		var FallingAnswer = function FallingAnswer(params)
		{
			this.x = params.x;
	    	this.y = params.y;
	    	this.rotation = Math.random()*4;
	    	this.radius = params.height/2;
	    	this.width = this.radius;
	    	this.height = this.radius;
	    	this.speed = params.speed;
	    	this.image = gameContainer.imageGood;
            this.answer = params.answer;

	    	this.render = function render()
	    	{
	    	}

	    	this.move = function move()
	    	{
	    		this.y += this.speed;
	    	}

			this.update = function update()
			{
                this.move();
                eventBus.emit('render object', this, ctx);
			}
		}

/***************************************************************************************
* Bonus/malus falling from the "sky"
***************************************************************************************/ 
    function colliderObject()
    { 
        for(var i = 0; i < gameContainer.arrayAnswer.length; i++)
        {       
            if(gameContainer.arrayAnswer[i] != undefined){
                var distance = tools.vectors.getDistance(gameContainer.arrayAnswer[i], mousePos);
                 
                if(distance < 80 && mousePos.isClicking.left){
                    if(gameContainer.arrayAnswer[i].answer === "good")
                        gameContainer.points += 3;
                    else
                        gameContainer.points -= 12;
                    
                    gameContainer.arrayAnswer.splice(i, 1);
                    eventBus.emit ('number random color', 1, 255, 255, 0, false);
                    eventBus.on('random color', function(data){
                        gameContainer.colorParticles = data;
                     });
                    console.log(gameContainer.colorParticles);
                    eventBus.emit('CreateParticles', mousePos.x, mousePos.y, gameContainer.colorParticles, 200, 60);
                    eventBus.emit('add points', gameContainer.points);
                    gameContainer.points = 0;
                }
            }
        }
    }
     eventBus.on('mouse update', function(data)
        {
           mousePos.x = data.canvasX;
           mousePos.y = data.canvasY;
           mousePos.isClicking = data.isClicking;
        });

	   	eventBus.on('keys still pressed', function(data)
	   	{
	   	 	gameContainer.key = data;
	   	});

        var bonusPoints = params.bonusPoints || 1;
        var malusPoints = params.malusPoints || -3;
	   	eventBus.emit('init bonus', false, params.bonusUrl);
        eventBus.emit('init bonus', true,  params.malusUrl);

	};
});
