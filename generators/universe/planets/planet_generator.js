var planetDataDef = {
	version:1,
	name:"Planet",
	fields:[
		
		//This is the outer diameter that includes atmosphere.
		{ name:"diameter",			type:"distance", 		units:"km", 		min:2400, 	max:60000},
		//https://en.wikipedia.org/wiki/Geologic_time_scale
		//Years is awkward here. Let's make this millions of year. Trillion years max for now.
		{ name:"age",				type:"time",			units:"my", 		min:0,		max:1000000},
		//composition (gas/rock)
		//List of layers?
		//orbit
		{ name:"averageOrbitDistance",	type:"distance", 	units:"km",		min:58000000,	max:5900000000}, //min, bit less than mercury. max about pluto dist.
		{ name:"timeToCompleteOrbit",	type:"time",		units:"years",	min:0.01,		max:1000 },
		//temp
		//exposure to space (meteors etc)
		//sea level
		{ name:"gravity",				type:"accel",	units:"m/s", 	min:0.8, 		max:1.2 },
		{ name:"approxMass",			type:"mass",	units:"earths", min:0.1, 		max:1000 }	//Thinking of using '1 earth' as a unit becuase the number is too big in kg! About 5.9736 x 10^24 kg
		//weather
	]
};

var planetGenerator = {
	version:1,
	name:"Planet",
	category:["Universe"],
	inputs:{
		planet:{		type:"data",		dataType:planetDataDef, autoGenerate:true	}
	},
	outputs:{
		data:{ 			type:"data", 		dataType:planetDataDef }
	},
	script:function(inputs, outputs){
		
		//If values are present in the input then just use them.
		//Otherwise generate values based on some rules.
		
		//Build up a planet params.
		//As we go check if a values was set on the input params. If so then use that override value, as daft as it may be.
		
		
		outputs.data = inputs.planet;
	}
}
bg.RegisterGenerator(planetGenerator);