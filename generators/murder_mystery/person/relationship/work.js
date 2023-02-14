var mm_workRelationshipGenerator = {
	version:1,
	name:"Work",
	category:["Murder Mystery","Person","Relationship"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"person1",				type:"data",		dataType:mm_personDataDef },
			{ name:"person2",				type:"data",		dataType:mm_personDataDef },
			{ name:"relationship1To2",		type:"data",		dataType:mm_relationshipDataDef	},
			{ name:"relationship2To1",		type:"data",		dataType:mm_relationshipDataDef	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"relationship1To2",		type:"data",		dataType:mm_relationshipDataDef	},
			{ name:"relationship2To1",		type:"data",		dataType:mm_relationshipDataDef	}
		],
	},
	script:function(inputs, outputs){
		outputs.relationship1To2 = inputs.relationship1To2;
		outputs.relationship2To1 = inputs.relationship2To1;
		
		outputs.relationship1To2.type = "Work";
		outputs.relationship2To1.type = "Work";
		
		
	}
}
bg.RegisterGenerator(mm_workRelationshipGenerator);