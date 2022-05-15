var mm_personDataDef = {
	version:1,
	name:"Person",
	fields:{
		age:{			type:"time",	units:"years", min:5, max:80 },
		male:{			type:"bool" },
		name:{			type:"text" },
		forename:{		type:"text" },
		surname:{		type:"text"	},
		maidenName:{	type:"text"	},
		gay:{			type:"bool" }
	}
}

var mm_personGenerator = {
	version:1,
	name:"Person",
	category:["Murder Mystery"],
	inputs:{
		person:{	type:"data",		dataType:mm_personDataDef	}
	},
	outputs:{
		data:{		type:"data",		dataType:mm_personDataDef	}
	},
	script:function(inputs, outputs){
		outputs.data = inputs.person;
		
		var name = bg.RunGenerator(mm_nameGenerator, inputs.seed, {male:inputs.person.male}).outputs.data;
		outputs.data.forename = bg.SetIfNotOverriden(inputs._overidden.person.forename, inputs.person.forename, name.forename);
		outputs.data.surname = bg.SetIfNotOverriden(inputs._overidden.person.surname, inputs.person.surname, name.surname);
		outputs.data.maidenName = bg.SetIfNotOverriden(inputs._overidden.person.maidenName, inputs.person.maidenName, name.maidenName);
		outputs.data.middleName = bg.SetIfNotOverriden(inputs._overidden.person.middleName, inputs.person.middleName, name.middleName);
		outputs.data.name = outputs.data.forename + " " + outputs.data.surname;
	}
}
bg.RegisterGenerator(mm_personGenerator);