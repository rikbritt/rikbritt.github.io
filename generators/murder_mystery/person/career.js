
var mm_careerGenerator = {
	version:1,
	name:"Career",
	category:["Murder Mystery","Person"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"success",	type:"norm",	min:0, max:1 }
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"text"	}
		],
	},
	script:function(inputs, outputs){
		
		var career = bg.GetRandomArrayEntry(inputs.seed, mm_data_careers);
		
		var careerLevel = null;
		if(career.levels != null)
		{
			careerLevel = career.levels[0];
			for(var i=0; i<career.levels.length; ++i)
			{
				if(inputs.success <= career.levels[i].success)
				{
					careerLevel = career.levels[i];
					break;
				}
			}
		}
		
		if(careerLevel == null)
		{
			careerLevel = {
				earn:0,
				fame:0
			};
		}

		outputs.data = {
			name:career.name,
			success:inputs.success,
			earn:careerLevel.earn,
			fame:careerLevel.fame,
			access:(career.access == null ? [] : career.access),
			skills:(career.skills == null ? [] : career.skills)
		};
		
	}
}
bg.RegisterGenerator(mm_careerGenerator);