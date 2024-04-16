
var mm_victimGenerator = {
	version:1,
	name:"Victim",
	category:["Murder Mystery"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"person",			type:"data",		dataType:mm_personDataDef	},
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