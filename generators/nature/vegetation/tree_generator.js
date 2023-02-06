
var treeGenerator = {
	version:1,
	name:"Tree",
	description:"WIP 3D tree generator",
	category:["Nature","Vegetation"],
	inputs:[
		{ name:"treeType",			type:"data",		dataType:treeTypeDataDef	},
		{ name:"height", 			type:"distance", 	units:"m", 		min:0.5, max:10	}, //would generate this via a script based on tree age? How easy to force a height?
		{ name:"age",				type:"time",		units:"years",	min:0.1, max:100 }
	],
	outputs:[
		{ name:"model",			type:"model"	}
	],
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		var makeBranchShape = function(branch, model)
		{
			var lineModel = bg.CreateLineModelBetweenPoints(outputs.model, branch.startPos, branch.endPos);
			//CreateBoxBetweenPoints(model, "Branch", "wood", branch.startPos, branch.endPos, branch.startWidth );
			for(var i=0; i<branch.childBranches.length; ++i)
			{
				makeBranchShape(branch.childBranches[i], model);
			}
		};
		
		
		var genTrunk = function(parentBranch, maxHeight)
		{
			var startPos = parentBranch.endPos.clone();
			var branchDir = parentBranch.endPos.clone().sub(parentBranch.startPos);
			//branchDir.rotate(GetRandomBetween(-0.1, 0.1))
			
			//var a = GetRandomBetween(0.0, Math.PI * 2);
			
			//var axis = new THREE.Vector3( Math.cos(a), 0, Math.sin(a) );
			//axis.normalize();
			//var angle = GetRandomBetween(-0.3, 0.3);
            //
			//branchDir.applyAxisAngle( axis, angle );
			//
			var hitEnd = startPos.y + branchDir.y >= maxHeight;
			if(hitEnd)
			{
				bg.ClipVectorOnY(branchDir, startPos.y, maxHeight);
			}
			
			var endPos = startPos.clone().add(branchDir);
			
			var branch = {
				startPos:startPos,
				endPos:endPos,
				length:branchDir.length(),
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
				//if(GetRandomBetween(0, 10) > 5)
				//{
				//	genTrunk(branch, Math.max( maxHeight - GetRandomBetween(0, 2), maxHeight - endPos.y + 0.1) );
				//}
				var trunkInfo = genTrunk(branch, maxHeight);
				
				trunkInfo.trunkLength += branchDir.length();
				return trunkInfo;
			}
		};
		
		
		var trunk = {
			startPos:bg.CreateTranslation(0,0,0),
			endPos:bg.CreateTranslation(0,1,0),
			length:1,
			startWidth:0.3,
			isTrunk:true,
			childBranches:[]
		};
		
		Math.seedrandom(inputs.seed);
		genTrunk(trunk, inputs.height);
	
		var wiggleTrunk = function(branch)
		{
			//Proportional to branch length
			var wiggleDist = branch.length * 0.05;
			branch.endPos.x += bg.GetRandomBetween(-wiggleDist, wiggleDist);
			branch.endPos.z += bg.GetRandomBetween(-wiggleDist, wiggleDist);
			for(var i=0; i<branch.childBranches.length; ++i)
			{
				var childBranch = branch.childBranches[i];
				childBranch.startPos.copy(branch.endPos);
				wiggleTrunk(childBranch);
			}
		}
		Math.seedrandom(inputs.seed);
		wiggleTrunk(trunk);
		
		//genBranch(trunk, 5);
		makeBranchShape(trunk, outputs.model);
	}
}
bg.RegisterGenerator(treeGenerator);
