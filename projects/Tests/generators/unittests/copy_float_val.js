export var generator = {
	version:1,
	name:"Copy Float A",
    id:"5ea609b0-f5dd-4fb8-b753-a4665248ffc3",
	description:"For Unit tests.",
	category:["Test","Unit Tests"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"val",	type:"float",					min:0,		max:10}
        ],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"out",	type:"float",             min:0,  max:10	}
		],
	},
	script:function(inputs, outputs)
    {
       outputs.out = inputs.val;        
	}
};