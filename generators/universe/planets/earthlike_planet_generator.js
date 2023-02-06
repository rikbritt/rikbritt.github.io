//var planetDataDef = {
//	version:1,
//	name:"Planet",
//	fields:{
//		
//		//This is the outer diameter that includes atmosphere.
//		diameter:{			type:"distance", units:"km", min:2400, max:60000},
//		
//		//composition (gas/rock)
//		//List of layers?
//		//orbit
//		//averageOrbitDistance:{	type:"distance", units:},
//		timeToCompleteOrbit:{	type:"time",	units:"years",	min:0.01,	max:1000 },
//		//temp
//		//exposure to space (meteors etc)
//		//sea level
//		gravity:{				type:"accel",	units:"m/s", min:0, max:9999 }
//		//weather
//	}
//};

var earthLikePlanetGenerator = {
	version:1,
	name:"Earthlike Planet",
	category:["Universe"],
	inputs:[
		{ name:"planet",		type:"data",		dataType:planetDataDef, autoGenerate:true	}
	],
	outputs:{
		data:{ 			type:"data", 		dataType:planetDataDef }
	},
	script:function(inputs, outputs){
		
		//If values are present in the input then just use them.
		//Otherwise generate values based on some rules.
		
		
		
		outputs.data = inputs.planet;
	}
}
bg.RegisterGenerator(earthLikePlanetGenerator);