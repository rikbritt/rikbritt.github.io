var mm_personGenerator = {
	version:2,
	name:"Person",
	id:"mm_person",
	category:["Murder Mystery"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"person",	type:"data_def",		default_def:"af338b4d-8a4c-4fd8-ab8c-466a624f032e"	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"data_def",		default_def:"af338b4d-8a4c-4fd8-ab8c-466a624f032e"	}
		],
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
bg.RegisterProjectGenerator(bg.global_project, mm_personGenerator);