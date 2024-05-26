export var generator = {
	version:1,
	name:"Graph",
	category:["Test"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"model",			type:"model"	}
		],
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		var boxA = bg.CreateBoxModel(outputs.model, 1, 1, 0.5);
		var boxAA = bg.CreateBoxModel(boxA, 0.5, 0.5, 0.5);
		boxAA.position.x = 1;
		boxAA.rotation.y = Math.PI / 4;
		
		var boxAAA = bg.CreateBoxModel(boxAA, 0.5, 0.5, 0.5);
		boxAAA.position.y = 1;
	}

};