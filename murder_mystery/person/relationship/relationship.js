var mm_relationshipBioRelationshipsGenerator = {
	version:1,
	name:"Bio Relationships Graph",
	description:"Given a relationship graph, adds biological relationships.",
	category:["Murder Mystery","Person"],
	inputs:{
		//How close they are?
		graph:{ 				type:"data",		dataType:mm_relationshipGraphDataDef }
	},
	outputs:{
		//info on links
	},
	script:function(inputs, outputs)
	{
	}
}
bg.RegisterGenerator(mm_relationshipBioRelationshipsGenerator);

var mm_relationshipsGenerator = {
	version:1,
	name:"Relationships",
	description:"Given a list of people, makes a relationships graph.",
	category:["Murder Mystery","Person"],
	inputs:{
		//How close they are?
		people:{ 				type:"list",		min:2, max:20, 		elementType:{ type:"data", dataType:mm_personDataDef} }
	},
	outputs:{
		//relationship1To2:{		type:"data",		dataType:mm_relationshipDataDef	},
		//relationship2To1:{		type:"data",		dataType:mm_relationshipDataDef	}
	},
	script:function(inputs, outputs)
	{
		outputs.relationships = [];
		var r_seed = inputs.seed;

		var p2StartIdx = 1;
		for(var p1Idx=0; p1Idx<inputs.people.length; ++p1Idx)
		{
			var p1 = inputs.people[p1Idx];
			for(var p2Idx=p2StartIdx; p2Idx<inputs.people.length; ++p2Idx)
			{
				var p2 = inputs.people[p2Idx];
				if(p1 == p2)
				{
					continue;
				}

				//Call this generator to make the link, but it'll be random,
				//so we'll sort it out
				var link = bg.BuildDataFields(mm_relationshipLinkDataDef.fields, r_seed, null);
				link.aName = p1.name;
				link.bName = p2.name;

				outputs.relationships.push(link);
				++r_seed;
			}
			++p2StartIdx;
		}

		//Create Biological Relationships First
		
		//Graph UML
		outputs.uml = "@startuml\n";
		outputs.uml += "digraph G {\n";
		for(var i=0; i<inputs.people.length; ++i)
		{
			outputs.uml += `    "${inputs.people[i].name}" -> "A"\n`;
		}
		outputs.uml += "}\n";
		outputs.uml += "@enduml\n";
	}
}
bg.RegisterGenerator(mm_relationshipsGenerator);


var mm_relationshipGenerator1 = {
	version:1,
	name:"Relationship 1",
	description:"For 2 fully defined people",
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
bg.RegisterGenerator(mm_relationshipGenerator1);