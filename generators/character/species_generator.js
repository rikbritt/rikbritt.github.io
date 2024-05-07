
var speciesDataDef = {
	version:1,
	name:"Species",
	id:"e328b056-9a1b-44e1-bb67-75e28746c83f",
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
bg.RegisterProjectDataDef(bg.global_project, speciesDataDef);

var speciesGenerator = {
	version:1,
	name:"Species",
	category:["Character"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"species",		type:"data_def",		default_def:"e328b056-9a1b-44e1-bb67-75e28746c83f"	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",			type:"data_def",		default_def:"e328b056-9a1b-44e1-bb67-75e28746c83f"	}
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs.species;
	}
}

bg.RegisterProjectGenerator(bg.global_project, speciesGenerator);