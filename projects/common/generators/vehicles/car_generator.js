

var wheelStyling = {
	version:1,
	name:"WheelStyling",
	fields:[]
}


var wheelGenerator = {
	version:1,
	name:"Car Wheel Generator",
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"wheelDiameter",		type:"distance", units:"m", default:0.5}, //No min/max given, an explicit value is required. A default is provided
			{ name:"wheelStyling", 		type:"data_def",		paramName:"WheelStyling"		}
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
		outputs.model = {};
	}
}



var carStyling = {
	version:1,
	name:"CarStyling",
	fields:[
		{ name:"paintColour",	type:"colour"	}
	]
}

var generator = {
	version:1,
	name:"Car Generator",
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"carStyling", 		type:"data_def",		default_def:carStyling		},
			{ name:"numPassengers", 	type:"int",			min:1, max:8				},
			{ name:"width" }, //Is forcing an exact 'width' etc suitable? It may set a width narrower than the allowed num of passengers for example? What happens if a generator fails to meet its constraints?
			{ name:"height" },
			{ name:"length" }
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
	
		//Setup wheel styling and generate a wheel model
		var wheelStyling;		
		var wheel = wheelGenerator;
		
		//Instantiate the wheel models
		
		outputs.model = {};
		outputs.model.material = inputs.carStyling.paintColour;
	}
}

export { generator }