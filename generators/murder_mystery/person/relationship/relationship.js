var mm_relationshipBioRelationshipsGenerator2 = {
	version:1,
	name:"Bio Relationships Graph 2",
	description:"Given abstract people graph, adds biological relationships.",
	category:["Murder Mystery","Person"],
	inputs:[
		//How close they are?
		{ name:"graph", 				type:"data",		dataType:mm_GraphDataDef },
		{ name:"taken_nodes",			type:"list",		elementType:{ type:"string" }, default:[] } //which nodes are already used by another tree
	],
	outputs:{
		//info on links
	},
	script:function(inputs, outputs)
	{
		outputs.bio_graph = bg.CreateGraph();

		var max_generations = bg.GetRandomIntFromSeed(inputs.seed, 1, 5);
		var child_seed = inputs.seed + 100;
		//Make a list of nodes to pick from
		var free_nodes = inputs.graph.nodes.filter( 
			node => inputs.taken_nodes.find(
				n => n == node.id
			) == undefined 
		);

		//var male_free_nodes = inputs.graph.nodes.filter( 
		//	node => node.data.male && inputs.taken_nodes.find(
		//		n => n.id == node.id
		//	) == undefined 
		//);
		//var female_free_nodes = inputs.graph.nodes.filter( 
		//	node => node.data.male == false && inputs.taken_nodes.find(
		//		n => n.id == node.id
		//	) == undefined 
		//);

		var CreateGeneration = function(current_gen, father, mother)
		{
			father.data.male = true;
			mother.data.male = false;
			bg.AddGraphNode(outputs.bio_graph, father.id, father.data);
			bg.AddGraphNode(outputs.bio_graph, mother.id, mother.data);

			var num_children = bg.GetRandomIntFromSeed(child_seed++, 0, 5);
			for(var i=0; i<num_children; ++i)
			{
				if(free_nodes.length == 0)
				{
					return;
				}
				var child = bg.GetAndRemoveRandomArrayEntry(child_seed++, free_nodes);
				child.data.male = bg.GetRandomBool(child_seed++);

				var child_can_have_child = free_nodes.length >= 2; //partner and child
				if(child_can_have_child && current_gen + 1 < max_generations && bg.GetRandomBool(child_seed++))
				{
					if(child.data.male)
					{
						CreateGeneration(current_gen+1, child, bg.GetAndRemoveRandomArrayEntry(child_seed++, free_nodes));
					}
					else
					{
						CreateGeneration(current_gen+1, bg.GetAndRemoveRandomArrayEntry(child_seed++, free_nodes), child);
					}
				}
				else
				{
					bg.AddGraphNode(outputs.bio_graph, child.id, child.data);
				}

				bg.AddGraphEdgeById(outputs.bio_graph, father.id, child.id);
				bg.AddGraphEdgeById(outputs.bio_graph, mother.id, child.id);
			}
		};

		if( free_nodes.length >= 2)
		{
			CreateGeneration(0, 
				bg.GetAndRemoveRandomArrayEntry(child_seed++, free_nodes),
				bg.GetAndRemoveRandomArrayEntry(child_seed++, free_nodes)
			);
		}
	}
}
bg.RegisterGenerator(mm_relationshipBioRelationshipsGenerator2);

var mm_relationshipBioRelationshipsGenerator = {
	version:1,
	name:"Bio Relationships Graph",
	description:"Given a relationship graph, adds biological relationships.",
	category:["Murder Mystery","Person"],
	inputs:[
		//How close they are?
		{ name:"graph", 				type:"data",		dataType:mm_GraphDataDef },
		{ name:"taken_nodes",			type:"list",		elementType:{ type:"string" }, default:[] } //which nodes are already used by another tree
	],
	outputs:{
		//info on links
	},
	script:function(inputs, outputs)
	{
		outputs.bio_graph = bg.CreateGraph();

		var max_generations = bg.GetRandomIntFromSeed(inputs.seed, 1, 5);
		var child_seed = inputs.seed + 100;
		//Make a list of nodes to pick from
		var male_free_nodes = inputs.graph.nodes.filter( 
			node => node.data.male && inputs.taken_nodes.find(
				n => n.id == node.id
			) == undefined 
		);
		var female_free_nodes = inputs.graph.nodes.filter( 
			node => node.data.male == false && inputs.taken_nodes.find(
				n => n.id == node.id
			) == undefined 
		);

		var CreateGeneration = function(current_gen, father)
		{
			var can_have_child = male_free_nodes.length > 0 || female_free_nodes.length > 1;
			var wants_child = can_have_child && bg.GetRandomBool(child_seed++);
			if(wants_child)
			{
				var mother = bg.GetAndRemoveRandomArrayEntry(child_seed++, female_free_nodes);

				var child_is_boy = female_free_nodes.length == 0 || bg.GetRandomBool(child_seed++);
				var child = child_is_boy ?
								bg.GetAndRemoveRandomArrayEntry(child_seed++, male_free_nodes)
								: bg.GetAndRemoveRandomArrayEntry(child_seed++, female_free_nodes);

				if(current_gen == 0)
				{
					bg.AddGraphNode(outputs.bio_graph, father.id, father.data);
				}
				bg.AddGraphNode(outputs.bio_graph, mother.id, mother.data);
				bg.AddGraphNode(outputs.bio_graph, child.id, child.data);
				bg.AddGraphEdgeById(outputs.bio_graph, father.id, child.id);
				bg.AddGraphEdgeById(outputs.bio_graph, mother.id, child.id);

				if(child_is_boy && current_gen + 1 < max_generations)
				{
					CreateGeneration(current_gen+1, child);
				}
			}
		};

		if( male_free_nodes.length > 0)
		{
			CreateGeneration(0, bg.GetAndRemoveRandomArrayEntry(child_seed++, male_free_nodes));
		}
	}
}
bg.RegisterGenerator(mm_relationshipBioRelationshipsGenerator);

var mm_relationshipsGenerator = {
	version:1,
	name:"Relationships",
	description:"Given a list of people, makes a relationships graph.",
	category:["Murder Mystery","Person"],
	inputs:[
		//How close they are?
		{ name:"people", 				type:"list",		min:2, max:20, 		elementType:{ type:"data", dataType:mm_personDataDef} }
	],
	outputs:{
		//relationship1To2:{		type:"data",		dataType:mm_relationshipDataDef	},
		//relationship2To1:{		type:"data",		dataType:mm_relationshipDataDef	}
	},
	script:function(inputs, outputs)
	{
		//Build Relationships Graph
		{
			//Create Biological Relationships First
			outputs.relationshipGraph = bg.CreateGraph();
			for(var i=0; i<inputs.people.length; ++i)
			{
				bg.AddGraphNode(outputs.relationshipGraph, inputs.people[i].name, inputs.people[i]);
			}
			var p2StartIdx = 1;
			for(var p1Idx=0; p1Idx<inputs.people.length; ++p1Idx)
			{
				for(var p2Idx=p2StartIdx; p2Idx<inputs.people.length; ++p2Idx)
				{
					bg.AddGraphEdgeByIdx(outputs.relationshipGraph, p1Idx, p2Idx);
				}
				++p2StartIdx;
			}
		}

		//Build relationship links
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

		//Build bio relationships
		{
			var bio_inputs = {
				graph:outputs.relationshipGraph
			};
			var data = bg.RunGenerator(mm_relationshipBioRelationshipsGenerator, inputs.seed, bio_inputs).outputs;
			outputs.bio_graph = data.bio_graph;
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
	inputs:[
		{ name:"person1",	type:"data",		dataType:mm_personDataDef },
		{ name:"person2",	type:"data",		dataType:mm_personDataDef }
	],
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