
var mm_scenarioGenerator3 = {
	version:1,
	name:"Scenario V3",
	description:"Abstract People, Then Bio Relationships, Then people",
	category:["Murder Mystery"],
	inputs:[
		{ name:"numPlayers",					type:"int", min:3, max:20			},
		{ name:"numPeoplePlayerCanPick",		type:"int", min:1, max:8, default:4	}
	],
	outputs:{
		data:{		type:"data",		dataType:mm_personDataDef	} /*fix type*/
	},
	script:function(inputs, outputs)
	{
		outputs.data = inputs;

		//Calc how many abstract people to make
		var num_abstract_people = inputs.numPeoplePlayerCanPick * inputs.numPlayers;
		outputs.data.abstract_people = [];
		for(var i=0; i<num_abstract_people; ++i)
		{
			var abstract_person = 
			{
				//anything?
				id:i
			};
			outputs.data.abstract_people.push(abstract_person);
		}

		//Make some families
		{
			var graph_for_fam_gen = bg.CreateGraphFromList(outputs.data.abstract_people);

			var bio_inputs = {
				graph:graph_for_fam_gen,
				taken_nodes:[]
			};

			var bio_graph_seed = inputs.seed;
			outputs.bio_graph = bg.CreateGraphFromList(outputs.data.abstract_people);
			while(bio_inputs.taken_nodes.length < graph_for_fam_gen.nodes.length)
			{
				var data = bg.RunGenerator(mm_relationshipBioRelationshipsGenerator2, bio_graph_seed, bio_inputs).outputs;

				for(var i=0; i<data.bio_graph.nodes.length; ++i)
				{
					bio_inputs.taken_nodes.push( data.bio_graph.nodes[i].id);
				}

				for(var i=0; i<data.bio_graph.edges.length; ++i)
				{
					var edge = data.bio_graph.edges[i];
					bg.AddGraphEdgeById(
						outputs.bio_graph,
						 data.bio_graph.nodes[edge.a].id, 
						data.bio_graph.nodes[edge.b].id
					);
				}
				bio_graph_seed += 1;
			}
			outputs.bio_graph_uml = MM_DiGraphToUML(outputs.bio_graph);
		}
	}
}
bg.RegisterGenerator(mm_scenarioGenerator3);

var mm_scenarioGenerator2 = {
	version:1,
	name:"Scenario V2",
	description:"Relationships First, Then People",
	category:["Murder Mystery"],
	inputs:[
		{ name:"numPeople",		type:"int", min:3, max:20	}
	],
	outputs:{
		//data:{		type:"data",		dataType:mm_personDataDef	} /*fix type*/
	},
	script:function(inputs, outputs)
	{
		//outputs.data = inputs;
		outputs.data = {};
		outputs.data.people = [];
		for(var i=0; i<inputs.numPeople; ++i)
		{
			var person = bg.RunGenerator(mm_personGenerator, inputs.seed+i, {}).outputs.data;
			outputs.data.people.push(person);
		}
		outputs.data.victim = outputs.data.people[0];
		outputs.data.victimCauseOfDeath = bg.RunGenerator(mm_causeOfDeathGenerator, inputs.seed, {}).outputs.data;
		outputs.data.suspects = [];
		outputs.data.murderer = 1;//outputs.data.people[1];
		
		//Relationships
		var relationshipInputs = {
			people:outputs.data.people 
		};
		var relationships = bg.RunGenerator(mm_relationshipsGenerator, inputs.seed+1, relationshipInputs);
		outputs.data.relationships = relationships.outputs.relationships;
		outputs.data.relationshipsUML = relationships.outputs.uml;
		outputs.data.bio_graph = relationships.outputs.bio_graph;
		outputs.data.bio_graph_uml = MM_DiGraphToUML(outputs.data.bio_graph);
	}
}
bg.RegisterGenerator(mm_scenarioGenerator2);

var mm_scenarioGenerator = {
	version:1,
	name:"Scenario V1",
	description:"People First, Then Relationships",
	category:["Murder Mystery"],
	inputs:[
		{ name:"numPeople",		type:"int", min:3, max:20	}
	],
	outputs:{
		data:{		type:"data",		dataType:mm_personDataDef	} /*fix type*/
	},
	script:function(inputs, outputs)
	{
		outputs.data = inputs;
		outputs.data.people = [];
		for(var i=0; i<inputs.numPeople; ++i)
		{
			var person = bg.RunGenerator(mm_personGenerator, inputs.seed+i, {}).outputs.data;
			outputs.data.people.push(person);
		}
		outputs.data.victim = outputs.data.people[0];
		outputs.data.victimCauseOfDeath = bg.RunGenerator(mm_causeOfDeathGenerator, inputs.seed, {}).outputs.data;
		outputs.data.suspects = [];
		outputs.data.murderer = 1;//outputs.data.people[1];
		
		//Relationships
		outputs.data.relationships = [];
		for(var i=0; i<inputs.numPeople; ++i)
		{
			for(var j=0; j<inputs.numPeople; ++j)
			{
				if(i==j)
				{
					continue;
				}
				
				var relationshipInputs = {
					person1:outputs.data.people[i],
					person2:outputs.data.people[j],
				};
				
				var relationships = bg.RunGenerator(mm_relationshipGenerator1, inputs.seed+i, relationshipInputs).outputs;
				
				if(j==0)
				{
					outputs.data.relationships.push(relationships.relationship1To2);
				}
			}
		}
	}
}
bg.RegisterGenerator(mm_scenarioGenerator);