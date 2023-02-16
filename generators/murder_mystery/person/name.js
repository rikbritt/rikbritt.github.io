var mm_nameDataDef = {
	version:1,
	name:"Name",
	fields:[
		{ name:"forename",		type:"text" },
		{ name:"surname",		type:"text"	},
		{ name:"maidenName",	type:"text"	}
	]
}

var mm_nameGenerator = {
	version:1,
	name:"Name",
	category:["Murder Mystery","Person"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"male",		type:"bool" }
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"data",		dataType:mm_nameDataDef	}
		],
	},
	script:function(inputs, outputs)
	{		
		var namePool = null;
		if(inputs.male)
		{
			namePool = mm_data_maleNames;
		}
		else
		{
			namePool = mm_data_femaleNames;
		}

		outputs.data = bg.BuildDataDefValues(mm_nameDataDef.fields, inputs.seed);
			
		outputs.data.forename = bg.GetRandomArrayEntry(inputs.seed, namePool);
		outputs.data.middleName = bg.GetRandomArrayEntry(inputs.seed + 1, namePool);
		outputs.data.surname = bg.GetRandomArrayEntry(inputs.seed, mm_data_surnames);

		//Sexist but let's say only women have maiden names
		if(inputs.male)
		{
			outputs.data.maidenName = outputs.data.surname;
		}
		else
		{
			outputs.data.maidenName = bg.GetRandomArrayEntry(inputs.seed + 1, mm_data_surnames);
		}
	}
}
bg.RegisterGenerator(mm_nameGenerator);