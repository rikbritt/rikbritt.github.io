var stoneWallStoneGenerator = {
	version:1,
	name:"Stone Wall Stone Generator",
	category:["Buildings","Wall"],
	inputs:
	{
		name:"inputs",
		version:1,
		fields:[
			{ name:"width", 		type:"distance", 	units:"m", min:0.1, max:1	},
			{ name:"depth",			type:"distance", 	units:"m", min:0.1, max:1	},
			{ name:"heigh]", 		type:"distance", 	units:"m", min:0.1, max:1	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"model",			type:"model"	}
		],
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		var stone = bg.CreateBoxModel(outputs.model, inputs.width, inputs.height, inputs.depth);
		stone.colour = 0x808892;
		stone.colour += bg.GetRandomInt(-20,20);
	}
}
bg.RegisterGenerator(stoneWallStoneGenerator);

//Specifically for following a path?
var stoneWallV1Generator = {
	version:1,
	name:"Stone Wall Generator V1",
	category:["Buildings","Wall"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"path",	type:"path", 
				script:function() { 
					return bg.CreatePath([bg.CreateTranslation(-1, 0, 0), bg.CreateTranslation(0, 0, 0), bg.CreateTranslation(0, 0, 1)]); 
				}	
			}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"model",			type:"model"	}
		],
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		//Visualise the path
		bg.CreateLineModelBetweenPoints(outputs.model, inputs.path.points[0], inputs.path.points[1]);
		bg.CreateLineModelBetweenPoints(outputs.model, inputs.path.points[1], inputs.path.points[2]);
		
		var brickWidth = 0.1;
		var brickHeight = 0.05;
		var brickGap = 0.005;
		//Make some stones to use
		var stone = bg.RunGenerator(stoneWallStoneGenerator, inputs.seed + i, {width:brickWidth, height:brickHeight, depth:0.05}).outputs.model;
		
		//Place them
		//for path point to point
		//		copy random stone and place
		for(var y=0; y<4; ++y)
		{
			for(var i=0; i<8; ++i)
			{
				var stoneCopy = Object.assign({}, stone.children[0]);
				stoneCopy.position = inputs.path.points[0].clone();
				stoneCopy.position.x = (i * (brickWidth + brickGap)) + ((y%2) * (brickWidth/2));
				stoneCopy.position.y = y * (brickHeight + brickGap);
				outputs.model.children.push(stoneCopy);
			}
		}
	}
}
bg.RegisterGenerator(stoneWallV1Generator);


var stoneWallGenerator = {
	version:1,
	name:"Stone Wall Generator",
	category:["Buildings","Wall"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"path",		type:"path", script:function(){ return bg.CreatePath([bg.CreateTranslation(-1, 0, 0), bg.CreateTranslation(0, 0, 0), bg.CreateTranslation(0, 0, 1)/*, bg.CreateTranslation(1, 0, 2)*/]);  }	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"model",			type:"model"	}
		],
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		//Visualise the path
		//bg.CreateLineModelBetweenPoints(outputs.model, inputs.path.points[0], inputs.path.points[1]);
		//bg.CreateLineModelBetweenPoints(outputs.model, inputs.path.points[1], inputs.path.points[2]);
		
		var brickWidth = 0.1;
		var brickHeight = 0.05;
		var brickGap = 0.005;
		
		//Make some stones to use
		var numStones = 10;
		var stones = [];
		for(var i=0; i<numStones; ++i)
		{
			var generatedStone = bg.RunGenerator(stoneWallStoneGenerator, inputs.seed + i, {width:brickWidth, height:brickHeight, depth:0.05}).outputs.model;
			stones.push(generatedStone);
		}
		
		//Place them
		for(var h=0; h<4; ++h)
		{
			for(var p=0; p<inputs.path.points.length-1; ++p)
			{
				var lastPlacedT = 0.0;
				var fromPathPoint = inputs.path.points[p];
				var toPathPoint = inputs.path.points[p+1];
				
				var toNextPointVec = bg.GetVectorToPos(fromPathPoint, toPathPoint);
				var distToNextPoint = toNextPointVec.length();
				
				var lookAtRotation = bg.LookAtPos(fromPathPoint, toNextPointVec, bg.GetUpVector());
				lookAtRotation.y += Math.PI / 2;
				
				if((h%2) == 1)
				{
					lastPlacedT += ((brickWidth + brickGap)/2) / distToNextPoint;;
				}
				
				while(lastPlacedT < 1.0)
				{
					//Choose a brick to place (TODO)
					var stonePlacementSize = brickWidth + brickGap;
					var stonePlacementSizeT = stonePlacementSize / distToNextPoint;
					
					var placementPos = toNextPointVec.clone().multiplyScalar(lastPlacedT).add(fromPathPoint);
					placementPos.y += ((brickHeight + brickGap) * h) ;
					
					var stoneToUse = bg.GetRandomArrayEntry(h+p+lastPlacedT, stones);
					var stoneCopy = Object.assign({}, stoneToUse.children[0]);
					stoneCopy.position = placementPos;
					stoneCopy.rotation = lookAtRotation;
					//stoneCopy.rotation.y = lookAtRotation.y;
					//stoneCopy.rotation.z = lookAtRotation.z;
					outputs.model.children.push(stoneCopy);
					
					lastPlacedT += stonePlacementSizeT;
				}
			}
		}
		//for path point to point
		//		copy random stone and place
		//for(var y=0; y<4; ++y)
		//{
		//	for(var i=0; i<8; ++i)
		//	{	
		//		var stoneCopy = Object.assign({}, stone.children[0]);
		//		stoneCopy.position = inputs.path.points[0].clone();
		//		stoneCopy.position.x = (i * (brickWidth + brickGap)) + ((y%2) * (brickWidth/2));
		//		stoneCopy.position.y = y * (brickHeight + brickGap);
		//		outputs.model.children.push(stoneCopy);
		//	}
		//}
	}
}
bg.RegisterGenerator(stoneWallGenerator);