define(['event_bus'], function(eventBus) {

    var CameraRender = function(){
    }
    CameraRender.prototype.content = [];
    CameraRender.prototype.x = 0;
    CameraRender.prototype.y = 0
    CameraRender.prototype.images = {};
    CameraRender.prototype.sprites = {};
    CameraRender.prototype.init = function(canvas, quad, color){
        this.canvas = canvas;
        this.buffer = document.createElement("canvas");
        this.buffer.width = canvas.width;
        this.buffer.height = canvas.height;
        this.buffer.context = this.buffer.getContext("2d");
        this.backgroundColor = "blue";
        this.background = [];
        // this.buffer.style.display = "hidden";
        this.noColorElement = color || "rgba(0,0,0,1)";
        if (quad){
            this.quadTree = [];
            this.quadTreeWidth = canvas.width/2;
            this.quadTreeHeight = canvas.height/2;
            this.frame = 0;
        }
    }
    CameraRender.prototype.render = function(context){
        if (this.targetFixed){
            this.x = this.targetFixed.x + this.targetFixed.width/2 - this.canvas.width/2;
            this.y = this.targetFixed.y + this.targetFixed.height/2 - this.canvas.height/2;
            this.recalculQuadOf(this.targetFixed);
        }

        if (this.quadTree){
            this.frame++;
            var quadX = (this.x/this.quadTreeWidth)|0;
            var quadY = (this.y/this.quadTreeHeight)|0;

            var endX = ((this.x + this.canvas.width) / this.quadTreeWidth)|0;
            var endY = ((this.y + this.canvas.height) / this.quadTreeHeight)|0;
            var tabQueu = [];
            for (var i = quadX ; i <= endX ; i++){
                if (!this.quadTree[i])
                    continue;
                for (var j = quadY ; j <= endY ; j++){
                    if (!this.quadTree[i][j])
                        continue;
                    for (var k = 0, max = this.quadTree[i][j].length; k < max; k++) {
                        var target = this.quadTree[i][j][k];
                        if (target.cameraRender.frame != this.frame){
                            target.cameraRender.frame = this.frame;
                            var found = false;
                            for (var l = tabQueu.length-1 ; l>=0 ; l--){
                                if (tabQueu[l].cameraRender.zIndex < target.cameraRender.zIndex){
                                    tabQueu.splice(l+1,0,target);
                                    found = true;
                                    break;
                                }
                            }
                            if (!found)
                                tabQueu.unshift(target);
                        }
                    }
                }
            }
            this.canvas.context.fillStyle = this.backgroundColor;
            this.canvas.context.fillRect(0,0,this.canvas.width, this.canvas.height);
            if (this.background.length > 0){
                for (var i = 0 ; i < this.background.length ; i++){
                    
                    this.canvas.context.globalAlpha = this.background[i].remanance;
                    var x = -(this.x/this.background[i].diviseur % this.background[i].image.width);
                    this.drawBackground(x, this.background[i]);               
                    if (this.background[i].spec != "unique" && x + this.background[i].image.width < this.canvas.width)
                            this.drawBackground(x + this.background[i].image.width, this.background[i])
                    this.canvas.context.globalAlpha = 1;
                }
            }

            for (var i = 0, max = tabQueu.length ; i < max ; i++){
                if (tabQueu[i].sprite){
                    this.animSprite(tabQueu[i]);
                }
                else if (tabQueu[i].image){
                    this.canvas.context.drawImage(this.images[tabQueu[i].image], tabQueu[i].x-this.x, tabQueu[i].y-this.y, tabQueu[i].width, tabQueu[i].height);
                }
                else{
                    this.canvas.context.fillStyle = tabQueu[i].color || this.noColorElement;
                    this.canvas.context.fillRect(tabQueu[i].x-this.x, tabQueu[i].y-this.y, tabQueu[i].width, tabQueu[i].height);    
                    if (tabQueu[i].strokeColor){
                        this.canvas.context.strokeStyle = tabQueu[i].strokeColor;
                        this.canvas.context.lineWidth = tabQueu[i].lineWidth || 5;
                        this.canvas.context.strokeRect(tabQueu[i].x-this.x, tabQueu[i].y-this.y, tabQueu[i].width, tabQueu[i].height);    
                    }
                }
            }
            // var imageData = this.buffer.context.getImageData(0,0,this.buffer.width, this.buffer.height);
            // this.canvas.context.putImageData(imageData, 0, 0);
        }
        else{
            for (var i = 0, max = this.content.length; i < max; i++) {
                var target = this.content[i];
                this.canvas.context.fillStyle = target.color || this.noColorElement;
                if (target.sprite){
                    this.animSprite(this.content[i]);
                }
                else if (target.radius){
                    this.content[key].canvas.context.beginPath();
                    this.content[key].canvas.context.arc(target.x+target.radius, target.pos.y+target.radius, target.radius, 0, 2 * Math.PI);
                    this.content[key].canvas.context.fill();
                }
                else{
                    this.canvas.context.fillRect(target.x-this.x, target.y-this.y, target.width, target.height);    
                }
            };
        }
    }
    CameraRender.prototype.add = function(element, zIndex){
        this.content.push(element);
        if (!element.cameraRender)
            element.cameraRender = {};
        element.cameraRender.zIndex = zIndex || 0;
        if (this.quadTree){
            var quadX = (element.x / this.quadTreeWidth)|0;
            var quadY = (element.y / this.quadTreeHeight)|0;

            var endX = ((element.x + element.width) / this.quadTreeWidth)|0;
            var endY = ((element.y + element.height) / this.quadTreeHeight)|0;

            for (var i = quadX ; i <= endX ; i++){
                if (!this.quadTree[i])
                    this.quadTree[i] = [];      
                for (var j = quadY ; j <= endY ; j++){
                    if (!this.quadTree[i][j])
                        this.quadTree[i][j] = [];   
                    this.quadTree[i][j].push(element);
                }
            }
            element.cameraRender.frame = this.frame;
            element.cameraRender.startX = quadX;
            element.cameraRender.endX = endX;
            element.cameraRender.startY = quadY;
            element.cameraRender.endY = endY;

        }
    }
    CameraRender.prototype.fixedCameraOn = function(element){
        this.targetFixed = element;
    }
    CameraRender.prototype.showQuadTree = function(){
        this.canvas.context.lineWidth="2";
        this.canvas.context.strokeStyle="red";
        this.canvas.context.font = "20pt Calibri,Geneva,Arial";

        for (var i = this.quadTree.length - 1; i >= 0; i--) {
            if (!this.quadTree[i])
                continue;
            for (var j = this.quadTree[i].length - 1; j >= 0; j--) {
                var realX = i*this.quadTreeWidth-this.x;
                var realY = j*this.quadTreeHeight-this.y;
                this.canvas.context.beginPath();
                this.canvas.context.rect(realX, realY, this.quadTreeWidth, this.quadTreeHeight)
                this.canvas.context.stroke();
                this.canvas.context.fillText(i + " : " + j, realX + 10, realY + 30);
            };
        };
    }
    CameraRender.prototype.recalculQuadOf = function(element){
        this.removeElement(element);
        this.add(element, element.cameraRender.zIndex);
    }
    CameraRender.prototype.removeElement = function(element){
        this.content.splice(this.content.indexOf(element), 1);
        if (this.quadTree){
            for (var i = element.cameraRender.startX ; i <= element.cameraRender.endX ; i++){
                for (var j = element.cameraRender.startY ; j <= element.cameraRender.endY ; j++){
                    this.quadTree[i][j].splice(this.quadTree[i][j].indexOf(element), 1);
                }
            }
        }
    }
    CameraRender.prototype.addImage = function(name, src){
        if (!this.images[name]){
            this.images[name] = new Image();
            this.images[name].src = src;
        }
        else
            console.warn("cameraRender.addImage : Envoie d'une image avec un nom deja utilise. ("+name+")");
    }
    CameraRender.prototype.addSprite = function(name, src, config){
        this.addImage(name, src);
        if (this.sprites[name])
            console.warn("cameraRender.addSprite : Envoie d'un sprite avec un nom deja utilise. ("+name+")");
        else{
            this.sprites[name] = {};
            for (var key in config)
                this.sprites[name][key] = config[key];
        }
    }
    CameraRender.prototype.putSpriteOn = function(element, name, anim){
        if (!this.sprites[name])
            console.log("cameraRender.putSprite : tentative d'appliquer un sprite non stocke ("+name+"). Utilise addSprite(name:string, src:string, config:object)");
        else{
            element.sprite = name;
            element.currentAnim = anim || "idle";
            element.currentIndex = 0;
            element.spriteFrame = 0;
            element.spriteNbLoop = 0;
            element.spriteAnchorX = element.width/2 || 0;
            element.spriteAnchorY = element.height/2 || 0;
            var that = this;
            element.changeAnimation = function(name){
                if (that.sprites[this.sprite][name]){
                    this.currentIndex = 0;
                    this.currentAnim = name;
                    this.width=that.sprites[this.sprite][name].width;
                    this.height=that.sprites[this.sprite][name].height;
                    this.spriteNbLoop = 0;
                }
                else
                    console.warn("L'animation '"+name+"' n'existe pas sur cet element");
            }
        }
    }
    CameraRender.prototype.animSprite = function(element){
        element.spriteFrame++;
        var target = this.sprites[element.sprite][element.currentAnim];
        if (element.spriteFrame >= target.fps){
            element.currentIndex++;
            element.spriteFrame = 0;
            if (element.currentIndex >= target.nbAnim){
                element.spriteNbLoop++;
                element.currentIndex = 0;
                if (element.spriteNbLoop == target.loop){
                    element.spriteNbLoop = 0;
                    if (target.loopCallback){
                        target.loopCallback(element);
                    }
                    else{
                        element.currentAnim = "idle";
                        element.spriteFrame = 0;
                        element.width = target.width;
                        element.height = target.height;
                    }
                }
            }
        }
        var indexOfAnim = target.offsetY;
        var offsetX = target.offsetX || 0;
        this.canvas.context.save();
        this.canvas.context.translate(element.x-this.x+element.width/2, element.y-this.y+element.height/2);
        if (target.scaleX && target.scaleY)
            this.canvas.context.scale(target.scaleX, target.scaleY);
        if (target.rotation)
            this.canvas.context.rotate(target.rotation);
        this.canvas.context.drawImage(this.images[element.sprite], element.width * element.currentIndex + offsetX, indexOfAnim, element.width, element.height, 
                                    -element.width/2, -element.height/2, element.width, element.height);

        this.canvas.context.restore();
    }
    CameraRender.prototype.backgroundParralax = function(src, diviseur, remanance, spec){
        var background = {};
        background.image = new Image();
        background.image.src = src;
        background.diviseur = diviseur || 10;
        background.remanance = remanance || 1;
        background.spec = spec || "basic";
        this.background.push(background);
    }
    CameraRender.prototype.drawBackground = function(x, background){
        if (background.spec == "full")
            this.canvas.context.drawImage(background.image, x, 0, background.image.width, this.canvas.height);
        else if (background.spec == "botAlign"){
            y = this.canvas.height - background.image.height;
            this.canvas.context.drawImage(background.image, x, y, background.image.width, this.canvas.height);
        }
        else if (background.spec == "unique"){
            var y = (this.canvas.height + background.image.height) - (this.y / background.diviseur) % (this.canvas.height + background.image.height);
            var x2 = (this.canvas.width + background.image.width) - (this.x / background.diviseur) % (this.canvas.width + background.image.width);
            y -= background.image.height;
            x2 -= background.image.width
            this.canvas.context.drawImage(background.image, x2, y, background.image.width, background.image.height);
        }
        else
            this.canvas.context.drawImage(background.image, x, 0, background.image.width, background.image.height);
    }

    var cameraRender = new CameraRender();
    return cameraRender;
});