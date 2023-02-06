//var galaxyDataDef = {
//	version:1,
//	name:"Solar System",
//	fields:{
//		numPlanets:{			type:"int", min:0, max:10}
//	}
//};

var galaxyGenerator = {
	version:1,
	name:"Galaxy",
	category:["Universe"],
	inputs:[
		//system:{		type:"data",		dataType:galaxyDataDef	}
	],
	outputs:[
		//data:{ type:"data", dataType:galaxyDataDef }
	],
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}
bg.RegisterGenerator(galaxyGenerator);