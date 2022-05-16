var mm_relationshipBioRelationshipsGenerator = {
	version:1,
	name:"Bio Relationships Graph",
	description:"Given a relationship graph, adds biological relationships.",
	category:["Murder Mystery","Person"],
	inputs:{
		//How close they are?
		graph:{ 				type:"data",		dataType:mm_GraphDataDef }
	},
	outputs:{
		//info on links
	},
	script:function(inputs, outputs)
	{
		outputs.data = {
			edges:[0]
		};
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
		//Build Relationships Graph
		{
			//Create Biological Relationships First
			outputs.relationshipGraph = {
				nodes:[],
				edges:[]
			};
			for(var i=0; i<inputs.people.length; ++i)
			{
				outputs.relationshipGraph.nodes.push(inputs.people[i].name);
			}
			var p2StartIdx = 1;
			for(var p1Idx=0; p1Idx<inputs.people.length; ++p1Idx)
			{
				for(var p2Idx=p2StartIdx; p2Idx<inputs.people.length; ++p2Idx)
				{
					outputs.relationshipGraph.edges.push({a:p1Idx, b:p2Idx});
				}
				++p2StartIdx;
			}
		}

		//Build relationships list
		{
			outputs.relationships = [];

			for(var e=0; e<outputs.relationshipGraph.edges.length; ++e)
			{
				var edge = outputs.relationshipGraph.edges[e];
				var p1 = inputs.people[edge.a];
				var p2 = inputs.people[edge.b];

				//Call this generator to make the link, but it'll be random,
				//so we'll sort it out
				var link = bg.BuildDataFields(mm_relationshipLinkDataDef.fields, inputs.seed + e, null);
				link.aName = p1.name;
				link.bName = p2.name;

				outputs.relationships.push(link);
			}
		}

		//Graph UML
		outputs.uml = MM_GraphToUML(outputs.relationshipGraph);
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