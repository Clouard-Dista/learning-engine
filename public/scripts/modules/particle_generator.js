define(['event_bus', 'modules/frames'], function(eventBus) {

    return function() {

        var particles = [];
        var context = "";
        eventBus.on('newCanvas', function(canvas) {
            context = canvas.context;
        });

        function Particle(params) {
            this.x = params.x || 0 ;
            this.y = params.y || 0;
            this.size = (params.size || 5)*Math.random() ;
            this.styleParticles = params.style ;
            this.alpha = params.alpha;
            this.lifeTime = (params.lifeTime || 100)*Math.random();
            this.maxLifeTime = this.lifeTime;
            this.speed = (params.speed || 5)*Math.random();
            this.angle = (params.angle|| Math.PI * 2)*Math.random();
            this.color = params.color ||'red';

            this.move = function() {
                //mouvements aleatoirs en angle
                this.x += Math.cos(this.angle) * this.speed;
                this.y -= Math.sin(this.angle) * this.speed;
                if (this.lifeTime <= 0) {
                    particles.splice(particles.indexOf(this), 1);
                }
            };

            this.draw = function() {
                context.fillStyle = this.color;
                if(this.alpha){
                    context.globalAlpha = (this.lifeTime/this.maxLifeTime)+0.1;
                }
                if(this.styleParticles){
                    context.fillRect(this.x, this.y, this.size, this.size);
                }
                else{
                    context.beginPath();
                    context.arc(this.x, this.y,this.size,0,2*Math.PI);
                    context.fill();
                }
                if(this.alpha){
                    context.globalAlpha = 1;
                }
            };

            this.update = function update() {

                this.lifeTime--;
                this.draw();
                this.move();
            };
        }

        eventBus.on("new frame", function() {
            for (var i = 0; i < particles.length; i++) {
                if (particles[i] != undefined) {
                    particles[i].update();
                }
            }
        },null,0);

        eventBus.on("updates particles", function() {
            for (var i = 0; i < particles.length; i++) {
                if (particles[i] != undefined) {
                    particles[i].update();
                }
            }
        });

        eventBus.on('CreateParticles', function(params) {
        for (var i = 0; i < params.count; i++) {
                var star = new Particle(params);
                particles.push(star);
            }
        });
    };

});
