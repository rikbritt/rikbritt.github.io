
var generator = {
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
			{ name:"data",		type:"data",		dataType:"df22de14-e904-496f-8ff0-70f7e820c8f6"	}
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

export { generator }