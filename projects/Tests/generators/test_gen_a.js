export var generator = {
	version:1,
	name:"Test Generator A",
	category:["Test"],
    id:"5789e50e-b882-4cf6-8b1d-958784541060",
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"a",	type:"data_def",		default_def:"abc3b2ee-8934-4816-ab92-a546a7c36cbf", id:"add1d102-a471-4fab-ab9d-8d2a7eb99bb2"	}
        ],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"data_def",		default_def:"abc3b2ee-8934-4816-ab92-a546a7c36cbf", id:"4f97075a-51a2-45c9-9825-b8279cb09842"	}
		],
	},
	script:function(inputs, outputs)
    {
		outputs.data = inputs.a;
	}
};