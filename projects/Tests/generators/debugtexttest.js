
var testDebugTextGenerator = {
	version:1,
	name:"Debug Text",
	description:"Broken - should be a test of CreateDebugTextNode",
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
		var helloWorld = bg.CreateDebugTextNode(outputs.model, "Hello World!");
		helloWorld.position.y = 1;
		
		bg.CreateDebugTextNode(outputs.model, "!\"£$%^&*()-=_+[]{}:;@'~#<>,./?\\").position.y = 1.5;
		bg.CreateDebugTextNode(outputs.model, "ABCDEFGHIJKLMNOPQRSTUVWXYZ").position.y = 0.5;
		bg.CreateDebugTextNode(outputs.model, "0123456789");
	}

}
bg.RegisterProjectGenerator(bg.global_project, testDebugTextGenerator);
