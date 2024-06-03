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
			{ name:"vowels", type:"data_table", default_id:"b82b66f7-fc33-49f5-968b-aea4abcb644b" },
			{ name:"consonants", type:"data_table", default_id:"704105dd-5221-49c8-ada3-25702b6fdc12" },
			{ name:"pairs", type:"data_table", default_id:"48614f99-1836-47c8-94c8-c890f773373f" }
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"text"	}
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