

// var wheelStyling = {
// 	version:1,
// 	name:"WheelStyling",
// 	fields:[]
// }


// var wheelGenerator = {
// 	version:1,
// 	name:"Car Wheel Generator",
// 	inputs:{
// 		name:"inputs",
// 		version:1,
// 		fields:[
// 			{ name:"wheelDiameter",	type:"distance", units:"m", default:0.5}, //No min/max given, an explicit value is required. A default is provided
// 			{ name:"wheelStyling", 	type:"data_def",		default_def:"WheelStyling"		}
// 		],
// 	},
// 	outputs:{
// 		name:"outputs",
// 		version:1,
// 		fields:[
// 			{ name:"model",			type:"model"	}
// 		],
// 	},
// 	script:function(inputs, outputs){
// 		outputs.model = {};
// 	}
// }



// var carStyling = {
// 	version:1,
// 	name:"CarStyling",
// 	fields:[
// 		{ name:"paintColour", type:"colour"	}
// 	]
// }

// var carGenerator = {
// 	version:1,
// 	name:"Car Generator",
// 	inputs:{
// 		name:"inputs",
// 		version:1,
// 		fields:[
// 			{ name:"carStyling",	type:"data_def",		default_def:carStyling		},
// 			{ name:"numPassengers",	type:"int",			min:1, max:8				},
// 			{ name:"width",}, //Is forcing an exact 'width' etc suitable? It may set a width narrower than the allowed num of passengers for example? What happens if a generator fails to meet its constraints?
// 			{ name:"height",},
// 			{ name:"length",}
// 		],
// 	},
// 	outputs:{
// 		name:"outputs",
// 		version:1,
// 		fields:[
// 			{ name:"model",			type:"model"	}
// 		],
// 	},
// 	script:function(inputs, outputs){
	
// 		//Setup wheel styling and generate a wheel model
// 		var wheelStyling;		
// 		var wheel = wheelGenerator;
		
// 		//Instantiate the wheel models
		
// 		outputs.model = {};
// 		outputs.model.material = inputs.carStyling.paintColour;
// 	}
// }

// var woodWorking = {
// 	version:1,
// 	name:"Wood Working",
// 	fields:[
// 		{ name:"standardLumberSizes",	type:"distance", units:"m", min:0.5, max:20	} //would be nice to make this tend toward whole units
// 	]
// }

// var woodCrateGenerator = {
// 	version:1,
// 	name:"Wood Crate",
// 	inputs:{
// 		name:"inputs",
// 		version:1,
// 		fields:[
// 			{ name:"woodWorking",	type:"data_def",		default_def:woodWorking		},
// 			{ name:"width", 		type:"distance", 	units:"m", min:0.5, max:20	}, //would be good to set some kind of ratio between width and height
// 			{ name:"height", 		type:"distance", 	units:"m", min:0.5, max:20	}
// 		],
// 	},
// 	outputs:{
// 		name:"outputs",
// 		version:1,
// 		fields:[
// 			{ name:"model",			type:"model"	}
// 		],
// 	},
// 	script:function(inputs, outputs){
// 		outputs.model = Create2DModel();
// 		var topPlank = CreateBoxShape(outputs.model, "Top Plank", inputs.width, 5, 0, -10);
// 		var bottomPlank = CreateBoxShape(outputs.model, "Bottom Plank", inputs.width, 5, 0, 20);
		
// 	}
// }