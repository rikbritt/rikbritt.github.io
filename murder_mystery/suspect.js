
var mm_suspectDataDef = {
	version:1,
	name:"Suspect",
	fields:{
		person:{			type:"data",		dataType:mm_personDataDef	}
	}
}

var mm_suspectGenerator = {
	version:1,
	name:"Suspect",
	category:"Murder Mystery",
	inputs:{
		suspect:{			type:"data",		dataType:mm_suspectDataDef	}
		
		//todo: character traits
	},
	outputs:{
		//model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
		outputs.data.career = bg.RunGenerator(mm_careerGenerator, inputs.seed, {}).outputs.data;
		
	}
}
bg.RegisterGenerator(mm_suspectGenerator);