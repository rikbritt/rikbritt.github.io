//var planetDataDef = {
//	version:1,
//	name:"Solar System",
//	fields:{
//		numPlanets:{			type:"int", min:0, max:10}
//	}
//};

var planetGenerator = {
	version:1,
	name:"Planet",
	category:"Universe",
	inputs:{
		//system:{		type:"data",		dataType:planetDataDef	}
	},
	outputs:{
		//data:{ type:"data", dataType:planetDataDef }
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}
bg.RegisterGenerator(planetGenerator);