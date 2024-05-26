export var generator = {
	version:1,
	name:"Name V2",
	description:"Does nothing, just generates an empty string right now",
	category:["Information"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[]
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"text"	}
		],
	},
	script:function(inputs, outputs){
		outputs.data = "";
	}
};
