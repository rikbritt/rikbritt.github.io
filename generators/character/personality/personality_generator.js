
var personalityGenerator = {
	version:1,
	name:"Personality",
	category:["Character"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"personalityCoreWeight",		type:"data",		dataType:personalityCoreWeightDataDef	},
			{ name:"personalityWeightDataDef",	type:"data",		dataType:personalityWeightDataDef	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data", 						type:"data",		dataType:personalityDataDef	}
		],
	},
	script:function(inputs, outputs){
		
		//Generate all personality values using a weighted bell curve.
		
		outputs.data = {core:inputs.personalityCoreWeight, personality:inputs.personalityWeightDataDef};
	}
}
bg.RegisterGenerator(personalityGenerator);