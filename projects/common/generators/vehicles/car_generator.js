

var wheelStyling = {
	version:1,
	name:"WheelStyling",
	id:"5c1036f3-e259-40aa-a3df-44846c6343f2",
	fields:[]
}
bg.RegisterProjectDataDef(bg.global_project, wheelStyling);


var wheelGenerator = {
	version:1,
	name:"Car Wheel Generator",
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"wheelDiameter",		type:"distance", units:"m", default:0.5}, //No min/max given, an explicit value is required. A default is provided
			{ name:"wheelStyling", 		type:"data_def",		default_def:"5c1036f3-e259-40aa-a3df-44846c6343f2"		}
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
	id:"2da75b6f-079c-42cc-a1ae-d89d209b3675",
	fields:[
		{ name:"paintColour",	type:"colour"	}
	]
}
bg.RegisterProjectDataDef(bg.global_project, carStyling);

var generator = {
	version:1,
	name:"Car Generator",
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"carStyling", 		type:"data_def",		default_def:"2da75b6f-079c-42cc-a1ae-d89d209b3675"		},
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