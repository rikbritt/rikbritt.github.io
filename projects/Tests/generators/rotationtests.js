export var generator = {
	version:1,
	name:"Rotation",
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
		
		var num = 20;
		for(var i=0; i<num; ++i)
		{
			var box = bg.CreateBoxModel(outputs.model, 0.1, 0.1, 0.05);
			box.rotation.y = Math.PI * (i* (1/num));
			box.position.x = (i-(num/2)) * 0.15;
			var txt = bg.CreateDebugTextNode(box, box.rotation.y.toString(), 0.01);
			txt.position = box.position.clone();
			txt.position.y += 0.08;
			txt.rotation.y = Math.PI * (i* (1/num));
		}
	}
};
