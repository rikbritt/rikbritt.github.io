export var generator = {
	version:1,
	name:"Copy Int A",
	description:"For Unit tests.",
	category:["Test","Unit Tests"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"int_val",	type:"int",					min:0,		max:10}
        ],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"int_out",	type:"int",             min:0,  max:10	}
		],
	},
	script:function(inputs, outputs)
    {
       outputs.int_out = inputs.int_val;        
	}
};