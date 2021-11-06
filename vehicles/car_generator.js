

var wheelStyling = {
	version:1,
	name:"WheelStyling",
	fields:{
	}
}


var wheelGenerator = {
	version:1,
	name:"Car Wheel Generator",
	inputs:{
		wheelDiameter:{	type:"distance", units:"m", default:0.5}, //No min/max given, an explicit value is required. A default is provided
		wheelStyling:{ type:"data",		paramName:"WheelStyling"		}
	},
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = {};
	}
}



var carStyling = {
	version:1,
	name:"CarStyling",
	fields:{
		paintColour:{	type:"colour"	}
	}
}

var carGenerator = {
	version:1,
	name:"Car Generator",
	inputs:{
		carStyling:{	type:"data",		dataType:carStyling		},
		numPassengers:{	type:"int",			min:1, max:8				},
		width:{}, //Is forcing an exact 'width' etc suitable? It may set a width narrower than the allowed num of passengers for example? What happens if a generator fails to meet its constraints?
		height:{},
		length:{}
	},
	outputs:{
		model:{			type:"model"	}
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
