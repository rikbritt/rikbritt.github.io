var mm_workRelationshipGenerator = {
	version:1,
	name:"Work",
	category:["Murder Mystery","Person","Relationship"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"person1",				type:"data_def",		default_def:"af338b4d-8a4c-4fd8-ab8c-466a624f032e" },
			{ name:"person2",				type:"data_def",		default_def:"af338b4d-8a4c-4fd8-ab8c-466a624f032e" },
			{ name:"relationship1To2",		type:"data_def",		default_def:"64fb176f-ecb2-46d6-9633-b0eb57582c16"	},
			{ name:"relationship2To1",		type:"data_def",		default_def:"64fb176f-ecb2-46d6-9633-b0eb57582c16"	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"relationship1To2",		type:"data_def",		default_def:"64fb176f-ecb2-46d6-9633-b0eb57582c16"	},
			{ name:"relationship2To1",		type:"data_def",		default_def:"64fb176f-ecb2-46d6-9633-b0eb57582c16"	}
		],
	},
	script:function(inputs, outputs){
		outputs.relationship1To2 = inputs.relationship1To2;
		outputs.relationship2To1 = inputs.relationship2To1;
		
		outputs.relationship1To2.type = "Work";
		outputs.relationship2To1.type = "Work";
		
		
	}
}
bg.RegisterProjectGenerator(bg.global_project, mm_workRelationshipGenerator);