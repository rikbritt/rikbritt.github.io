
var woodCrateGenerator = {
	version:1,
	name:"Wood Crate",
	category:["Furniture"],
	inputs:{
		woodWorking:{	type:"data",		dataType:woodWorkingDataDef	},
		width:{ 		type:"distance", 	units:"m", min:0.5, max:10	}, //would be good to set some kind of ratio between width and height
		depth:{ 		type:"distance", 	units:"m", min:0.5, max:10	}, //would be good to set some kind of ratio between width and height
		height:{ 		type:"distance", 	units:"m", min:0.5, max:10	}
	},
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		bg.CreateBoxModel(outputs.model, inputs.width, inputs.height, inputs.depth);
		//var plankWidth = inputs.woodWorking.plankWidth;
		
		
		//var panelInputs = {
		//	woodWorking:inputs.woodWorking,
		//	width:(inputs.width - (plankWidth*2)),
		//	height:(inputs.height - (plankWidth*2))
		//}
		//Generate the frame model
		//var panelModel = RunGenerator(woodPanelsGenerator, inputs.seed, panelInputs).outputs.model;
		//CombineModels(outputs.model, panelModel);
		
		
		//Generate a frame. Set some constraints for the inputs
		//var frameInputs = {
		//	woodWorking:inputs.woodWorking,
		//	width:inputs.width,
		//	height:inputs.height
		//}
		////Generate the frame model
		//var frameModel = RunGenerator(woodFrameGenerator, inputs.seed, frameInputs).outputs.model;
		//CombineModels(outputs.model, frameModel);
		
		
		//Generate a support if we need one
		//if(inputs.width > 3 && inputs.height > 3) {
		//	var supportInputs = {
		//		woodWorking:inputs.woodWorking,
		//		width:(inputs.width - (plankWidth*2)),
		//		height:(inputs.height - (plankWidth*2))
		//	}
		//	var supportModel = RunGenerator(woodSupportGenerator, inputs.seed, supportInputs).outputs.model;
		//	CombineModels(outputs.model, supportModel);
		//}
	}
}
bg.RegisterGenerator(woodCrateGenerator);