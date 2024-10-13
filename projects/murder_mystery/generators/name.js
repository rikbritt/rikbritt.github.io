
var generator = {
	version:1,
	name:"Name",
	category:["Murder Mystery","Person"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"male",		type:"bool" },
			{ name:"male_names", type:"data_table", default_id:"6d8979e3-9fa3-4684-b92f-a15aee11038c", id:"df4325fa-6a46-4e57-975e-686e1c4b9006" },
			{ name:"female_names", type:"data_table", default_id:"eee4679b-06e1-4929-9ff6-bdc28fec2194", id:"c10e941e-9001-4411-a33e-7bfdc9fc2928" },
			{ name:"name", type:"data_def", default_def:"df22de14-e904-496f-8ff0-70f7e820c8f6", id:"93c7d5da-936f-4d75-8fea-1d599f233244" },
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"data_def",		default_def:"df22de14-e904-496f-8ff0-70f7e820c8f6"	}
		],
	},
	script:function(inputs, outputs)
	{		
		var namePool = null;
		if(inputs.male)
		{
			namePool = inputs.male_names.data;// mm_data_maleNames;
		}
		else
		{
			namePool = inputs.female_names.data;// mm_data_femaleNames;
		}

		// copy?
		outputs.data = inputs.name; //bg.BuildDataDefValues(inputs.name.fields, inputs.seed);
			
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