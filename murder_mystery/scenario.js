var mm_scenarioGenerator2 = {
	version:1,
	name:"Scenario V2",
	description:"Relationships First, Then People",
	category:["Murder Mystery"],
	inputs:{
		numPeople:{		type:"int", min:3, max:20	}
	},
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
		var relationshipInputs = {
			people:outputs.data.people 
		};
		var relationships = bg.RunGenerator(mm_relationshipsGenerator, inputs.seed+1, relationshipInputs);
		outputs.data.relationships = relationships.outputs.relationships;
	}
}
bg.RegisterGenerator(mm_scenarioGenerator2);

var mm_scenarioGenerator = {
	version:1,
	name:"Scenario V1",
	description:"People First, Then Relationships",
	category:["Murder Mystery"],
	inputs:{
		numPeople:{		type:"int", min:3, max:20	}
	},
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