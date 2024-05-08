var mm_biologicalRelationshipGenerator = {
	version:1,
	name:"Biological",
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
		
		outputs.relationship1To2.fromName = inputs.person1.name;
		outputs.relationship1To2.toName = inputs.person2.name;
		outputs.relationship2To1.fromName = inputs.person2.name;
		outputs.relationship2To1.toName = inputs.person1.name;
		
		outputs.relationship1To2.type = "Biological";
		outputs.relationship1To2.attraction = 0;
		outputs.relationship2To1.type = "Biological";
		outputs.relationship2To1.attraction = 0;
		
		
		var ageDiff = inputs.person1.age - inputs.person2.age;
		var ageDiffAbs = Math.abs(ageDiff);
		var younger = inputs.person1.age > inputs.person2.age ? inputs.person2 : inputs.person1;
		var youngerRelationshipToElder = inputs.person1.age > inputs.person2.age ? outputs.relationship2To1 : outputs.relationship1To2;
		var elder = inputs.person1.age > inputs.person2.age ? inputs.person1 : inputs.person2;
		var elderRelationshipToYounger = inputs.person1.age > inputs.person2.age ? outputs.relationship1To2 : outputs.relationship2To1;
		
		if(ageDiffAbs > 16)
		{
			youngerRelationshipToElder.description = "child";
			elderRelationshipToYounger.description = "parent";
		}
		else
		{
			youngerRelationshipToElder.description = "sibling";
			elderRelationshipToYounger.description = "sibling";
		}
	}
}
bg.RegisterProjectGenerator(bg.global_project, mm_biologicalRelationshipGenerator);