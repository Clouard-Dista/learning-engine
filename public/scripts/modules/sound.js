define(['event_bus',
		'modules/gauge',
		'modules/canvas',
		'modules/frames',
		'modules/chrono',
],function(eventBus,Gauge,Canvas,frames){

    var canvas = Canvas.create({width:100,height:20});
	canvas.canvas.style.marginLeft="50%";
	canvas.canvas.style.left="235px";
	canvas.canvas.style.position="absolute";
	console.log(canvas);
    var gauge = new Gauge({
        context : canvas.context,
        size : {
            x : 100,
            y : 20
        },
		position:{
			x:0,
			y:0
		},
        valueMax : 100,
		color : "blue",
        displayMode : "horizontal"
    });

	eventBus.on("gauge sound",function(music)
	{
		gauge.currentValue=gauge.valueMax*music.volume;
	});
	eventBus.on('add sound',function(loop, src, guiNeeded)
	{
		var music = document.createElement("audio");
		music.setAttribute('src', src);
		music.setAttribute('preload', 'true');
		music.setAttribute('loop', loop);
		music.volume=0.5;
		music.play();
		eventBus.emit("gauge sound",music);
		if(guiNeeded)
			eventBus.emit('gui sound',music);
	});
	eventBus.on('createElement',function(params){
		var elemCreated=document.createElement(params.elem);
		elemCreated.style.cssText=params.stylesheet || "";
		elemCreated.id= params.id || Math.floor(Math.random()*1000)+" ";
		if(params.typeEvent)
			elemCreated.addEventListener(params.typeEvent,params.event);
		if(document.getElementById(params.parent))
			document.getElementById(params.parent).appendChild(elemCreated);
		else
			document.body.appendChild(elemCreated);
	});
	eventBus.on('gui sound', function(music)
	{
		var CancutSound=true;
		var cssPlusSound = "width:40px;height:35px;position:absolute;cursor:pointer;left:320px;margin-left:50%;top:55px;z-index:10;background-image:url('../images/+.png');";
		var cssLessSound = "width:40px;height:35px;position:absolute;cursor:pointer;left:210px;margin-left:50%;top:55px;z-index:10;background-image:url('../images/-.png');";
		var cssCutSound = "width:60px;height:60px;position:absolute;cursor:pointer;left:250px;margin-left:50%;top:40px;z-index:10;background-image:url('../images/On.png');";
	
		var clickPlus = function()
		{
			if(music.volume<1)
			{
				music.volume+=0.1;
			}
		}
		var clickLess = function()
		{
			if(music.volume>0)
			{
				music.volume-=0.1;
			}
		}
		var clickCut=function()
		{
			if(CancutSound==true)
			{
				music.volume=0;
				cutSound.style.backgroundImage="url('../images/Off.png')";
				CancutSound=false;
			}
			else
			{
				music.volume=0.5;	
				cutSound.style.backgroundImage="url('../images/On.png')";
				CancutSound=true;
			}
		}
		var ManageGauge = function()
		{
			eventBus.emit("gauge sound",music);
		}
		eventBus.emit("createElement", {elem:"div", id:"containGui", parent:"body",typeEvent:"click", event:ManageGauge});
		eventBus.emit("createElement", {elem:"div", stylesheet:cssLessSound, id:"lessSound", parent:"containGui", typeEvent:"click", event:clickLess});
		eventBus.emit("createElement", {elem:"div", stylesheet:cssPlusSound, id:"plusSound", parent:"containGui",typeEvent:"click", event:clickPlus});
		eventBus.emit("createElement", {elem:"div", stylesheet:cssCutSound, id:"cutSound", parent:"containGui", typeEvent:"click", event:clickCut});
		
	// Boutons du son +/-/cut

	
	});
});