
var terrainVoxelGenerator = {
	version:1,
	name:"Terrain Voxel",
	category:["Nature","Terrain"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"width",		type:"distance",	units:"m",	min:1.0, max:5 },
			{ name:"depth",		type:"distance",	units:"m",	min:1.0, max:5 },
			{ name:"height",	type:"distance",	units:"m",	min:1.0, max:5 }
		],
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
			//map.values.push(bg.GetRandomFloatFromSeed(i+inputs.seed, 0.0, 1.0));
			//voxelData.values.push(1);
		}
		
		bg.CreateVoxelModel(outputs.model, inputs.width, inputs.height, inputs.depth, voxelData);
	}
}
bg.RegisterGenerator(terrainVoxelGenerator);