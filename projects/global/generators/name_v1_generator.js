export var generator = {
	version:1,
	name:"Name V1",
	id:"bae92d4e-3b90-4840-9ff7-1a6a88dad088",
	description:"Builds a 'name' from random consonants and vowels",
	category:["Information"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"vowels", type:"data_table", default_id:"b82b66f7-fc33-49f5-968b-aea4abcb644b", id:"175a26aa-15cc-43d6-979f-72546449e601" },
			{ name:"consonants", type:"data_table", default_id:"704105dd-5221-49c8-ada3-25702b6fdc12", id:"a5c8a2a2-b0b7-49d7-917c-162bea136ed5" },
			{ name:"pairs", type:"data_table", default_id:"48614f99-1836-47c8-94c8-c890f773373f", id:"b06c6c5f-035c-4cc1-aad8-94a8738ba11e" }
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"text", id:"143e9520-87b5-4029-bd44-1c7a98ce9c0a"	}
		],
	},
	script:function(inputs, outputs){
		
		//Observations:
		//viy - 'iy' is an awkward combo
		//diw - 'iw' is an awkward combo
		//huj - 'uj' is an awkward combo
		//bos - seems incomplete, should be boss? bose? bost etc.?
		//wod - seems incomplete
		//tuy - 'uy' is an awkward combo
		//voj - 'oj' is akward to end on?
		//waw - akward to say
		//jeh - seems incomplete
		//vuqu - 'qu' at end.. hmm
		//vuich - 'ui' bad double vowel combo?
		//touhn - doesn't seem right
		
		outputs.data = "";
		var GetRandomConsonant = function(data)
		{
			var i = bg.GetRandomInt(0, data.length-1);
			return data[i];
		};
		
		var GetRandomVowel = function(data)
		{
			var i = bg.GetRandomInt(0, data.length-1);
			return data[i];
		};
		
		var GetRandomPair = function(data)
		{
			var i = bg.GetRandomInt(0, data.length-1);
			return data[i];
		}
		
		outputs.data += GetRandomConsonant(inputs.consonants.data);
		outputs.data += GetRandomVowel(inputs.vowels.data);
		outputs.data += GetRandomConsonant(inputs.consonants.data);
		outputs.data += GetRandomVowel(inputs.vowels.data);
		//outputs.data += GetRandomConsonant(this.data);
		outputs.data += GetRandomPair(inputs.pairs.data);
	}
};