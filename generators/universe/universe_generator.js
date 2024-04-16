
var universeDataDef = {
	version:1,
	name:"Universe",
	fields:[
		//list of intelligent species
	]
}


var universeGenerator = {
	version:1,
	name:"Universe",
	description:"WIP - possibly clashes with reality generator. Or this hosts physical info, like galaxies info etc",
	category:["Universe"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			//model:{			type:"model"	}
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}
bg.RegisterProjectGenerator(bg.global_project, universeGenerator);