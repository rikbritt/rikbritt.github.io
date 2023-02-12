var modularRoomDataDef = {
	version:1,
	name:"Modular Room",
	fields:[
		{ name:"tileWidth",	type:"distance",	units:"m",	min:2.0, max:8 },
		{ name:"height",	type:"distance",	units:"m",	min:1.0, max:3 }
	]
}

var modularRoomGenerator = {
	version:1,
	name:"Modular Room Generator",
	category:["Buildings", "Modular"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"modularDataDef",		type:"data",		dataType:modularRoomDataDef	}
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
		
		var halfTileWidth = inputs.modularDataDef.tileWidth * 0.5;
		var wallThickness = 0.1;
		var halfWallThick = wallThickness * 0.5;
		
		//Create the floor
		var floorWidth = inputs.modularDataDef.tileWidth - (wallThickness * 2);
		var floorModel = bg.RunGenerator(floorGenerator, inputs.seed, {width:floorWidth, depth:floorWidth}).outputs.model;
		outputs.model.children.push(floorModel);
				
		var frontWall = bg.CreateFlooredBoxModel(null, inputs.modularDataDef.tileWidth, inputs.modularDataDef.height, wallThickness, bg.CreateTranslation(0,0,halfTileWidth - halfWallThick));
		bg.CreateFlooredBoxModel(outputs.model, inputs.modularDataDef.tileWidth, inputs.modularDataDef.height, wallThickness, bg.CreateTranslation(0,0,-halfTileWidth + halfWallThick));
		
		bg.CreateFlooredBoxModel(outputs.model, wallThickness, inputs.modularDataDef.height, inputs.modularDataDef.tileWidth, bg.CreateTranslation(halfTileWidth - halfWallThick,0,0));
		bg.CreateFlooredBoxModel(outputs.model, wallThickness, inputs.modularDataDef.height, inputs.modularDataDef.tileWidth, bg.CreateTranslation(-halfTileWidth + halfWallThick,0,0));
		
		var doorCutter = bg.CreateFlooredBoxModel(null, 1, 1.5, 1, bg.CreateTranslation(0,0,halfTileWidth));
		frontWall = bg.SubtractModel(frontWall, doorCutter);
		outputs.model.children.push(frontWall);
		
		//Decoration
		var woodCrate = bg.RunGenerator(woodCrateGenerator, inputs.seed, {width:1, depth:1, height:1}).outputs.model.children[0]; //temp
		outputs.model.children.push(woodCrate);
		woodCrate.position.y = 0.5;
	}
}
bg.RegisterGenerator(modularRoomGenerator);