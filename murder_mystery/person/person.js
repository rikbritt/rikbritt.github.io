var mm_personDataDef = {
	version:1,
	name:"Person",
	fields:{
		age:{			type:"time",	units:"years", min:5, max:80 },
		male:{			type:"bool" },
		forename:{		type:"text" },
		surname:{		type:"text"	},
		maidenName:{	type:"text"	},
		gay:{			type:"bool" }
	}
}

var mm_personGenerator = {
	version:1,
	name:"Person",
	category:"Murder Mystery",
	inputs:{
		person:{		type:"data",		dataType:mm_personDataDef	}
	},
	outputs:{
		data:{		type:"data",		dataType:mm_personDataDef	}
	},
	script:function(inputs, outputs){
		outputs.data = inputs.person;
		
		outputs.data.name = bg.RunGenerator(mm_nameGenerator, inputs.seed, {male:inputs.person.male}).outputs.data;
			
	}
}
bg.RegisterGenerator(mm_personGenerator);