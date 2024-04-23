
var nameV1Generator = {
	version:1,
	name:"Name V1",
	description:"Builds a 'name' from random consonants and vowels",
	category:["Information"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"text"	}
		],
	},
	data:{
		vowels:["a","e","o","u","i"],
		//consonant pairs
		pairs:[
			"ch",
			"ck",
			"rl",
			"rk",
			"hn",
			"ld",
			"ll",
			"sh",
			"ve"
			//"qu"
		],
		//consonant minus 'q', 'x', 'z'
		consonants:[
			"b",
			"c",
			"d",
			"f",
			"g",
			"h",
			"j",
			"k",
			"l",
			"m",
			"n",
			"p",
			"r",
			"s",
			"t",
			"v",
			"w",
			"y"
		]
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
			var i = bg.GetRandomInt(0, data.consonants.length-1);
			return data.consonants[i];
		};
		
		var GetRandomVowel = function(data)
		{
			var i = bg.GetRandomInt(0, data.vowels.length-1);
			return data.vowels[i];
		};
		
		var GetRandomPair = function(data)
		{
			var i = bg.GetRandomInt(0, data.pairs.length-1);
			return data.pairs[i];
		}
		
		outputs.data += GetRandomConsonant(this.data);
		outputs.data += GetRandomVowel(this.data);
		outputs.data += GetRandomConsonant(this.data);
		outputs.data += GetRandomVowel(this.data);
		//outputs.data += GetRandomConsonant(this.data);
		outputs.data += GetRandomPair(this.data);
	}
}
bg.RegisterProjectGenerator(bg.global_project, nameV1Generator);