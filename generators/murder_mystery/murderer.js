
var mm_murdererGenerator = {
	version:1,
	name:"Murderer",
	category:["Murder Mystery"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"suspect",			type:"data",		dataType:mm_suspectDataDef	}
			
			//todo: character traits
		],
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
bg.RegisterGenerator(mm_murdererGenerator);