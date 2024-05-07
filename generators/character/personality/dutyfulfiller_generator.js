
//ISTJ - The Duty Fulfiller
//Serious and quiet, interested in security and peaceful living.
//Extremely thorough, responsible, and dependable. 
//Well-developed powers of concentration. 
//Usually interested in supporting and promoting traditions and establishments. 
//Well-organized and hard working, they work steadily towards identified goals. 
//They can usually accomplish any task once they have set their mind to it.

var dutyFulfillerGenerator = {
	version:1,
	name:"Duty Fulfiller",
	category:["Character", "Personality"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"personalityCore",		type:"data_def",		default_def:"7ddb8611-0575-46c5-9511-665b570bd233"	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",					type:"data_def",		default_def:"dc5eae14-0ccf-414b-a9ea-6eaae1d13ac6"	}
		],
	},
	script:function(inputs, outputs){
		var personalityCoreWeighting = { }
		var personalityWeighting = {
			quiet:1,
			organised:1,
			serious:1,
			concentration:1,
			hardWorking:1,
			playful:-0.5
		};
		outputs.data = bg.BuildDataDefValues(personalityDataDef.fields, 0, {});
	}
}

bg.RegisterProjectGenerator(bg.global_project, dutyFulfillerGenerator);