
var forestSceneGenerator = {
	version:1,
	name:"Forest Scene",
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
		outputs.model = bg.Create2DModel();
	
		var sceneWidth=20;
		for(var i=0; i<10; ++i) {
			var treeModel = bg.RunGenerator(treeV1Generator, inputs.seed + i, null).outputs.model;
			treeModel.position = bg.CreatePoint(GetRandomBellFloatFromSeed(inputs.seed + i, -(sceneWidth/2), (sceneWidth/2)), 0);
			bg.CombineModels(outputs.model, treeModel);
		}
		
		bg.CreateBoxShape(outputs.model, "Ground", "ground", sceneWidth, 1, 0, -0.5);
	}
}
bg.RegisterProjectGenerator(bg.global_project, forestSceneGenerator);