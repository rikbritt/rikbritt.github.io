var mm_relationshipGenerator = {
	version:1,
	name:"Relationship",
	category:["Murder Mystery","Person"],
	inputs:{
		person1:{	type:"data",		dataType:mm_personDataDef },
		person2:{	type:"data",		dataType:mm_personDataDef }
	},
	outputs:{
		relationship1To2:{		type:"data",		dataType:mm_relationshipDataDef	},
		relationship2To1:{		type:"data",		dataType:mm_relationshipDataDef	}
	},
	script:function(inputs, outputs){
		
		var relationshipType = "";
		
		var youngestAge = Math.min( inputs.person1.age, inputs.person2.age );
		var ageDiff = inputs.person1.age - inputs.person2.age;
		var ageDiffAbs = Math.abs(ageDiff);
		
		//todo: Check existing relationships
		
		
		outputs.inputs = inputs;
		//outputs.relationship1To2 = bg.BuildDataFields(mm_relationshipDataDef.fields, inputs.seed, {}, true);
		//outputs.relationship1To2.type = relationshipType;
		//outputs.relationship2To1 = bg.BuildDataFields(mm_relationshipDataDef.fields, inputs.seed + 1, {}, true);
		//outputs.relationship2To1.type = relationshipType;
		
		//Relationship Type:
		var relationshipGenerators = [
			mm_biologicalRelationshipGenerator,
			mm_workRelationshipGenerator
		];
		
		var relationshipGenerator = bg.GetRandomArrayEntry(inputs.seed, relationshipGenerators);
		var data = bg.RunGenerator(relationshipGenerator, inputs.seed, inputs).outputs;
		outputs.relationship1To2 = data.relationship1To2;
		outputs.relationship2To1 = data.relationship2To1;
		
		//if(bg.GetRandomBool(inputs.seed))
		//{
		//	//Biological
		//	if(ageDiffAbs > 16)
		//	{
		//		relationshipType = "parent";
		//	}
		//	else
		//	{
		//		relationshipType = "sibling";
		//	}
		//}
		//else if(youngestAge > 18)
		//{
		//	relationshipType = "work";
		//}
		//else
		//{
		//	relationshipType = "friends";
		//}
		
		//
		//outputs.data.ageDiff = ageDiffAbs
		
	}
}
bg.RegisterGenerator(mm_relationshipGenerator);