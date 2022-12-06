
var testGeomSubtractGenerator = {
	version:1,
	name:"Subtract",
	category:["Test","Geometry"],
	inputs:{
	},
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		var box1 = bg.CreateBoxModel(null, 2, 2, 0.1);
		var box2 = bg.CreateBoxModel(null, 1, 1, 1);
		
		var result = bg.SubtractModel(box1, box2);
		outputs.model.children.push(result);
	}

}
bg.RegisterGenerator(testGeomSubtractGenerator);
