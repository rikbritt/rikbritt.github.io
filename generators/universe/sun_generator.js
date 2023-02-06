//var planetDataDef = {
//	version:1,
//	name:"Solar System",
//	fields:{
//		numPlanets:{			type:"int", min:0, max:10}
//	}
//};

var sunGenerator = {
	version:1,
	name:"Sun",
	category:["Universe"],
	inputs:[
		//system:{		type:"data",		dataType:planetDataDef	}
	],
	outputs:[
		//{ name:"data",		type:"text"	}
	],
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}
bg.RegisterGenerator(sunGenerator);