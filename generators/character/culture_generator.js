
var cultureDataDef = {
	version:1,
	name:"Culture",
	id:"fec27e18-039c-4716-ba4f-1f13cde4bb14",
	fields:[
		//Cultural traits here
		{ name:"aggression",		type:"norm",	min:0, max:1 },
		{ name:"technology",		type:"norm",	min:0, max:1,
		 	description:"How advanced is their technology." },
		{ name:"language",			type:"norm",	min:0, max:1 },
		{ name:"religion",			type:"norm",	min:0, max:1,
			description:"Religion may be expanded into specific information about their religions.\n"
		 				+ "Perhaps this should be a general 'how religious are the general population' from 0 to 1." },
		{ name:"fascism",			type:"norm",	min:0, max:1 },
	]
}
bg.RegisterProjectDataDef(bg.global_project, cultureDataDef);

var cultureGenerator = {
	version:1,
	name:"Culture",
	category:["Character"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"culture",		type:"data_def",		default_def:"fec27e18-039c-4716-ba4f-1f13cde4bb14"	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"data_def",		default_def:"fec27e18-039c-4716-ba4f-1f13cde4bb14"	}
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs.culture;
	}
}

bg.RegisterProjectGenerator(bg.global_project, cultureGenerator);