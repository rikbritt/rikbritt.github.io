
var mm_murdererGenerator = {
	version:1,
	name:"Murderer",
	category:["Murder Mystery"],
	inputs:{
		suspect:{			type:"data",		dataType:mm_suspectDataDef	}
		
		//todo: character traits
	},
	outputs:{
		//model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
		
		
	}
}
bg.RegisterGenerator(mm_murdererGenerator);