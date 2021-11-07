var mm_scenarioGenerator = {
	version:1,
	name:"Scenario",
	category:"Murder Mystery",
	inputs:{
		numPlayers:{		type:"int", min:3, max:10	}
	},
	outputs:{
		data:{		type:"data",		dataType:mm_personDataDef	} /*fix type*/
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
		outputs.data.people = [];
		for(var i=0; i<inputs.numPlayers; ++i)
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
		for(var i=0; i<inputs.numPlayers; ++i)
		{
			for(var j=0; j<inputs.numPlayers; ++j)
			{
				if(i==j)
				{
					continue;
				}
				
				var relationshipInputs = {
					person1:outputs.data.people[i],
					person2:outputs.data.people[j],
				};
				
				var relationships = bg.RunGenerator(mm_relationshipGenerator, inputs.seed+i, relationshipInputs).outputs;
				
				if(j==0)
				{
					outputs.data.relationships.push(relationships.relationship1To2);
				}
			}
		}
	}
}
bg.RegisterGenerator(mm_scenarioGenerator);