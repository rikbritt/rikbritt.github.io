
var testVoxelsGenerator = {
	version:1,
	name:"Voxels",
	category:["Test"],
	inputs:[
		{ name:"width",		type:"distance",	units:"m",	min:1.0, max:5 },
		{ name:"depth",		type:"distance",	units:"m",	min:1.0, max:5 },
		{ name:"height",	type:"distance",	units:"m",	min:1.0, max:5 }
	],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		var segmentsWidth = Math.floor(inputs.width);
		var segmentsHeight = Math.floor(inputs.height);
		var segmentsDepth = Math.floor(inputs.depth);
				
		var voxelData = {
			width:segmentsWidth,
			depth:segmentsDepth,
			height:segmentsHeight,
			values:[]
		};
		
		for(var i=0; i<(voxelData.width*voxelData.depth*voxelData.height);++i)
		{
			voxelData.values.push(bg.GetRandomInt(0,1));
		}
		
		bg.CreateVoxelModel(outputs.model, inputs.width, inputs.height, inputs.depth, voxelData);
	}

}
bg.RegisterGenerator(testVoxelsGenerator);