export var generator = {
	version:1,
	name:"Object Logic",
	description:"Currently broken, but the idea is you can generate something with an 'update' script for game logic",
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
	boxUpdateScript:function(dt, node, temp_renderModel){
		
		//TODO: Manipulate the node via physics based functions.
		
		temp_renderModel.rotation.y += (1 * dt);
		if(node.elapsedTime == null)
		{
			node.elapsedTime = 0;
		}
		node.elapsedTime += dt;
		temp_renderModel.position.y = Math.sin(node.elapsedTime * 2);
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		var boxModel = bg.CreateBoxModel(outputs.model, 1, 1, 0.5);
		bg.AddUpdateScriptToNode(boxModel, this.boxUpdateScript);
	}
};