var mm_workRelationshipGenerator = {
	version:1,
	name:"Work",
	category:["Murder Mystery","Person","Relationship"],
	inputs:{
		person1:{				type:"data",		dataType:mm_personDataDef },
		person2:{				type:"data",		dataType:mm_personDataDef },
		relationship1To2:{		type:"data",		dataType:mm_relationshipDataDef	},
		relationship2To1:{		type:"data",		dataType:mm_relationshipDataDef	}
	},
	outputs:{
		relationship1To2:{		type:"data",		dataType:mm_relationshipDataDef	},
		relationship2To1:{		type:"data",		dataType:mm_relationshipDataDef	}
	},
	script:function(inputs, outputs){
		outputs.relationship1To2 = inputs.relationship1To2;
		outputs.relationship2To1 = inputs.relationship2To1;
		
		outputs.relationship1To2.type = "Work";
		outputs.relationship2To1.type = "Work";
		
		
	}
}
bg.RegisterGenerator(mm_workRelationshipGenerator);