
var speciesDataDef = {
	version:1,
	name:"Species",
	fields:[
		//Physiology:
		//height //Described as a curve? For now typical height of an adult and the variance
		{ name:"heightTypicalAdult",	type:"distance", units:"m", min:0.5, max:4 	},
		{ name:"heightVariance",		type:"distance", units:"m", min:0.5, max:3 	}, //Validate against heightTypicalAdult
		
		//age
		{ name:"ageStartAdulthood",		type:"time",	units:"years", min:5, max:20 },
		{ name:"naturalLifeExpectancy",	type:"time",	units:"years", min:5, max:200, mid:80 }, //Validate
		//muscle
		{ name:"intelligence",			type:"norm",	min:0, max:1 } //how to mix that with a per individual rating?
	
		//Don't put stuff here that isn't biological. Aggression/technology etc should go under culture.
	]
}

var speciesGenerator = {
	version:1,
	name:"Species",
	category:["Character"],
	inputs:{
		species:{		type:"data",		dataType:speciesDataDef	}
	},
	outputs:{
		data:{		type:"data",		dataType:speciesDataDef	}
	},
	script:function(inputs, outputs){
		outputs.data = inputs.species;
	}
}
bg.RegisterGenerator(speciesGenerator);