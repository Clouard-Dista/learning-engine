define([], function(){
	createWallBox = function(box, level, wall){
	    //Creer le mur du bas
	    wall.create(box.startX,
	                box.startY + level.height,
	                level.width,
	                box.containerWallSize, 
	                "invertRainbow");

	    //Creer le mur de gauche haut
	    wall.create(box.startX - box.containerWallSize,
	                box.startY - box.containerWallSize,
	                box.containerWallSize, 
	                level.startY - (box.doorHeight/2) + box.containerWallSize,
	                "invertRainbow");

	    //Cree le mur de gauche bas
	    wall.create(box.startX - box.containerWallSize,
	                box.startY + (box.doorHeight/2) + level.startY,
	                box.containerWallSize, 
	                level.height - (level.startY + (box.doorHeight/2)) + box.containerWallSize,
	                "invertRainbow");

	    //Creer le mur de gauche haut
	    wall.create(box.startX + level.width,
	                box.startY - box.containerWallSize,
	                box.containerWallSize, 
	                level.endY - (box.doorHeight/2) + box.containerWallSize,
	                "invertRainbow");

	    //Cree le mur de droite bas
	    wall.create(box.startX + level.width,
	                box.startY + (box.doorHeight/2) + level.endY,
	                box.containerWallSize, 
	                level.height - (level.endY + (box.doorHeight/2)) + box.containerWallSize,
	                "invertRainbow");

	    //Cree le mur du haut
	    wall.create(box.startX,
	                box.startY - box.containerWallSize,
	                level.width, 
	                box.containerWallSize,
	                "invertRainbow");
	};
	return createWallBox;
});    	