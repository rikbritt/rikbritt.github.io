
var universeDataDef = {
	version:1,
	name:"Universe",
	fields:{
		//list of intelligent species
	}
}


var universeGenerator = {
	version:1,
	name:"Universe",
	description:"WIP - possibly clashes with reality generator. Or this hosts physical info, like galaxies info etc",
	category:["Universe"],
	inputs:{
	},
	outputs:{
		//model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}
bg.RegisterGenerator(universeGenerator);