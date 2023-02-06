
var testRotationGenerator = {
	version:1,
	name:"Rotation",
	category:["Test"],
	inputs:[],
	outputs:{
		model:{			type:"model"	}
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

}
bg.RegisterGenerator(testRotationGenerator);

var testLookAtGenerator = {
	version:1,
	name:"Look At",
	category:["Test","Rotation"],
	inputs:[],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		var num = 1;
		for(var i=0; i<num; ++i)
		{
			var box = bg.CreateBoxModel(outputs.model, 0.1, 0.1, 0.05);
			box.position.x = (i-(num/2)) * 0.15;
			
			var target = bg.CreateBoxModel(outputs.model, 0.05, 0.05, 0.05);
			target.position = box.position.clone();
			target.position.add(bg.CreateTranslation(
				bg.GetRandomBetween(-1, 1),
				bg.GetRandomBetween(-1, 1),
				bg.GetRandomBetween(-1, 1)
			));
			
			box.rotation = bg.LookAtPos(box.position, bg.GetVectorToPos(box.position, target.position), bg.GetUpVector());
			
			//box.rotation.y = Math.PI * (i* (1/num));
			
			//var txt = bg.CreateDebugTextNode(box, box.rotation.y.toString(), 0.01);
			//txt.position = box.position.clone();
			//txt.position.y += 0.08;
			//txt.rotation.y = Math.PI * (i* (1/num));
			
			bg.CreateDebugArrow(outputs.model, box.position, target.position);
		}
	}

}
bg.RegisterGenerator(testLookAtGenerator);
