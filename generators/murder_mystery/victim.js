
var mm_victimGenerator = {
	version:1,
	name:"Victim",
	category:["Murder Mystery"],
	inputs:[
		{ name:"person",			type:"data",		dataType:mm_personDataDef	},
		{ name:"causeOfDeath",		type:"text"}
		
		//todo: character traits
	],
	outputs:{
		//model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
		
		
	}
}
bg.RegisterGenerator(mm_victimGenerator);