
var tree2DV2Generator = {
	version:1,
	name:"Tree 2D V2",
	inputs:[
		{ name:"treeType",			type:"data",		dataType:treeTypeDataDef	},
		{ name:"height", 			type:"distance", 	units:"m", 		min:0.5, max:10	}, //would generate this via a script based on tree age? How easy to force a height?
		{ name:"age",				type:"time",		units:"years",	min:0.1, max:100 }
	],
	outputs:[
		{ name:"model",			type:"model"	}
	],
	script:function(inputs, outputs){
		outputs.model = bg.Create2DModel();
		
		var makeBranchShape = function(branch, model)
		{
			bg.CreateBoxBetweenPoints(model, "Branch", "wood", branch.startPos, branch.endPos, branch.startWidth );
			for(var i=0; i<branch.childBranches.length; ++i)
			{
				makeBranchShape(branch.childBranches[i], model);
			}
		};
		
		
		var genTrunk = function(parentBranch, maxHeight)
		{
			var startPos = parentBranch.endPos.clone();
			var branchDir = parentBranch.endPos.clone().subtract(parentBranch.startPos);
			branchDir.rotate(bg.GetRandomBetween(-0.1, 0.1))
			
			var endPos = startPos.clone().add(branchDir);
		
			var hitEnd = endPos.y >= maxHeight;
			if(hitEnd)
			{
				endPos.y = maxHeight; //Too simple. Loses angle.
			}
			
			var branch = {
				startPos:startPos,
				endPos:endPos,
				startWidth:parentBranch.startWidth,
				isTrunk:true,
				childBranches:[]
			};
			parentBranch.childBranches.push(branch);

			if(hitEnd)
			{
				var trunkInfo = {
					trunkLength:branchDir.length()
				};
				return trunkInfo;
			}
			else
			{
				var trunkInfo = genTrunk(branch, maxHeight);
				trunkInfo.trunkLength += branchDir.length();
				return trunkInfo;
			}
		};
		
		
		var trunk = {
			startPos:bg.CreatePoint(0,0),
			endPos:bg.CreatePoint(0, 1),
			startWidth:0.3,
			isTrunk:true,
			childBranches:[]
		};
		
		Math.seedrandom(inputs.seed);
		genTrunk(trunk, inputs.height);
	
		
		//genBranch(trunk, 5);
		makeBranchShape(trunk, outputs.model);
	}
}
bg.RegisterGenerator(tree2DV2Generator);

var tree2DV1Generator = {
	version:1,
	name:"Tree 2D V1",
	inputs:[
		{ name:"treeType",			type:"data",		dataType:treeTypeDataDef	},
		{ name:"height", 			type:"distance", 	units:"m", 		min:0.5, max:10	}, //would generate this via a script based on tree age? How easy to force a height?
		{ name:"age",				type:"time",		units:"years",	min:0.1, max:100 }
	],
	outputs:[
		{ name:"model",			type:"model"	}
	],
	script:function(inputs, outputs){
		outputs.model = bg.Create2DModel();
		
		var makeBranchShape = function(branch, model)
		{
			bg.CreateBoxBetweenPoints(model, "Branch", "wood", branch.startPos, branch.endPos, branch.startWidth );
			for(var i=0; i<branch.childBranches.length; ++i)
			{
				makeBranchShape(branch.childBranches[i], model);
			}
		};
		
		var genBranch = function(parentBranch, depth)
		{
			var startPos = parentBranch.endPos.clone();
			var parentDir = parentBranch.endPos.clone().subtract(parentBranch.startPos);
			parentDir.multiplyByScalar(0.75);
			var endPos = startPos.clone().add(parentDir);
			endPos.add(Vector2D(bg.GetRandomBetween(-0.4, 0.4), bg.GetRandomBetween(-0.4, 0.4)));
			var branch = {
				startPos:startPos,
				endPos:endPos,
				startWidth:(parentBranch.startWidth * 0.75),
				childBranches:[]
			};
			parentBranch.childBranches.push(branch);
			if(depth > 0) {
				var numChildren = bg.GetRandomInt(0,2);
				for(var i=0; i<numChildren; ++i)
				{
					genBranch(branch, depth-1);
				}
			}
		};
		
		var trunk = {
			startPos:bg.CreatePoint(0,0),
			endPos:bg.CreatePoint(0, (inputs.height / 2)),
			startWidth:0.3,
			childBranches:[]
		};
	
		Math.seedrandom(inputs.seed);
		genBranch(trunk, 5);
		makeBranchShape(trunk, outputs.model);
	}
}
bg.RegisterGenerator(tree2DV1Generator);