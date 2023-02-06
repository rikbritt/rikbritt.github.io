
var woodPanelsGenerator = {
	version:1,
	name:"Wood Panels 2D",
	inputs:[
		{ name:"woodWorking",	type:"data",		dataType:woodWorkingDataDef	},
		{ name:"width", 		type:"distance", 	units:"m", min:0.5, max:10	}, //would be good to set some kind of ratio between width and height
		{ name:"height", 		type:"distance", 	units:"m", min:0.5, max:10	}
	],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.Create2DModel();
		
		var panelWidth = bg.GetRandomFloatFromSeed(inputs.seed, 0.5, 1);
		var numPanels = Math.ceil((inputs.width / panelWidth));
		for(var i=0; i<numPanels;++i)
		{
			var panel = bg.CreateBoxShape(outputs.model, "Panel " + i, "wood", panelWidth, inputs.height, ((i-(numPanels/2)) * panelWidth) + (panelWidth/2), 0);
		}		
	}
}
bg.RegisterGenerator(woodPanelsGenerator);

var woodFrameGenerator = {
	version:1,
	name:"Wood Frame 2D",
	inputs:[
		{ name:"woodWorking",	type:"data",		dataType:woodWorkingDataDef	},
		{ name:"width", 		type:"distance", 	units:"m", min:0.5, max:10	}, //would be good to set some kind of ratio between width and height
		{ name:"height", 		type:"distance", 	units:"m", min:0.5, max:10	}
	],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.Create2DModel();
		
		var halfHeight = inputs.height / 2;
		var plankWidth = inputs.woodWorking.plankWidth;
		
		//Top and bottom planks
		var topPlank = bg.CreateBoxShape(outputs.model, "Top Plank", "wood", inputs.width, plankWidth, 0, -halfHeight + (plankWidth / 2));
		var bottomPlank = bg.CreateBoxShape(outputs.model, "Bottom Plank", "wood", inputs.width, plankWidth, 0, halfHeight - (plankWidth/2));
		
		//Side planks
		var sidePlankHeight = inputs.height - (plankWidth * 2);
		var sidePlankLeft = bg.CreateBoxShape(outputs.model, "Left Side Plank", "wood", plankWidth, sidePlankHeight, -(inputs.width/2) + (plankWidth/2), 0);
		var sidePlankRight = bg.CreateBoxShape(outputs.model, "Right Side Plank", "wood", plankWidth, sidePlankHeight, (inputs.width/2) - (plankWidth/2), 0);
	}
}
bg.RegisterGenerator(woodFrameGenerator);

var woodSupportDiagonalGenerator = {
	version:1,
	name:"Diagonal Wood Support 2D",
	inputs:[
		{ name:"woodWorking", 	type:"data",		dataType:woodWorkingDataDef	},
		{ name:"width",  		type:"distance", 	units:"m", min:0.5, max:10	}, //would be good to set some kind of ratio between width and height
		{ name:"height",  		type:"distance", 	units:"m", min:0.5, max:10	}
	],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.Create2DModel();
		var supportShape = bg.CreateShape(outputs.model, "Support", "wood");
		var halfWidth = inputs.width/2;
		var halfHeight = inputs.height/2;
		
		//Diagonal support
		var w = 0.2;
		supportShape.points.push( CreatePoint(-halfWidth, -halfHeight + w) );
		supportShape.points.push( CreatePoint(-halfWidth, -halfHeight) );
		supportShape.points.push( CreatePoint(-halfWidth + w, -halfHeight) );
		
		supportShape.points.push( CreatePoint(halfWidth, halfHeight - w) );
		supportShape.points.push( CreatePoint(halfWidth, halfHeight) );
		supportShape.points.push( CreatePoint(halfWidth - w, halfHeight) );
	}
}
bg.RegisterGenerator(woodSupportDiagonalGenerator);

var woodSupportStraightGenerator = {
	version:1,
	name:"Straight Wood Support 2D",
	inputs:[
		{ name:"woodWorking", 	type:"data",		dataType:woodWorkingDataDef	},
		{ name:"width",  		type:"distance", 	units:"m", min:0.5, max:10	}, //would be good to set some kind of ratio between width and height
		{ name:"height",  		type:"distance", 	units:"m", min:0.5, max:10	}
	],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.Create2DModel();
		var supportShape = bg.CreateShape(outputs.model, "Support", "wood");
		
		//Straight support
		var plankWidth = inputs.woodWorking.plankWidth;
		bg.CreateBoxShape(outputs.model, "Support", "wood", inputs.width, plankWidth, 0, 0);
	}
}
bg.RegisterGenerator(woodSupportStraightGenerator);

var woodSupportGenerator = {
	version:1,
	name:"Wood Support 2D",
	inputs:[
		{ name:"woodWorking",	type:"data",		dataType:woodWorkingDataDef	},
		{ name:"width", 		type:"distance", 	units:"m", min:0.5, max:10	}, //would be good to set some kind of ratio between width and height
		{ name:"height", 		type:"distance", 	units:"m", min:0.5, max:10	}
	],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		
		var supportGenerators = [
			woodSupportDiagonalGenerator,
			woodSupportStraightGenerator
		];
		
		var plankWidth = inputs.woodWorking.plankWidth;
		var supportInputs = {
			woodWorking:inputs.woodWorking,
			width:inputs.width,
			height:inputs.height
		}
		
		var supportGenerator = bg.GetRandomArrayEntry(inputs.seed, supportGenerators);
		outputs.model = bg.RunGenerator(supportGenerator, inputs.seed, supportInputs).outputs.model;
	}
}
bg.RegisterGenerator(woodSupportGenerator);

var woodCrate2DGenerator = {
	version:1,
	name:"Wood Crate 2D",
	inputs:[
		{ name:"woodWorking",	type:"data",		dataType:woodWorkingDataDef	},
		{ name:"width", 		type:"distance", 	units:"m", min:0.5, max:10	}, //would be good to set some kind of ratio between width and height
		{ name:"height", 		type:"distance", 	units:"m", min:0.5, max:10	}
	],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.Create2DModel();
		var plankWidth = inputs.woodWorking.plankWidth;
		
		
		var panelInputs = {
			woodWorking:inputs.woodWorking,
			width:(inputs.width - (plankWidth*2)),
			height:(inputs.height - (plankWidth*2))
		}
		//Generate the frame model
		var panelModel = bg.RunGenerator(woodPanelsGenerator, inputs.seed, panelInputs).outputs.model;
		bg.CombineModels(outputs.model, panelModel);
		
		
		//Generate a frame. Set some constraints for the inputs
		var frameInputs = {
			woodWorking:inputs.woodWorking,
			width:inputs.width,
			height:inputs.height
		}
		//Generate the frame model
		var frameModel = bg.RunGenerator(woodFrameGenerator, inputs.seed, frameInputs).outputs.model;
		bg.CombineModels(outputs.model, frameModel);
		
		
		//Generate a support if we need one
		if(inputs.width > 3 && inputs.height > 3) {
			var supportInputs = {
				woodWorking:inputs.woodWorking,
				width:(inputs.width - (plankWidth*2)),
				height:(inputs.height - (plankWidth*2))
			}
			var supportModel = bg.RunGenerator(woodSupportGenerator, inputs.seed, supportInputs).outputs.model;
			bg.CombineModels(outputs.model, supportModel);
		}
	}
}
bg.RegisterGenerator(woodCrate2DGenerator);