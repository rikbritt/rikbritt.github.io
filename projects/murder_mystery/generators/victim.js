
var mm_victimGenerator = {
	version:1,
	name:"Victim",
	category:["Murder Mystery"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"person",			type:"data_def",		default_def:"af338b4d-8a4c-4fd8-ab8c-466a624f032e"	},
			{ name:"causeOfDeath",		type:"text"}
			
			//todo: character traits
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			//{ name:"data",		type:"text"	}
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
		
		
	}
}
bg.RegisterProjectGenerator(bg.global_project, mm_victimGenerator);