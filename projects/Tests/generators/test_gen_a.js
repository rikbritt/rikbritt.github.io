export var generator = {
	version:1,
	name:"Test Generator A",
	category:["Test"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"a",	type:"data_def",		default_def:"abc3b2ee-8934-4816-ab92-a546a7c36cbf"	}
        ],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"data_def",		default_def:"abc3b2ee-8934-4816-ab92-a546a7c36cbf"	}
		],
	},
	script:function(inputs, outputs)
    {
		outputs.data = inputs.a;
	}
};